"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore } from "@/store/useResumeStore";
import { Target, X, Save, Briefcase, Building2, FileText } from "lucide-react";
import { useState } from "react";

export default function JobTargetModal() {
  const { resume, updateJobTarget, showJobTargetModal, setShowJobTargetModal } = useResumeStore();
  const [role, setRole] = useState(resume.targetRole ?? "");
  const [company, setCompany] = useState(resume.targetCompany ?? "");
  const [jd, setJd] = useState(resume.jobDescription ?? "");

  const handleSave = () => {
    updateJobTarget({ targetRole: role, targetCompany: company, jobDescription: jd });
    setShowJobTargetModal(false);
  };

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
              className="glass-elevated rounded-2xl p-6 w-full max-w-lg shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-200 flex items-center justify-center">
                    <Target className="w-4 h-4 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Job Target</h3>
                    <p className="text-xs text-gray-500">AI uses this to tailor every suggestion</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowJobTargetModal(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors"
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
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-rose-500/40 transition-colors"
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
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-rose-500/40 transition-colors"
                  />
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
                    rows={7}
                    placeholder="Paste the full job description here — AI will use it for keyword matching, skill suggestions, and summary tailoring…"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-rose-500/40 transition-colors resize-none leading-relaxed"
                  />
                  <p className="text-xs text-gray-400">{jd.length} characters</p>
                </div>

                {/* Save */}
                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-gray-900 font-semibold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                >
                  <Save className="w-4 h-4" />
                  Save & Activate AI Context
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
