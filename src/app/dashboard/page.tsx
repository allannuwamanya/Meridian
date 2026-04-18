"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { INDUSTRY_LABELS } from "@/lib/industryPrompts";
import {
  Plus, FileText, Sparkles, Brain, Target, Zap, Copy, Trash2,
  Clock, Shield, ChevronRight, Wand2, FlaskConical, AlertCircle,
  Mail, Star, TrendingUp, Users, Briefcase, Search, Settings, BookOpen,
  MousePointerClick, ArrowUpDown, LayoutTemplate, CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { IndustryMode, ResumeData } from "@/types/resume";
import { cn } from "@/lib/utils";

const INDUSTRY_ICONS: Record<IndustryMode, LucideIcon> = {
  general: FileText, tech: Zap, healthcare: Users, executive: Star,
  academic: BookOpen, creative: Wand2, federal: Shield,
  finance: TrendingUp, legal: BookOpen, marketing: Target,
};

const INDUSTRY_GRADIENTS: Record<IndustryMode, string> = {
  general: "from-slate-400 to-slate-600",
  tech: "from-blue-500 to-cyan-400",
  healthcare: "from-emerald-400 to-teal-500",
  executive: "from-amber-400 to-orange-500",
  academic: "from-indigo-400 to-blue-500",
  creative: "from-pink-400 to-rose-500",
  federal: "from-slate-600 to-slate-800",
  finance: "from-green-500 to-emerald-600",
  legal: "from-stone-500 to-stone-700",
  marketing: "from-violet-400 to-purple-500",
};

const FEATURE_TILES = [
  { icon: Zap, label: "Auto-Tailor Engine", desc: "Rewrite bullets to mirror any JD without fabricating facts.", color: "text-rose-500 bg-rose-50" },
  { icon: FlaskConical, label: "Quantification Lab", desc: "Extract real metrics from weak bullets before rewriting.", color: "text-violet-500 bg-violet-50" },
  { icon: Mail, label: "Career Agent", desc: "Follow-ups, interview prep, and salary intelligence.", color: "text-blue-500 bg-blue-50" },
  { icon: Brain, label: "Industry Modes", desc: "Context-aware writing style for 10 industries.", color: "text-amber-500 bg-amber-50" },
  { icon: Shield, label: "ATS Health", desc: "Local ATS checks for structure and readiness.", color: "text-emerald-500 bg-emerald-50" },
];

type SortMode = "updated-desc" | "updated-asc" | "name-asc" | "name-desc";

type ResumeHealth = {
  score: number;
  completedChecks: number;
  totalChecks: number;
  missing: string[];
  status: "strong" | "fair" | "weak";
};

function getTimestamp(date?: Date | string): number {
  if (!date) return 0;
  const ts = new Date(date).getTime();
  return Number.isNaN(ts) ? 0 : ts;
}

function formatLastSaved(date: Date | string | undefined): string {
  if (!date) return "Never saved";
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function hasTargetContext(resume: ResumeData): boolean {
  return Boolean(
    resume.targetRole?.trim() ||
    resume.targetCompany?.trim() ||
    resume.jobDescription?.trim()
  );
}

function hasNumericImpact(text: string): boolean {
  return /(\d+%|\$[\d,.]+|\d+x|\d+\s*(k|m|million|billion|users|customers|leads|teams|engineers|days|hours))/i.test(text);
}

function getResumeHealth(resume: ResumeData): ResumeHealth {
  const bullets = resume.experience.flatMap((e) => e.bullets).filter((b) => b.content.trim());
  const metricCount = bullets.filter((b) => hasNumericImpact(b.content)).length;

  const checks = [
    { label: "Contact basics", pass: Boolean(resume.contact.fullName && resume.contact.email && resume.contact.phone && resume.contact.location) },
    { label: "Summary", pass: resume.summary.trim().length >= 90 },
    { label: "Experience", pass: resume.experience.some((e) => e.role && e.company && e.bullets.some((b) => b.content.trim())) },
    { label: "Skills", pass: resume.skills.length >= 6 },
    { label: "Education", pass: resume.education.some((e) => e.institution && e.degree) },
    { label: "Targeting", pass: hasTargetContext(resume) },
    { label: "Metrics", pass: metricCount >= 2 },
  ];

  const completedChecks = checks.filter((c) => c.pass).length;
  const totalChecks = checks.length;
  const score = Math.round((completedChecks / totalChecks) * 100);
  const missing = checks.filter((c) => !c.pass).map((c) => c.label);
  const status = score >= 80 ? "strong" : score >= 55 ? "fair" : "weak";

  return { score, completedChecks, totalChecks, missing, status };
}

function HealthPill({ health }: { health: ResumeHealth }) {
  const tone =
    health.status === "strong"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : health.status === "fair"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-red-50 text-red-700 border-red-200";

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide", tone)}>
      <CheckCircle2 className="w-3 h-3" />
      {health.score}% Ready
    </span>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
        <Icon className="h-3.5 w-3.5 text-gray-400" />
      </div>
      <p className="text-2xl font-bold tracking-tight text-gray-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-gray-500">{helper}</p>
    </div>
  );
}

function TemplatePreviewChip({ templateId }: { templateId: string }) {
  const colors: Record<string, string> = {
    "modern-minimal": "bg-slate-900 border-slate-900", classic: "bg-gray-800 border-gray-800", executive: "bg-[#0f172a] border-[#0f172a]",
    technical: "bg-[#0f172a] border-[#0f172a]", compact: "bg-white border-gray-200 text-gray-700", bold: "bg-[#065f46] border-[#065f46]",
    sidebar: "bg-[#4c1d95] border-[#4c1d95]", timeline: "bg-white border-gray-200 text-gray-700", creative: "bg-slate-900 border-slate-900",
    academic: "bg-white border-gray-200 text-gray-700", "career-changer": "bg-[#7c3aed] border-[#7c3aed]", international: "bg-[#0f4c81] border-[#0f4c81]",
  };
  
  const isLight = templateId === "compact" || templateId === "timeline" || templateId === "academic";
  
  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase border", colors[templateId] || "bg-gray-100 border-gray-200")}>
      <span className={cn(isLight ? "text-gray-700" : "text-white")}>
        {templateId.replace(/-/g, " ")}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const {
    savedResumes,
    createResume,
    loadResume,
    deleteResume,
    duplicateResume,
    updateIndustryMode,
  } = useResumeStore();

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState<IndustryMode | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("updated-desc");
  const [showAllIndustries, setShowAllIndustries] = useState(false);

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

  const handleOpenCareerAgent = (id: string) => {
    loadResume(id);
    router.push("/career-agent");
  };

  const handleQuickStartIndustry = (mode: IndustryMode) => {
    createResume();
    updateIndustryMode(mode);
    router.push("/editor");
  };

  const resumeHealth = useMemo(
    () => Object.fromEntries(savedResumes.map((r) => [r.id, getResumeHealth(r)])),
    [savedResumes]
  );

  const savedResumeIndex = useMemo(
    () => Object.fromEntries(savedResumes.map((r, i) => [r.id, i])),
    [savedResumes]
  );

  const latestResume = useMemo(() => {
    if (savedResumes.length === 0) return null;
    return [...savedResumes].sort((a, b) => {
      const diff = getTimestamp(b.lastSaved) - getTimestamp(a.lastSaved);
      if (diff !== 0) return diff;
      return (savedResumeIndex[b.id] ?? 0) - (savedResumeIndex[a.id] ?? 0);
    })[0];
  }, [savedResumeIndex, savedResumes]);

  const workspaceStats = useMemo(() => {
    const total = savedResumes.length;
    const ready = savedResumes.filter((r) => (resumeHealth[r.id]?.score ?? 0) >= 80).length;
    const targeted = savedResumes.filter((r) => hasTargetContext(r)).length;
    const updatedWeek = savedResumes.filter((r) => {
      const ts = getTimestamp(r.lastSaved);
      return ts > 0 && Date.now() - ts <= 1000 * 60 * 60 * 24 * 7;
    }).length;
    return { total, ready, targeted, updatedWeek };
  }, [savedResumes, resumeHealth]);

  const visibleResumes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let next = savedResumes.filter((r) => {
      if (industryFilter !== "all" && r.industryMode !== industryFilter) return false;
      if (!normalized) return true;
      const hay = [
        r.title,
        r.contact.fullName,
        r.targetRole,
        r.targetCompany,
        INDUSTRY_LABELS[r.industryMode],
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(normalized);
    });

    next = [...next].sort((a, b) => {
      if (sortMode === "updated-desc") {
        const diff = getTimestamp(b.lastSaved) - getTimestamp(a.lastSaved);
        if (diff !== 0) return diff;
        return (savedResumeIndex[b.id] ?? 0) - (savedResumeIndex[a.id] ?? 0);
      }
      if (sortMode === "updated-asc") {
        const diff = getTimestamp(a.lastSaved) - getTimestamp(b.lastSaved);
        if (diff !== 0) return diff;
        return (savedResumeIndex[a.id] ?? 0) - (savedResumeIndex[b.id] ?? 0);
      }
      if (sortMode === "name-asc") return (a.contact.fullName || a.title).localeCompare(b.contact.fullName || b.title);
      return (b.contact.fullName || b.title).localeCompare(a.contact.fullName || a.title);
    });

    return next;
  }, [industryFilter, query, savedResumeIndex, savedResumes, sortMode]);

  const workspaceSignals = useMemo(() => {
    const missingTargets = savedResumes.filter((r) => !hasTargetContext(r)).length;
    const lowMetrics = savedResumes.filter((r) => {
      const bullets = r.experience.flatMap((e) => e.bullets).filter((b) => b.content.trim());
      if (bullets.length === 0) return false;
      return bullets.filter((b) => hasNumericImpact(b.content)).length < 2;
    }).length;
    const thinSkills = savedResumes.filter((r) => r.skills.length < 6).length;

    return [
      { label: "Need job target", value: missingTargets, tone: "text-amber-700 bg-amber-50 border-amber-200" },
      { label: "Need stronger metrics", value: lowMetrics, tone: "text-rose-700 bg-rose-50 border-rose-200" },
      { label: "Need broader skills", value: thinSkills, tone: "text-blue-700 bg-blue-50 border-blue-200" },
    ];
  }, [savedResumes]);

  const visibleShortcutModes = (Object.keys(INDUSTRY_LABELS) as IndustryMode[]);
  const shortcutModes = showAllIndustries ? visibleShortcutModes : visibleShortcutModes.slice(0, 6);
  const hasFilters = Boolean(query.trim()) || industryFilter !== "all" || sortMode !== "updated-desc";

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900 selection:bg-rose-200 selection:text-rose-900">
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-[-100px] w-[600px] h-[600px] rounded-full bg-rose-100/40 blur-[120px]" />
        <div className="absolute top-[40%] left-[-150px] w-[500px] h-[500px] rounded-full bg-blue-50/50 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/60 backdrop-blur-xl border-b border-gray-200/50 sticky top-0">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">Meridian</span>
            <span className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-rose-100 text-rose-700 ml-1">Dashboard</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <button
              onClick={() => latestResume && handleOpenCareerAgent(latestResume.id)}
              disabled={!latestResume}
              className="text-gray-500 hover:text-gray-900 disabled:opacity-40 transition-colors hidden sm:flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> Career Agent
            </button>
            <div className="w-px h-4 bg-gray-200 hidden sm:block" />
            <button
              onClick={() => router.push("/")}
              className="text-gray-500 hover:text-gray-900 transition-colors hidden sm:flex items-center gap-2"
            >
              <Settings className="w-4 h-4" /> Home
            </button>
            <button
              onClick={handleNew}
              className="flex items-center gap-2 text-sm bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-full transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" /> Create New
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
        {/* Left: Library + control center */}
        <div className="min-w-0 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">Workspace Controller</h1>
            <p className="text-gray-500 text-base max-w-xl">
              Command center for the editor. Manage resume versions, quality, targeting context, and launch points in one place.
            </p>
          </motion.div>

          {/* Workspace metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <MetricCard icon={FileText} label="Total Resumes" value={String(workspaceStats.total)} helper="All drafts in this workspace" />
            <MetricCard icon={CheckCircle2} label="Ready Resumes" value={String(workspaceStats.ready)} helper="Health score >= 80%" />
            <MetricCard icon={Target} label="Targeted Resumes" value={String(workspaceStats.targeted)} helper="Role/company/JD configured" />
            <MetricCard icon={Clock} label="Updated 7 Days" value={String(workspaceStats.updatedWeek)} helper="Recent activity window" />
          </div>

          {/* Filters and controls */}
          <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px_auto] gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, title, target role, or company"
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-9 py-2.5 outline-none focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                />
              </div>

              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value as IndustryMode | "all")}
                className="text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
              >
                <option value="all">All industries</option>
                {(Object.keys(INDUSTRY_LABELS) as IndustryMode[]).map((mode) => (
                  <option key={mode} value={mode}>{INDUSTRY_LABELS[mode]}</option>
                ))}
              </select>

              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
              >
                <option value="updated-desc">Recently edited</option>
                <option value="updated-asc">Oldest edited</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>

              <button
                onClick={() => {
                  setQuery("");
                  setIndustryFilter("all");
                  setSortMode("updated-desc");
                }}
                disabled={!hasFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Continue latest */}
          {latestResume && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Continue Editing</p>
                  <h2 className="text-lg font-bold text-gray-900">{latestResume.contact.fullName || latestResume.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated {formatLastSaved(latestResume.lastSaved)} • {INDUSTRY_LABELS[latestResume.industryMode || "general"]}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <HealthPill health={resumeHealth[latestResume.id]} />
                  <button
                    onClick={() => handleOpen(latestResume.id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-gray-800"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Open Editor
                  </button>
                  <button
                    onClick={() => handleOpenCareerAgent(latestResume.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Career Agent
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Resume Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
            {/* New resume card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNew}
              className="group relative bg-[#fafafa]/50 border-2 border-dashed border-gray-300 hover:border-gray-900 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 min-h-[260px] cursor-pointer overflow-hidden backdrop-blur-sm shadow-sm hover:shadow-xl"
            >
              {/* Subtle hover background sweep */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-white flex items-center justify-center transition-all duration-500 shadow-sm border border-gray-200 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] group-hover:bg-gray-900 group-hover:border-gray-900">
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-500" />
              </div>
              <div className="relative z-10 text-center">
                <p className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Create New Resume</p>
                <p className="text-xs text-gray-400 mt-1">Launch into editor with default template</p>
              </div>
            </motion.button>

            {/* Saved Resumes */}
            <AnimatePresence>
              {savedResumes.length === 0 && (
                <motion.div
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="col-span-1 md:col-span-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-200/50 rounded-3xl bg-white/40 p-10 min-h-[260px]"
                 >
                    <Search className="w-10 h-10 text-gray-300 mb-4" />
                    <p className="text-sm font-semibold text-gray-500">No resumes found</p>
                    <p className="text-xs text-gray-400">Click create to start your first resume.</p>
                 </motion.div>
              )}
              {savedResumes.length > 0 && visibleResumes.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="col-span-1 md:col-span-2 flex flex-col items-center justify-center border border-gray-200 rounded-3xl bg-white p-10 min-h-[260px]"
                >
                  <Search className="w-10 h-10 text-gray-300 mb-4" />
                  <p className="text-sm font-semibold text-gray-600">No resumes match these filters</p>
                  <button
                    onClick={() => {
                      setQuery("");
                      setIndustryFilter("all");
                      setSortMode("updated-desc");
                    }}
                    className="mt-3 text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Clear filters
                  </button>
                </motion.div>
              )}

              {visibleResumes.map((r, i) => {
                const IndustryIcon = INDUSTRY_ICONS[r.industryMode || "general"];
                const industryGrad = INDUSTRY_GRADIENTS[r.industryMode || "general"];
                const isDeleting = deleteConfirmId === r.id;
                const health = resumeHealth[r.id];

                return (
                  <motion.div
                    key={r.id}
                    layout // Ensure smooth reflow when deleted
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "group relative bg-white border rounded-3xl p-6 flex flex-col justify-between min-h-[280px] transition-all duration-300",
                      isDeleting ? "border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-xl hover:-translate-y-1"
                    )}
                  >
                    {/* Top Section */}
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-inner", industryGrad)}>
                         <IndustryIcon className="w-6 h-6 text-white drop-shadow-sm" />
                      </div>
                      
                      <HealthPill health={health} />
                    </div>

                    {/* Middle Info */}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight leading-snug mb-1 line-clamp-1">
                        {r.contact.fullName || "Untitled Document"}
                      </h2>
                      <p className="text-sm font-medium text-gray-500 mb-4 line-clamp-1">
                        {r.title || "Career Profile"}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <TemplatePreviewChip templateId={r.templateId} />
                        <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 border border-gray-100 px-2 py-0.5 text-[9px] font-bold tracking-wider text-gray-600 uppercase">
                          <Brain className="w-3 h-3" /> {INDUSTRY_LABELS[r.industryMode || "general"]}
                        </span>
                        {hasTargetContext(r) && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 text-[9px] font-bold tracking-wider text-blue-700 uppercase">
                            <Target className="w-3 h-3" /> Targeted
                          </span>
                        )}
                      </div>

                      {health.missing.length > 0 && (
                        <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-1">Needs Attention</p>
                          <p className="text-[11px] text-amber-800">
                            {health.missing.slice(0, 2).join(" • ")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer Info & CTA */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-1.5 text-xs text-gray-400">
                           <Clock className="w-3.5 h-3.5" />
                           Edited {formatLastSaved(r.lastSaved)}
                         </div>
                         {r.targetRole && (
                           <div className="text-[10px] font-semibold tracking-wide text-gray-600 truncate max-w-[100px] text-right">
                             {r.targetRole}
                           </div>
                         )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleOpen(r.id)}
                          className="group/btn flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-900 text-gray-700 hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border border-gray-200 hover:border-gray-900 shadow-sm"
                        >
                          <FileText className="w-4 h-4 text-gray-400 group-hover/btn:text-white transition-colors" />
                          Editor
                        </button>
                        <button
                          onClick={() => handleOpenCareerAgent(r.id)}
                          className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-xl text-xs font-bold transition-all border border-blue-200"
                        >
                          <Mail className="w-4 h-4" />
                          Agent
                        </button>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {isDeleting ? (
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="col-span-2 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold animate-pulse"
                          >
                            <AlertCircle className="w-4 h-4" /> Confirm delete
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleDuplicate(r.id)}
                              className="flex items-center justify-center gap-2 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              Duplicate
                            </button>
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="flex items-center justify-center gap-2 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: control panels */}
        <div className="flex flex-col gap-6">
          {/* Quick starts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl border border-gray-200/60 shadow-sm p-6 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-[100px] -z-0 opacity-50" />
            <div className="relative z-10 mb-5">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-gray-900">Quick Start</h3>
              </div>
              <p className="text-xs text-gray-500 font-medium">Create by industry context and jump straight into the editor.</p>
            </div>

            <button
              onClick={handleNew}
              className="w-full mb-3 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-gray-800"
            >
              <Plus className="w-3.5 h-3.5" />
              Start Blank Resume
            </button>

            <div className="relative z-10 flex flex-wrap gap-2">
              {shortcutModes.map((mode) => {
                const Icon = INDUSTRY_ICONS[mode];
                return (
                  <button
                    key={mode}
                    onClick={() => handleQuickStartIndustry(mode)}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:border-gray-900 hover:text-gray-900 px-3 py-2 rounded-[10px] transition-all duration-200 hover:shadow-md"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {INDUSTRY_LABELS[mode]}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowAllIndustries((v) => !v)}
              className="mt-3 text-xs font-semibold text-gray-500 hover:text-gray-900"
            >
              {showAllIndustries ? "Show fewer" : "Show all industries"}
            </button>
          </motion.div>

          {/* Central workflow panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl border border-gray-200/60 shadow-sm p-6"
          >
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1">
                <LayoutTemplate className="w-4 h-4 text-gray-700" />
                Control Flow
              </h3>
              <p className="text-xs text-gray-500 font-medium">Fast launch points into your editing workflows.</p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => latestResume && handleOpen(latestResume.id)}
                disabled={!latestResume}
                className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40"
              >
                Continue latest in editor
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => latestResume && handleOpenCareerAgent(latestResume.id)}
                disabled={!latestResume}
                className="w-full flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-40"
              >
                Open Career Agent
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleNew}
                className="w-full flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              >
                Start fresh resume
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Pipeline</p>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Targeted resumes</span>
                <span className="font-bold text-gray-900">{workspaceStats.targeted}/{workspaceStats.total}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500"
                  style={{ width: `${workspaceStats.total === 0 ? 0 : (workspaceStats.targeted / workspaceStats.total) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Capabilities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl border border-gray-200/60 shadow-sm p-6 relative overflow-hidden group/capabilities cursor-default"
          >
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500 transform origin-left scale-x-0 group-hover/capabilities:scale-x-100 transition-transform duration-500" />

            <div className="mb-6">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-gray-900" /> System Capabilities
              </h3>
              <p className="text-xs text-gray-500 font-medium">Inside the Meridian intelligence engine.</p>
            </div>

            <div className="flex flex-col gap-4">
              {FEATURE_TILES.map((f) => (
                <div key={f.label} className="flex items-start gap-3 group transition-transform duration-300">
                  <div className={cn("w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3", f.color)}>
                    <f.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none mb-1">{f.label}</p>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed pr-2">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Signals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl border border-gray-200/60 shadow-sm p-6"
          >
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1">
              <MousePointerClick className="w-4 h-4 text-gray-700" />
              Workspace Signals
            </h3>
            <p className="text-xs text-gray-500 font-medium mb-4">Operational feedback before entering the editor.</p>
            <div className="space-y-2">
              {workspaceSignals.map((signal) => (
                <div key={signal.label} className={cn("rounded-xl border px-3 py-2.5 flex items-center justify-between", signal.tone)}>
                  <span className="text-xs font-semibold">{signal.label}</span>
                  <span className="text-xs font-bold">{signal.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
