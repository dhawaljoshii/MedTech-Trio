import dotenv from "dotenv";
dotenv.config();

import { Pinecone } from "@pinecone-database/pinecone";
import { embed } from "./embed.js";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.index("medical-rag");

export async function retrieveContext(query, topK = 3) {
  const [queryVector] = await embed([query]);

  const response = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });

  return response.matches.map(m => m.metadata.text).join("\n\n");
}
