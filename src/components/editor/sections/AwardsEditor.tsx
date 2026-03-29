"use client";
import { useResumeStore } from "@/store/useResumeStore";
import { Plus, Trash2 } from "lucide-react";
import SmartField from "../SmartField";
import { motion, AnimatePresence } from "framer-motion";

export default function AwardsEditor() {
  const { resume, addAward, updateAward, removeAward } = useResumeStore();

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Awards & Honors</h2>
          <p className="text-sm text-gray-500">Recognition that separates you from equally qualified candidates.</p>
        </div>
        <button onClick={addAward}
          className="flex items-center gap-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-gray-900 px-3 py-1.5 rounded-xl transition-all font-medium shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      <AnimatePresence>
        {resume.awards.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center mb-3">
              <span className="text-2xl">🏆</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">No awards added yet</p>
            <p className="text-xs text-gray-400">Include hackathon wins, academic honors, or industry recognition.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence>
          {resume.awards.map((award, i) => (
            <motion.div key={award.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }} transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-4 space-y-3 border border-gray-200 group"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <SmartField label="Award Title" value={award.title}
                    onChange={(v) => updateAward(award.id, { title: v })}
                    placeholder="Employee of the Year" />
                  <SmartField label="Issued By" value={award.issuer}
                    onChange={(v) => updateAward(award.id, { issuer: v })}
                    placeholder="Google, MIT, Forbes…" />
                  <SmartField label="Date" value={award.date} type="month"
                    onChange={(v) => updateAward(award.id, { date: v })} placeholder="2023-11" />
                  <SmartField label="Description (optional)" value={award.description ?? ""}
                    onChange={(v) => updateAward(award.id, { description: v })}
                    placeholder="Brief context…" />
                </div>
                <button onClick={() => removeAward(award.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity mt-5 w-6 h-6 flex items-center justify-center hover:bg-red-500/15 rounded-lg shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-600 transition-colors" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
