import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";
import fs from 'fs/promises';
import path from 'path';
const PDFParser = require("pdf2json");

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file provided" },
                { status: 400 }
            );
        }

        // Get Mistral API key
        const apiKey = process.env.MISTRAL_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, error: "Mistral API key not configured" },
                { status: 500 }
            );
        }

        const client = new Mistral({ apiKey });

        let analysisResult = {};
        const fileType = file.type;

        // Handle PDF (Lab Reports)
        if (fileType === "application/pdf") {
            const buffer = Buffer.from(await file.arrayBuffer());

            try {
                const pdfParser = new PDFParser(this, 1); // 1 = text content only

                const textContent = await new Promise((resolve, reject) => {
                    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
                    pdfParser.on("pdfParser_dataReady", pdfData => {
                        resolve(pdfParser.getRawTextContent());
                    });
                    pdfParser.parseBuffer(buffer);
                });

                if (!textContent || textContent.trim().length === 0) {
                    return NextResponse.json(
                        { success: false, error: "Could not extract text from PDF" },
                        { status: 400 }
                    );
                }

                // Analyze with Mistral AI
                const chatResponse = await client.chat.complete({
                    model: "mistral-large-latest",
                    responseFormat: { type: "json_object" },
                    messages: [
                        {
                            role: "system",
                            content: "You are a medical assistant analyzing lab reports. Provide clear, concise analysis. You must respond in valid JSON format with two fields: 'analysis' (a markdown formatted string with key findings, abnormal values, and actions) and 'specialist' (a single string recommending the type of doctor to consult, e.g., 'Cardiologist', 'Dermatologist', 'General Physician')."
                        },
                        {
                            role: "user",
                            content: `Analyze this medical lab report.\n\nLab Report:\n${textContent}`
                        }
                    ],
                });

                const rawContent = chatResponse.choices[0].message.content;
                analysisResult = JSON.parse(rawContent);

            } catch (pdfError) {
                console.error("PDF parsing/analysis error:", pdfError);
                return NextResponse.json(
                    { success: false, error: "Failed to process PDF file. " + (pdfError.message || pdfError) },
                    { status: 400 }
                );
            }
        }

        // Handle Images (X-rays)
        else if (fileType.startsWith("image/")) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const base64Image = buffer.toString("base64");
            const imageUrl = `data:${fileType};base64,${base64Image}`;

            // Analyze with Mistral Vision
            const chatResponse = await client.chat.complete({
                model: "pixtral-large-latest",
                responseFormat: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content: "You are a medical imaging assistant. Analyze X-ray/Scan images. You must respond in valid JSON format with two fields: 'analysis' (a markdown formatted string with visible structures, potential abnormalities, and observations) and 'specialist' (a single string recommending the type of doctor to consult, e.g., 'Orthopedist', 'Radiologist', 'Pulmonologist', 'Dentist')."
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Analyze this medical image."
                            },
                            {
                                type: "image_url",
                                imageUrl: {
                                    url: imageUrl
                                }
                            }
                        ]
                    }
                ],
            });

            const rawContent = chatResponse.choices[0].message.content;
            analysisResult = JSON.parse(rawContent);
        }

        else {
            return NextResponse.json(
                { success: false, error: "Unsupported file type" },
                { status: 400 }
            );
        }

        // Save file locally for doctor access
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + '_' + file.name.replace(/\s/g, '_');
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        // Ensure directory exists (recursive: true ensures parent dirs exist)
        await fs.mkdir(uploadDir, { recursive: true });
        const filepath = path.join(uploadDir, filename);
        await fs.writeFile(filepath, buffer);
        const fileUrl = `/uploads/${filename}`;

        // Add disclaimer
        const formattedAnalysis = `🔬 **Medical Document Analysis**\n\n${analysisResult.analysis}\n\n---\n\n⚠️ **Important Disclaimer**: This AI analysis is for informational purposes only and is NOT a medical diagnosis. Please consult with a qualified healthcare professional.`;

        return NextResponse.json({
            success: true,
            analysis: formattedAnalysis,
            specialist: analysisResult.specialist,
            url: fileUrl
        });

    } catch (error) {
        console.error("Document analysis error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to analyze document: " + error.message
            },
            { status: 500 }
        );
    }
}
