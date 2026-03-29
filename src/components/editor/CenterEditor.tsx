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
import ToastContainer from "@/components/ui/Toast";
import ATSHealthBar from "./ATSHealthBar";

const SECTION_MAP: Record<string, React.ComponentType> = {
  contact:        ContactEditor,
  summary:        SummaryEditor,
  experience:     ExperienceEditor,
  education:      EducationEditor,
  skills:         SkillsEditor,
  projects:       ProjectsEditor,
  certifications: CertificationsEditor,
  languages:      LanguagesEditor,
  volunteering:   VolunteeringEditor,
  publications:   PublicationsEditor,
  awards:         AwardsEditor,
};

export default function CenterEditor() {
  const { activeSection } = useResumeStore();
  const Editor = SECTION_MAP[activeSection];

  return (
    <div className="flex flex-col h-full relative">
      <ToastContainer />
      {/* Scrollable section area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="p-8 max-w-2xl mx-auto w-full"
          >
            {Editor ? (
              <div className="space-y-8 pb-4">
                <Editor />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
                  <span className="text-2xl">✦</span>
                </div>
                <p className="text-sm text-gray-500">This section editor is coming soon.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* ATS Health Bar — sticky footer, always visible */}
      <div className="flex-shrink-0">
        <ATSHealthBar />
      </div>
    </div>
  );
}
