"use client";
import { useState, useRef, useMemo } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { X, Sparkles, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSkillSuggestions } from "@/hooks/useAI";
import { cn } from "@/lib/utils";

const SUGGESTED_SKILLS = [
  "Leadership", "Communication", "Project Management", "SQL", "Python", "React",
  "TypeScript", "AWS", "Docker", "Machine Learning", "Figma", "Go", "Rust", "Swift",
  "Kubernetes", "GraphQL", "Redis", "TensorFlow", "Data Analysis", "Agile / Scrum",
];

// ─── Extract keywords from JD — local, zero API ───────────────────────────────
const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "is", "are", "was", "be", "been", "being", "have", "has", "had", "do", "does", "did",
  "will", "would", "could", "should", "may", "might", "shall", "can", "need", "must",
  "you", "we", "our", "your", "their", "this", "that", "these", "those", "from", "by",
  "as", "up", "out", "about", "into", "than", "then", "also", "very", "just", "not",
]);

function extractJDKeywords(jd: string): string[] {
  const words = jd
    .toLowerCase()
    .replace(/[^a-z0-9#+.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
  const freq = new Map<string, number>();
  words.forEach((w) => freq.set(w, (freq.get(w) ?? 0) + 1));
  return Array.from(freq.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([w]) => w);
}

export default function SkillsEditor() {
  const { resume, addSkill, removeSkill } = useResumeStore();
  const { fetch: fetchAISuggestions, isLoading, suggestions, accept } = useSkillSuggestions();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !resume.skills.includes(trimmed)) {
      addSkill(trimmed);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); handleAdd(); }
    if (e.key === "Backspace" && !input && resume.skills.length > 0) {
      removeSkill(resume.skills[resume.skills.length - 1]);
    }
  };

  const quickAddSuggestions = SUGGESTED_SKILLS.filter(
    (s) => !resume.skills.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  ).slice(0, 6);

  const staticSuggestions = SUGGESTED_SKILLS.filter((s) => !resume.skills.includes(s)).slice(0, 8);

  // ─── Keyword density (local) ─────────────────────────────────────────────
  const { matched, missing } = useMemo(() => {
    if (!resume.jobDescription?.trim()) return { matched: [], missing: [] };
    const jdKeywords = extractJDKeywords(resume.jobDescription);
    const skillsLower = resume.skills.map((s) => s.toLowerCase());
    const matchedKws = jdKeywords.filter((kw) =>
      skillsLower.some((s) => s.includes(kw) || kw.includes(s))
    );
    const missingKws = jdKeywords.filter((kw) => !matchedKws.includes(kw)).slice(0, 8);
    return { matched: matchedKws, missing: missingKws };
  }, [resume.skills, resume.jobDescription]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Skills</h2>
          <p className="text-sm text-gray-500">Hard skills only. Recruiters spend 6 seconds on skills — make them count.</p>
        </div>
        <button
          onClick={fetchAISuggestions}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white border border-rose-600 px-3 py-1.5 rounded-lg transition-all shrink-0 font-semibold shadow-sm"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {isLoading ? "Analyzing…" : "AI Suggest"}
        </button>
      </div>

      {/* ── Keyword density panel — only shows when JD is set ── */}
      {resume.jobDescription && (matched.length > 0 || missing.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-200 p-4 space-y-3 bg-white"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ATS Keyword Match</p>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              matched.length >= 5 ? "bg-emerald-50 text-emerald-700" :
              matched.length >= 2 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"
            )}>
              {matched.length}/{matched.length + missing.length} matched
            </span>
          </div>

          {matched.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-semibold text-emerald-600">In your resume</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matched.map((kw) => (
                  <span key={kw} className="text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {missing.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertCircle className="w-3 h-3 text-red-400" />
                <span className="text-[10px] font-semibold text-red-500">Missing from JD — click to add</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missing.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => addSkill(kw)}
                    className="text-[10px] font-medium bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:border-red-200 px-2 py-0.5 rounded-full transition-all active:scale-95"
                  >
                    + {kw}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Tag input */}
      <div
        className="bg-white rounded-2xl p-3 border border-gray-200 focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/10 transition-all flex flex-wrap gap-2 min-h-[56px] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence>
          {resume.skills.map((skill) => (
            <motion.span key={skill}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              className="skill-chip cursor-pointer"
              onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
            >
              {skill} <X className="w-2.5 h-2.5" />
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAdd}
          placeholder={resume.skills.length === 0 ? "Type a skill and press Enter…" : ""}
          className="flex-1 min-w-[120px] text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
        />
      </div>
      <p className="text-xs text-gray-400 -mt-4">Press Enter or comma to add · Click a skill to remove</p>

      {/* Search suggestions */}
      {input && quickAddSuggestions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2">
          {quickAddSuggestions.map((s) => (
            <button key={s} onClick={() => { addSkill(s); setInput(""); }}
              className="text-xs px-3 py-1 bg-gray-50 hover:bg-rose-50 text-gray-500 hover:text-rose-600 rounded-lg border border-gray-200 hover:border-rose-200 transition-all"
            >
              + {s}
            </button>
          ))}
        </motion.div>
      )}

      {/* AI Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
          >
            <div className="ai-badge rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                <Sparkles className="w-3.5 h-3.5" />
                AI-suggested skills based on your profile &amp; target role
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => accept(s)}
                    className="text-xs px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-lg border border-rose-200 hover:border-rose-300 transition-all"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Add */}
      {!input && suggestions.length === 0 && (
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Add</p>
          <div className="flex flex-wrap gap-2">
            {staticSuggestions.map((s) => (
              <button key={s} onClick={() => addSkill(s)}
                className="text-xs px-3 py-1 bg-gray-50 hover:bg-rose-50 text-gray-500 hover:text-rose-600 rounded-lg border border-gray-200 hover:border-rose-200 transition-all"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Skill count */}
      {resume.skills.length > 0 && (
        <div className="flex items-center gap-3 text-xs">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((resume.skills.length / 15) * 100, 100)}%` }}
            />
          </div>
          <span className={resume.skills.length < 6 ? "text-amber-600" : resume.skills.length > 15 ? "text-red-600" : "text-emerald-600"}>
            {resume.skills.length} skills
            {resume.skills.length < 6 && " — add more"}
            {resume.skills.length > 15 && " — consider trimming"}
          </span>
        </div>
      )}
    </div>
  );
}
