"use client";
import { useResumeStore } from "@/store/useResumeStore";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import SmartField from "../SmartField";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicationsEditor() {
  const { resume, addPublication, updatePublication, removePublication } = useResumeStore();

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Publications</h2>
          <p className="text-sm text-gray-500">Papers, articles, blogs — published work signals deep expertise.</p>
        </div>
        <button onClick={addPublication}
          className="flex items-center gap-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-gray-900 px-3 py-1.5 rounded-xl transition-all font-medium shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      <AnimatePresence>
        {resume.publications.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center mb-3">
              <span className="text-2xl">📄</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">No publications yet</p>
            <p className="text-xs text-gray-400">Published work is a strong credibility signal for senior roles.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence>
          {resume.publications.map((pub, i) => (
            <motion.div key={pub.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }} transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-4 space-y-3 border border-gray-200 group"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 space-y-3">
                  <SmartField label="Title" value={pub.title}
                    onChange={(v) => updatePublication(pub.id, { title: v })}
                    placeholder="Deep Learning for Time Series Forecasting" />
                  <div className="grid grid-cols-2 gap-3">
                    <SmartField label="Publisher / Journal" value={pub.publisher}
                      onChange={(v) => updatePublication(pub.id, { publisher: v })} placeholder="Nature, IEEE, Medium…" />
                    <SmartField label="Date" value={pub.date} type="month"
                      onChange={(v) => updatePublication(pub.id, { date: v })} placeholder="2023-09" />
                  </div>
                  <SmartField label="URL (optional)" value={pub.url ?? ""}
                    onChange={(v) => updatePublication(pub.id, { url: v })}
                    placeholder="https://doi.org/…" icon={<ExternalLink className="w-4 h-4" />} />
                  <SmartField label="Description (optional)" value={pub.description ?? ""}
                    onChange={(v) => updatePublication(pub.id, { description: v })}
                    placeholder="Brief abstract or key finding…" multiline />
                </div>
                <button onClick={() => removePublication(pub.id)}
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
