import natural from "natural";
import fs from "fs";
import { loadAllText } from "./parseData.js";

const TfIdf = natural.TfIdf;

async function buildIndex() {
  const documents = await loadAllText();
  const tfidf = new TfIdf();

  documents.forEach(doc => tfidf.addDocument(doc));

  const index = documents.map((text, i) => ({
    id: i,
    text,
    vector: tfidf.listTerms(i)
  }));

  fs.writeFileSync("rag/index.json", JSON.stringify(index, null, 2));
  console.log("Local RAG index created");
}

buildIndex();