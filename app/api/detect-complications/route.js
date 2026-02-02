import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";

export async function POST(request) {
    try {
        const { patientContext, observations } = await request.json();

        // Get Mistral API key
        const apiKey = process.env.MISTRAL_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, error: "Mistral API key not configured" },
                { status: 500 }
            );
        }

        const client = new Mistral({ apiKey });

        // Construct the analysis prompt
        const systemPrompt = `You are a post-operative complication detection system. 
Analyze the provided patient context and clinical observations to identify potential risks or complications.
You must respond in valid JSON format with the following structure:
{
  "riskLevel": "Low" | "Medium" | "High",
  "summary": "Short summary of the findings (1-2 sentences)",
  "details": "Markdown formatted list of specific observations or concerns",
  "recommendations": "Markdown formatted list of suggested next steps or interventions",
  "warningSigns": "Markdown formatted list of specific symptoms to watch for"
}
Be precise, clinical, and cautious. If there are signs of infection, thrombosis, or severe pain, escalate the risk level appropriately.`;

        const userPrompt = `Patient Context:
Surgeries: ${JSON.stringify(patientContext.surgeries)}
Chronic Conditions: ${JSON.stringify(patientContext.chronicConditions)}
Recovery Tasks Completed: ${patientContext.completedTasks}/${patientContext.totalTasks}

Clinician Observations:
"${observations}"

Please provide a detailed risk assessment.`;

        const chatResponse = await client.chat.complete({
            model: "mistral-large-latest",
            responseFormat: { type: "json_object" },
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.2
        });

        const rawContent = chatResponse.choices[0].message.content;
        const analysis = JSON.parse(rawContent);

        return NextResponse.json({
            success: true,
            ...analysis
        });

    } catch (error) {
        console.error("AI complication detection error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to analyze complications: " + error.message
            },
            { status: 500 }
        );
    }
}
