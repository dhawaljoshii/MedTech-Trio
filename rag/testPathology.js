import { answerQuestion } from "./answer.js";

async function testPathology() {
    // Replace this with a query specific to the content of Pathology.pdf if you know it.
    // Since I don't know the exact content, I'll try a generic query that should hit it.
    const query = "what is immounodeficiency";
    console.log(`Testing query: "${query}"`);

    const result = await answerQuestion(query);

    console.log("\n--- RAG RESPONSE ---\n");
    console.log(result);
}

testPathology();
