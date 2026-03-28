"use client";
import { useState, useRef } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { Plus, X, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSkillSuggestions } from "@/hooks/useAI";

const SUGGESTED_SKILLS = [
  "Leadership", "Communication", "Project Management", "SQL", "Python", "React",
  "TypeScript", "AWS", "Docker", "Machine Learning", "Figma", "Go", "Rust", "Swift",
  "Kubernetes", "GraphQL", "Redis", "TensorFlow", "Data Analysis", "Agile / Scrum",
];

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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Skills</h2>
          <p className="text-sm text-slate-500">Hard skills only. Recruiters spend 6 seconds on skills — make them count.</p>
        </div>
        <button
          onClick={fetchAISuggestions}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/25 px-3 py-1.5 rounded-lg transition-all shrink-0"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {isLoading ? "Analyzing…" : "AI Suggest"}
        </button>
      </div>

      {/* Tag input */}
      <div
        className="glass rounded-2xl p-3 border border-white/5 focus-within:border-violet-500/30 transition-colors flex flex-wrap gap-2 min-h-[56px] cursor-text"
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
          className="flex-1 min-w-[120px] text-sm bg-transparent outline-none text-slate-200 placeholder:text-slate-600"
        />
      </div>
      <p className="text-xs text-slate-600 -mt-4">Press Enter or comma to add · Click a skill to remove</p>

      {/* Search suggestions */}
      {input && quickAddSuggestions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2">
          {quickAddSuggestions.map((s) => (
            <button key={s} onClick={() => { addSkill(s); setInput(""); }}
              className="text-xs px-3 py-1 bg-white/5 hover:bg-violet-500/20 text-slate-400 hover:text-violet-300 rounded-lg border border-white/5 hover:border-violet-500/25 transition-all"
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
              <div className="flex items-center gap-2 text-xs font-semibold text-violet-300">
                <Sparkles className="w-3.5 h-3.5" />
                AI-suggested skills based on your profile & target role
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => accept(s)}
                    className="text-xs px-3 py-1 bg-violet-500/15 hover:bg-violet-500/30 text-violet-300 hover:text-violet-200 rounded-lg border border-violet-500/20 hover:border-violet-500/40 transition-all"
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
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Quick Add</p>
          <div className="flex flex-wrap gap-2">
            {staticSuggestions.map((s) => (
              <button key={s} onClick={() => addSkill(s)}
                className="text-xs px-3 py-1 bg-white/5 hover:bg-violet-500/15 text-slate-500 hover:text-violet-300 rounded-lg border border-white/5 hover:border-violet-500/20 transition-all"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Skill count insight */}
      {resume.skills.length > 0 && (
        <div className="flex items-center gap-3 text-xs">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((resume.skills.length / 15) * 100, 100)}%` }}
            />
          </div>
          <span className={resume.skills.length < 6 ? "text-amber-400" : resume.skills.length > 15 ? "text-red-400" : "text-emerald-400"}>
            {resume.skills.length} skills
            {resume.skills.length < 6 && " — add more"}
            {resume.skills.length > 15 && " — consider trimming"}
          </span>
        </div>
      )}
    </div>
  );
}
