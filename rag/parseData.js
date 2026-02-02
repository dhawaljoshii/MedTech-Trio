import fs from "fs";
import csv from "csv-parser";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// Extract text from a single PDF
async function extractPdfText(path) {
  const data = new Uint8Array(fs.readFileSync(path));
  // Load the PDF document
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  let text = "";

  // Iterate through each page
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Concatenate text items
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }

  return text;
}

export async function loadAllText() {
  const texts = [];

  // 1. READ CSV
  if (fs.existsSync("rag/data/diseases.csv")) {
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
  }

  // 2. READ ALL PDFs
  if (fs.existsSync("rag/data")) {
    const files = fs.readdirSync("rag/data").filter(file => file.toLowerCase().endsWith(".pdf"));

    for (const file of files) {
      try {
        const text = await extractPdfText(`rag/data/${file}`);
        
        if (text.trim().length > 0) {
          // Mistral has a limit of 8192 tokens. 
          // 1 token is roughly 4 characters. 
          // Let's use 4000 characters as a safe chunk size (~1000 tokens).
          const CHUNK_SIZE = 4000;
          const overlap = 200; // Small overlap to maintain context
          
          if (text.length <= CHUNK_SIZE) {
            texts.push(`Source: ${file}\n${text}`);
          } else {
            let start = 0;
            while (start < text.length) {
              const end = Math.min(start + CHUNK_SIZE, text.length);
              const chunk = text.substring(start, end);
              texts.push(`Source: ${file} (Part ${Math.floor(start / CHUNK_SIZE) + 1})\n${chunk}`);
              start += (CHUNK_SIZE - overlap);
            }
          }
        }
      } catch (err) {
        console.error(`Failed to parse PDF ${file}:`, err);
      }
    }
  }

  return texts;
}