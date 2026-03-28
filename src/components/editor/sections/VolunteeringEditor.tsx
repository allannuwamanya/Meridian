"use client";
import { useResumeStore } from "@/store/useResumeStore";
import { Plus, Trash2 } from "lucide-react";
import SmartField from "../SmartField";
import { motion, AnimatePresence } from "framer-motion";

export default function VolunteeringEditor() {
  const { resume, addVolunteering, updateVolunteering, removeVolunteering } = useResumeStore();

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Volunteering</h2>
          <p className="text-sm text-slate-500">Community contributions show character and transferable skills.</p>
        </div>
        <button
          onClick={addVolunteering}
          className="flex items-center gap-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-xl transition-all font-medium shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      <AnimatePresence>
        {resume.volunteering.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-3">
              <span className="text-2xl">🤝</span>
            </div>
            <p className="text-sm text-slate-500 mb-1">No volunteering added yet</p>
            <p className="text-xs text-slate-600">Community work often closes the gap for competitive roles.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence>
          {resume.volunteering.map((vol, i) => (
            <motion.div key={vol.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }} transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-4 space-y-3 border border-white/5 group"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <SmartField label="Organization" value={vol.organization}
                    onChange={(v) => updateVolunteering(vol.id, { organization: v })} placeholder="Red Cross" />
                  <SmartField label="Role" value={vol.role}
                    onChange={(v) => updateVolunteering(vol.id, { role: v })} placeholder="Volunteer Coordinator" />
                  <SmartField label="Start Date" value={vol.startDate} type="month"
                    onChange={(v) => updateVolunteering(vol.id, { startDate: v })} placeholder="2021-06" />
                  <SmartField label="End Date" value={vol.endDate} type="month"
                    onChange={(v) => updateVolunteering(vol.id, { endDate: v })} placeholder="Present" />
                </div>
                <button onClick={() => removeVolunteering(vol.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity mt-5 w-6 h-6 flex items-center justify-center hover:bg-red-500/15 rounded-lg shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-600 hover:text-red-400 transition-colors" />
                </button>
              </div>
              <SmartField label="Description" value={vol.description}
                onChange={(v) => updateVolunteering(vol.id, { description: v })}
                placeholder="Describe your contribution and impact…" multiline />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
