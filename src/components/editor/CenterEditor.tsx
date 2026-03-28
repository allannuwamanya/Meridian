"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useResumeStore } from "@/store/useResumeStore";
import ContactEditor from "./sections/ContactEditor";
import SummaryEditor from "./sections/SummaryEditor";
import ExperienceEditor from "./sections/ExperienceEditor";
import EducationEditor from "./sections/EducationEditor";
import SkillsEditor from "./sections/SkillsEditor";
import ProjectsEditor from "./sections/ProjectsEditor";
import CertificationsEditor from "./sections/CertificationsEditor";
import LanguagesEditor from "./sections/LanguagesEditor";
import VolunteeringEditor from "./sections/VolunteeringEditor";
import PublicationsEditor from "./sections/PublicationsEditor";
import AwardsEditor from "./sections/AwardsEditor";
import ScoreCard from "@/components/ui/ScoreCard";

const SECTION_MAP: Record<string, React.ComponentType> = {
  contact: ContactEditor,
  summary: SummaryEditor,
  experience: ExperienceEditor,
  education: EducationEditor,
  skills: SkillsEditor,
  projects: ProjectsEditor,
  certifications: CertificationsEditor,
  languages: LanguagesEditor,
  volunteering: VolunteeringEditor,
  publications: PublicationsEditor,
  awards: AwardsEditor,
};

export default function CenterEditor() {
  const { activeSection } = useResumeStore();
  const Editor = SECTION_MAP[activeSection];

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="flex-1 p-8 max-w-2xl mx-auto w-full"
        >
          {Editor ? (
            <div className="space-y-8">
              <Editor />
              {/* Inline ScoreCard at the bottom of every section */}
              <div className="pt-4 border-t border-white/5">
                <ScoreCard />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-600">
              <div className="text-4xl mb-3">✦</div>
              <p className="text-sm">This section editor is coming soon.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
