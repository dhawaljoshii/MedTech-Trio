import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (magA * magB);
}

async function buildEmbeddings() {
  const data = JSON.parse(
    fs.readFileSync("rag/medical_knowledge.json", "utf-8")
  );

  const model = genAI.getGenerativeModel({ model: "embedding-001" });

  const embeddings = [];

  for (const item of data) {
    const result = await model.embedContent(item.text);

    embeddings.push({
      id: item.id,
      text: item.text,
      embedding: result.embedding.values
    });
  }

  fs.writeFileSync(
    "rag/embeddings.json",
    JSON.stringify(embeddings, null, 2)
  );

  console.log("✅ Gemini embeddings created");
}

buildEmbeddings();