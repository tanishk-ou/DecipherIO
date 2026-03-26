import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// 1. Setup Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// 2. OCR-Optimized Model Chain (Fastest models from your list)
const MODEL_CHAIN = [
  "gemini-2.5-flash",         // Primary: Newest, extremely capable at OCR
  "gemini-3-flash-preview",   // Fallback 1: Latest preview
  "gemini-2.5-flash-lite",    // Fallback 2: Lightest/Fastest
  "gemini-2.0-flash",         // Fallback 3: Stable legacy
];

/**
 * Tries extracting text from an image with each model in the chain.
 */
async function generateOCRWithFallback(
  base64Data: string, 
  mimeType: string, 
  prompt: string
): Promise<{ text: string; modelUsed: string }> {
  const errors: { model: string; error: string }[] = [];

  for (const modelName of MODEL_CHAIN) {
    try {
      console.log(`[OCR] Trying model: ${modelName}`);
      const model: GenerativeModel = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error(`Empty response from ${modelName}`);
      }

      console.log(`[OCR] ✅ Success with model: ${modelName}`);
      return { text, modelUsed: modelName };
    } catch (err: any) {
      const errorMsg = err?.message || String(err);
      console.warn(`[OCR] ❌ Model ${modelName} failed: ${errorMsg}`);
      errors.push({ model: modelName, error: errorMsg });
    }
  }

  const summary = errors.map(e => `${e.model}: ${e.error}`).join(' | ');
  throw new Error(`All OCR models failed. Details: ${summary}`);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const language = (formData.get("language")?.toString() || "hi-IN").trim();

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    // Convert the image file to a base64 string
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `Extract all readable text from this image perfectly in its original language.
    Maintain paragraph structures if possible.
    Only return the extracted text, do not add any markdown formatting, commentary, or introduction.`;

    // Use the fallback logic
    const { text, modelUsed } = await generateOCRWithFallback(
      base64String,
      file.type,
      prompt
    );

    return NextResponse.json({
      text: text.trim(),
      modelUsed,
      language,
    });

  } catch (error: any) {
    console.error("Error parsing image:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to parse image" },
      { status: 500 }
    );
  }
}