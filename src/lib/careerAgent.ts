import { ResumeData, EmailSequence, InterviewPack, SalaryRange } from "@/types/resume";
import { extractResumeText } from "@/lib/ai";

async function callAI(prompt: string): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, stream: false, expectJson: true }),
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "AI request failed" }));
    throw new Error(error ?? "Career Agent AI failed");
  }
  const { text } = await res.json();
  return text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
}

// ─── Follow-Up Email Sequence ──────────────────────────────────────────────────

export async function generateFollowUpEmails(
  resume: ResumeData
): Promise<EmailSequence> {
  const name = resume.contact.fullName;
  const role = resume.targetRole || "the position";
  const company = resume.targetCompany || "the company";
  const jdContext = resume.jobDescription?.slice(0, 600) || "";

  const prompt = `You are a professional career coach. Generate a 3-email follow-up sequence for a job applicant.

Applicant: ${name}
Applied for: ${role} at ${company}
${jdContext ? `Job context: "${jdContext}"` : ""}
Key skills: ${resume.skills.slice(0, 8).join(", ")}
Most recent role: ${resume.experience[0]?.role || "n/a"} at ${resume.experience[0]?.company || "n/a"}

Create 3 follow-up emails:
- Day 1 (same day): Confirm application, show genuine interest with one specific reason you're excited about this company
- Day 7: Value-add follow-up — share a specific insight, article, or project update that shows you're already thinking like you work there
- Day 14: Final gentle nudge — professional persistence without desperation

Rules:
- Personalized, not template-sounding
- Concise: Day 1 max 120 words, Day 7 max 100 words, Day 14 max 80 words
- Subject lines must be specific and non-generic
- Natural professional tone — not stiff or corporate

Respond with ONLY this JSON (no markdown):
{
  "day1": { "subject": "...", "body": "..." },
  "day7": { "subject": "...", "body": "..." },
  "day14": { "subject": "...", "body": "..." }
}`;

  const clean = await callAI(prompt);
  return JSON.parse(clean) as EmailSequence;
}

// ─── Interview Prep Pack ───────────────────────────────────────────────────────

export async function generateInterviewPrep(
  resume: ResumeData
): Promise<InterviewPack> {
  const resumeText = extractResumeText(resume);
  const role = resume.targetRole || "the target role";
  const company = resume.targetCompany || "the company";
  const jd = resume.jobDescription?.slice(0, 1500) || "";

  const prompt = `You are a senior interview coach. Generate a personalised interview prep pack for this candidate.

Target: ${role} at ${company}
${jd ? `Job Description:\n${jd}\n` : ""}
Resume Summary:
${resumeText.slice(0, 2000)}

Generate:
1. 8 likely interview questions (mix of behavioral, technical, situational)
2. For each: a short "guidance" tip (what they're really testing) and a sample answer framework based on THIS resume's specific experience
3. 3 key themes the interviewer will probe
4. 2 red flags to proactively address (gaps, transitions, etc.)

Respond with ONLY this JSON (no markdown):
{
  "questions": [
    {
      "question": "...",
      "guidance": "...",
      "sampleAnswer": "..."
    }
  ],
  "keyThemes": ["...", "...", "..."],
  "redFlags": ["...", "..."]
}`;

  const clean = await callAI(prompt);
  return JSON.parse(clean) as InterviewPack;
}

// ─── Salary Range Estimate ─────────────────────────────────────────────────────

export async function estimateSalary(
  role: string,
  location: string,
  skills: string[],
  yearsExp: number
): Promise<SalaryRange> {
  const prompt = `You are a compensation intelligence expert. Estimate the salary range for this profile.

Role: "${role}"
Location: "${location}"
Key skills: ${skills.slice(0, 10).join(", ")}
Estimated experience: ${yearsExp} years

Provide a realistic market salary range (low/mid/high) based on current market data.
Consider the location's cost of living and tech/industry premiums.

Respond with ONLY this JSON (no markdown):
{
  "low": <integer salary in local currency>,
  "mid": <integer median salary>,
  "high": <integer top-of-range salary>,
  "currency": "<USD/GBP/EUR/etc>",
  "context": "<One sentence: key factor driving this range, e.g., 'Senior-level Python + AWS skills command a 15% premium in SF Bay Area'>"
}`;

  const clean = await callAI(prompt);
  return JSON.parse(clean) as SalaryRange;
}
