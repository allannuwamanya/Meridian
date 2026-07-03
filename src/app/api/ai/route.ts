import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const userKeys = [
  "AIzaSyBDLAwyRcVtrDsVQzZqonyybTHZ1P0ZZac",
  "AIzaSyCE5ixQemu8vs3b6gpxtL5KEuL_EjyN_og",
  "AIzaSyDdcCmXCnJMtFB7t9YtdmxERIRksiGclaE",
  "AIzaSyAxObJd35TX-OAZhyLCyK7WmEqqh2btsQg",
  "AIzaSyAyVxoJbdcQvROgQreVlYfWCzKaOystseU"
];
const envKey = process.env.GEMINI_API_KEY;
const API_KEYS = [...(envKey ? [envKey] : []), ...userKeys];

let keyIndex = 0;
function getNextKey() {
  const k = API_KEYS[keyIndex];
  keyIndex = (keyIndex + 1) % API_KEYS.length;
  return k;
}

// gemini-2.5-flash free tier maximizes quota and speed for this key
const MODEL = "gemini-2.5-flash";

// Retry wrapper for 429 rate-limit errors
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1500): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const error = err as Error & { status?: number; message?: string };
      const isRateLimit = error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("quota") || error?.message?.includes("Too Many Requests");
      if (isRateLimit && attempt < retries) {
        // We will retry, the function should fetch a new key if structured that way.
        // Wait briefly before retry.
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Max retries exceeded");
}

export async function POST(req: NextRequest) {
  if (API_KEYS.length === 0) {
    return NextResponse.json(
      { error: "No GEMINI API keys available." },
      { status: 500 }
    );
  }

  try {
    const { prompt, stream = false, expectJson = false } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const runGenAI = async () => {
      const activeKey = getNextKey();
      const genAI = new GoogleGenerativeAI(activeKey);
      const model = genAI.getGenerativeModel({
        model: MODEL,
        generationConfig: {
          temperature: 0.6,
          topP: 0.95,
          maxOutputTokens: 4096,
          responseMimeType: expectJson ? "application/json" : "text/plain",
        },
      });
      return { model, activeKey };
    };

    if (stream) {
      const result = await withRetry(async () => {
        const { model } = await runGenAI();
        return model.generateContentStream(prompt);
      });
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
      const result = await withRetry(async () => {
        const { model } = await runGenAI();
        return model.generateContent(prompt);
      });
      const text = result.response.text();
      if (!text?.trim()) throw new Error("AI returned an empty response — try again.");
      return NextResponse.json({ text }, { headers: { "X-Model": MODEL } });
    }
  } catch (err: unknown) {
    const error = err as Error & { status?: number; message?: string };
    console.error("[AI Route Error]", error.message);
    const isRateLimit = error?.message?.includes("429") || error?.message?.includes("quota");
    return NextResponse.json(
      { error: isRateLimit ? "Rate limit reached. Please wait a moment and try again." : (error.message ?? "AI request failed") },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}
