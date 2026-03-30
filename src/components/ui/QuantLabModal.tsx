"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useQuantLab } from "@/hooks/useQuantLab";
import { FlaskConical, ChevronRight, Check, X, Loader2, Sparkles, Zap, FastForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantLabModalProps {
  open: boolean;
  onClose: () => void;
  quantLab: ReturnType<typeof useQuantLab>;
}

export function QuantLabModal({ open, onClose, quantLab }: QuantLabModalProps) {
  const {
    isActive, isStarting, labBullets, currentBullet, currentIndex,
    progress, completedCount,
    setAnswer, rewriteCurrent, applyRewrite, skipCurrent, closeLab,
  } = quantLab;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        className="fixed inset-x-4 top-[10vh] mx-auto max-w-xl bg-white rounded-3xl shadow-2xl z-[60] flex flex-col overflow-hidden border border-gray-100"
        style={{ maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-inner">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 leading-tight">Quantification Lab</h2>
              <p className="text-[11px] text-gray-500 font-medium">Extract true metrics · Block AI hallucinations</p>
            </div>
          </div>
          <button onClick={() => { closeLab(); onClose(); }} className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Progress bar */}
        {isActive && labBullets.length > 0 && (
          <div className="h-1 w-full bg-gray-100">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {isStarting ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-2">
                <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Scanning your resume…</h3>
              <p className="text-sm text-gray-500 max-w-sm leading-relaxed">Finding bullets that lack metrics or strong verbs to quantify.</p>
            </div>
          ) : !isActive ? (
            <div className="flex flex-col items-center justify-center py-12 gap-5 text-center px-4">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mb-2">
                <Check className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">All Done!</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                  {completedCount > 0
                    ? `You successfully quantified ${completedCount} bullets.`
                    : "No weak bullets detected! Your experience section is already highly quantified."}
                </p>
              </div>
              <button
                onClick={() => { closeLab(); onClose(); }}
                className="mt-4 px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
              >
                Back to Editor
              </button>
            </div>
          ) : currentBullet ? (
            <div className="space-y-6">
              {/* Context */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>Bullet {currentIndex + 1} of {labBullets.length}</span>
                  <span className="text-violet-500">{currentBullet.role}</span>
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <p className="text-[11px] font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertCircleIcon /> Needs improvement</p>
                  <p className="text-[13px] text-gray-800 leading-relaxed font-medium">"{currentBullet.original}"</p>
                </div>
              </div>

              {/* Questions */}
              {currentBullet.state === "questioning" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {currentBullet.questions.length === 0 ? (
                    <div className="flex items-center justify-center py-8 gap-3 text-violet-600">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-semibold">Formulating questions…</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-violet-500" />
                        <h3 className="text-sm font-bold text-gray-900">Answer these to quantify your impact:</h3>
                      </div>
                      <div className="space-y-4 pl-1">
                        {currentBullet.questions.map((q, i) => (
                          <div key={i} className="group">
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">{q}</label>
                            <input
                              type="text"
                              value={currentBullet.answers[String(i)] || ""}
                              onChange={(e) => setAnswer(i, e.target.value)}
                              placeholder="e.g. 5 team members, 20%, $5M..."
                              className="w-full text-sm text-gray-900 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10 transition-all bg-white shadow-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* Rewriting State */}
              {currentBullet.state === "rewriting" && (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <WandIcon className="w-8 h-8 text-violet-500 animate-pulse" />
                  <p className="text-sm font-bold text-gray-900">Rewriting organically…</p>
                  <p className="text-xs text-gray-500">Blending your answers into the bullet.</p>
                </div>
              )}

              {/* Done / Review State */}
              {currentBullet.state === "done" && currentBullet.rewritten && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                  <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 shadow-sm">
                    <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> High Impact Rewrite</p>
                    <p className="text-sm text-gray-900 font-semibold leading-relaxed">
                      "{currentBullet.rewritten}"
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {isActive && currentBullet && (
          <div className="border-t border-gray-100 p-4 bg-gray-50/50 flex justify-between items-center rounded-b-3xl">
            <button
              onClick={skipCurrent}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1.5 transition-colors"
            >
              Skip <FastForward className="w-3.5 h-3.5" />
            </button>
            
            {currentBullet.state === "questioning" && currentBullet.questions.length > 0 && (
              <button
                onClick={rewriteCurrent}
                disabled={Object.values(currentBullet.answers).every((a) => !a.trim())}
                className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
              >
                Assemble Metric <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentBullet.state === "done" && (
              <button
                onClick={applyRewrite}
                className="px-5 py-2.5 bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-600 transition-colors shadow-sm"
              >
                <Check className="w-4 h-4" /> Looks good, next
              </button>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function AlertCircleIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
function WandIcon({ className }: { className: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Zm-14 14 1.28-1.28"/><path d="m5.2 11.2 1.28-1.28"/><path d="m3.64 21.64 1.28-1.28"/><path d="m11.24 5.24 1.28-1.28"/><path d="M15.44 2.12 16.72 3.4"/><path d="m20.24 9.24 1.28-1.28"/></svg>; }
