"use client";
import { useResumeStore } from "@/store/useResumeStore";
import ModernMinimalTemplate from "@/components/templates/ModernMinimal";
import ClassicTemplate from "@/components/templates/Classic";
import ExecutiveTemplate from "@/components/templates/Executive";
import TechnicalTemplate from "@/components/templates/Technical";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";

const TEMPLATES: Record<string, React.ComponentType<{ resume: any }>> = {
  "modern-minimal": ModernMinimalTemplate,
  classic: ClassicTemplate,
  executive: ExecutiveTemplate,
  technical: TechnicalTemplate,
  creative: ModernMinimalTemplate, // placeholder until creative template is built
};

const ZOOM_STEPS = [0.45, 0.55, 0.65, 0.75, 0.85];

export default function RightPreview() {
  const { resume } = useResumeStore();
  const Template = TEMPLATES[resume.templateId] ?? ModernMinimalTemplate;
  const [zoomIdx, setZoomIdx] = useState(1); // default 0.55
  const scale = ZOOM_STEPS[zoomIdx];

  const zoomIn = useCallback(() => setZoomIdx((i) => Math.min(i + 1, ZOOM_STEPS.length - 1)), []);
  const zoomOut = useCallback(() => setZoomIdx((i) => Math.max(i - 1, 0)), []);
  const resetZoom = useCallback(() => setZoomIdx(1), []);

  // The A4 page is 210mm wide. At 96dpi, 1mm ≈ 3.78px → 210mm ≈ 794px
  const pageWidthPx = 794;
  const scaledWidth = pageWidthPx * scale;
  const scaledHeight = 1123 * scale; // A4 height 297mm ≈ 1123px
  const negativeMargin = scaledHeight - 1123;

  return (
    <div className="flex flex-col h-full">
      {/* Preview header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Live Preview</span>
        </div>
        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={zoomIdx === 0}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-all"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetZoom}
            className="text-[10px] text-slate-500 hover:text-slate-300 px-2 py-1 rounded-lg hover:bg-white/5 transition-all min-w-[40px] text-center"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={zoomIn}
            disabled={zoomIdx === ZOOM_STEPS.length - 1}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-all"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable preview area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 flex justify-center items-start bg-[#0d0d14]">
        <div
          className="relative"
          style={{
            width: scaledWidth,
            height: scaledHeight,
            flexShrink: 0,
          }}
        >
          <motion.div
            key={`${resume.templateId}-${scale}`}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-0 origin-top-left shadow-2xl"
            style={{
              width: pageWidthPx,
              transform: `scale(${scale})`,
              background: "white",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <Template resume={resume} />
          </motion.div>
        </div>
      </div>

      {/* Template name indicator */}
      <div className="px-4 py-2 border-t border-white/5 flex-shrink-0">
        <span className="text-[10px] text-slate-600 capitalize">{resume.templateId.replace("-", " ")} template</span>
      </div>
    </div>
  );
}
