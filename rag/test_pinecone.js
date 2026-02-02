
import { Pinecone } from '@pinecone-database/pinecone';
import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;
const client = apiKey ? new Mistral({ apiKey }) : null;

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'patient-chatbot';

async function testRetrieval() {
    const query = "What are the symptoms of diabestes?";
    console.log(`Querying: "${query}" against index: ${INDEX_NAME}`);

    // 1. Embed
    const embeddingResult = await client.embeddings.create({
        model: "mistral-embed",
        inputs: [query]
    });
    const vector = embeddingResult.data[0].embedding;

    // 2. Query
    const index = pc.index(INDEX_NAME);
    const result = await index.query({
        vector,
        topK: 3,
        includeMetadata: true
    });

    console.log("\n--- Top Matches ---");
    result.matches.forEach((match, i) => {
        console.log(`\n[${i + 1}] Score: ${match.score}`);
        console.log(`Text segment: ${match.metadata.text?.substring(0, 150)}...`);
    });
}

testRetrieval();
