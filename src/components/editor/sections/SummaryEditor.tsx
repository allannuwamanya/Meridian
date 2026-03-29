"use client";
import { useResumeStore } from "@/store/useResumeStore";
import { Sparkles, Wand2, CheckCircle2, X, Loader2, Lightbulb, AlertTriangle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSummaryVariants } from "@/hooks/useAI";
import { useAINudge } from "@/hooks/useAINudge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AIVariant } from "@/types/resume";

function VariantCard({ variant, onAccept, onDismiss }: {
  variant: AIVariant;
  onAccept: (content: string) => void;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="ai-badge rounded-xl p-3.5 space-y-2.5 group hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" /> {variant.label}
        </span>
        <button onClick={onDismiss} className="opacity-0 group-hover:opacity-100 transition-opacity">
          <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
        </button>
      </div>
      <p className="text-xs text-gray-700 leading-relaxed">{variant.content}</p>
      <div className="flex justify-end pt-1">
        <button
          onClick={() => onAccept(variant.content)}
          className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all border border-emerald-200"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Use this version
        </button>
      </div>
    </motion.div>
  );
}

export default function SummaryEditor() {
  const { resume, updateSummary, ai, clearAI, setAIVariants } = useResumeStore();
  const { generate, isGenerating } = useSummaryVariants();
  const [localSummary, setLocalSummary] = useState(resume.summary);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // AI nudge — fires 1.8s after user pauses typing
  const nudgeContext = `Professional summary for ${resume.targetRole || "a professional"} targeting ${resume.targetCompany || "top companies"}`;
  const { nudge, isLoading: isNudgeLoading } = useAINudge(localSummary, nudgeContext);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [localSummary]);

  const handleAcceptVariant = (content: string) => {
    updateSummary(content);
    setLocalSummary(content);
    clearAI();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalSummary(e.target.value);
    updateSummary(e.target.value);
  };

  const charCount = localSummary.length;
  const charStatus = charCount < 200 ? "too-short" : charCount > 600 ? "too-long" : "good";

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Professional Summary</h2>
          <p className="text-sm text-gray-500">3 sentences. Achievement-led. Role-specific.</p>
        </div>
        <button
          onClick={generate}
          disabled={isGenerating}
          className={cn(
            "flex items-center justify-center gap-1.5 text-xs border px-3.5 py-2 rounded-xl transition-all font-semibold shrink-0 shadow-sm disabled:opacity-80 active:scale-95",
            isGenerating
              ? "bg-rose-50 text-rose-500 border-rose-200 cursor-wait"
              : "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white border-rose-600"
          )}
        >
          {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
          {isGenerating ? "Crafting variants…" : "AI Draft Variants"}
        </button>
      </div>

      {/* Textarea */}
      <div className={cn(
        "bg-white rounded-2xl border transition-all overflow-hidden relative",
        isGenerating ? "border-rose-200 bg-rose-50/30" : "border-gray-200 focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/10"
      )}>
        <textarea
          ref={textareaRef}
          value={localSummary}
          onChange={handleTextChange}
          placeholder="Write a powerful 2–3 sentence summary that positions you exactly for your target role…"
          className={cn(
            "w-full min-h-[140px] p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none resize-none bg-transparent leading-relaxed",
            isGenerating && "opacity-60 cursor-wait"
          )}
          disabled={isGenerating}
        />
      </div>

      {/* Char count + ATS indicator */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className={cn(
          charStatus === "good" ? "text-emerald-600 font-medium" :
          charStatus === "too-short" ? "text-amber-600" : "text-red-500"
        )}>
          {charCount} chars
          {charStatus === "too-short" && " — slightly too short"}
          {charStatus === "too-long" && " — consider trimming"}
          {charStatus === "good" && " ✓ ideal length"}
        </span>
        <span className="text-gray-400 font-medium">Target: 200–600 chars</span>
      </div>

      {/* AI Writing Nudge */}
      <AnimatePresence>
        {(nudge || isNudgeLoading) && !isGenerating && localSummary.length >= 40 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={cn(
              "flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs",
              isNudgeLoading ? "bg-gray-50 border-gray-100 text-gray-400" :
              nudge?.type === "praise" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
              nudge?.type === "warning" ? "bg-amber-50 border-amber-100 text-amber-700" :
              "bg-blue-50 border-blue-100 text-blue-700"
            )}
          >
            {isNudgeLoading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 mt-0.5" />
              : nudge?.type === "warning"
                ? <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                : <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            }
            <span>{isNudgeLoading ? "AI coach is reading your summary…" : nudge?.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Variants */}
      <AnimatePresence>
        {ai.feature === "summary-variants" && ai.variants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                <Sparkles className="w-3.5 h-3.5" />
                3 AI-generated options ready
              </div>
              <button onClick={clearAI} className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
                Dismiss all
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <AnimatePresence>
                {ai.variants.map((v) => (
                  <VariantCard
                    key={v.id}
                    variant={v}
                    onAccept={handleAcceptVariant}
                    onDismiss={() => setAIVariants(ai.variants.filter((x) => x.id !== v.id))}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Writing tips */}
      <div className="ai-badge rounded-xl p-4 space-y-2 mt-2">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
          <Sparkles className="w-3.5 h-3.5" />
          ATS Writing Tips
        </div>
        <ul className="text-xs text-gray-600 space-y-2 list-none pl-1">
          <li className="flex items-start gap-2"><span className="text-rose-400 font-bold mt-0.5">•</span> Open with your title and years of experience.</li>
          <li className="flex items-start gap-2"><span className="text-rose-400 font-bold mt-0.5">•</span> Include 1–2 signature achievements with metrics.</li>
          <li className="flex items-start gap-2"><span className="text-rose-400 font-bold mt-0.5">•</span> Mirror keywords from the job description for ATS.</li>
          <li className="flex items-start gap-2"><span className="text-rose-400 font-bold mt-0.5">•</span> End with what you are targeting or uniquely bring.</li>
        </ul>
      </div>
    </div>
  );
}
