"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore } from "@/store/useResumeStore";
import { Target, X, Save, Briefcase, Building2, FileText, Sparkles, Loader2, Shield, Lightbulb, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";
import { useCompanyIntel } from "@/hooks/useCompanyIntel";
import { cn } from "@/lib/utils";

const ATS_SYSTEMS: Record<string, string> = {
  Workday: "bg-blue-100 text-blue-700",
  Greenhouse: "bg-green-100 text-green-700",
  Lever: "bg-purple-100 text-purple-700",
  iCIMS: "bg-orange-100 text-orange-700",
  Taleo: "bg-red-100 text-red-700",
  SmartRecruiters: "bg-teal-100 text-teal-700",
  Unknown: "bg-gray-100 text-gray-500",
};

export default function JobTargetModal() {
  const { resume, updateJobTarget, showJobTargetModal, setShowJobTargetModal } = useResumeStore();
  const [role, setRole] = useState(resume.targetRole ?? "");
  const [company, setCompany] = useState(resume.targetCompany ?? "");
  const [jd, setJd] = useState(resume.jobDescription ?? "");
  const { intel, isLoading, fetchIntel, clearIntel } = useCompanyIntel();

  const handleSave = () => {
    updateJobTarget({ targetRole: role, targetCompany: company, jobDescription: jd });
    // Fetch company intel on save if company is set
    if (company.trim()) fetchIntel(company, role);
    else clearIntel();
    setShowJobTargetModal(false);
  };

  const atsColor = intel?.atsSystem ? (ATS_SYSTEMS[intel.atsSystem] ?? ATS_SYSTEMS.Unknown) : "";

  return (
    <AnimatePresence>
      {showJobTargetModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setShowJobTargetModal(false)}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="glass-elevated rounded-2xl p-6 w-full max-w-lg shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                    <Target className="w-4 h-4 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Job Target</h3>
                    <p className="text-xs text-gray-500">AI uses this to tailor every suggestion</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowJobTargetModal(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3" /> Target Role
                  </label>
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Product Manager"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10 transition-all"
                  />
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" /> Target Company
                  </label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Stripe, Figma, OpenAI…"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10 transition-all"
                  />
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-rose-400" />
                    AI will profile this company and adapt all suggestions to match their culture
                  </p>
                </div>

                {/* Job Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText className="w-3 h-3" /> Job Description
                    <span className="text-gray-400 normal-case font-normal">(paste the full JD)</span>
                  </label>
                  <textarea
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    rows={6}
                    placeholder="Paste the full job description here — AI will use it for keyword matching, skill suggestions, and summary tailoring…"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10 transition-all resize-none leading-relaxed"
                  />
                  <p className="text-xs text-gray-400">{jd.length} characters</p>
                </div>

                {/* Save */}
                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  <Save className="w-4 h-4" />
                  Save & Activate AI Context
                </button>
              </div>

              {/* Company Intelligence Panel — shows after save */}
              <AnimatePresence>
                {(isLoading || intel) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                        </div>
                        <span className="text-xs font-bold text-gray-800">
                          {isLoading ? "Profiling company…" : `${company} Intelligence`}
                        </span>
                        {isLoading && <Loader2 className="w-3 h-3 animate-spin text-rose-400 ml-auto" />}
                      </div>

                      {isLoading && (
                        <div className="space-y-2.5">
                          {[80, 60, 90, 70].map((w, i) => (
                            <div key={i} className="h-3 bg-gray-100 rounded-full animate-pulse" style={{ width: `${w}%` }} />
                          ))}
                        </div>
                      )}

                      {intel && !isLoading && (
                        <div className="space-y-3">
                          {/* ATS System */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <Shield className="w-3.5 h-3.5 text-gray-400" />
                              Likely ATS system
                            </div>
                            <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full", atsColor)}>
                              {intel.atsSystem}
                            </span>
                          </div>

                          {/* Culture keywords */}
                          <div>
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Culture Keywords to Mirror</p>
                            <div className="flex flex-wrap gap-1.5">
                              {intel.cultureKeywords.map((kw) => (
                                <span key={kw} className="text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-full">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Resume tone */}
                          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-bold text-blue-700 mb-0.5">Resume Tone</p>
                              <p className="text-xs text-blue-600">{intel.resumeTone}</p>
                            </div>
                          </div>

                          {/* Red flags */}
                          <div>
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-500" /> Avoid on your resume
                            </p>
                            <ul className="space-y-1">
                              {intel.redFlags.map((flag) => (
                                <li key={flag} className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 flex items-start gap-2">
                                  <span className="text-amber-400 font-bold shrink-0">✕</span> {flag}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Hiring insight */}
                          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
                            <Lightbulb className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-emerald-700">{intel.hiringInsights}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
