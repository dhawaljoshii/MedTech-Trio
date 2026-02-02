// rag/ingest.js
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import csv from "csv-parser";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { Pinecone } from "@pinecone-database/pinecone";
import { embed } from "./embed.js";
import { loadAllText } from "./parseData.js";

// --------------------
// Pinecone Client
// --------------------
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'patient-chatbot';
const index = pc.index(INDEX_NAME);

// --------------------
// Extract text from PDF
// --------------------
async function extractPdfText(path) {
  const data = new Uint8Array(fs.readFileSync(path));
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }

  return text;
}

// --------------------
// Load CSV + PDF Text
// --------------------
async function loadTexts() {
  const texts = [];

  // CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream("rag/data/diseases.csv")
      .pipe(csv())
      .on("data", (row) => {
        texts.push(
          `Disease: ${row.disease}. Symptoms: ${row.symptoms}. Description: ${row.description}`
        );
      })
      .on("end", resolve)
      .on("error", reject);
  });

  // PDFs
  const pdfFiles = fs
    .readdirSync("rag/data")
    .filter((file) => file.endsWith(".pdf"));

  for (const file of pdfFiles) {
    const text = await extractPdfText(`rag/data/${file}`);
    texts.push(`Source: ${file}\n${text}`);
  }

  return texts;
}

// --------------------
// Ingest into Pinecone
// --------------------
async function ingest() {
  const texts = await loadAllText();
  const vectors = await embed(texts);

  const pineconeVectors = vectors.map((values, i) => ({
    id: `doc-${i}`,
    values,
    metadata: { text: texts[i] },
  }));

  // Batch upsert to Pinecone to avoid 4MB limit
  const BATCH_SIZE = 50;

  for (let i = 0; i < pineconeVectors.length; i += BATCH_SIZE) {
    const batch = pineconeVectors.slice(i, i + BATCH_SIZE);
    console.log(`Upserting batch ${i / BATCH_SIZE + 1} of ${Math.ceil(pineconeVectors.length / BATCH_SIZE)} to Pinecone...`);
    await index.upsert(batch);
  }

  console.log("Data uploaded to Pinecone successfully");
}

ingest();
