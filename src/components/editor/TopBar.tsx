"use client";
import { motion } from "framer-motion";
import { Sparkles, Download, Loader2, Target, Layers, Check } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { useState, useEffect, useRef, useCallback } from "react";
import JobTargetModal from "@/components/ui/JobTargetModal";
import TemplatePicker from "@/components/ui/TemplatePicker";
import { toast } from "@/components/ui/Toast";

export default function TopBar() {
  const { resume, isDirty, markSaved, setShowJobTargetModal } = useResumeStore();
  const [justSaved, setJustSaved] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Auto-save simulation
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      markSaved();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isDirty, resume, markSaved]);

  const handleExportPDF = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    toast.info("Preparing your PDF…", "This takes a few seconds.");

    try {
      // Dynamically import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      // Get the full-resolution (unscaled) resume element
      const el = document.getElementById("resume-print-target");
      if (!el) {
        toast.error("Export failed", "Resume preview not found. Please try again.");
        return;
      }

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 794,
        height: 1123,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);

      const name = resume.contact.fullName?.replace(/\s+/g, "_") || "Resume";
      pdf.save(`${name}_Resume.pdf`);
      toast.success("PDF downloaded!", `Saved as ${name}_Resume.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("Export failed", "Could not generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, resume.contact.fullName]);

  const hasJobTarget = !!(resume.targetRole || resume.targetCompany || resume.jobDescription);
  const templateLabel = resume.templateId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <JobTargetModal />
      <TemplatePicker open={showTemplatePicker} onClose={() => setShowTemplatePicker(false)} />

      <header className="h-14 flex items-center justify-between px-4 bg-white border-b border-gray-200 relative z-50 flex-shrink-0 shadow-sm">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900 hidden sm:block">Meridian</span>
          <span className="mx-1.5 text-gray-300 hidden sm:block">|</span>
          <span className="text-xs text-gray-500 max-w-[140px] truncate hidden sm:block">{resume.title}</span>
        </div>

        {/* Center controls */}
        <div className="flex items-center gap-2.5">

          {/* Autosave */}
          <motion.div
            key={isDirty ? "dirty" : justSaved ? "saved" : "idle"}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-xs text-gray-500"
          >
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
              isDirty ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
            }`} />
            {isDirty ? "Saving…" : justSaved ? "Saved ✓" : "All saved"}
          </motion.div>

          {/* Template switcher */}
          <button
            id="template-picker-btn"
            onClick={() => setShowTemplatePicker(true)}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all border border-gray-200 hover:border-gray-300"
          >
            <Layers className="w-3.5 h-3.5" />
            {templateLabel}
          </button>

          {/* Job target button */}
          <button
            id="job-target-btn"
            onClick={() => setShowJobTargetModal(true)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all border ${
              hasJobTarget
                ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                : "bg-gray-50 text-gray-500 hover:text-gray-800 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {hasJobTarget ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" /> Job Target
                </span>
              ) : "Set Target"}
            </span>
          </button>
        </div>

        {/* Export button */}
        <button
          id="export-pdf-btn"
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex items-center gap-1.5 text-xs bg-rose-600 hover:bg-rose-700 disabled:opacity-70 text-white px-3.5 py-1.5 rounded-lg transition-all font-semibold shadow-sm hover:shadow-brand disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{isExporting ? "Exporting…" : "Download PDF"}</span>
        </button>
      </header>
    </>
  );
}
