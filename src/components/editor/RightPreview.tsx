"use client";
import { useResumeStore } from "@/store/useResumeStore";
import ModernMinimalTemplate from "@/components/templates/ModernMinimal";
import ClassicTemplate from "@/components/templates/Classic";
import ExecutiveTemplate from "@/components/templates/Executive";
import TechnicalTemplate from "@/components/templates/Technical";
import CompactTemplate from "@/components/templates/Compact";
import BoldTemplate from "@/components/templates/Bold";
import SidebarTemplate from "@/components/templates/Sidebar";
import TimelineTemplate from "@/components/templates/Timeline";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";

import AcademicTemplate from "@/components/templates/Academic";
import CareerChangerTemplate from "@/components/templates/CareerChanger";
import InternationalTemplate from "@/components/templates/International";
import CreativeTemplate from "@/components/templates/Creative";

const TEMPLATES: Record<string, React.ComponentType<{ resume: any; isPreview?: boolean; onSectionClick?: (id: string) => void }>> = {
  "modern-minimal": ModernMinimalTemplate,
  classic:          ClassicTemplate,
  executive:        ExecutiveTemplate,
  technical:        TechnicalTemplate,
  compact:          CompactTemplate,
  bold:             BoldTemplate,
  sidebar:          SidebarTemplate,
  timeline:         TimelineTemplate,
  academic:         AcademicTemplate,
  "career-changer": CareerChangerTemplate,
  international:    InternationalTemplate,
  creative:         CreativeTemplate,
};

const ZOOM_STEPS = [0.42, 0.52, 0.62, 0.72, 0.82];

export default function RightPreview() {
  const { resume, setActiveSection } = useResumeStore();
  const Template = TEMPLATES[resume.templateId] ?? ModernMinimalTemplate;
  const [zoomIdx, setZoomIdx] = useState(1);
  const scale = ZOOM_STEPS[zoomIdx];

  const zoomIn  = useCallback(() => setZoomIdx((i) => Math.min(i + 1, ZOOM_STEPS.length - 1)), []);
  const zoomOut = useCallback(() => setZoomIdx((i) => Math.max(i - 1, 0)), []);
  const reset   = useCallback(() => setZoomIdx(1), []);

  const pageW = 794;
  const pageH = 1123;
  const scaledW = pageW * scale;
  const scaledH = pageH * scale;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Preview header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 flex-shrink-0 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Live Preview</span>
        </div>
        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button onClick={zoomOut} disabled={zoomIdx === 0}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-all">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button onClick={reset}
            className="text-[10px] text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-all min-w-[40px] text-center">
            {Math.round(scale * 100)}%
          </button>
          <button onClick={zoomIn} disabled={zoomIdx === ZOOM_STEPS.length - 1}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-all">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={reset} title="Reset zoom"
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all ml-0.5">
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Scrollable viewport */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 p-4 flex justify-center items-start">
        <div className="relative" style={{ width: scaledW, height: scaledH, flexShrink: 0 }}>
          <motion.div
            key={`${resume.templateId}-${scale}`}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="absolute top-0 left-0 origin-top-left"
            style={{
              width: pageW,
              transform: `scale(${scale})`,
              background: "white",
              borderRadius: "4px",
              overflow: "hidden",
              boxShadow: "0 4px 32px rgba(0,0,0,0.14)",
            }}
          >
            <Template resume={resume} isPreview={true} onSectionClick={setActiveSection} />
          </motion.div>
        </div>
      </div>

      {/* Template name bar */}
      <div className="px-4 py-2 border-t border-gray-200 flex-shrink-0 bg-white flex items-center justify-between">
        <span className="text-[10px] text-gray-400 capitalize">
          {resume.templateId.replace(/-/g, " ")} template
        </span>
        <span className="text-[10px] text-gray-400">A4 · PDF ready</span>
      </div>

      {/* Hidden full-resolution print target for PDF export */}
      <div
        id="resume-print-target"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "794px",
          height: "1123px",
          overflow: "hidden",
          background: "white",
          zIndex: -1,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <Template resume={resume} />
      </div>
    </div>
  );
}
