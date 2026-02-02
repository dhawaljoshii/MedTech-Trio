import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { Mistral } from '@mistralai/mistralai';

// Initialize Mistral
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

        const { messages, language } = await req.json();
        const lastMessage = messages[messages.length - 1];
        // Ensure user content is a string
        const query = typeof lastMessage.content === 'string' ? lastMessage.content : JSON.stringify(lastMessage.content);


        // 1. Generate embedding using Mistral
        let embedding = [];
        try {
            const embeddingResult = await client.embeddings.create({
                model: "mistral-embed",
                inputs: [query]
            });
            embedding = embeddingResult.data[0].embedding;
        } catch (e) {
            console.error("Mistral Embedding failed:", e);
        }

        // 2. Query Pinecone for context
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

        // 3. Construct System Prompt
        const systemPrompt = `You are HealthConnect Assistant, a professional and empathetic virtual triage nurse for a hospital.
        
        Use the following CONTEXT from our medical knowledge base to answer the user's question.
        
        STRICT OUTPUT FORMAT:
        1. **Possible Medical Conditions**: List the top 1-3 conditions identified from the context or symptoms. Use bullet points.
        2. **Symptom Analysis**: Briefly explain why these conditions match the reported symptoms. Mention specific symptoms the user described.
        3. **Recommended Next Steps**: Suggest generally appropriate next steps (e.g., "See a General Physician", "Monitor temperature").
        
        CONTEXT:
        ${context}
        
        Language: ${language || 'en'}
        
        CRITICAL: If symptoms are life-threatening (chest pain, trouble breathing, severe bleeding, stroke signs), IGNORE the context and advise ER/Emergency immediately in BOLD RED text.
        `;

        // 4. Generate Response with Mistral
        const result = await client.chat.stream({
            model: "mistral-small-latest",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages.map(m => ({
                    role: m.role === 'user' ? 'user' : 'assistant',
                    content: m.content
                }))
            ],
        });

        // 5. Stream Response
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of result) {
                    const chunkText = chunk.data.choices[0].delta.content;
                    if (chunkText) {
                        controller.enqueue(new TextEncoder().encode(chunkText));
                    }
                }
                controller.close();
            },
        });

        return new NextResponse(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });

    } catch (error) {
        console.error('Error in chat route:', error);
        return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
    }
}
