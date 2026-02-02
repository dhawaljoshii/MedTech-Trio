import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const NEW_INDEX_NAME = "patient-bot-mistral";

async function main() {
    console.log("Checking Pinecone indexes...");
    const listParams = await pc.listIndexes();
    const indexes = listParams.indexes || [];
    console.log("Existing indexes:", indexes.map(i => `${i.name} (dim: ${i.dimension})`));

    // 1. Check for target index
    const targetIndex = indexes.find(i => i.name === NEW_INDEX_NAME);
    if (targetIndex) {
        if (targetIndex.dimension === 1024) {
            console.log(`✅ Index ${NEW_INDEX_NAME} already exists with correct dimension.`);
            return;
        } else {
            console.log(`⚠️ Index ${NEW_INDEX_NAME} exists but has wrong dimension (${targetIndex.dimension}). Deleting...`);
            await pc.deleteIndex(NEW_INDEX_NAME);
            // Wait for deletion to propagate
            await new Promise(r => setTimeout(r, 5000));
        }
    }

    // 2. Determine spec from existing index to match region/cloud
    let spec = { serverless: { cloud: 'aws', region: 'us-east-1' } };
    if (indexes.length > 0) {
        // Try to reuse the spec of the first index found
        const existingSpec = indexes[0].spec;
        if (existingSpec) {
            spec = existingSpec;
            console.log("Reusing spec from existing index:", JSON.stringify(spec));
        }
    }

    // 3. Try to create new index
    try {
        console.log(`Creating index ${NEW_INDEX_NAME} with dimension 1024...`);
        await pc.createIndex({
            name: NEW_INDEX_NAME,
            dimension: 1024,
            metric: 'cosine',
            spec: spec
        });
        console.log("✅ Index created successfully.");
    } catch (e) {
        console.error("❌ Creation failed:", e.message);

        // Handle Quota Limit (Free tier usually allows only 1 index)
        if (e.message.toLowerCase().includes("quota") || e.message.toLowerCase().includes("limit")) {
            console.log("⚠️ Quota exceeded. Attempting to delete incompatible indexes to free up space...");

            let deletedAny = false;
            for (const idx of indexes) {
                // Delete index if it's NOT the one we want (and we already know we want 1024 dim)
                // Or if it matches our target name but we failed to verify it earlier (unlikely)
                // Specifically target the old incompatible ones
                if (idx.dimension !== 1024) {
                    console.log(`Deleting incompatible index: ${idx.name} (dim: ${idx.dimension})...`);
                    await pc.deleteIndex(idx.name);
                    deletedAny = true;
                }
            }

            if (deletedAny) {
                console.log("Waiting 10s for deletion...");
                await new Promise(r => setTimeout(r, 10000));

                console.log("Retrying creation...");
                await pc.createIndex({
                    name: NEW_INDEX_NAME,
                    dimension: 1024,
                    metric: 'cosine',
                    spec: spec
                });
                console.log("✅ Index created successfully on retry.");
            } else {
                console.error("Could not find any incompatible indexes to delete. Please check your Pinecone console.");
            }
        }
    }
}

main();
