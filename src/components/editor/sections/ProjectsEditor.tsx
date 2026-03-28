"use client";
import { useResumeStore } from "@/store/useResumeStore";
import { Plus, Trash2, Wand2, ExternalLink } from "lucide-react";
import SmartField from "../SmartField";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef } from "react";

function ProjectBulletEditor({
  bullet,
  projId,
  onRemove,
}: {
  bullet: { id: string; content: string };
  projId: string;
  onRemove: () => void;
}) {
  const { updateProjectBullet } = useResumeStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateProjectBullet(projId, bullet.id, e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="group flex items-start gap-2">
      <div className="flex-1 relative">
        <div className="absolute left-3 top-2.5 text-slate-600 text-sm select-none">•</div>
        <textarea
          ref={textareaRef}
          value={bullet.content}
          onChange={handleChange}
          rows={1}
          placeholder="Describe a feature, impact, or technical accomplishment…"
          className="w-full resize-none bg-white/4 border border-white/5 rounded-xl pl-7 pr-10 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/40 transition-colors leading-relaxed overflow-hidden"
          style={{ minHeight: "42px" }}
        />
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

export default function ProjectsEditor() {
  const {
    resume, addProject, updateProject, removeProject,
    addProjectBullet, removeProjectBullet,
  } = useResumeStore();

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Projects</h2>
          <p className="text-sm text-slate-500">Side projects, open source, and personal work. Show range and depth.</p>
        </div>
        <button onClick={addProject}
          className="flex items-center gap-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-xl transition-all font-medium shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add Project
        </button>
      </div>

      <AnimatePresence>
        {resume.projects.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-3">
              <span className="text-2xl">🚀</span>
            </div>
            <p className="text-sm text-slate-500 mb-1">No projects yet</p>
            <p className="text-xs text-slate-600">Projects prove you can build independently. Always include them.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <AnimatePresence>
          {resume.projects.map((proj, i) => (
            <motion.div key={proj.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }} transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl border border-white/5 overflow-hidden group"
            >
              {/* Header row */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <SmartField label="Project Name" value={proj.name}
                      onChange={(v) => updateProject(proj.id, { name: v })} placeholder="OpenBudget" />
                    <SmartField label="Your Role" value={proj.role}
                      onChange={(v) => updateProject(proj.id, { role: v })} placeholder="Creator & Lead Dev" />
                    <SmartField label="URL (optional)" value={proj.url ?? ""}
                      onChange={(v) => updateProject(proj.id, { url: v })}
                      placeholder="github.com/…" icon={<ExternalLink className="w-4 h-4" />} />
                    <SmartField label="Start Date" value={proj.startDate} type="month"
                      onChange={(v) => updateProject(proj.id, { startDate: v })} placeholder="2023-01" />
                  </div>
                  <button onClick={() => removeProject(proj.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity mt-5 w-6 h-6 flex items-center justify-center hover:bg-red-500/15 rounded-lg shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-600 hover:text-red-400 transition-colors" />
                  </button>
                </div>

                {/* Bullets */}
                <div className="pt-1 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Highlights</p>
                    <button onClick={() => addProjectBullet(proj.id)}
                      className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 px-2.5 py-1 rounded-lg transition-all"
                    >
                      <Plus className="w-3 h-3" /> Add bullet
                    </button>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {proj.bullets.map((bullet) => (
                        <motion.div key={bullet.id}
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        >
                          <ProjectBulletEditor bullet={bullet} projId={proj.id}
                            onRemove={() => removeProjectBullet(proj.id, bullet.id)} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {proj.bullets.length === 0 && (
                      <p className="text-xs text-slate-600 italic pl-2">Click "Add bullet" to describe impact…</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
