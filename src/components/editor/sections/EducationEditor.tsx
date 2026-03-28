"use client";
import { useResumeStore } from "@/store/useResumeStore";
import { Plus, Trash2 } from "lucide-react";
import SmartField from "../SmartField";

export default function EducationEditor() {
  const { resume, addEducation, updateEducation, removeEducation } = useResumeStore();
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Education</h2>
          <p className="text-sm text-slate-500">Include GPA only if 3.5+. Include honors if relevant.</p>
        </div>
        <button onClick={addEducation} className="flex items-center gap-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-xl transition-all font-medium">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      <div className="space-y-3">
        {resume.education.map((edu) => (
          <div key={edu.id} className="glass rounded-2xl p-4 space-y-3 border border-white/5 group">
            <div className="flex justify-between items-start">
              <SmartField label="Institution" value={edu.institution} onChange={(v) => updateEducation(edu.id, { institution: v })} placeholder="UC Berkeley" />
              <button onClick={() => removeEducation(edu.id)} className="opacity-0 group-hover:opacity-100 transition-opacity mt-5 w-6 h-6 flex items-center justify-center hover:bg-red-500/15 rounded-lg">
                <Trash2 className="w-3.5 h-3.5 text-slate-600 hover:text-red-400 transition-colors" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SmartField label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, { degree: v })} placeholder="B.S." />
              <SmartField label="Field of Study" value={edu.field} onChange={(v) => updateEducation(edu.id, { field: v })} placeholder="Computer Science" />
              <SmartField label="Start Date" value={edu.startDate} onChange={(v) => updateEducation(edu.id, { startDate: v })} placeholder="2016-09" type="month" />
              <SmartField label="End Date" value={edu.endDate} onChange={(v) => updateEducation(edu.id, { endDate: v })} placeholder="2020-05" type="month" />
              <SmartField label="GPA (optional)" value={edu.gpa ?? ""} onChange={(v) => updateEducation(edu.id, { gpa: v })} placeholder="3.8" />
              <SmartField label="Honors (optional)" value={edu.honors ?? ""} onChange={(v) => updateEducation(edu.id, { honors: v })} placeholder="Magna Cum Laude" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
