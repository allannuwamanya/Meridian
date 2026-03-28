"use client";
import { useResumeStore } from "@/store/useResumeStore";
import { Sparkles, Wand2, CheckCircle2, X, RefreshCw } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import { useSummaryVariants } from "@/hooks/useAI";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AIVariant } from "@/types/resume";

function VariantCard({
  variant,
  onAccept,
  onDismiss,
}: {
  variant: AIVariant;
  onAccept: (content: string) => void;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="ai-badge rounded-xl p-3 space-y-2 group"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider">{variant.label}</span>
        <button onClick={onDismiss} className="opacity-0 group-hover:opacity-100 transition-opacity">
          <X className="w-3 h-3 text-slate-500 hover:text-slate-300" />
        </button>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">{variant.content}</p>
      <button
        onClick={() => onAccept(variant.content)}
        className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg transition-all border border-emerald-500/20"
      >
        <CheckCircle2 className="w-3 h-3" /> Use this version
      </button>
    </motion.div>
  );
}

export default function SummaryEditor() {
  const { resume, updateSummary, ai, clearAI, setAIVariants } = useResumeStore();
  const { generate, isGenerating } = useSummaryVariants();
  const [localSummary, setLocalSummary] = useState(resume.summary);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write a powerful 2–3 sentence summary that positions you exactly for your target role…",
      }),
    ],
    content: resume.summary,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setLocalSummary(text);
      updateSummary(text);
    },
    editorProps: { attributes: { class: "tiptap-content min-h-[140px] focus:outline-none" } },
  });

  useEffect(() => {
    if (editor && resume.summary !== editor.getText()) {
      editor.commands.setContent(resume.summary);
    }
  }, []);

  const handleAcceptVariant = (content: string) => {
    updateSummary(content);
    setLocalSummary(content);
    editor?.commands.setContent(content);
    clearAI();
  };

  const charCount = localSummary.length;
  const charStatus = charCount < 200 ? "too-short" : charCount > 600 ? "too-long" : "good";

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Professional Summary</h2>
          <p className="text-sm text-slate-500">3 sentences. Achievement-led. Role-specific.</p>
        </div>
        <button
          onClick={generate}
          disabled={isGenerating}
          className={cn(
            "flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-lg transition-all shrink-0",
            isGenerating
              ? "bg-violet-600/10 text-violet-400 border-violet-500/25 cursor-wait"
              : "bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border-violet-500/25 hover:border-violet-500/50"
          )}
        >
          {isGenerating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Wand2 className="w-3.5 h-3.5" />
          )}
          {isGenerating ? "Generating…" : "AI Draft 3 Variants"}
        </button>
      </div>

      {/* Editor */}
      <div className="glass rounded-2xl p-4 border border-white/5 focus-within:border-violet-500/30 transition-colors">
        <EditorContent editor={editor} />
      </div>

      {/* Char count */}
      <div className="flex items-center justify-between text-xs">
        <span className={cn(
          charStatus === "good" ? "text-emerald-400" :
          charStatus === "too-short" ? "text-amber-400" : "text-red-400"
        )}>
          {charCount} chars
          {charStatus === "too-short" && " — too short"}
          {charStatus === "too-long" && " — consider trimming"}
          {charStatus === "good" && " ✓ good length"}
        </span>
        <span className="text-slate-600">Target: 200–600 chars</span>
      </div>

      {/* AI Variants */}
      <AnimatePresence>
        {ai.feature === "summary-variants" && ai.variants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-violet-300">
                <Sparkles className="w-3.5 h-3.5" />
                3 AI-generated variants — pick one or close
              </div>
              <button onClick={clearAI} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Dismiss all
              </button>
            </div>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="ai-badge rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-violet-300">
          <Sparkles className="w-3.5 h-3.5" />
          Smart Tips
        </div>
        <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
          <li>Start with your title and years of experience.</li>
          <li>Name 1–2 signature achievements with metrics.</li>
          <li>End with what you're targeting or uniquely bring.</li>
        </ul>
      </div>
    </div>
  );
}
