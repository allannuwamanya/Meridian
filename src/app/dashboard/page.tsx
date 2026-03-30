"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/useResumeStore";
import { INDUSTRY_LABELS } from "@/lib/industryPrompts";
import {
  Plus, FileText, Sparkles, Brain, Target, Zap, Copy, Trash2,
  Clock, Shield, ChevronRight, Wand2, FlaskConical, AlertCircle,
  Mail, Star, TrendingUp, Users, ArrowRight, BookOpen, Globe,
  Briefcase, Search, Settings, MoreHorizontal, MousePointerClick
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
  { icon: Zap, label: "Auto-Tailor Engine", desc: "Instantly rewrite bullets to mirror any JD.", color: "text-rose-500 bg-rose-50" },
  { icon: FlaskConical, label: "Quantification Lab", desc: "AI extracts real metrics. No hallucinations.", color: "text-violet-500 bg-violet-50" },
  { icon: Mail, label: "Career Agent", desc: "Follow-ups, prep, & salary intelligence.", color: "text-blue-500 bg-blue-50" },
  { icon: Brain, label: "Industry Modes", desc: "10 active models: tech, federal, medical...", color: "text-amber-500 bg-amber-50" },
  { icon: Shield, label: "Shadow ATS", desc: "Real-time 10-point ATS health baseline.", color: "text-emerald-500 bg-emerald-50" },
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
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
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
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900 selection:bg-rose-200 selection:text-rose-900">
      
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-[-100px] w-[600px] h-[600px] rounded-full bg-rose-100/40 blur-[120px]" />
        <div className="absolute top-[40%] left-[-150px] w-[500px] h-[500px] rounded-full bg-blue-50/50 blur-[100px]" />
      </div>

      {/* Header Navigation */}
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
            <button className="text-gray-500 hover:text-gray-900 transition-colors hidden sm:flex items-center gap-2">
              <Settings className="w-4 h-4" /> Preferences
            </button>
            <div className="w-px h-4 bg-gray-200 hidden sm:block" />
            <a href="/" className="text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">Home</a>
            <button
              onClick={handleNew}
              className="flex items-center gap-2 text-sm bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-full transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" /> Create New
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Left Column: Resumes */}
        <div className="flex-1 w-full min-w-0">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">Your Resumes</h1>
            <p className="text-gray-500 text-base max-w-xl">
              Architect, tailor, and deploy your career story. Select a document to enter the AI intelligence lab.
            </p>
          </motion.div>

          {/* Resume Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            
            {/* New Resume Creation Card */}
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
                <p className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Start Blank Document</p>
                <p className="text-xs text-gray-400 mt-1">Initialize AI canvas</p>
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
                    <p className="text-xs text-gray-400">Click the plus button to create your first masterpiece.</p>
                 </motion.div>
              )}
              {savedResumes.map((r, i) => {
                const IndustryIcon = INDUSTRY_ICONS[r.industryMode || "general"];
                const industryGrad = INDUSTRY_COLORS[r.industryMode || "general"];
                const isDeleting = deleteConfirmId === r.id;

                return (
                  <motion.div
                    key={r.id}
                    layout // Ensure smooth reflow when deleted
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "group relative bg-white border rounded-3xl p-6 flex flex-col justify-between min-h-[260px] transition-all duration-300",
                      isDeleting ? "border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-xl hover:-translate-y-1"
                    )}
                  >
                    {/* Top Section */}
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-inner", industryGrad)}>
                         <IndustryIcon className="w-6 h-6 text-white drop-shadow-sm" />
                      </div>
                      
                      {/* Action Menu Handle */}
                      <div className="relative">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 p-1 bg-white border border-gray-100 rounded-xl shadow-lg -mr-2 -mt-2">
                          <button
                            onClick={() => handleDuplicate(r.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors group/tooltip relative"
                          >
                            <Copy className="w-4 h-4" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-[10px] text-white opacity-0 group-hover/tooltip:opacity-100 pointer-events-none whitespace-nowrap">Duplicate</span>
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className={cn("p-1.5 rounded-lg transition-colors group/tooltip relative",
                              isDeleting ? "bg-red-50 text-red-600" : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                            )}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-[10px] text-white opacity-0 group-hover/tooltip:opacity-100 pointer-events-none whitespace-nowrap">
                               {isDeleting ? "Confirm?" : "Delete"}
                            </span>
                          </button>
                        </div>
                      </div>
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
                      </div>
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

                      {isDeleting ? (
                         <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold animate-pulse">
                           <AlertCircle className="w-4 h-4" /> Click delete again to confirm
                         </div>
                      ) : (
                        <button
                          onClick={() => handleOpen(r.id)}
                          className="w-full group/btn flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-900 text-gray-700 hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border border-gray-200 hover:border-gray-900 shadow-sm"
                        >
                          <FileText className="w-4 h-4 text-gray-400 group-hover/btn:text-white transition-colors" />
                          Resume Session
                          <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Widgets / Quick Actions */}
        <div className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0 flex flex-col gap-8">
           
           {/* Widget: Quick Select Industry */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} 
             className="bg-white rounded-3xl border border-gray-200/60 shadow-sm p-6 overflow-hidden relative"
           >
             <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-[100px] -z-0 opacity-50" />
             <div className="relative z-10 mb-5">
               <div className="flex items-center gap-2 mb-1">
                 <Briefcase className="w-5 h-5 text-rose-500" />
                 <h3 className="text-base font-bold text-gray-900">Industry Shortcuts</h3>
               </div>
               <p className="text-xs text-gray-500 font-medium">Bypass configuration. Generate a targeted resume instantly.</p>
             </div>

             <div className="relative z-10 flex flex-wrap gap-2">
               {(Object.keys(INDUSTRY_LABELS) as IndustryMode[]).slice(0, 6).map((mode) => {
                 const Icon = INDUSTRY_ICONS[mode];
                 return (
                   <button
                     key={mode}
                     onClick={() => {
                       createResume();
                       // Industry mode injected in editor state implicitly via role mapping later, or we can just pass params (out of scope for now)
                       router.push("/editor");
                     }}
                     className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:border-gray-900 hover:text-gray-900 px-3 py-2 rounded-[10px] transition-all duration-200 hover:shadow-md"
                   >
                     <Icon className="w-3.5 h-3.5" />
                     {INDUSTRY_LABELS[mode]}
                   </button>
                 );
               })}
               <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-2 rounded-[10px] hover:text-gray-900 transition-colors">
                 <MoreHorizontal className="w-4 h-4" /> More
               </button>
             </div>
           </motion.div>

           {/* Widget: Capabilities List */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} 
             className="bg-white rounded-3xl border border-gray-200/60 shadow-sm p-6 relative overflow-hidden group/capabilities cursor-default"
           >
             {/* Subsurface glow effect */}
             <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500 transform origin-left scale-x-0 group-hover/capabilities:scale-x-100 transition-transform duration-500" />
             
             <div className="mb-6">
               <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1">
                 <Sparkles className="w-4 h-4 text-gray-900" /> System Capabilities
               </h3>
               <p className="text-xs text-gray-500 font-medium">Inside the Meridian intelligence engine.</p>
             </div>

             <div className="flex flex-col gap-4">
               {FEATURE_TILES.map((f, i) => (
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

           {/* Promotional Link or Feedback */}
           <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="mt-auto px-6 py-4 flex flex-col gap-2 items-center text-center opacity-60 hover:opacity-100 transition-opacity"
           >
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm">
                <MousePointerClick className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <p className="text-xs font-semibold text-gray-500">Need help crafting your story?</p>
              <a href="#" className="text-xs font-bold text-rose-500 hover:text-rose-600 underline decoration-rose-200 underline-offset-2">Read our expert manifesto</a>
           </motion.div>

        </div>
      </main>

    </div>
  );
}
