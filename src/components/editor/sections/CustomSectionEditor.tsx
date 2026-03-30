"use client";
import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface CustomSectionEditorProps {
  sectionId: string;
}

export function CustomSectionEditor({ sectionId }: CustomSectionEditorProps) {
  const {
    resume,
    updateCustomSection,
    removeCustomSection,
    addCustomBullet,
    updateCustomBullet,
    removeCustomBullet,
  } = useResumeStore();

  const section = resume.customSections.find((cs) => cs.id === sectionId);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!section) {
    return (
      <div className="p-6 text-center text-gray-400 text-sm">
        Section not found.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5">
      {/* Section Title */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
          Section Title
        </label>
        <input
          type="text"
          value={section.title}
          onChange={(e) => updateCustomSection(sectionId, { title: e.target.value })}
          placeholder="e.g. Volunteer Work, Research, Side Projects…"
          className="w-full text-sm font-bold text-gray-900 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100 transition-all bg-white"
        />
      </div>

      {/* Bullets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</label>
          <button
            onClick={() => addCustomBullet(sectionId)}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add item
          </button>
        </div>
        <div className="space-y-2">
          {section.bullets.map((bullet, idx) => (
            <div key={bullet.id} className="flex items-start gap-2 group">
              <div className="mt-2.5 text-gray-300 cursor-grab">
                <GripVertical className="w-3.5 h-3.5" />
              </div>
              <span className="mt-2.5 text-gray-400 text-sm">•</span>
              <textarea
                value={bullet.content}
                onChange={(e) => updateCustomBullet(sectionId, bullet.id, e.target.value)}
                placeholder={`Item ${idx + 1}…`}
                rows={2}
                className="flex-1 text-sm text-gray-900 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100 transition-all resize-none bg-white"
              />
              <button
                onClick={() => removeCustomBullet(sectionId, bullet.id)}
                className="mt-2 w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            </div>
          ))}
          {section.bullets.length === 0 && (
            <button
              onClick={() => addCustomBullet(sectionId)}
              className="w-full text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl py-4 hover:border-rose-300 hover:text-rose-500 transition-all"
            >
              + Add first item
            </button>
          )}
        </div>
      </div>

      {/* Delete Section */}
      <div className="pt-4 border-t border-gray-100">
        {confirmDelete ? (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-xs text-red-700 flex-1">Delete "{section.title}"? This cannot be undone.</p>
            <button
              onClick={() => removeCustomSection(sectionId)}
              className="text-xs font-bold text-red-600 hover:text-red-700"
            >
              Delete
            </button>
            <button onClick={() => setConfirmDelete(false)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove this section
          </button>
        )}
      </div>
    </div>
  );
}
