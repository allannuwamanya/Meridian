"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore } from "@/store/useResumeStore";
import { Plus, Trash2, ChevronDown, ChevronUp, Wand2, Sparkles, RefreshCw } from "lucide-react";
import SmartField from "../SmartField";
import { cn } from "@/lib/utils";
import { formatDateRange } from "@/lib/utils";
import { BulletPoint, WorkExperience } from "@/types/resume";
import { useState, useRef, useCallback } from "react";
import { useEnhanceBullet } from "@/hooks/useAI";

function BulletEditor({
  bullet,
  expId,
  onRemove,
}: {
  bullet: BulletPoint;
  expId: string;
  onRemove: () => void;
}) {
  const { updateBullet } = useResumeStore();
  const { enhance, isEnhancing } = useEnhanceBullet();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isThisEnhancing = isEnhancing === bullet.id;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateBullet(expId, bullet.id, e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="group flex items-start gap-2">
      <div className="w-3.5 mt-3 shrink-0 text-slate-600 text-xs select-none">•</div>
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={bullet.content}
          onChange={handleChange}
          rows={1}
          placeholder="Describe an achievement with impact…"
          className={cn(
            "w-full resize-none bg-white/4 border rounded-xl pl-3 pr-10 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none transition-colors leading-relaxed overflow-hidden",
            isThisEnhancing
              ? "border-violet-500/50 bg-violet-500/5 animate-pulse"
              : "border-white/5 focus:border-violet-500/40"
          )}
          style={{ minHeight: "42px" }}
          disabled={isThisEnhancing}
        />
        {/* AI Enhance button */}
        <button
          onClick={() => enhance(expId, bullet.id, bullet.content)}
          disabled={isThisEnhancing || !bullet.content.trim()}
          className={cn(
            "absolute right-2 top-2 transition-all duration-200",
            "w-6 h-6 rounded-lg flex items-center justify-center",
            isThisEnhancing
              ? "bg-violet-500/40 opacity-100"
              : "opacity-0 group-hover:opacity-100 bg-violet-500/20 hover:bg-violet-500/40",
            !bullet.content.trim() && "cursor-not-allowed"
          )}
          title="Enhance with AI"
        >
          {isThisEnhancing ? (
            <RefreshCw className="w-3 h-3 text-violet-400 animate-spin" />
          ) : (
            <Wand2 className="w-3 h-3 text-violet-400" />
          )}
        </button>
      </div>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 shrink-0 w-6 h-6 flex items-center justify-center hover:bg-red-500/15 rounded-lg"
      >
        <Trash2 className="w-3 h-3 text-slate-600 hover:text-red-400 transition-colors" />
      </button>
    </div>
  );
}

function ExperienceCard({ exp }: { exp: WorkExperience }) {
  const {
    updateExperience, removeExperience, addBullet, removeBullet,
    activeExperienceId, setActiveExperience,
  } = useResumeStore();
  const { enhance: enhanceAll } = useEnhanceBullet();
  const isOpen = activeExperienceId === exp.id;
  const [isEnhancingAll, setIsEnhancingAll] = useState(false);

  const handleEnhanceAll = useCallback(async () => {
    if (!exp.bullets.length) return;
    setIsEnhancingAll(true);
    for (const bullet of exp.bullets) {
      if (bullet.content.trim()) {
        await enhanceAll(exp.id, bullet.id, bullet.content);
      }
    }
    setIsEnhancingAll(false);
  }, [exp.bullets, exp.id, enhanceAll]);

  return (
    <motion.div layout className="glass rounded-2xl overflow-hidden border border-white/5 group">
      {/* Header */}
      <button
        onClick={() => setActiveExperience(isOpen ? null : exp.id)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/3 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {exp.role || <span className="text-slate-600 font-normal">New Role</span>}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {exp.company || "Company"} · {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent) || "Dates"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
            className="w-6 h-6 flex items-center justify-center hover:bg-red-500/15 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3 h-3 text-slate-600 hover:text-red-400 transition-colors" />
          </button>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 space-y-3 border-t border-white/5">
              <div className="grid grid-cols-2 gap-3">
                <SmartField label="Role Title" value={exp.role}
                  onChange={(v) => updateExperience(exp.id, { role: v })} placeholder="Senior Engineer" />
                <SmartField label="Company" value={exp.company}
                  onChange={(v) => updateExperience(exp.id, { company: v })} placeholder="Acme Corp" />
                <SmartField label="Start Date" value={exp.startDate} type="month"
                  onChange={(v) => updateExperience(exp.id, { startDate: v })} placeholder="2022-01" />
                <SmartField label="End Date" value={exp.endDate} type="month"
                  onChange={(v) => updateExperience(exp.id, { endDate: v })} placeholder="Present" disabled={exp.isCurrent} />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox" id={`current-${exp.id}`} checked={exp.isCurrent}
                  onChange={(e) => updateExperience(exp.id, { isCurrent: e.target.checked })}
                  className="accent-violet-500 w-3.5 h-3.5"
                />
                <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-400">I currently work here</label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SmartField label="Location" value={exp.location}
                  onChange={(v) => updateExperience(exp.id, { location: v })} placeholder="Remote" />
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={exp.employmentType}
                    onChange={(e) => updateExperience(exp.id, { employmentType: e.target.value as any })}
                    className="w-full text-sm text-slate-300 bg-white/5 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-violet-500/40 transition-colors"
                  >
                    {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map((t) => (
                      <option key={t} className="bg-[#18181f]">{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Achievements */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Achievements</p>
                  <button
                    onClick={() => addBullet(exp.id)}
                    className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 px-2.5 py-1 rounded-lg transition-all"
                  >
                    <Plus className="w-3 h-3" /> Add bullet
                  </button>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {exp.bullets.map((bullet) => (
                      <motion.div key={bullet.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <BulletEditor bullet={bullet} expId={exp.id}
                          onRemove={() => removeBullet(exp.id, bullet.id)} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* AI Panel */}
              <div className="ai-badge rounded-xl mt-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-violet-300 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Actions
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleEnhanceAll}
                    disabled={isEnhancingAll || exp.bullets.every(b => !b.content.trim())}
                    className={cn(
                      "text-[10px] px-2.5 py-1 rounded-lg transition-colors border",
                      isEnhancingAll
                        ? "bg-violet-500/25 text-violet-300 border-violet-500/30 cursor-wait"
                        : "bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border-violet-500/20"
                    )}
                  >
                    {isEnhancingAll ? (
                      <span className="flex items-center gap-1"><RefreshCw className="w-2.5 h-2.5 animate-spin" /> Enhancing…</span>
                    ) : "✦ Enhance all bullets"}
                  </button>
                  {["Check anti-patterns", "Detect career gaps"].map((action) => (
                    <button key={action}
                      className="text-[10px] px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 rounded-lg transition-colors border border-white/5"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ExperienceEditor() {
  const { resume, addExperience } = useResumeStore();

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Work Experience</h2>
          <p className="text-sm text-slate-500">Most recent first. Use bullets to show impact, not duties.</p>
        </div>
        <button onClick={addExperience}
          className="flex items-center gap-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-xl transition-all font-medium shrink-0"
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
