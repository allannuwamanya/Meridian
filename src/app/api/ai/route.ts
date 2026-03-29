import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

// gemini-2.5-flash free tier maximizes quota and speed for this key
const MODEL = "gemini-2.5-flash";

// Retry wrapper for 429 rate-limit errors
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1500): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const isRateLimit = err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("quota");
      if (isRateLimit && attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Max retries exceeded");
}

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured. Add it to .env.local and restart the server." },
      { status: 500 }
    );
  }

  try {
    const { prompt, stream = false, expectJson = false } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: {
        temperature: 0.6,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: expectJson ? "application/json" : "text/plain",
      },
    });

    if (stream) {
      const result = await withRetry(() => model.generateContentStream(prompt));
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) controller.enqueue(encoder.encode(text));
            }
          } finally {
            controller.close();
          }
        },
      });
      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          "X-Model": MODEL,
        },
      });
    } else {
      const result = await withRetry(() => model.generateContent(prompt));
      const text = result.response.text();
      if (!text?.trim()) throw new Error("AI returned an empty response — try again.");
      return NextResponse.json({ text }, { headers: { "X-Model": MODEL } });
    }
  } catch (err: any) {
    console.error("[AI Route Error]", err.message);
    const isRateLimit = err?.message?.includes("429") || err?.message?.includes("quota");
    return NextResponse.json(
      { error: isRateLimit ? "Rate limit reached. Please wait a moment and try again." : (err.message ?? "AI request failed") },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}
