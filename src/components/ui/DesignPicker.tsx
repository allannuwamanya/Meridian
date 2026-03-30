"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette, Type } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";

const FONTS = [
  { id: "'Inter', sans-serif", label: "Inter", desc: "Modern Sans" },
  { id: "'Helvetica Neue', Helvetica, Arial, sans-serif", label: "Helvetica", desc: "Classic Bold" },
  { id: "'Merriweather', serif", label: "Merriweather", desc: "Formal Serif" },
  { id: "'Roboto Mono', monospace", label: "Roboto Mono", desc: "Technical" },
  { id: "'Times New Roman', Times, serif", label: "Times New", desc: "Academic" },
  { id: "'Outfit', sans-serif", label: "Outfit", desc: "Contemporary" },
];

const COLORS = [
  { id: "#ef4444", label: "Ruby", twStart: "from-red-400", twEnd: "to-red-600" },
  { id: "#3b82f6", label: "Ocean", twStart: "from-blue-400", twEnd: "to-blue-600" },
  { id: "#10b981", label: "Emerald", twStart: "from-emerald-400", twEnd: "to-emerald-600" },
  { id: "#8b5cf6", label: "Amethyst", twStart: "from-purple-400", twEnd: "to-purple-600" },
  { id: "#f59e0b", label: "Amber", twStart: "from-amber-400", twEnd: "to-amber-600" },
  { id: "#475569", label: "Slate", twStart: "from-slate-400", twEnd: "to-slate-600" },
];

export default function DesignPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { resume, updateDesign } = useResumeStore();
  const design = resume.design || { fontFamily: FONTS[0].id, accentColor: COLORS[0].id };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.18)] w-full max-w-lg pointer-events-auto overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">Typography & Color</h2>
                    <p className="text-xs text-gray-500">Customize the global appearance of your resume.</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                  <X className="w-4.5 h-4.5 text-gray-500" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-8">
                {/* Font Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Type className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-bold text-gray-900">Font Family</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {FONTS.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => updateDesign({ fontFamily: font.id })}
                        className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all ${
                          design.fontFamily === font.id
                            ? "border-indigo-500 bg-indigo-50/30"
                            : "border-gray-200 hover:border-indigo-200 bg-white"
                        }`}
                      >
                        <span style={{ fontFamily: font.id }} className="text-base text-gray-900 mb-0.5">
                          {font.label}
                        </span>
                        <span className="text-[10px] text-gray-500">{font.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-bold text-gray-900">Accent Color</h3>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => updateDesign({ accentColor: color.id })}
                        className={`group relative flex flex-col items-center gap-2 transition-all ${
                          design.accentColor === color.id ? "scale-110" : "hover:scale-105"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.twStart} ${color.twEnd} shadow-sm border-2 ${
                            design.accentColor === color.id ? "border-gray-900" : "border-white"
                          } ring-2 ring-transparent ${
                            design.accentColor === color.id ? "ring-gray-900/10" : ""
                          }`}
                        />
                        <span className={`text-[10px] font-medium ${design.accentColor === color.id ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"}`}>
                          {color.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-500">Changes apply instantly to the live preview</p>
                <button onClick={onClose} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
