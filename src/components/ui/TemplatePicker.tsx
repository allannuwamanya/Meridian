"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { TemplateId } from "@/types/resume";

interface TemplateInfo {
  id: TemplateId;
  label: string;
  description: string;
  category: string;
  preview: React.ReactNode; // mini SVG preview
}

// Mini visual thumbnails for each template
function MinimalPreview() {
  return (
    <svg viewBox="0 0 80 110" className="w-full h-full">
      <rect width="80" height="110" fill="#f8fafc" rx="2" />
      {/* Name */}
      <rect x="8" y="10" width="40" height="5" rx="1" fill="#111827" opacity="0.9" />
      <rect x="8" y="17" width="25" height="2.5" rx="1" fill="#6b7280" opacity="0.6" />
      {/* Divider */}
      <rect x="8" y="23" width="64" height="0.5" fill="#e5e7eb" />
      {/* Section */}
      <rect x="8" y="27" width="20" height="2" rx="1" fill="#111827" opacity="0.5" />
      <rect x="8" y="32" width="50" height="2" rx="1" fill="#6b7280" opacity="0.4" />
      <rect x="8" y="36" width="45" height="2" rx="1" fill="#6b7280" opacity="0.3" />
      <rect x="8" y="42" width="20" height="2" rx="1" fill="#111827" opacity="0.5" />
      <rect x="8" y="47" width="55" height="2" rx="1" fill="#6b7280" opacity="0.4" />
      <rect x="8" y="51" width="40" height="2" rx="1" fill="#6b7280" opacity="0.3" />
      <rect x="8" y="57" width="20" height="2" rx="1" fill="#111827" opacity="0.5" />
      <rect x="8" y="62" width="48" height="2" rx="1" fill="#6b7280" opacity="0.4" />
    </svg>
  );
}

function ClassicPreview() {
  return (
    <svg viewBox="0 0 80 110" className="w-full h-full">
      <rect width="80" height="110" fill="#ffffff" rx="2" />
      {/* Header bar */}
      <rect width="80" height="22" fill="#111827" rx="2" />
      <rect x="8" y="7" width="35" height="4" rx="1" fill="#ffffff" opacity="0.95" />
      <rect x="8" y="13" width="22" height="2.5" rx="1" fill="#ffffff" opacity="0.5" />
      {/* Body */}
      <rect x="8" y="28" width="16" height="2" rx="1" fill="#111827" opacity="0.7" />
      <rect x="8" y="32" width="0.5" height="30" fill="#111827" opacity="0.2" />
      <rect x="12" y="32" width="45" height="2" rx="1" fill="#374151" opacity="0.5" />
      <rect x="12" y="36" width="38" height="2" rx="1" fill="#374151" opacity="0.35" />
      <rect x="12" y="40" width="42" height="2" rx="1" fill="#374151" opacity="0.35" />
      <rect x="8" y="48" width="16" height="2" rx="1" fill="#111827" opacity="0.7" />
      <rect x="12" y="52" width="40" height="2" rx="1" fill="#374151" opacity="0.5" />
      <rect x="12" y="56" width="35" height="2" rx="1" fill="#374151" opacity="0.35" />
    </svg>
  );
}

function ExecutivePreview() {
  return (
    <svg viewBox="0 0 80 110" className="w-full h-full">
      <rect width="80" height="110" fill="#ffffff" rx="2" />
      {/* Navy top band */}
      <rect width="80" height="28" fill="#0f172a" rx="2" />
      {/* Gold accent line */}
      <rect x="0" y="28" width="80" height="2" fill="#d97706" />
      {/* Name block */}
      <rect x="8" y="8" width="42" height="5" rx="1" fill="#ffffff" opacity="0.95" />
      <rect x="8" y="15" width="28" height="2.5" rx="1" fill="#d97706" opacity="0.8" />
      <rect x="8" y="20" width="50" height="1.5" rx="1" fill="#ffffff" opacity="0.3" />
      {/* Body */}
      <rect x="8" y="36" width="18" height="2" rx="1" fill="#d97706" opacity="0.7" />
      <rect x="8" y="40" width="1.5" height="18" fill="#0f172a" opacity="0.15" />
      <rect x="13" y="40" width="50" height="2" rx="1" fill="#374151" opacity="0.5" />
      <rect x="13" y="44" width="42" height="2" rx="1" fill="#374151" opacity="0.35" />
      <rect x="13" y="48" width="46" height="2" rx="1" fill="#374151" opacity="0.35" />
      <rect x="8" y="56" width="18" height="2" rx="1" fill="#d97706" opacity="0.7" />
      <rect x="13" y="60" width="48" height="2" rx="1" fill="#374151" opacity="0.5" />
    </svg>
  );
}

function TechnicalPreview() {
  return (
    <svg viewBox="0 0 80 110" className="w-full h-full">
      <rect width="80" height="110" fill="#0f172a" rx="2" />
      {/* Sidebar */}
      <rect width="24" height="110" fill="#1e293b" />
      {/* Cyan accent */}
      <rect x="0" y="0" width="2" height="110" fill="#06b6d4" />
      {/* Sidebar items */}
      <rect x="4" y="12" width="14" height="3" rx="1" fill="#ffffff" opacity="0.9" />
      <rect x="4" y="17" width="10" height="2" rx="1" fill="#06b6d4" opacity="0.7" />
      <rect x="4" y="28" width="12" height="1.5" rx="1" fill="#94a3b8" opacity="0.5" />
      <rect x="4" y="32" width="12" height="1.5" rx="1" fill="#94a3b8" opacity="0.5" />
      <rect x="4" y="36" width="10" height="1.5" rx="1" fill="#94a3b8" opacity="0.5" />
      {/* Main content */}
      <rect x="28" y="10" width="10" height="1.5" rx="1" fill="#06b6d4" opacity="0.6" />
      <rect x="28" y="14" width="44" height="2" rx="1" fill="#ffffff" opacity="0.7" />
      <rect x="28" y="18" width="36" height="1.5" rx="1" fill="#94a3b8" opacity="0.4" />
      <rect x="28" y="28" width="10" height="1.5" rx="1" fill="#06b6d4" opacity="0.6" />
      <rect x="28" y="32" width="44" height="1.5" rx="1" fill="#94a3b8" opacity="0.4" />
      <rect x="28" y="36" width="40" height="1.5" rx="1" fill="#94a3b8" opacity="0.3" />
    </svg>
  );
}

function CompactPreview() {
  return (
    <svg viewBox="0 0 80 110" className="w-full h-full">
      <rect width="80" height="110" fill="#ffffff" rx="2" />
      <rect x="8" y="8" width="38" height="4" rx="1" fill="#111827" opacity="0.9" />
      <rect x="8" y="14" width="60" height="1.5" rx="1" fill="#6b7280" opacity="0.4" />
      <rect x="8" y="18" width="0.5" height="80" fill="#e5e7eb" />
      {/* Dense rows */}
      {[24,29,34,39,44,49,54,59,64,69,74,79].map((y, i) => (
        <rect key={i} x="12" y={y} width={30 + (i % 3) * 8} height="1.5" rx="1" fill="#374151" opacity="0.4" />
      ))}
      <rect x="8" y="22" width="14" height="1.5" rx="1" fill="#111827" opacity="0.6" />
      <rect x="8" y="42" width="14" height="1.5" rx="1" fill="#111827" opacity="0.6" />
      <rect x="8" y="62" width="14" height="1.5" rx="1" fill="#111827" opacity="0.6" />
    </svg>
  );
}

function BoldPreview() {
  return (
    <svg viewBox="0 0 80 110" className="w-full h-full">
      <rect width="80" height="110" fill="#ffffff" rx="2" />
      {/* Large accent block */}
      <rect width="80" height="35" fill="#065f46" rx="2" />
      {/* Big name */}
      <rect x="8" y="9" width="50" height="7" rx="1.5" fill="#ffffff" opacity="0.95" />
      <rect x="8" y="19" width="30" height="3" rx="1" fill="#6ee7b7" opacity="0.8" />
      <rect x="8" y="25" width="55" height="1.5" rx="1" fill="#ffffff" opacity="0.25" />
      {/* Divider with accent */}
      <rect x="8" y="39" width="12" height="2.5" rx="1" fill="#065f46" opacity="0.8" />
      <rect x="22" y="40" width="50" height="0.5" fill="#d1d5db" />
      {/* Content */}
      <rect x="8" y="45" width="42" height="2" rx="1" fill="#111827" opacity="0.7" />
      <rect x="8" y="49" width="36" height="1.5" rx="1" fill="#6b7280" opacity="0.5" />
      <rect x="8" y="55" width="12" height="2.5" rx="1" fill="#065f46" opacity="0.8" />
      <rect x="22" y="56" width="50" height="0.5" fill="#d1d5db" />
      <rect x="8" y="60" width="45" height="2" rx="1" fill="#111827" opacity="0.7" />
      <rect x="8" y="64" width="38" height="1.5" rx="1" fill="#6b7280" opacity="0.5" />
    </svg>
  );
}

function SidebarPreview() {
  return (
    <svg viewBox="0 0 80 110" className="w-full h-full">
      <rect width="80" height="110" fill="#ffffff" rx="2" />
      {/* Purple sidebar */}
      <rect width="26" height="110" fill="#4c1d95" rx="2" />
      {/* Sidebar content */}
      <circle cx="13" cy="18" r="8" fill="#7c3aed" opacity="0.6" />
      <rect x="4" y="30" width="18" height="2" rx="1" fill="#ffffff" opacity="0.9" />
      <rect x="4" y="34" width="14" height="1.5" rx="1" fill="#c4b5fd" opacity="0.7" />
      <rect x="4" y="42" width="10" height="1.5" rx="1" fill="#a78bfa" opacity="0.6" />
      <rect x="4" y="46" width="16" height="1.5" rx="1" fill="#c4b5fd" opacity="0.5" />
      <rect x="4" y="50" width="14" height="1.5" rx="1" fill="#c4b5fd" opacity="0.5" />
      <rect x="4" y="58" width="10" height="1.5" rx="1" fill="#a78bfa" opacity="0.6" />
      <rect x="4" y="62" width="16" height="1.5" rx="1" fill="#c4b5fd" opacity="0.5" />
      {/* Main content */}
      <rect x="30" y="10" width="38" height="4" rx="1" fill="#111827" opacity="0.9" />
      <rect x="30" y="16" width="24" height="2" rx="1" fill="#7c3aed" opacity="0.7" />
      <rect x="30" y="22" width="46" height="1" fill="#e5e7eb" />
      <rect x="30" y="26" width="12" height="2" rx="1" fill="#111827" opacity="0.6" />
      <rect x="30" y="30" width="42" height="1.5" rx="1" fill="#374151" opacity="0.5" />
      <rect x="30" y="34" width="36" height="1.5" rx="1" fill="#374151" opacity="0.35" />
      <rect x="30" y="40" width="12" height="2" rx="1" fill="#111827" opacity="0.6" />
      <rect x="30" y="44" width="44" height="1.5" rx="1" fill="#374151" opacity="0.5" />
    </svg>
  );
}

const TEMPLATES: TemplateInfo[] = [
  {
    id: "modern-minimal",
    label: "Modern Minimal",
    description: "Clean lines, strong typography. The safe choice for any industry.",
    category: "Popular",
    preview: <MinimalPreview />,
  },
  {
    id: "classic",
    label: "Classic",
    description: "Traditional black & white structure. Maximum ATS compatibility.",
    category: "ATS-Safe",
    preview: <ClassicPreview />,
  },
  {
    id: "executive",
    label: "Executive",
    description: "Navy & gold authority. Built for senior roles and C-suite applications.",
    category: "Premium",
    preview: <ExecutivePreview />,
  },
  {
    id: "technical",
    label: "Technical",
    description: "Dark sidebar with cyan accents. Ideal for engineers and developers.",
    category: "Tech",
    preview: <TechnicalPreview />,
  },
  {
    id: "compact",
    label: "Compact",
    description: "Dense, high-information layout. Perfect for experienced professionals.",
    category: "New",
    preview: <CompactPreview />,
  },
  {
    id: "bold",
    label: "Bold",
    description: "Strong emerald header with dramatic typography. Stand out.",
    category: "New",
    preview: <BoldPreview />,
  },
  {
    id: "sidebar",
    label: "Sidebar",
    description: "Two-column with purple sidebar. Modern, structured, memorable.",
    category: "New",
    preview: <SidebarPreview />,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Popular:  "bg-rose-50 text-rose-600 border-rose-200",
  "ATS-Safe": "bg-emerald-50 text-emerald-600 border-emerald-200",
  Premium:  "bg-amber-50 text-amber-600 border-amber-200",
  Tech:     "bg-blue-50 text-blue-600 border-blue-200",
  New:      "bg-rose-50 text-rose-600 border-rose-200",
};

export default function TemplatePicker({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { resume, updateTemplateId } = useResumeStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.18)] w-full max-w-4xl max-h-[88vh] flex flex-col pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Choose a Template</h2>
                  </div>
                  <p className="text-sm text-gray-500">Select the design that best fits your industry and style.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4.5 h-4.5 text-gray-500" />
                </button>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {TEMPLATES.map((t) => {
                    const isActive = resume.templateId === t.id;
                    return (
                      <motion.button
                        key={t.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { updateTemplateId(t.id); onClose(); }}
                        className={`relative text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 group ${
                          isActive
                            ? "border-rose-500 shadow-brand"
                            : "border-gray-200 hover:border-rose-200 hover:shadow-card"
                        }`}
                      >
                        {/* Template preview thumbnail */}
                        <div className="aspect-[3/4] bg-gray-50 overflow-hidden">
                          {t.preview}
                        </div>

                        {/* Active check */}
                        {isActive && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-sm">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}

                        {/* Info */}
                        <div className="p-3 border-t border-gray-100 bg-white">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-900">{t.label}</span>
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${CATEGORY_COLORS[t.category] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
                              {t.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 leading-snug">{t.description}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-shrink-0">
                <p className="text-xs text-gray-500">
                  {TEMPLATES.length} templates · Click any to apply instantly
                </p>
                <button
                  onClick={onClose}
                  className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
                >
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
