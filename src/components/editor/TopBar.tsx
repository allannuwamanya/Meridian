"use client";
import { motion } from "framer-motion";
import { Sparkles, Download, Settings2, ChevronDown, Target, Check } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { useState, useEffect } from "react";
import { TemplateId } from "@/types/resume";
import JobTargetModal from "@/components/ui/JobTargetModal";

const templates: { id: TemplateId; label: string }[] = [
  { id: "modern-minimal", label: "Modern Minimal" },
  { id: "classic", label: "Classic" },
  { id: "executive", label: "Executive" },
  { id: "technical", label: "Technical" },
  { id: "creative", label: "Creative" },
];

export default function TopBar() {
  const { resume, isDirty, markSaved, updateTemplateId, setShowJobTargetModal } = useResumeStore();
  const [showTemplates, setShowTemplates] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Auto-save simulation: mark saved after 2s of no edits
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      markSaved();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isDirty, resume, markSaved]);

  const handleExportPDF = () => {
    // Trigger browser print dialog — the print CSS styles A4 layout
    window.print();
  };

  const hasJobTarget = !!(resume.targetRole || resume.targetCompany || resume.jobDescription);

  return (
    <>
      <JobTargetModal />
      <header
        className="h-14 flex items-center justify-between px-4 border-b border-white/5 relative z-50 flex-shrink-0"
        style={{ background: "var(--bg-surface)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-white hidden sm:block">Meridian</span>
          <span className="mx-1.5 text-white/10 hidden sm:block">|</span>
          <span className="text-sm text-slate-400 max-w-[140px] truncate hidden sm:block">{resume.title}</span>
        </div>

        {/* Center: autosave + template + job target */}
        <div className="flex items-center gap-3">
          {/* Autosave indicator */}
          <motion.div
            key={isDirty ? "dirty" : justSaved ? "saved" : "idle"}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-xs text-slate-500"
          >
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
              isDirty ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
            }`} />
            {isDirty ? "Saving…" : justSaved ? "Saved ✓" : "All saved"}
          </motion.div>

          {/* Template switcher */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all border border-white/5"
            >
              <Settings2 className="w-3.5 h-3.5" />
              {templates.find((t) => t.id === resume.templateId)?.label ?? "Template"}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute top-full mt-2 right-0 glass-elevated rounded-xl p-1.5 min-w-[160px] shadow-2xl z-50"
              >
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { updateTemplateId(t.id); setShowTemplates(false); }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                      resume.templateId === t.id
                        ? "bg-violet-600/30 text-violet-300"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {t.label}
                    {resume.templateId === t.id && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Job target button */}
          <button
            onClick={() => setShowJobTargetModal(true)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all border ${
              hasJobTarget
                ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/25 hover:bg-cyan-500/20"
                : "bg-white/5 text-slate-400 hover:text-slate-200 border-white/5 hover:bg-white/10"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{hasJobTarget ? "Job Target ✓" : "Set Target"}</span>
          </button>
        </div>

        {/* Right: Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white px-3.5 py-1.5 rounded-lg transition-all font-medium hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </header>
    </>
  );
}
