"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, AlignLeft, Briefcase, GraduationCap, Layers, FolderOpen,
  Award, Heart, BookOpen, Globe, Trophy, Plus, Eye, EyeOff, GripVertical,
} from "lucide-react";
import { useResumeStore, ActiveSection } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { SectionId } from "@/types/resume";
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
import { ResumeData } from "@/types/resume";

const SECTION_ICONS: Record<string, React.ComponentType<any>> = {
  contact: User, summary: AlignLeft, experience: Briefcase,
  education: GraduationCap, skills: Layers, projects: FolderOpen,
  certifications: Award, volunteering: Heart,
  publications: BookOpen, languages: Globe, awards: Trophy,
};

function SortableSectionItem({ section, isActive }: {
  section: ResumeData["sectionOrder"][number];
  isActive: boolean;
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

        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />}

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

  return (
    <div className="flex flex-col h-full py-4 bg-white">

      {/* Header */}
      <div className="px-4 mb-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sections</p>
        <p className="text-[9px] text-gray-400 mt-0.5">Drag to reorder · eye to toggle</p>
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
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add custom section */}
      <div className="px-3 pt-3 border-t border-gray-100">
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
