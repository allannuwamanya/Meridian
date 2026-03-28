"use client";
import { useResumeStore } from "@/store/useResumeStore";
import { Plus, Trash2 } from "lucide-react";

const PROFICIENCY_LEVELS = ["Native", "Fluent", "Professional", "Conversational", "Basic"] as const;

export default function LanguagesEditor() {
  const { resume, addLanguage, updateLanguage, removeLanguage } = useResumeStore();
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Languages</h2>
          <p className="text-sm text-slate-500">Be honest about proficiency — it will be verified.</p>
        </div>
        <button onClick={addLanguage} className="flex items-center gap-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-xl transition-all font-medium">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {resume.languages.map((lang) => (
          <div key={lang.id} className="glass rounded-2xl px-4 py-3 flex items-center gap-3 border border-white/5 group">
            <input
              value={lang.name}
              onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
              placeholder="e.g. Spanish"
              className="flex-1 text-sm bg-transparent outline-none text-slate-200 placeholder:text-slate-600 min-w-0"
            />
            <select
              value={lang.proficiency}
              onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value as any })}
              className="text-xs text-slate-400 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 outline-none focus:border-violet-500/40 transition-colors"
            >
              {PROFICIENCY_LEVELS.map((p) => <option key={p} className="bg-[#18181f]">{p}</option>)}
            </select>
            <button onClick={() => removeLanguage(lang.id)} className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center hover:bg-red-500/15 rounded-lg">
              <Trash2 className="w-3.5 h-3.5 text-slate-600 hover:text-red-400 transition-colors" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
