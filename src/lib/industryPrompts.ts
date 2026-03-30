import { IndustryMode } from "@/types/resume";

export const INDUSTRY_LABELS: Record<IndustryMode, string> = {
  general: "General",
  tech: "Software / Tech",
  healthcare: "Healthcare / Clinical",
  executive: "Executive / C-Suite",
  academic: "Academic / Research",
  creative: "Creative / Design",
  federal: "Federal / Government",
  finance: "Finance / Banking",
  legal: "Legal / Compliance",
  marketing: "Marketing / Growth",
};

export const INDUSTRY_CONTEXT: Record<IndustryMode, string> = {
  general: `Write for a broad professional audience. Use clear, impactful language. Focus on measurable outcomes.`,

  tech: `Write for software engineering and technology roles. Use precise technical terminology. Prioritize:
- Performance metrics (latency, throughput, uptime %)
- Scale indicators (users, requests/sec, data volume)
- Technologies and languages as specific keywords
- System design, architecture decisions
- Team/mentorship impact
Avoid vague phrases. Prefer: "Reduced p99 latency by 35%" over "Improved performance".`,

  healthcare: `Write for clinical, nursing, medical, or allied health roles. Prioritize:
- Patient outcomes and safety metrics
- Clinical certifications and licensure keywords (RN, BSN, ACLS, BLS)
- HIPAA compliance and EMR/EHR systems (Epic, Cerner)
- Patient volume and case complexity
- Quality improvement and JCAHO standards
Use clinical terminology correctly. Avoid jargon that obscures patient impact.`,

  executive: `Write for C-suite, VP, Director, and senior leadership roles. Prioritize:
- Revenue impact ($M, $B scale)
- P&L ownership and budget stewardship
- Board-level reporting and strategic vision
- Organizational transformation and headcount scale
- M&A, fundraising, market expansion
Tone: authoritative, concise, leadership-focused. Avoid tactical minutiae.`,

  academic: `Write for faculty, research, and postdoctoral roles (CV format). Prioritize:
- Publications (peer-reviewed, impact factor, citations)
- Research grants and funding ($amounts, funding bodies)
- Teaching experience and curriculum development
- Conference presentations and keynotes
- Lab/team mentorship and thesis supervision
Use precise academic language. Include field-specific methodology terms.`,

  creative: `Write for design, UX, content, and creative roles. Prioritize:
- Portfolio-linked projects with clear outcomes
- User research, A/B testing, conversion metrics
- Design tools (Figma, Adobe XD, Sketch, After Effects)
- Brand impact and campaign reach
- Cross-functional collaboration with engineering/marketing
Balance creative vision with measurable business outcomes.`,

  federal: `Write for USAJOBS and federal government applications (USAJOBS format). Prioritize:
- KSA (Knowledge, Skills, and Abilities) alignment
- GS grade equivalency
- Duty hours and supervisory status where relevant
- Federal agency acronyms and program names
- Clearance levels (if applicable)
Be more verbose than private sector — federal applications reward detail and completeness.`,

  finance: `Write for banking, investment, private equity, and financial services roles. Prioritize:
- AUM, deal size, portfolio performance (% returns, alpha)
- Regulatory compliance (Basel III, Dodd-Frank, SEC/FINRA)
- Financial modeling, valuation, DCF, LBO
- Client relationship and AUM growth
- Transaction experience and capital markets exposure
Use precise financial terminology. Quantify everything in $ terms.`,

  legal: `Write for attorney, paralegal, compliance, and legal operations roles. Prioritize:
- Bar admissions and practice areas
- Case outcomes (verdicts, settlements, regulatory wins)
- Transaction experience (M&A, securities, IP)
- Regulatory and compliance frameworks
- Research, brief-writing, and litigation support
Maintain professional legal tone. Use recognized legal terminology.`,

  marketing: `Write for marketing, growth, demand generation, and brand roles. Prioritize:
- Revenue influenced, pipeline generated ($)
- CAC, LTV, ROAS, conversion rate metrics
- Campaign reach, MQL/SQL volume
- SEO/SEM, paid media, organic growth
- Marketing technology stack (HubSpot, Salesforce, Google Analytics)
Lead with business outcomes. Quantify every campaign and initiative.`,
};

export function getIndustrySystemPrompt(mode: IndustryMode): string {
  return `INDUSTRY CONTEXT — ${INDUSTRY_LABELS[mode]}:\n${INDUSTRY_CONTEXT[mode]}\n\nApply this industry context to all suggestions.`;
}
