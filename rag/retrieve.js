import fs from "fs";
import natural from "natural";

const TfIdf = natural.TfIdf;

export function retrieveContext(question) {
  const index = JSON.parse(fs.readFileSync("rag/index.json", "utf-8"));
  const tfidf = new TfIdf();

  // Add documents
  index.forEach(doc => tfidf.addDocument(doc.text));

  // Add user question as last document
  tfidf.addDocument(question);

  const queryIndex = tfidf.documents.length - 1;

  // Score each document against the query
  const scores = index.map((doc, i) => {
    let score = 0;

    tfidf.listTerms(queryIndex).forEach(term => {
      score += tfidf.tfidf(term.term, i);
    });

    return {
      text: doc.text,
      score,
    };
  });

  // Sort by relevance
  scores.sort((a, b) => b.score - a.score);

  // Filter out very low quality matches if any
  const relevantScores = scores.filter(s => s.score > 0);

  // 🔑 KEY FIX: extract only short, meaningful context
  const topContext = (relevantScores.length ? relevantScores : scores)
    .slice(0, 3) // Increase to 3 chunks for better coverage
    .map(s => summarizeText(s.text))
    .join("\n\n");

  return topContext || null;
}

/**
 * Keep only the most useful medical signal
 */
function summarizeText(text) {
  if (!text) return "";

  // Prefer sentences with keywords
  const sentences = text.split(/\.|\n/).map(s => s.trim()).filter(s => s.length > 0);

  const importantSentences = sentences
    .filter(line =>
      /symptom|cause|pain|fever|infection|bleeding|headache|chest|autopsy|microbiological|examination|report|pathology|finding/i.test(line)
    );

  const summary = (importantSentences.length
    ? importantSentences
    : sentences
  )
    .slice(0, 4) // Allow more sentences for technical reports
    .join(". ")
    .trim();

  // Hard limit to avoid UI overflow, but generous enough for technical data
  return summary.slice(0, 500);
}
