import { useState, useCallback } from "react";
import { toast } from "@/components/ui/Toast";

export interface CompanyIntel {
  atsSystem: string;
  cultureKeywords: string[];
  resumeTone: string;
  redFlags: string[];
  hiringInsights: string;
}

export function useCompanyIntel() {
  const [intel, setIntel] = useState<CompanyIntel | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchIntel = useCallback(async (company: string, role: string) => {
    if (!company.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectJson: true,
          stream: false,
          prompt: `You are a hiring intelligence expert. Provide recruiter-level intelligence for a job application.

Company: "${company}"
Target Role: "${role || "General applicant"}"

Respond with this exact JSON (no markdown):
{
  "atsSystem": "<which ATS this company likely uses: Workday, Greenhouse, Lever, iCIMS, Taleo, SmartRecruiters, or Unknown>",
  "cultureKeywords": ["<5 keywords this company values in candidates, e.g. data-driven, ownership, scale>"],
  "resumeTone": "<One sentence: what writing style/format best works for this company, e.g. STAR method metrics-first>",
  "redFlags": ["<3 things to avoid on a resume targeting this company>"],
  "hiringInsights": "<One sentence insider tip about how this company evaluates resumes>"
}`
        }),
      });
      if (!res.ok) { toast.error("Intel fetch failed", "Could not load company data."); return; }
      const { text } = await res.json();
      const clean = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
      setIntel(JSON.parse(clean) as CompanyIntel);
      toast.success(`${company} intel loaded`, "AI has profiled this company for your resume.");
    } catch (err: any) {
      toast.error("Company intel failed", err?.message ?? "Try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearIntel = useCallback(() => setIntel(null), []);

  return { intel, isLoading, fetchIntel, clearIntel };
}
