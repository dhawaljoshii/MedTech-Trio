import { answerQuestion } from "./answer.js";

async function test() {
  const query = "Bleeding from the nose";
  const result = await answerQuestion(query);

  console.log("\n--- GEMINI RAG RESPONSE ---\n");
  console.log(result);
}

test();
