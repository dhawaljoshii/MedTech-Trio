import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://generativelanguage.googleapis.com/v1";
const API_KEY = process.env.GOOGLE_API_KEY;

let cachedModel = null;

async function getUsableModel() {
  const res = await fetch(`${BASE_URL}/models?key=${API_KEY}`);
  const data = await res.json();

  const model = data.models?.find((m) =>
    m.supportedGenerationMethods?.includes("generateContent")
  );

  if (!model) {
    throw new Error("No Gemini model supports generateContent");
  }

  return model.name;
}

export async function generateAnswer(query, context) {
  if (!cachedModel) {
    cachedModel = await getUsableModel();
    console.log("Using Gemini model:", cachedModel); //for test
  }

  const prompt = `
You are a medical assistant.

RULES:
- Answer ONLY using the provided context
- If not found, say you don't know
- Do NOT give medical advice

CONTEXT:
${context}

QUESTION:
${query}
`;

  const response = await fetch(
    `${BASE_URL}/${cachedModel}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();

  // HANDLE QUOTA EXCEEDED
  if (response.status === 429) {
    return (
      "⚠️ Gemini API quota exceeded.\n\n" +
      "Here is the relevant information I retrieved from the knowledge base:\n\n" +
      context
    );
  }

  if (!response.ok) {
    throw new Error(JSON.stringify(data, null, 2));
  }

  return data.candidates[0].content.parts[0].text;
}
