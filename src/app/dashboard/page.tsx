"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/useResumeStore";
import { INDUSTRY_LABELS } from "@/lib/industryPrompts";
import {
  Plus, FileText, Sparkles, Brain, Target, Zap, Copy, Trash2,
  Clock, Shield, ChevronRight, LayoutTemplate, Wand2, FlaskConical,
  Mail, Star, TrendingUp, Users, ArrowRight, BookOpen, Globe,
} from "lucide-react";
import { useState } from "react";
import { IndustryMode } from "@/types/resume";
import { cn } from "@/lib/utils";

const INDUSTRY_ICONS: Record<IndustryMode, React.ComponentType<any>> = {
  general: FileText, tech: Zap, healthcare: Users, executive: Star,
  academic: BookOpen, creative: Wand2, federal: Shield,
  finance: TrendingUp, legal: BookOpen, marketing: Target,
};

const INDUSTRY_COLORS: Record<IndustryMode, string> = {
  general: "from-slate-500 to-slate-600",
  tech: "from-blue-500 to-cyan-500",
  healthcare: "from-emerald-500 to-teal-500",
  executive: "from-amber-500 to-orange-500",
  academic: "from-indigo-500 to-blue-600",
  creative: "from-pink-500 to-rose-500",
  federal: "from-slate-600 to-slate-700",
  finance: "from-green-600 to-emerald-600",
  legal: "from-stone-600 to-stone-700",
  marketing: "from-purple-500 to-violet-500",
};

const FEATURE_TILES = [
  { icon: Zap, label: "Auto-Tailor Engine", desc: "One click rewrites all bullets to mirror any job description.", color: "from-rose-500 to-pink-600" },
  { icon: FlaskConical, label: "Quantification Lab", desc: "AI interviews you to extract real metrics. No hallucinations.", color: "from-violet-500 to-purple-600" },
  { icon: Mail, label: "Career Agent", desc: "Follow-up emails, interview prep, and salary ranges post-download.", color: "from-blue-500 to-cyan-600" },
  { icon: Brain, label: "Industry Modes", desc: "10 industry-specific AI modes: tech, healthcare, federal, and more.", color: "from-amber-500 to-orange-600" },
  { icon: Shield, label: "Shadow ATS", desc: "Real-time 10-point ATS health check. No job description required.", color: "from-emerald-500 to-teal-600" },
  { icon: Globe, label: "12 Templates", desc: "Academic, International, Creative, Executive and 8 more.", color: "from-indigo-500 to-blue-600" },
];

function formatLastSaved(date: Date | string | undefined): string {
  if (!date) return "Never saved";
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString();
}

function TemplatePreviewChip({ templateId }: { templateId: string }) {
  const colors: Record<string, string> = {
    "modern-minimal": "bg-slate-900", classic: "bg-gray-800", executive: "bg-[#0f172a]",
    technical: "bg-[#0f172a]", compact: "bg-white border", bold: "bg-[#065f46]",
    sidebar: "bg-[#4c1d95]", timeline: "bg-white border", creative: "bg-slate-900",
    academic: "bg-white border", "career-changer": "bg-[#7c3aed]", international: "bg-[#0f4c81]",
  };
  return (
    <div className={cn("rounded-lg px-2 py-0.5 text-[9px] font-semibold border border-transparent", colors[templateId] || "bg-gray-100")}>
      <span className={cn(templateId === "classic" || templateId === "compact" || templateId === "timeline" || templateId === "academic" ? "text-gray-700" : "text-white")}>
        {templateId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { savedResumes, createResume, loadResume, deleteResume, duplicateResume } = useResumeStore();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleNew = () => {
    createResume();
    router.push("/editor");
  };

  const handleOpen = (id: string) => {
    loadResume(id);
    router.push("/editor");
  };

  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      deleteResume(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateResume(id);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">Meridian</span>
            <span className="hidden sm:block text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">AI-Native</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">Home</a>
            <button
              onClick={handleNew}
              className="flex items-center gap-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg transition-all font-semibold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> New Resume
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* HERO */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Resumes</h1>
          <p className="text-gray-500 text-sm">Build, tailor, and deploy your career story. AI-powered for every application.</p>
        </motion.div>

        {/* RESUME GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {/* New Resume Card */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNew}
            className="bg-white rounded-2xl border-2 border-dashed border-rose-200 hover:border-rose-400 transition-all p-8 flex flex-col items-center justify-center gap-3 group min-h-[180px]"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center transition-colors border border-rose-200">
              <Plus className="w-5 h-5 text-rose-500" />
            </div>
            <p className="text-sm font-semibold text-rose-600">New Resume</p>
            <p className="text-xs text-gray-400 text-center">Start fresh with AI assistance</p>
          </motion.button>

          {/* Saved resume cards */}
          <AnimatePresence>
            {savedResumes.map((r, i) => {
              const IndustryIcon = INDUSTRY_ICONS[r.industryMode || "general"];
              const industryGrad = INDUSTRY_COLORS[r.industryMode || "general"];
              const isDeleting = deleteConfirmId === r.id;

              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group",
                    isDeleting ? "border-red-300" : "border-gray-200 hover:border-rose-200"
                  )}
                >
                  {/* Card accent bar */}
                  <div className={cn("h-1.5 w-full bg-gradient-to-r", industryGrad)} />

                  <div className="flex-1 p-5">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0", industryGrad)}>
                          <IndustryIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-tight">{r.contact.fullName || "Untitled"}</p>
                          <p className="text-xs text-gray-500">{r.title || "My Resume"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDuplicate(r.id)}
                          title="Duplicate"
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          title={isDeleting ? "Click again to confirm" : "Delete"}
                          className={cn("w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
                            isDeleting ? "bg-red-100 text-red-500" : "hover:bg-red-50 text-gray-400 hover:text-red-500"
                          )}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-2 mb-3">
                      <TemplatePreviewChip templateId={r.templateId} />
                      <span className="text-[10px] text-gray-400">{INDUSTRY_LABELS[r.industryMode || "general"]}</span>
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatLastSaved(r.lastSaved)}
                      </div>
                      {r.targetRole && (
                        <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full font-medium truncate max-w-[100px]">
                          {r.targetRole}
                        </span>
                      )}
                    </div>

                    {isDeleting && (
                      <p className="text-xs text-red-500 font-medium mt-2">Click delete again to confirm</p>
                    )}
                  </div>

                  {/* Edit button */}
                  <button
                    onClick={() => handleOpen(r.id)}
                    className="border-t border-gray-100 py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" /> Open in Editor <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* FEATURE SHOWCASE */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900">What makes Meridian different</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURE_TILES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-card hover:border-gray-200 transition-all group"
              >
                <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3", f.color)}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">{f.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* INDUSTRY QUICK SELECT */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Quick Start by Industry</h3>
          <p className="text-xs text-gray-500 mb-4">Create a new resume pre-configured for your field.</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(INDUSTRY_LABELS) as IndustryMode[]).map((mode) => {
              const Icon = INDUSTRY_ICONS[mode];
              const grad = INDUSTRY_COLORS[mode];
              return (
                <button
                  key={mode}
                  onClick={() => {
                    createResume();
                    // Note: industry mode will be set via the editor's role selector
                    router.push("/editor");
                  }}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-xl transition-all"
                >
                  <Icon className="w-3.5 h-3.5 text-gray-500" />
                  {INDUSTRY_LABELS[mode]}
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
