import { AIVariant } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function callAI(prompt: string, expectJson: boolean = false): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, stream: false, expectJson }),
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error ?? `AI request failed (${res.status})`);
  }
  const { text } = await res.json();
  if (!text) throw new Error("AI returned an empty response.");
  return text;
}

async function streamAI(
  prompt: string,
  onToken: (token: string) => void
): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, stream: true }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `AI stream failed (${res.status})`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No readable stream from AI.");

  const decoder = new TextDecoder();
  let fullContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const token = decoder.decode(value, { stream: true });
    fullContent += token;
    onToken(token);
  }

  return fullContent.trim();
}

// ─── Bullet Enhancer ──────────────────────────────────────────────────────────

export async function streamEnhanceBullet(
  bullet: string,
  role: string,
  onToken: (token: string) => void,
  onDone: (final: string) => void
): Promise<void> {
  const prompt = `You are an expert resume writer. Transform the following work experience bullet point into a powerful, achievement-framed statement using metrics and impact.

Role: ${role || "Professional"}
Original bullet: "${bullet}"

Rules:
- Start with a strong action verb (past tense)
- Include quantifiable metrics if possible (%, $, numbers, timeframes)
- Focus on impact and results, not duties
- Keep it to one sentence, max 20 words
- Do not use "I" or "we"
- Do not add a bullet symbol or dash

Respond with ONLY the improved bullet point text, nothing else.`;

  try {
    const final = await streamAI(prompt, onToken);
    onDone(final);
  } catch (error) {
    console.error("AI enhance error:", error);
    onDone(bullet); // fallback to original
    throw error;
  }
}

// ─── Summary Variants ─────────────────────────────────────────────────────────

export async function generateSummaryVariants(
  currentSummary: string,
  targetRole: string,
  targetCompany: string,
  jobDescription: string
): Promise<AIVariant[]> {
  const context = [
    targetRole && `Target role: ${targetRole}`,
    targetCompany && `Target company: ${targetCompany}`,
    jobDescription && `Job description excerpt: ${jobDescription.slice(0, 600)}`,
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = `You are an elite resume coach. Generate exactly 3 distinct professional summary variants for a resume.

Context:
${context || "No specific target provided — make them broadly compelling."}

Current summary:
"${currentSummary}"

Generate 3 variants with these distinct angles:
1. Achievement-Led: Opens with a hard metric or major win
2. Role-Specific: Tightly tailored to the target role/company keywords
3. Narrative: Tells a compelling career story arc

Rules:
- Each summary must be 2-3 sentences
- Max 500 characters each
- No "I" statements — third-person implied
- Include concrete numbers where possible

Respond in this exact JSON format (no markdown, no explanation):
[
  {"label":"Achievement-Led","content":"..."},
  {"label":"Role-Specific","content":"..."},
  {"label":"Narrative","content":"..."}
]`;

  const text = await callAI(prompt, true);
  const clean = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  const parsed = JSON.parse(clean) as { label: string; content: string }[];
  return parsed.map((v) => ({ id: uuidv4(), label: v.label, content: v.content }));
}

// ─── Keyword Scanner ──────────────────────────────────────────────────────────

export interface KeywordScanResult {
  score: number;
  matched: string[];
  missing: string[];
  suggestions: string[];
  atsWarnings: string[];
}

export async function scanKeywords(
  resumeText: string,
  jobDescription: string
): Promise<KeywordScanResult> {
  if (!jobDescription.trim()) {
    throw new Error("Job description is required for keyword scanning");
  }

  const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume against a job description.

RESUME:
${resumeText.slice(0, 3000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 2000)}

Respond in this exact JSON format (no markdown):
{
  "score": <number 0-100>,
  "matched": [<keywords found in both resume and JD, max 10>],
  "missing": [<important JD keywords not in resume, max 8>],
  "suggestions": [<specific action items to improve match, max 5>],
  "atsWarnings": [<ATS formatting issues detected, max 3>]
}`;

  const text = await callAI(prompt, true);
  const clean = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(clean) as KeywordScanResult;
}

// ─── Resume Score ─────────────────────────────────────────────────────────────

export interface ResumeScore {
  overall: number;
  breakdown: {
    impact: number;
    clarity: number;
    ats: number;
    completeness: number;
  };
  topIssues: string[];
  quickWins: string[];
}

export async function scoreResume(resumeText: string, targetRole?: string): Promise<ResumeScore> {
  const prompt = `You are an expert resume reviewer with 15 years of recruiting experience. Score this resume.

${targetRole ? `Target role: ${targetRole}` : ""}

RESUME:
${resumeText.slice(0, 3000)}

Score across 4 dimensions (0-100 each):
- Impact: Do bullets show measurable results?
- Clarity: Is it easy to read and well-structured?
- ATS: Will it pass Applicant Tracking Systems?
- Completeness: Are all key sections filled properly?

Respond in this exact JSON format (no markdown):
{
  "overall": <weighted average>,
  "breakdown": {
    "impact": <0-100>,
    "clarity": <0-100>,
    "ats": <0-100>,
    "completeness": <0-100>
  },
  "topIssues": [<max 3 critical problems>],
  "quickWins": [<max 3 easy improvements>]
}`;

  const text = await callAI(prompt, true);
  const clean = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(clean) as ResumeScore;
}

// ─── AI Skill Suggestions ─────────────────────────────────────────────────────

export async function suggestSkills(
  currentSkills: string[],
  jobDescription: string,
  targetRole: string
): Promise<string[]> {
  const prompt = `Based on this job description and current skills, suggest 8 additional relevant skills to add.

Target role: ${targetRole || "Professional"}
Current skills: ${currentSkills.join(", ")}
Job description: ${jobDescription.slice(0, 1000) || "Not provided"}

Rules:
- Only suggest real, specific technical or professional skills
- Don't repeat existing skills
- Order by relevance (most important first)
- Use standard industry terminology

Respond with ONLY a JSON array of strings, no explanation:
["skill1", "skill2", ...]`;

  const text = await callAI(prompt, true);
  const clean = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(clean) as string[];
}

// ─── Text extractor helper ────────────────────────────────────────────────────

export function extractResumeText(resume: {
  contact: { fullName: string };
  summary: string;
  experience: Array<{ role: string; company: string; bullets: Array<{ content: string }>; skills: string[] }>;
  education: Array<{ institution: string; degree: string; field: string }>;
  skills: string[];
  projects: Array<{ name: string; bullets: Array<{ content: string }> }>;
}): string {
  const lines: string[] = [
    resume.contact.fullName,
    resume.summary,
    ...resume.experience.flatMap((e) => [
      `${e.role} at ${e.company}`,
      ...e.bullets.map((b) => b.content),
      e.skills.join(", "),
    ]),
    ...resume.education.map((e) => `${e.degree} ${e.field} ${e.institution}`),
    `Skills: ${resume.skills.join(", ")}`,
    ...resume.projects.flatMap((p) => [p.name, ...p.bullets.map((b) => b.content)]),
  ];
  return lines.filter(Boolean).join("\n");
}
