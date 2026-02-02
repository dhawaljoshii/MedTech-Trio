import fs from "fs";
import csv from "csv-parser";
import { Pinecone } from "@pinecone-database/pinecone";
import { embed } from "./embed.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

const index = pc.index("medical-rag");

async function loadTexts() {
  const texts = [];

  // ---------- CSV ----------
  await new Promise((resolve) => {
    fs.createReadStream("rag/data/diseases.csv")
      .pipe(csv())
      .on("data", (row) => {
        texts.push(
          `Disease: ${row.disease}. Symptoms: ${row.symptoms}. Description: ${row.description}`
        );
      })
      .on("end", resolve);
  });

  // ---------- PDFs ----------
  const pdfFiles = fs.readdirSync("rag/data").filter(f => f.endsWith(".pdf"));

  for (const file of pdfFiles) {
    const buffer = fs.readFileSync(`rag/data/${file}`);
    const data = await pdfParse(buffer);
    texts.push(`Source: ${file}\n${data.text}`);
  }

  return texts;
}

async function ingest() {
  const texts = await loadTexts();
  const vectors = await embed(texts);

  const pineconeVectors = vectors.map((values, i) => ({
    id: `doc-${i}`,
    values,
    metadata: { text: texts[i] },
  }));

  await index.upsert(pineconeVectors);
  console.log("✅ Data uploaded to Pinecone");
}

ingest();