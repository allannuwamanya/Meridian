import { useState, useCallback } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { WorkExperience, BulletPoint, QuantQuestion } from "@/types/resume";

interface LabBullet {
  bulletId: string;
  expId: string;
  role: string;
  company: string;
  original: string;
  isWeak: boolean;
  questions: string[];
  answers: Record<string, string>;
  rewritten: string | null;
  state: "pending" | "questioning" | "rewriting" | "done" | "skipped";
}

function isWeakBullet(content: string): boolean {
  const hasMetric = /\d+/.test(content); // no number = weak
  const hasStrongVerb = /^(Led|Built|Achieved|Increased|Reduced|Managed|Delivered|Launched|Grew|Saved|Automated|Optimized|Developed|Implemented|Designed|Architected|Directed|Generated)/i.test(content.trim());
  const tooShort = content.trim().length < 40;
  return !hasMetric || !hasStrongVerb || tooShort;
}

async function generateQuestionsForBullet(bullet: string, role: string): Promise<string[]> {
  const prompt = `You are a career coach helping someone quantify a resume bullet.

The bullet: "${bullet}"
The person's role: "${role}"

Ask 3 focused follow-up questions to extract real metrics and impact. Questions should be specific and answerable.
Example types:
- "How many people were on your team / affected by this?"
- "What was the % improvement or time saved?"
- "What was the budget or revenue scale?"
- "How long did this take to build/implement?"

Return ONLY a JSON array of 3 question strings. No markdown, no commentary:
["Question 1?", "Question 2?", "Question 3?"]`;

  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, stream: false }),
  });
  if (!res.ok) throw new Error("AI request failed");
  const { text } = await res.json();
  const clean = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(clean) as string[];
}

async function rewriteBulletWithAnswers(
  original: string,
  role: string,
  questions: string[],
  answers: Record<string, string>
): Promise<string> {
  const qaBlock = questions
    .map((q, i) => `Q: ${q}\nA: ${answers[String(i)] || "(not provided)"}`)
    .join("\n\n");

  const prompt = `You are an expert resume writer. Rewrite the following bullet point using the context provided by the interview answers.

ORIGINAL BULLET: "${original}"
ROLE: "${role}"

INTERVIEW ANSWERS:
${qaBlock}

Rules:
- Start with a strong action verb
- Incorporate real numbers from the answers
- Keep under 175 characters
- Do not fabricate any information not provided
- If a metric was "not provided", don't include it
- Return ONLY the rewritten bullet. No quotes, no commentary.`;

  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, stream: false }),
  });
  if (!res.ok) throw new Error("AI request failed");
  const { text } = await res.json();
  return text.replace(/^["']|["']$/g, "").trim();
}

export function useQuantLab() {
  const { resume, updateBullet } = useResumeStore();
  const [labBullets, setLabBullets] = useState<LabBullet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const startLab = useCallback(async (expId?: string) => {
    setIsStarting(true);
    try {
      // Collect weak bullets
      const targetExp = expId
        ? resume.experience.filter((e) => e.id === expId)
        : resume.experience;

      const weakBullets: LabBullet[] = [];
      for (const exp of targetExp) {
        for (const bullet of exp.bullets) {
          if (!bullet.content.trim()) continue;
          if (isWeakBullet(bullet.content)) {
            weakBullets.push({
              bulletId: bullet.id,
              expId: exp.id,
              role: exp.role,
              company: exp.company,
              original: bullet.content,
              isWeak: true,
              questions: [],
              answers: {},
              rewritten: null,
              state: "questioning",
            });
          }
        }
      }

      if (weakBullets.length === 0) {
        setIsActive(false);
        return { noWeakBullets: true };
      }

      // Generate questions for first bullet immediately, others on demand
      if (weakBullets[0]) {
        const questions = await generateQuestionsForBullet(weakBullets[0].original, weakBullets[0].role);
        weakBullets[0].questions = questions;
      }

      setLabBullets(weakBullets);
      setCurrentIndex(0);
      setIsActive(true);
      return { count: weakBullets.length };
    } finally {
      setIsStarting(false);
    }
  }, [resume]);

  const setAnswer = useCallback((questionIndex: number, answer: string) => {
    setLabBullets((prev) =>
      prev.map((b, i) =>
        i === currentIndex ? { ...b, answers: { ...b.answers, [String(questionIndex)]: answer } } : b
      )
    );
  }, [currentIndex]);

  const rewriteCurrent = useCallback(async () => {
    const current = labBullets[currentIndex];
    if (!current) return;

    setLabBullets((prev) => prev.map((b, i) => i === currentIndex ? { ...b, state: "rewriting" } : b));
    try {
      const rewritten = await rewriteBulletWithAnswers(current.original, current.role, current.questions, current.answers);
      setLabBullets((prev) => prev.map((b, i) => i === currentIndex ? { ...b, rewritten, state: "done" } : b));
    } catch {
      setLabBullets((prev) => prev.map((b, i) => i === currentIndex ? { ...b, state: "questioning" } : b));
    }
  }, [labBullets, currentIndex]);

  const applyRewrite = useCallback(() => {
    const current = labBullets[currentIndex];
    if (current?.rewritten) {
      updateBullet(current.expId, current.bulletId, current.rewritten);
    }
    moveNext();
  }, [labBullets, currentIndex, updateBullet]);

  const skipCurrent = useCallback(() => {
    setLabBullets((prev) => prev.map((b, i) => i === currentIndex ? { ...b, state: "skipped" } : b));
    moveNext();
  }, [currentIndex]);

  const moveNext = useCallback(async () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= labBullets.length) {
      setIsActive(false);
      return;
    }
    // Preload questions for next bullet if not loaded
    const nextBullet = labBullets[nextIdx];
    if (nextBullet && nextBullet.questions.length === 0) {
      try {
        const questions = await generateQuestionsForBullet(nextBullet.original, nextBullet.role);
        setLabBullets((prev) => prev.map((b, i) => i === nextIdx ? { ...b, questions } : b));
      } catch {}
    }
    setCurrentIndex(nextIdx);
  }, [currentIndex, labBullets]);

  const closeLab = useCallback(() => {
    setIsActive(false);
    setLabBullets([]);
    setCurrentIndex(0);
  }, []);

  const currentBullet = labBullets[currentIndex] ?? null;
  const progress = labBullets.length > 0 ? ((currentIndex) / labBullets.length) * 100 : 0;
  const completedCount = labBullets.filter((b) => b.state === "done" || b.state === "skipped").length;

  return {
    isActive, isStarting, labBullets, currentBullet, currentIndex,
    progress, completedCount,
    startLab, setAnswer, rewriteCurrent, applyRewrite, skipCurrent, closeLab,
  };
}
