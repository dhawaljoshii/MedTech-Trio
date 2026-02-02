import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { Mistral } from '@mistralai/mistralai';
import { DOCTOR_DIRECTORY } from "@/utils/doctorDirectory";
import { predictDoctorType } from "@/utils/predictDoctor";

// Initialize Mistral & Pinecone
const apiKey = process.env.MISTRAL_API_KEY;
const client = apiKey ? new Mistral({ apiKey }) : null;

const pc = process.env.PINECONE_API_KEY
  ? new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
  : null;

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'patient-chatbot';

export async function POST(req) {
  try {
    if (!client) {
      return NextResponse.json({ error: 'MISTRAL_API_KEY is not configured.' }, { status: 500 });
    }

    const { symptoms, language, patientContext } = await req.json();

    // Context String from Patient History
    let historyContext = "";
    if (patientContext) {
      if (patientContext.chronicConditions && patientContext.chronicConditions.length > 0) {
        historyContext += `\nPATIENT CHRONIC CONDITIONS: ${patientContext.chronicConditions.join(", ")}`;
      }
      if (patientContext.surgeries && patientContext.surgeries.length > 0) {
        historyContext += `\nPATIENT SURGERY HISTORY: ${patientContext.surgeries.map(s => typeof s === 'string' ? s : `${s.name} (${s.type})`).join(", ")}`;
      }
    }

    // 1. Generate embedding
    let embedding = [];
    try {
      const embeddingResult = await client.embeddings.create({
        model: "mistral-embed",
        inputs: [symptoms]
      });
      embedding = embeddingResult.data[0].embedding;
    } catch (e) {
      console.error("Mistral Embedding failed:", e);
    }

    // 2. Query Pinecone
    let context = '';
    if (pc && embedding.length > 0) {
      try {
        const index = pc.index(INDEX_NAME);
        const queryResponse = await index.query({
          vector: embedding,
          topK: 3,
          includeMetadata: true,
        });
        context = queryResponse.matches
          .map((match) => match.metadata.text)
          .join('\n\n');
      } catch (e) {
        console.warn("Pinecone query failed:", e);
      }
    }

    // 3. Generate Analysis with Mistral
    // We ask for a JSON response to easily parse into summary/urgency/specialist
    const systemPrompt = `You are a professional medical triage system. 
    Analyze the user's symptoms using the provided CONTEXT.

    Return a valid JSON object with the following fields:
    {
        "summary": "A concise, professional summary of the single most probable condition. Start directly with the condition name. Limit to under 50 words. Use Markdown.",
        "urgency": "routine" | "urgent" | "emergency",
        "specialist": "The most appropriate specialist type (e.g. General Physician, Cardiologist)",
        "detected_conditions": ["List of explicitly stated NEW chronic conditions found in the input, e.g. 'Diabetes', 'Asthma'. Only include permanent/chronic diseases the user says they HAVE."]
    }

    CONTEXT:
    ${context}

    ${historyContext}

    CRITICAL RULES:
    1. **Prioritize Probability**: Return ONLY the single most likely condition based on common prevalence (e.g., Fever -> Viral Infection). Do NOT list rare diseases unless symptoms are highly specific.
    2. **Be Concise**: Keep the summary extremely short (max 2 sentences). No fluff.
    3. **Patient Context**: If the patient has chronic conditions (listed above), heavily weight them in your analysis (e.g. "Likely related to your Diabetes").
    4. **Safety**: If symptoms are clearly life-threatening (e.g. crushing chest pain), set urgency to "emergency".
    `;

    const result = await client.chat.complete({
      model: "mistral-large-latest", // Use a smart model for JSON
      responseFormat: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Symptoms: ${symptoms}. Language: ${language || 'en'}` }
      ],
    });

    const parsedContent = JSON.parse(result.choices[0].message.content);
    console.log("🤖 MISTRAL PARSED CONTENT:", parsedContent); // Debugging Log

    // 4. Resolve Doctor Directory
    const doctorType = parsedContent.specialist || "General Physician";
    // Map specialist string to our internal keys if possible, or fall back to prediction utils
    // For now, let's trust the LLM's specialist suggestion but use the utility to map to directory keys if needed
    // Or strictly use the utility for the *directory* lookup to stay safe
    const mappedDoctorType = predictDoctorType(symptoms); // Fallback to existing logic for directory mapping to be safe
    const safeDoctorType = mappedDoctorType && DOCTOR_DIRECTORY[mappedDoctorType] ? mappedDoctorType : "general-physician";

    const doctors = DOCTOR_DIRECTORY[safeDoctorType];

    return NextResponse.json({
      summary: parsedContent.summary,
      urgency: parsedContent.urgency,
      specialist: parsedContent.specialist,
      doctorType: safeDoctorType,
      doctors,
      doctors,
      symptoms: symptoms,
      detected_conditions: parsedContent.detected_conditions || []
    });

  } catch (err) {
    console.error("Diagnosis error:", err);
    return NextResponse.json({ error: "Diagnosis failed" }, { status: 500 });
  }
}
