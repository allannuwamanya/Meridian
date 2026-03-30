"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import {
  CheckCircle2, AlertCircle, AlertTriangle, ChevronDown, ChevronUp, Shield,
} from "lucide-react";
import { useMemo, useState } from "react";

// ─── Local ATS rule engine — zero API calls ───────────────────────────────────

function scoreATS(resume: any): { score: number; checks: { label: string; pass: boolean | "warn"; tip: string }[] } {
  const checks = [];

  // Contact completeness
  const c = resume.contact;
  checks.push({
    label: "Contact info complete",
    pass: !!(c.fullName && c.email && c.phone && c.location),
    tip: "Add name, email, phone, and location for full ATS compatibility.",
  });
  checks.push({
    label: "LinkedIn URL present",
    pass: !!c.linkedin ? true : "warn" as const,
    tip: "Most ATS systems parse LinkedIn. Add yours to stand out.",
  });

  // Summary
  checks.push({
    label: "Professional summary written",
    pass: resume.summary?.length >= 100,
    tip: "A 2–3 sentence summary dramatically increases ATS match rate.",
  });

  // Experience
  const totalBullets = resume.experience.flatMap((e: any) => e.bullets).filter((b: any) => b.content.trim());
  const longBullets  = totalBullets.filter((b: any) => b.content.length > 200);
  checks.push({
    label: "Work experience entries filled",
    pass: resume.experience.length > 0 && resume.experience.some((e: any) => e.role && e.company),
    tip: "At least one complete experience entry is required.",
  });
  checks.push({
    label: "Bullet points present",
    pass: totalBullets.length >= 3,
    tip: "Aim for 3–6 bullets per role to pass ATS keyword density checks.",
  });
  checks.push({
    label: "No overly long bullets (>200 chars)",
    pass: longBullets.length === 0 ? true : "warn" as const,
    tip: "ATS systems often truncate bullets over 200 characters. Keep them concise.",
  });

  // Quantified bullets
  const metricsRegex = /(\d+%|\d+x|\$[\d,.]+|\d+ (million|billion|users|customers|teams|people|engineers|points))/i;
  const quantifiedCount = totalBullets.filter((b: any) => metricsRegex.test(b.content)).length;
  checks.push({
    label: `Quantified bullets (${quantifiedCount}/${totalBullets.length})`,
    pass: quantifiedCount >= 2 ? true : quantifiedCount >= 1 ? "warn" as const : false,
    tip: "Resumes with ≥2 quantified achievements get 40% more recruiter callbacks.",
  });

  // Skills
  checks.push({
    label: "Skills section populated",
    pass: resume.skills.length >= 5,
    tip: "Add 8–15 skills so ATS can match you against the job description.",
  });

  // Education
  checks.push({
    label: "Education entry present",
    pass: resume.education.length > 0 && resume.education.some((e: any) => e.institution || e.degree),
    tip: "Include at least one education entry — most ATS require it.",
  });

  // Job target
  checks.push({
    label: "Job target / JD set",
    pass: !!(resume.targetRole || resume.jobDescription) ? true : "warn" as const,
    tip: "Set a job target so AI can tailor keyword suggestions to your application.",
  });

  const passed = checks.filter((c) => c.pass === true).length;
  const warned = checks.filter((c) => c.pass === "warn").length;
  const score  = Math.round((passed / checks.length) * 100 + (warned / checks.length) * 30);

  return { score: Math.min(score, 100), checks };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ATSHealthBar() {
  const { resume } = useResumeStore();
  const [expanded, setExpanded] = useState(false);
  const { score, checks } = useMemo(() => scoreATS(resume), [resume]);

  const statusColor =
    score >= 80 ? "text-emerald-600" :
    score >= 55 ? "text-amber-600" :
    "text-red-500";

  const barColor =
    score >= 80 ? "bg-emerald-500" :
    score >= 55 ? "bg-amber-400" :
    "bg-red-400";

  const fails  = checks.filter((c) => c.pass === false).length;
  const warns  = checks.filter((c) => c.pass === "warn").length;

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* Summary row — always visible */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Shield className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-semibold text-gray-700">ATS Health</span>
          {/* Score bar */}
          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={cn("h-full rounded-full", barColor)}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <span className={cn("text-xs font-bold tabular-nums", statusColor)}>{score}%</span>
        </div>
        <div className="flex items-center gap-2">
          {fails > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
              <AlertCircle className="w-2.5 h-2.5" /> {fails} issue{fails > 1 ? "s" : ""}
            </span>
          )}
          {warns > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              <AlertTriangle className="w-2.5 h-2.5" /> {warns} warning{warns > 1 ? "s" : ""}
            </span>
          )}
          
          {(fails > 0 || warns > 0) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent("open-quant-lab"));
              }}
              className="ml-2 flex items-center gap-1 text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-2.5 py-1 rounded-lg border border-rose-200 transition-colors"
            >
               Fix with AI
            </button>
          )}

          {expanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" /> : <ChevronUp className="w-3.5 h-3.5 text-gray-400 ml-1" />}
        </div>
      </button>

      {/* Expanded checklist */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="px-5 py-3 grid grid-cols-1 gap-1.5 max-h-[240px] overflow-y-auto">
              {checks.map((check, i) => (
                <div key={i} className="flex items-start gap-2.5 group">
                  {check.pass === true && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />}
                  {check.pass === "warn" && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />}
                  {check.pass === false && <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <span className={cn(
                      "text-[11px] font-medium block leading-tight",
                      check.pass === true ? "text-gray-700" :
                      check.pass === "warn" ? "text-amber-700" : "text-red-600"
                    )}>{check.label}</span>
                    {check.pass !== true && (
                      <span className="text-[10px] text-gray-400 leading-tight">{check.tip}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
