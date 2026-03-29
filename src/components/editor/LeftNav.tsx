"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, AlignLeft, Briefcase, GraduationCap, Layers, FolderOpen,
  Award, Heart, BookOpen, Globe, Trophy, Plus, Eye, EyeOff, GripVertical,
} from "lucide-react";
import { useResumeStore, ActiveSection } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { SectionId, ResumeData } from "@/types/resume";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useMemo } from "react";

const SECTION_ICONS: Record<string, React.ComponentType<any>> = {
  contact: User, summary: AlignLeft, experience: Briefcase,
  education: GraduationCap, skills: Layers, projects: FolderOpen,
  certifications: Award, volunteering: Heart,
  publications: BookOpen, languages: Globe, awards: Trophy,
};

// ─── Completeness scoring — zero API ──────────────────────────────────────────
function getSectionScore(sectionId: string, resume: ResumeData): "full" | "partial" | "empty" {
  switch (sectionId) {
    case "contact": {
      const c = resume.contact;
      const filled = [c.fullName, c.email, c.phone, c.location].filter(Boolean).length;
      return filled === 4 ? "full" : filled > 0 ? "partial" : "empty";
    }
    case "summary":
      return resume.summary.length >= 100 ? "full" : resume.summary.length > 10 ? "partial" : "empty";
    case "experience": {
      const hasRole = resume.experience.some((e) => e.role && e.company);
      const hasBullets = resume.experience.some((e) => e.bullets.some((b) => b.content.trim()));
      return hasRole && hasBullets ? "full" : hasRole ? "partial" : "empty";
    }
    case "education":
      return resume.education.some((e) => e.institution && e.degree) ? "full"
        : resume.education.length > 0 ? "partial" : "empty";
    case "skills":
      return resume.skills.length >= 8 ? "full" : resume.skills.length > 0 ? "partial" : "empty";
    case "projects":
      return resume.projects.some((p) => p.name && p.bullets.some((b) => b.content)) ? "full"
        : resume.projects.length > 0 ? "partial" : "empty";
    case "certifications":
      return resume.certifications.some((c) => c.name) ? "full" : "empty";
    case "volunteering":
      return resume.volunteering.some((v) => v.organization) ? "full" : "empty";
    case "publications":
      return resume.publications.some((p) => p.title) ? "full" : "empty";
    case "languages":
      return resume.languages.some((l) => l.name) ? "full" : "empty";
    case "awards":
      return resume.awards.some((a) => a.title) ? "full" : "empty";
    default:
      return "empty";
  }
}

const SCORE_DOT: Record<string, string> = {
  full: "bg-emerald-400",
  partial: "bg-amber-400",
  empty: "bg-gray-200",
};

// ─── Sortable item ────────────────────────────────────────────────────────────
function SortableSectionItem({ section, isActive, score }: {
  section: ResumeData["sectionOrder"][number];
  isActive: boolean;
  score: "full" | "partial" | "empty";
}) {
  const { setActiveSection, toggleSectionVisibility } = useResumeStore();
  const Icon = SECTION_ICONS[section.id] ?? Layers;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <button
        onClick={() => setActiveSection(section.id as ActiveSection)}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left transition-all duration-150",
          isActive
            ? "bg-rose-50 text-rose-700 border border-rose-200"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-transparent",
          !section.visible && "opacity-40",
        )}
      >
        {/* Drag handle */}
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-60 transition-opacity touch-none flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3 h-3 text-gray-400" />
        </span>

        <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-rose-600" : "text-gray-400")} />
        <span className="flex-1 truncate text-xs font-medium">{section.label}</span>

        {/* Completeness dot */}
        <div
          className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors", SCORE_DOT[score])}
          title={score === "full" ? "Complete" : score === "partial" ? "Partially filled" : "Empty"}
        />

        {/* Visibility toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(section.id as SectionId); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-0.5 rounded"
          title={section.visible ? "Hide section" : "Show section"}
        >
          {section.visible
            ? <Eye className="w-3 h-3 text-gray-400 hover:text-gray-600" />
            : <EyeOff className="w-3 h-3 text-gray-300 hover:text-gray-500" />}
        </button>
      </button>

      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-rose-500 rounded-full"
        />
      )}
    </div>
  );
}

// ─── Main LeftNav ─────────────────────────────────────────────────────────────
export default function LeftNav() {
  const { resume, activeSection, reorderSections } = useResumeStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = resume.sectionOrder.findIndex((s) => s.id === active.id);
    const newIdx = resume.sectionOrder.findIndex((s) => s.id === over.id);
    reorderSections(arrayMove(resume.sectionOrder, oldIdx, newIdx));
  };

  // Legend counts
  const scores = useMemo(() =>
    Object.fromEntries(resume.sectionOrder.map((s) => [s.id, getSectionScore(s.id, resume)])),
    [resume]
  );
  const fullCount = Object.values(scores).filter((s) => s === "full").length;
  const totalCount = resume.sectionOrder.length;

  return (
    <div className="flex flex-col h-full py-4 bg-white">
      {/* Header */}
      <div className="px-4 mb-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sections</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[9px] text-gray-400">Drag to reorder · eye to toggle</p>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-[10px] font-semibold text-gray-500">{fullCount}/{totalCount}</span>
            <span className="text-[9px] text-gray-400">complete</span>
          </div>
        </div>
        {/* Mini progress bar */}
        <div className="mt-1.5 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(fullCount / totalCount) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Section list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={resume.sectionOrder.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {resume.sectionOrder.map((section) => (
              <SortableSectionItem
                key={section.id}
                section={section}
                isActive={activeSection === section.id}
                score={scores[section.id] ?? "empty"}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Legend */}
      <div className="px-4 pt-2 pb-1 flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Complete
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Partial
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200" /> Empty
        </div>
      </div>

      {/* Add custom section */}
      <div className="px-3 pt-2 border-t border-gray-100">
        <button className="w-full flex items-center gap-2 text-xs text-gray-500 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 transition-all border border-dashed border-gray-200 hover:border-rose-300">
          <Plus className="w-3.5 h-3.5" />
          Add custom section
        </button>
      </div>

      {/* Role category selector */}
      <div className="px-3 pt-3">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 px-1 font-semibold">Role Category</p>
        <select className="w-full text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/10 transition-colors">
          {["Software Engineer", "Designer", "Marketer", "Executive", "Recent Graduate", "Career Changer", "Academic"].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
