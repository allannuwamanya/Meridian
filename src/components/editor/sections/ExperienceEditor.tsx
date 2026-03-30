"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore } from "@/store/useResumeStore";
import { Plus, Trash2, ChevronDown, ChevronUp, Wand2, Sparkles, Loader2, Zap } from "lucide-react";
import SmartField from "../SmartField";
import { cn } from "@/lib/utils";
import { formatDateRange } from "@/lib/utils";
import { BulletPoint, WorkExperience } from "@/types/resume";
import { useState, useCallback, useMemo } from "react";
import { useEnhanceBullet } from "@/hooks/useAI";
import { toast } from "@/components/ui/Toast";

// ─── Bullet impact scorer — local heuristic, zero API ────────────────────────
type ImpactLevel = "empty" | "weak" | "good" | "strong";

function scoreBullet(content: string): ImpactLevel {
  if (!content.trim() || content.length < 10) return "empty";
  const STRONG_VERBS = /^(led|built|drove|grew|scaled|reduced|improved|delivered|launched|architected|designed|created|achieved|secured|generated|saved|increased|decreased|managed|mentored|negotiated|transformed|automated|optimized|pioneered|spearheaded|orchestrated)/i;
  const METRICS = /(\d+%|\$[\d,.]+|\d+x|\d+\s*(million|billion|k|users|customers|clients|engineers|people|days|hours|minutes|months|years|points|sales|leads|accounts))/i;
  const hasVerb = STRONG_VERBS.test(content.trim());
  const hasMetric = METRICS.test(content);
  if (hasVerb && hasMetric) return "strong";
  if (hasVerb || hasMetric) return "good";
  return "weak";
}

const IMPACT_CONFIG: Record<ImpactLevel, { label: string; color: string; dot: string }> = {
  empty:  { label: "",         color: "",                          dot: "" },
  weak:   { label: "Weak",    color: "text-red-500 bg-red-50 border-red-100",     dot: "bg-red-400" },
  good:   { label: "Good",    color: "text-amber-600 bg-amber-50 border-amber-100", dot: "bg-amber-400" },
  strong: { label: "Strong",  color: "text-emerald-600 bg-emerald-50 border-emerald-100", dot: "bg-emerald-400" },
};

function BulletImpactBadge({ content }: { content: string }) {
  const level = useMemo(() => scoreBullet(content), [content]);
  if (level === "empty") return null;
  const cfg = IMPACT_CONFIG[level];
  return (
    <motion.span
      key={level}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border", cfg.color)}
    >
      <div className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </motion.span>
  );
}

// ─── Bullet Editor ────────────────────────────────────────────────────────────
function BulletEditor({ bullet, expId, onRemove }: {
  bullet: BulletPoint; expId: string; onRemove: () => void;
}) {
  const { updateBullet, ai } = useResumeStore();
  const { enhance, isEnhancing } = useEnhanceBullet();
  const isThisEnhancing = isEnhancing === bullet.id;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateBullet(expId, bullet.id, e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="group flex items-start gap-2">
      <div className="w-3.5 mt-3 shrink-0 text-rose-400 text-xs select-none">•</div>
      <div className="flex-1 relative">
        <textarea
          value={isThisEnhancing ? (ai.streamingContent || "AI is enhancing…") : bullet.content}
          onChange={handleChange}
          rows={1}
          placeholder="Describe an achievement with impact…"
          className={cn(
            "w-full resize-none bg-white border rounded-xl pl-3 pr-10 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition-all leading-relaxed overflow-hidden",
            isThisEnhancing
              ? "border-rose-300 bg-rose-50/50 animate-pulse"
              : "border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10"
          )}
          style={{ minHeight: "42px" }}
          disabled={isThisEnhancing}
        />
        {/* Impact badge */}
        <div className="absolute left-3 -bottom-4">
          <BulletImpactBadge content={bullet.content} />
        </div>
        {/* AI Enhance button */}
        <button
          onClick={() => enhance(expId, bullet.id, bullet.content)}
          disabled={isThisEnhancing || !bullet.content.trim()}
          className={cn(
            "absolute right-2 top-2 transition-all duration-200",
            "w-6 h-6 rounded-lg flex items-center justify-center",
            isThisEnhancing
              ? "bg-rose-100 opacity-100"
              : "opacity-0 group-hover:opacity-100 bg-rose-50 hover:bg-rose-100 border border-rose-200",
            !bullet.content.trim() && "cursor-not-allowed"
          )}
          title="Enhance with AI"
        >
          {isThisEnhancing
            ? <Loader2 className="w-3 h-3 text-rose-500 animate-spin" />
            : <Wand2 className="w-3 h-3 text-rose-500" />}
        </button>
      </div>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 shrink-0 w-6 h-6 flex items-center justify-center hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200"
      >
        <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500 transition-colors" />
      </button>
    </div>
  );
}

// ─── Bullet Generator ─────────────────────────────────────────────────────────
function useBulletGenerator(expId: string) {
  const { addBullet, updateBullet, resume } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(async (role: string, company: string) => {
    if (!role.trim()) { toast.warning("No role set", "Fill in the role title first."); return; }
    setIsGenerating(true);
    try {
      const jdContext = resume.jobDescription?.slice(0, 600) ?? "";
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectJson: true,
          stream: false,
          prompt: `You are an expert resume writer. Generate 4 strong achievement bullet points for this role.

Role: "${role}"
Company: "${company || "a technology company"}"
${jdContext ? `Job context: "${jdContext}"` : ""}

Rules:
- Start each bullet with a strong past-tense action verb
- Include at least 2 bullets with metrics/numbers
- Keep each bullet under 180 characters
- No "I" or "we" — implied third person
- Focus on business impact, not just tasks

Respond with ONLY this JSON array (no markdown):
["bullet 1", "bullet 2", "bullet 3", "bullet 4"]`
        }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const { text } = await res.json();
      const clean = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
      const bullets: string[] = JSON.parse(clean);
      bullets.forEach((content) => {
        const exp = resume.experience.find((e) => e.id === expId);
        if (!exp) return;
        // Add a bullet and immediately fill it
        const newId = crypto.randomUUID();
        addBullet(expId);
        // The new bullet gets auto-assigned an id from the store, update the last one
        setTimeout(() => {
          const updated = useResumeStore.getState().resume.experience.find((e) => e.id === expId);
          if (updated) {
            const last = updated.bullets[updated.bullets.length - 1];
            if (last) updateBullet(expId, last.id, content);
          }
        }, 0);
      });
      toast.success(`${bullets.length} bullets generated!`, `Tailored for ${role} at ${company || "your target company"}.`);
    } catch (err: any) {
      toast.error("Generation failed", err?.message ?? "Try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [expId, resume, addBullet, updateBullet]);

  return { generate, isGenerating };
}

// ─── Experience Card ──────────────────────────────────────────────────────────
function ExperienceCard({ exp }: { exp: WorkExperience }) {
  const { updateExperience, removeExperience, addBullet, removeBullet, activeExperienceId, setActiveExperience } = useResumeStore();
  const { enhance: enhanceAll } = useEnhanceBullet();
  const { generate, isGenerating } = useBulletGenerator(exp.id);
  const isOpen = activeExperienceId === exp.id;
  const [isEnhancingAll, setIsEnhancingAll] = useState(false);

  const handleEnhanceAll = useCallback(async () => {
    if (!exp.bullets.length) return;
    setIsEnhancingAll(true);
    for (const bullet of exp.bullets) {
      if (bullet.content.trim()) await enhanceAll(exp.id, bullet.id, bullet.content);
    }
    setIsEnhancingAll(false);
  }, [exp.bullets, exp.id, enhanceAll]);

  // Count strong bullets for card preview
  const strongCount = exp.bullets.filter((b) => scoreBullet(b.content) === "strong").length;
  const totalFilled = exp.bullets.filter((b) => b.content.trim()).length;

  return (
    <motion.div layout className="bg-white rounded-2xl overflow-hidden border border-gray-200 group shadow-sm hover:shadow-card transition-shadow">
      {/* Card header */}
      <button
        onClick={() => setActiveExperience(isOpen ? null : exp.id)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {exp.role || <span className="text-gray-400 font-normal italic">New Role</span>}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {exp.company || "Company"} · {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent) || "Dates"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Bullet quality mini-indicator */}
          {totalFilled > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className="text-emerald-500 font-semibold">{strongCount}</span>
              <span>/</span>
              <span>{totalFilled}</span>
              <span className="hidden sm:inline">strong</span>
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
            className="w-6 h-6 flex items-center justify-center hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-200"
          >
            <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
          {isOpen
            ? <ChevronUp className="w-4 h-4 text-gray-400" />
            : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 space-y-3 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <SmartField label="Role Title" value={exp.role} onChange={(v) => updateExperience(exp.id, { role: v })} placeholder="Senior Engineer" />
                <SmartField label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} placeholder="Acme Corp" />
                <SmartField label="Start Date" value={exp.startDate} type="month" onChange={(v) => updateExperience(exp.id, { startDate: v })} />
                <SmartField label="End Date" value={exp.endDate} type="month" onChange={(v) => updateExperience(exp.id, { endDate: v })} disabled={exp.isCurrent} />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox" id={`current-${exp.id}`} checked={exp.isCurrent}
                  onChange={(e) => updateExperience(exp.id, { isCurrent: e.target.checked })}
                  className="accent-rose-500 w-3.5 h-3.5 cursor-pointer"
                />
                <label htmlFor={`current-${exp.id}`} className="text-xs text-gray-600 cursor-pointer">I currently work here</label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SmartField label="Location" value={exp.location} onChange={(v) => updateExperience(exp.id, { location: v })} placeholder="Remote" />
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Employment Type</label>
                  <select
                    value={exp.employmentType}
                    onChange={(e) => updateExperience(exp.id, { employmentType: e.target.value as any })}
                    className="w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10 transition-all"
                  >
                    {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Achievements */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Achievements</p>
                  <button
                    onClick={() => addBullet(exp.id)}
                    className="flex items-center gap-1 text-[10px] text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-all border border-rose-200"
                  >
                    <Plus className="w-3 h-3" /> Add bullet
                  </button>
                </div>
                <div className="space-y-5">
                  <AnimatePresence>
                    {exp.bullets.map((bullet) => (
                      <motion.div key={bullet.id}
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <BulletEditor bullet={bullet} expId={exp.id} onRemove={() => removeBullet(exp.id, bullet.id)} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* AI Actions */}
              <div className="ai-badge rounded-xl pt-3 mt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Actions
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Generate bullets */}
                  <button
                    onClick={() => generate(exp.role, exp.company)}
                    disabled={isGenerating}
                    className={cn(
                      "text-[10px] px-2.5 py-1.5 rounded-lg transition-all border flex items-center gap-1.5 font-semibold",
                      isGenerating
                        ? "bg-rose-100 text-rose-600 border-rose-300 cursor-wait"
                        : "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-500 hover:from-rose-600 hover:to-pink-600 shadow-sm"
                    )}
                  >
                    {isGenerating
                      ? <><Loader2 className="w-2.5 h-2.5 animate-spin" /> Generating…</>
                      : <><Zap className="w-2.5 h-2.5" /> Generate bullets</>}
                  </button>

                  {/* Enhance all */}
                  <button
                    onClick={handleEnhanceAll}
                    disabled={isEnhancingAll || exp.bullets.every((b) => !b.content.trim())}
                    className={cn(
                      "text-[10px] px-2.5 py-1 rounded-lg transition-all border flex items-center gap-1",
                      isEnhancingAll
                        ? "bg-rose-100 text-rose-600 border-rose-300 cursor-wait"
                        : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 hover:border-rose-300"
                    )}
                  >
                    {isEnhancingAll
                      ? <><Loader2 className="w-2.5 h-2.5 animate-spin" /> Enhancing…</>
                      : "✦ Enhance all bullets"}
                  </button>
                  
                  {/* Quantification Lab */}
                  <button
                    onClick={() => {
                      const evt = new CustomEvent("open-quant-lab", { detail: { expId: exp.id } });
                      window.dispatchEvent(evt);
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-lg transition-all border flex items-center gap-1 font-semibold bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-200 hover:border-violet-300"
                  >
                    🔬 Quantification Lab
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Experience Editor ────────────────────────────────────────────────────────
export default function ExperienceEditor() {
  const { resume, addExperience } = useResumeStore();

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Work Experience</h2>
          <p className="text-sm text-gray-500">Most recent first. Use bullets to show impact, not duties.</p>
        </div>
        <button
          id="add-experience-btn"
          onClick={addExperience}
          className="flex items-center gap-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl transition-all font-semibold shrink-0 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Add Role
        </button>
      </div>
      <div className="space-y-3">
        {resume.experience.map((exp) => (
          <div key={exp.id} className="group">
            <ExperienceCard exp={exp} />
          </div>
        ))}
      </div>
    </div>
  );
}
