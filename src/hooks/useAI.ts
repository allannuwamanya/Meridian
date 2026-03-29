import { useState, useCallback } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import {
  streamEnhanceBullet, generateSummaryVariants,
  scanKeywords, scoreResume, suggestSkills,
  extractResumeText, KeywordScanResult, ResumeScore,
} from "@/lib/ai";
import { AIVariant } from "@/types/resume";
import { toast } from "@/components/ui/Toast";

// ─── Bullet Enhancer Hook ─────────────────────────────────────────────────────

export function useEnhanceBullet() {
  const { resume, updateBullet, setAIStatus, setAIFeature, appendAIStream, clearAI } = useResumeStore();
  const [isEnhancing, setIsEnhancing] = useState<string | null>(null); // bulletId

  const enhance = useCallback(
    async (expId: string, bulletId: string, currentContent: string) => {
      const exp = resume.experience.find((e) => e.id === expId);
      if (!exp || !currentContent.trim()) return;

      setIsEnhancing(bulletId);
      setAIFeature("enhance-bullet", bulletId);
      setAIStatus("streaming");

      try {
        await streamEnhanceBullet(
          currentContent,
          exp.role,
          (token) => appendAIStream(token),
          (final) => {
            updateBullet(expId, bulletId, final);
          }
        );
        setAIStatus("done");
        toast.success("Bullet enhanced!", "Your achievement statement has been improved.");
      } catch (err: any) {
        setAIStatus("error");
        toast.error("AI Enhancement Failed", err?.message ?? "Check your connection and try again.");
      } finally {
        setIsEnhancing(null);
        setTimeout(() => clearAI(), 2500);
      }
    },
    [resume.experience, updateBullet, setAIStatus, setAIFeature, appendAIStream, clearAI]
  );

  return { enhance, isEnhancing };
}

// ─── Summary Variants Hook ────────────────────────────────────────────────────

export function useSummaryVariants() {
  const { resume, setAIStatus, setAIFeature, setAIVariants, clearAI } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(async () => {
    setIsGenerating(true);
    setAIFeature("summary-variants");
    setAIStatus("streaming");

    try {
      const variants = await generateSummaryVariants(
        resume.summary,
        resume.targetRole ?? "",
        resume.targetCompany ?? "",
        resume.jobDescription ?? ""
      );
      setAIVariants(variants);
      setAIStatus("done");
      toast.success("3 AI variants ready!", "Pick the one that best fits your target role.");
    } catch (err: any) {
      setAIStatus("error");
      toast.error("AI Generation Failed", err?.message ?? "Could not reach Gemini. Try again.");
      clearAI();
    } finally {
      setIsGenerating(false);
    }
  }, [resume, setAIStatus, setAIFeature, setAIVariants, clearAI]);

  return { generate, isGenerating };
}

// ─── Keyword Scanner Hook ─────────────────────────────────────────────────────

export function useKeywordScan() {
  const { resume } = useResumeStore();
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<KeywordScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async () => {
    if (!resume.jobDescription?.trim()) {
      toast.warning("No job description", "Paste a job description in Set Target first.");
      setError("Paste a job description first in the Job Target settings.");
      return;
    }
    setIsScanning(true);
    setError(null);
    try {
      const resumeText = extractResumeText(resume);
      const data = await scanKeywords(resumeText, resume.jobDescription);
      setResult(data);
      toast.success(`ATS Score: ${data.score}/100`, `${data.matched.length} keywords matched.`);
    } catch (err: any) {
      setError("Scan failed. Please try again.");
      toast.error("Keyword Scan Failed", err?.message ?? "Try again in a moment.");
    } finally {
      setIsScanning(false);
    }
  }, [resume]);

  return { scan, isScanning, result, error, setResult };
}

// ─── Resume Score Hook ────────────────────────────────────────────────────────

export function useResumeScore() {
  const { resume } = useResumeStore();
  const [isScoring, setIsScoring] = useState(false);
  const [score, setScore] = useState<ResumeScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  const evaluate = useCallback(async () => {
    setIsScoring(true);
    setError(null);
    try {
      const resumeText = extractResumeText(resume);
      const data = await scoreResume(resumeText, resume.targetRole);
      setScore(data);
      toast.success(`Resume Score: ${data.overall}/100`, "See the breakdown below.");
    } catch (err: any) {
      setError("Scoring failed. Please try again.");
      toast.error("Score Failed", err?.message ?? "Try again in a moment.");
    } finally {
      setIsScoring(false);
    }
  }, [resume]);

  return { evaluate, isScoring, score, error };
}

// ─── Skill Suggestions Hook ───────────────────────────────────────────────────

export function useSkillSuggestions() {
  const { resume, addSkill } = useResumeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const skills = await suggestSkills(
        resume.skills,
        resume.jobDescription ?? "",
        resume.targetRole ?? ""
      );
      const filtered = skills.filter((s) => !resume.skills.includes(s));
      setSuggestions(filtered);
      if (filtered.length === 0) toast.info("No new suggestions", "Your skills are already well-covered!");
      else toast.success(`${filtered.length} skill suggestions ready!`, "Click any to add it.");
    } catch (err: any) {
      toast.error("Suggestion Failed", err?.message ?? "Try again in a moment.");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [resume]);

  const accept = useCallback((skill: string) => {
    addSkill(skill);
    setSuggestions((prev) => prev.filter((s) => s !== skill));
  }, [addSkill]);

  return { fetch, isLoading, suggestions, accept };
}
