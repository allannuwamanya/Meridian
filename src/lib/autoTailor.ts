import { WorkExperience, TailoredBullet } from "@/types/resume";

export async function autoTailorBullets(
  experience: WorkExperience[],
  jobDescription: string,
  targetRole: string
): Promise<TailoredBullet[]> {
  // Flatten all bullets with their context
  const bulletData = experience.flatMap((exp) =>
    exp.bullets
      .filter((b) => b.content.trim())
      .map((b) => ({
        bulletId: b.id,
        expId: exp.id,
        role: exp.role,
        company: exp.company,
        original: b.content,
      }))
  );

  if (bulletData.length === 0) throw new Error("No bullets found to tailor.");

  const prompt = `You are an expert resume strategist. Your task is to rewrite resume bullet points to precisely mirror the language, priorities, and keywords of a specific job description — without inventing fake accomplishments.

TARGET ROLE: "${targetRole || "the target role"}"

JOB DESCRIPTION (key excerpt):
${jobDescription.slice(0, 2500)}

RESUME BULLETS TO TAILOR:
${JSON.stringify(
  bulletData.map((b) => ({
    id: b.bulletId,
    expId: b.expId,
    role: b.role,
    original: b.original,
  })),
  null,
  2
)}

Rules:
- Mirror JD vocabulary and phrasing WITHOUT adding false information
- If the JD mentions "cross-functional collaboration", rewrite bullets that involve teamwork to explicitly use similar language
- Keep the factual core of each bullet — only rephrase, don't fabricate
- Strengthen weak bullets with stronger action verbs if possible
- Keep rewrites under 200 characters
- If a bullet cannot be meaningfully tailored to this JD, still return it with minor improvements
- Every bullet MUST get a rewrite (even small improvements count)
- "reason" field: 1 short phrase explaining what changed (e.g., "Mirrored JD's 'cross-functional' language")

Respond with ONLY this JSON array (no markdown):
[
  {
    "bulletId": "...",
    "expId": "...",
    "original": "...",
    "rewritten": "...",
    "reason": "..."
  }
]`;

  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, stream: false, expectJson: true }),
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Auto-tailor request failed" }));
    throw new Error(error ?? "Auto-tailor failed");
  }

  const { text } = await res.json();
  const clean = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(clean) as TailoredBullet[];
}
