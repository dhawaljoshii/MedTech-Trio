// rag/embed.js
import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;
const client = apiKey ? new Mistral({ apiKey }) : null;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function embed(texts) {
  if (!client) {
    console.error("MISTRAL_API_KEY not found. Skipping embedding.");
    return [];
  }

  const vectors = [];
  const BATCH_SIZE = 10; // Process 10 items at a time
  const DELAY_MS = 2000; // 2 seconds delay between batches to respect rate limits

  try {
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);
      console.log(`Embedding batch ${i / BATCH_SIZE + 1} of ${Math.ceil(texts.length / BATCH_SIZE)}...`);

      const response = await client.embeddings.create({
        model: "mistral-embed",
        inputs: batch,
      });

      // response.data is array of objects { object: 'embedding', embedding: [...], index: 0 }
      // Mistral returns them in order of the batch inputs
      const batchVectors = response.data.map(d => d.embedding);
      vectors.push(...batchVectors);

      // Wait before next batch if not the last one
      if (i + BATCH_SIZE < texts.length) {
        await sleep(DELAY_MS);
      }
    }

    return vectors;

  } catch (error) {
    console.error("Mistral Embedding Error:", error);
    // Better to throw so ingest stops.
    throw error;
  }
}
