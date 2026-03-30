"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { autoTailorBullets } from "@/lib/autoTailor";
import { TailoredBullet } from "@/types/resume";
import { Zap, X, Loader2, Check, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

interface AutoTailorModalProps {
  open: boolean;
  onClose: () => void;
}

export function AutoTailorModal({ open, onClose }: AutoTailorModalProps) {
  const { resume, applyTailoredBullets } = useResumeStore();
  const [step, setStep] = useState<"setup" | "loading" | "review">("setup");
  const [tailored, setTailored] = useState<TailoredBullet[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const jd = resume.jobDescription || "";
  const hasJD = jd.trim().length > 30;

  const handleTailor = async () => {
    if (!hasJD || resume.experience.flatMap((e) => e.bullets.filter((b) => b.content)).length === 0) return;
    setStep("loading");
    setError(null);
    try {
      const results = await autoTailorBullets(resume.experience, jd, resume.targetRole || "");
      setTailored(results);
      setSelected(new Set(results.map((r) => r.bulletId)));
      setStep("review");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Try again.");
      setStep("setup");
    }
  };

  const handleApply = () => {
    const toApply = tailored.filter((r) => selected.has(r.bulletId));
    applyTailoredBullets(toApply);
    toast.success("Bullets updated!", `${toApply.length} bullets tailored to the JD.`);
    onClose();
    setStep("setup");
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-x-4 top-[8vh] mx-auto max-w-2xl bg-white rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden"
            style={{ maxHeight: "84vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Auto-Tailor Engine</h2>
                  <p className="text-[10px] text-gray-500">Rewrites bullets to mirror your target JD</p>
                </div>
              </div>
              <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {step === "setup" && (
                <div className="space-y-4">
                  {!hasJD ? (
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800">No job description found</p>
                        <p className="text-xs text-amber-700 mt-1">Paste a job description first via <strong>Set Target</strong> in the top bar, then come back here.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Job Description Preview</p>
                        <p className="text-xs text-gray-700 line-clamp-6 leading-relaxed">{jd.slice(0, 600)}…</p>
                      </div>
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-rose-700 uppercase tracking-widest mb-1">What happens</p>
                        <ul className="text-xs text-rose-800 space-y-1 list-none">
                          <li>→ AI reads all {resume.experience.flatMap((e) => e.bullets.filter((b) => b.content)).length} bullets + JD in one pass</li>
                          <li>→ Rewrites each bullet to mirror JD language without changing facts</li>
                          <li>→ You see before/after for every bullet — approve or reject each</li>
                        </ul>
                      </div>
                    </>
                  )}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{error}</div>
                  )}
                </div>
              )}

              {step === "loading" && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                    <Loader2 className="w-7 h-7 text-white animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900">Analysing JD & rewriting…</p>
                    <p className="text-xs text-gray-500">This takes about 15–30 seconds</p>
                  </div>
                </div>
              )}

              {step === "review" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">{selected.size} of {tailored.length} selected</p>
                    <div className="flex gap-2">
                      <button onClick={() => setSelected(new Set(tailored.map((r) => r.bulletId)))} className="text-[10px] text-rose-600 font-semibold hover:text-rose-700">Select all</button>
                      <button onClick={() => setSelected(new Set())} className="text-[10px] text-gray-400 font-semibold hover:text-gray-600">Clear</button>
                    </div>
                  </div>
                  {tailored.map((bullet) => {
                    const exp = resume.experience.find((e) => e.id === bullet.expId);
                    const isSelected = selected.has(bullet.bulletId);
                    return (
                      <div key={bullet.bulletId}
                        onClick={() => toggleSelect(bullet.bulletId)}
                        className={cn(
                          "rounded-xl border p-4 cursor-pointer transition-all",
                          isSelected ? "border-rose-300 bg-rose-50/50" : "border-gray-200 bg-white hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={cn(
                            "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                            isSelected ? "bg-rose-500 border-rose-500" : "border-gray-300"
                          )}>
                            {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            {exp && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{exp.role} @ {exp.company}</p>}
                            <div className="grid grid-cols-1 gap-2">
                              <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Before</p>
                                <p className="text-xs text-gray-600 line-through leading-relaxed">{bullet.original}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-bold text-rose-500 uppercase mb-1">After</p>
                                <p className="text-xs text-gray-900 font-medium leading-relaxed">{bullet.rewritten}</p>
                              </div>
                              <p className="text-[10px] text-gray-400 italic">{bullet.reason}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-3.5 flex justify-between items-center bg-gray-50">
              {step === "review" && (
                <button onClick={() => setStep("setup")} className="text-xs text-gray-500 hover:text-gray-700 transition-colors">← Back</button>
              )}
              {step !== "review" && <div />}
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5">Cancel</button>
                {step === "setup" && (
                  <button
                    onClick={handleTailor}
                    disabled={!hasJD}
                    className="flex items-center gap-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5" /> Analyse & Tailor <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {step === "review" && (
                  <button
                    onClick={handleApply}
                    disabled={selected.size === 0}
                    className="flex items-center gap-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" /> Apply {selected.size} Changes
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
