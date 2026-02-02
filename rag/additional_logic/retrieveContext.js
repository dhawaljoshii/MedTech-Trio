import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (magA * magB);
}

export async function retrieveContext(question) {
  const model = genAI.getGenerativeModel({ model: "embedding-001" }); 
//   AIzaSyCRhc4Bo7cgGK1c6qlTxgTlCI_Y4FXW9J8

  const questionEmbedding = await model.embedContent(question);

  const stored = JSON.parse(
    fs.readFileSync("rag/embeddings.json", "utf-8")
  );

  const scored = stored.map(item => ({
    ...item,
    score: cosineSimilarity(
      questionEmbedding.embedding.values,
      item.embedding
    )
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map(s => s.text).join("\n");
}