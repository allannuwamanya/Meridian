import { useState, useEffect, useRef, useCallback } from "react";
import { useResumeStore } from "@/store/useResumeStore";

interface Nudge {
  text: string;
  type: "tip" | "warning" | "praise";
}

export function useAINudge(content: string, context: string, delayMs = 1800) {
  const [nudge, setNudge] = useState<Nudge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastContentRef = useRef<string>("");

  const fetchNudge = useCallback(async (text: string) => {
    if (!text || text.trim().length < 40) { setNudge(null); return; }
    if (text === lastContentRef.current) return;
    lastContentRef.current = text;

    setIsLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectJson: true,
          stream: false,
          prompt: `You are a concise resume writing coach. Analyze this text and give ONE short (max 18 words) coaching nudge.

Context: ${context}
Text: "${text}"

Rules:
- If it's great, say so briefly
- If something is missing (metric, verb, clarity), point it out in one line
- Keep it encouraging and specific
- type is: "tip" if suggesting improvement, "warning" if there's a real issue, "praise" if it's strong

Respond with this exact JSON:
{"text": "...", "type": "tip" | "warning" | "praise"}`
        }),
      });
      if (!res.ok) return;
      const { text: raw } = await res.json();
      const clean = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
      const parsed = JSON.parse(clean) as Nudge;
      setNudge(parsed);
    } catch {
      // silently fail — nudges are non-critical
    } finally {
      setIsLoading(false);
    }
  }, [context]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchNudge(content), delayMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [content, delayMs, fetchNudge]);

  return { nudge, isLoading };
}
