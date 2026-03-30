import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  ResumeData, WorkExperience, Education, Project, BulletPoint,
  Certification, VolunteerExperience, Publication, Language, Award,
  CustomSection, SectionId, TemplateId, AIStatus, AIVariant, IndustryMode,
  TailoredBullet,
} from "@/types/resume";

const DEFAULT_RESUME = (): ResumeData => ({
  id: uuidv4(),
  title: "My Resume",
  templateId: "modern-minimal",
  industryMode: "general",
  design: {
    fontFamily: "'Inter', sans-serif",
    accentColor: "#ef4444",
  },
  contact: {
    fullName: "Alex Rivera",
    email: "alex.rivera@email.com",
    phone: "+1 (555) 000-0000",
    location: "San Francisco, CA",
    website: "alexrivera.dev",
    linkedin: "linkedin.com/in/alexrivera",
    github: "github.com/alexrivera",
  },
  summary:
    "Results-driven Software Engineer with 5+ years of experience building scalable web applications. Proven track record of reducing load times by 40% and leading cross-functional teams to ship features on time. Passionate about clean architecture and mentoring junior engineers.",
  experience: [
    {
      id: uuidv4(),
      company: "Acme Corp",
      role: "Senior Software Engineer",
      startDate: "2022-01",
      endDate: "",
      isCurrent: true,
      location: "San Francisco, CA",
      employmentType: "Full-time",
      bullets: [
        { id: uuidv4(), content: "Led migration of monolithic API to microservices, reducing p99 latency by 35%." },
        { id: uuidv4(), content: "Architected real-time dashboard serving 50K concurrent users with zero downtime." },
        { id: uuidv4(), content: "Mentored 4 junior engineers, accelerating their promotion timelines by 6 months." },
      ],
      skills: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    },
    {
      id: uuidv4(),
      company: "Startup XYZ",
      role: "Software Engineer",
      startDate: "2020-03",
      endDate: "2021-12",
      isCurrent: false,
      location: "Remote",
      employmentType: "Full-time",
      bullets: [
        { id: uuidv4(), content: "Built core checkout flow processing $2M+ in monthly transactions." },
        { id: uuidv4(), content: "Reduced CI/CD pipeline run time from 18 min to 4 min via parallelization." },
      ],
      skills: ["Python", "React", "AWS"],
    },
  ],
  education: [
    {
      id: uuidv4(),
      institution: "University of California, Berkeley",
      degree: "B.S.",
      field: "Computer Science",
      startDate: "2016-09",
      endDate: "2020-05",
      gpa: "3.8",
      honors: "Magna Cum Laude",
    },
  ],
  skills: ["TypeScript", "Python", "React", "Next.js", "Node.js", "PostgreSQL", "AWS", "Docker", "GraphQL", "Redis"],
  projects: [
    {
      id: uuidv4(),
      name: "OpenBudget",
      role: "Creator & Maintainer",
      url: "github.com/alexrivera/openbudget",
      startDate: "2023-01",
      endDate: "",
      bullets: [{ id: uuidv4(), content: "Open-source budgeting tool with 2,400+ GitHub stars and 300+ monthly active users." }],
      skills: ["Next.js", "Supabase", "TypeScript"],
    },
  ],
  certifications: [
    { id: uuidv4(), name: "AWS Solutions Architect – Associate", issuer: "Amazon Web Services", date: "2023-06" },
  ],
  volunteering: [],
  publications: [],
  languages: [
    { id: uuidv4(), name: "English", proficiency: "Native" },
    { id: uuidv4(), name: "Spanish", proficiency: "Conversational" },
  ],
  awards: [],
  customSections: [],
  sectionOrder: [
    { id: "contact", label: "Contact", visible: true },
    { id: "summary", label: "Summary", visible: true },
    { id: "experience", label: "Experience", visible: true },
    { id: "education", label: "Education", visible: true },
    { id: "skills", label: "Skills", visible: true },
    { id: "projects", label: "Projects", visible: true },
    { id: "certifications", label: "Certifications", visible: true },
    { id: "volunteering", label: "Volunteering", visible: false },
    { id: "publications", label: "Publications", visible: false },
    { id: "languages", label: "Languages", visible: true },
    { id: "awards", label: "Awards", visible: false },
  ],
  targetRole: "",
  targetCompany: "",
  jobDescription: "",
});

export type ActiveSection =
  | "contact" | "summary" | "experience" | "education" | "skills"
  | "projects" | "certifications" | "volunteering" | "publications"
  | "languages" | "awards" | string;

interface AIState {
  status: AIStatus;
  feature: string | null;
  targetId: string | null;
  variants: AIVariant[];
  streamingContent: string;
}

interface ResumeStore {
  resume: ResumeData;
  savedResumes: ResumeData[];
  activeSection: ActiveSection;
  activeExperienceId: string | null;
  isDirty: boolean;
  showJobTargetModal: boolean;
  ai: AIState;

  // Multi-resume
  createResume: () => void;
  loadResume: (id: string) => void;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string) => void;
  saveCurrentResume: () => void;

  // Actions — Resume
  setResume: (data: ResumeData) => void;
  updateContact: (patch: Partial<ResumeData["contact"]>) => void;
  updateSummary: (summary: string) => void;
  updateTemplateId: (id: TemplateId) => void;
  updateDesign: (patch: Partial<ResumeData["design"]>) => void;
  updateJobTarget: (patch: { targetRole?: string; targetCompany?: string; jobDescription?: string }) => void;
  updateIndustryMode: (mode: IndustryMode) => void;
  markSaved: () => void;

  // Experience
  addExperience: () => void;
  updateExperience: (id: string, patch: Partial<WorkExperience>) => void;
  removeExperience: (id: string) => void;
  addBullet: (experienceId: string) => void;
  updateBullet: (experienceId: string, bulletId: string, content: string) => void;
  removeBullet: (experienceId: string, bulletId: string) => void;
  reorderBullets: (experienceId: string, newOrder: BulletPoint[]) => void;
  applyTailoredBullets: (rewrites: TailoredBullet[]) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, patch: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addProjectBullet: (projectId: string) => void;
  updateProjectBullet: (projectId: string, bulletId: string, content: string) => void;
  removeProjectBullet: (projectId: string, bulletId: string) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, patch: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  // Volunteering
  addVolunteering: () => void;
  updateVolunteering: (id: string, patch: Partial<VolunteerExperience>) => void;
  removeVolunteering: (id: string) => void;

  // Publications
  addPublication: () => void;
  updatePublication: (id: string, patch: Partial<Publication>) => void;
  removePublication: (id: string) => void;

  // Languages
  addLanguage: () => void;
  updateLanguage: (id: string, patch: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  // Awards
  addAward: () => void;
  updateAward: (id: string, patch: Partial<Award>) => void;
  removeAward: (id: string) => void;

  // Custom sections
  addCustomSection: (title: string) => void;
  updateCustomSection: (id: string, patch: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  addCustomBullet: (sectionId: string) => void;
  updateCustomBullet: (sectionId: string, bulletId: string, content: string) => void;
  removeCustomBullet: (sectionId: string, bulletId: string) => void;

  // UI
  setActiveSection: (section: ActiveSection) => void;
  setActiveExperience: (id: string | null) => void;
  toggleSectionVisibility: (id: SectionId) => void;
  reorderSections: (newOrder: ResumeData["sectionOrder"]) => void;
  setShowJobTargetModal: (show: boolean) => void;

  // AI
  setAIStatus: (status: AIStatus) => void;
  setAIFeature: (feature: string | null, targetId?: string | null) => void;
  appendAIStream: (token: string) => void;
  setAIVariants: (variants: AIVariant[]) => void;
  clearAI: () => void;
}

const INITIAL_RESUME = DEFAULT_RESUME();

export const useResumeStore = create<ResumeStore>()(
  persist(
    immer((set, get) => ({
      resume: INITIAL_RESUME,
      savedResumes: [INITIAL_RESUME],
      activeSection: "experience",
      activeExperienceId: INITIAL_RESUME.experience[0]?.id ?? null,
      isDirty: false,
      showJobTargetModal: false,
      ai: { status: "idle", feature: null, targetId: null, variants: [], streamingContent: "" },

      // ── Multi-resume ──────────────────────────────────────────────────────
      createResume: () =>
        set((s) => {
          const r = DEFAULT_RESUME();
          s.savedResumes.push(r);
          s.resume = r;
          s.activeSection = "experience";
          s.activeExperienceId = r.experience[0]?.id ?? null;
          s.isDirty = false;
        }),

      loadResume: (id) =>
        set((s) => {
          const found = s.savedResumes.find((r) => r.id === id);
          if (found) {
            s.resume = found;
            s.activeSection = "experience";
            s.activeExperienceId = found.experience[0]?.id ?? null;
            s.isDirty = false;
          }
        }),

      deleteResume: (id) =>
        set((s) => {
          s.savedResumes = s.savedResumes.filter((r) => r.id !== id);
          // If deleting active, switch to first remaining
          if (s.resume.id === id && s.savedResumes.length > 0) {
            s.resume = s.savedResumes[0];
          }
        }),

      duplicateResume: (id) =>
        set((s) => {
          const found = s.savedResumes.find((r) => r.id === id);
          if (found) {
            const copy: ResumeData = JSON.parse(JSON.stringify(found));
            copy.id = uuidv4();
            copy.title = `${found.title} (Copy)`;
            copy.lastSaved = undefined;
            s.savedResumes.push(copy);
          }
        }),

      saveCurrentResume: () =>
        set((s) => {
          const idx = s.savedResumes.findIndex((r) => r.id === s.resume.id);
          if (idx !== -1) {
            s.savedResumes[idx] = JSON.parse(JSON.stringify(s.resume));
          } else {
            s.savedResumes.push(JSON.parse(JSON.stringify(s.resume)));
          }
          s.isDirty = false;
          s.resume.lastSaved = new Date();
        }),

      // ── Resume ────────────────────────────────────────────────────────────
      setResume: (data) => set((s) => { s.resume = data; }),
      updateContact: (patch) => set((s) => { Object.assign(s.resume.contact, patch); s.isDirty = true; }),
      updateSummary: (summary) => set((s) => { s.resume.summary = summary; s.isDirty = true; }),
      updateTemplateId: (id) => set((s) => { s.resume.templateId = id; s.isDirty = true; }),
      updateDesign: (patch) => set((s) => { Object.assign(s.resume.design, patch); s.isDirty = true; }),
      updateJobTarget: (patch) => set((s) => { Object.assign(s.resume, patch); s.isDirty = true; }),
      updateIndustryMode: (mode) => set((s) => { s.resume.industryMode = mode; s.isDirty = true; }),
      markSaved: () => set((s) => {
        s.isDirty = false;
        s.resume.lastSaved = new Date();
        // Sync active resume into savedResumes
        const idx = s.savedResumes.findIndex((r) => r.id === s.resume.id);
        if (idx !== -1) s.savedResumes[idx] = JSON.parse(JSON.stringify(s.resume));
        else s.savedResumes.push(JSON.parse(JSON.stringify(s.resume)));
      }),

      // ── Experience ────────────────────────────────────────────────────────
      addExperience: () =>
        set((s) => {
          const newExp: WorkExperience = {
            id: uuidv4(), company: "", role: "", startDate: "", endDate: "",
            isCurrent: true, location: "", employmentType: "Full-time",
            bullets: [{ id: uuidv4(), content: "" }], skills: [],
          };
          s.resume.experience.unshift(newExp);
          s.activeExperienceId = newExp.id;
          s.isDirty = true;
        }),
      updateExperience: (id, patch) =>
        set((s) => {
          const idx = s.resume.experience.findIndex((e) => e.id === id);
          if (idx !== -1) Object.assign(s.resume.experience[idx], patch);
          s.isDirty = true;
        }),
      removeExperience: (id) =>
        set((s) => { s.resume.experience = s.resume.experience.filter((e) => e.id !== id); s.isDirty = true; }),
      addBullet: (experienceId) =>
        set((s) => {
          const exp = s.resume.experience.find((e) => e.id === experienceId);
          if (exp) exp.bullets.push({ id: uuidv4(), content: "" });
          s.isDirty = true;
        }),
      updateBullet: (experienceId, bulletId, content) =>
        set((s) => {
          const exp = s.resume.experience.find((e) => e.id === experienceId);
          if (exp) { const b = exp.bullets.find((b) => b.id === bulletId); if (b) b.content = content; }
          s.isDirty = true;
        }),
      removeBullet: (experienceId, bulletId) =>
        set((s) => {
          const exp = s.resume.experience.find((e) => e.id === experienceId);
          if (exp) exp.bullets = exp.bullets.filter((b) => b.id !== bulletId);
          s.isDirty = true;
        }),
      reorderBullets: (experienceId, newOrder) =>
        set((s) => {
          const exp = s.resume.experience.find((e) => e.id === experienceId);
          if (exp) exp.bullets = newOrder;
        }),
      applyTailoredBullets: (rewrites) =>
        set((s) => {
          rewrites.forEach(({ bulletId, expId, rewritten }) => {
            const exp = s.resume.experience.find((e) => e.id === expId);
            if (exp) {
              const b = exp.bullets.find((b) => b.id === bulletId);
              if (b) b.content = rewritten;
            }
          });
          s.isDirty = true;
        }),

      // ── Education ─────────────────────────────────────────────────────────
      addEducation: () =>
        set((s) => {
          s.resume.education.push({ id: uuidv4(), institution: "", degree: "", field: "", startDate: "", endDate: "" });
          s.isDirty = true;
        }),
      updateEducation: (id, patch) =>
        set((s) => {
          const idx = s.resume.education.findIndex((e) => e.id === id);
          if (idx !== -1) Object.assign(s.resume.education[idx], patch);
          s.isDirty = true;
        }),
      removeEducation: (id) =>
        set((s) => { s.resume.education = s.resume.education.filter((e) => e.id !== id); s.isDirty = true; }),

      // ── Skills ────────────────────────────────────────────────────────────
      addSkill: (skill) => set((s) => { if (!s.resume.skills.includes(skill)) s.resume.skills.push(skill); s.isDirty = true; }),
      removeSkill: (skill) => set((s) => { s.resume.skills = s.resume.skills.filter((sk) => sk !== skill); s.isDirty = true; }),

      // ── Projects ──────────────────────────────────────────────────────────
      addProject: () =>
        set((s) => {
          s.resume.projects.push({ id: uuidv4(), name: "", role: "", startDate: "", endDate: "", bullets: [{ id: uuidv4(), content: "" }], skills: [] });
          s.isDirty = true;
        }),
      updateProject: (id, patch) =>
        set((s) => {
          const idx = s.resume.projects.findIndex((p) => p.id === id);
          if (idx !== -1) Object.assign(s.resume.projects[idx], patch);
          s.isDirty = true;
        }),
      removeProject: (id) => set((s) => { s.resume.projects = s.resume.projects.filter((p) => p.id !== id); s.isDirty = true; }),
      addProjectBullet: (projectId) =>
        set((s) => {
          const proj = s.resume.projects.find((p) => p.id === projectId);
          if (proj) proj.bullets.push({ id: uuidv4(), content: "" });
          s.isDirty = true;
        }),
      updateProjectBullet: (projectId, bulletId, content) =>
        set((s) => {
          const proj = s.resume.projects.find((p) => p.id === projectId);
          if (proj) { const b = proj.bullets.find((b) => b.id === bulletId); if (b) b.content = content; }
          s.isDirty = true;
        }),
      removeProjectBullet: (projectId, bulletId) =>
        set((s) => {
          const proj = s.resume.projects.find((p) => p.id === projectId);
          if (proj) proj.bullets = proj.bullets.filter((b) => b.id !== bulletId);
          s.isDirty = true;
        }),

      // ── Certifications ────────────────────────────────────────────────────
      addCertification: () =>
        set((s) => { s.resume.certifications.push({ id: uuidv4(), name: "", issuer: "", date: "" }); s.isDirty = true; }),
      updateCertification: (id, patch) =>
        set((s) => {
          const idx = s.resume.certifications.findIndex((c) => c.id === id);
          if (idx !== -1) Object.assign(s.resume.certifications[idx], patch);
          s.isDirty = true;
        }),
      removeCertification: (id) =>
        set((s) => { s.resume.certifications = s.resume.certifications.filter((c) => c.id !== id); s.isDirty = true; }),

      // ── Volunteering ──────────────────────────────────────────────────────
      addVolunteering: () =>
        set((s) => { s.resume.volunteering.push({ id: uuidv4(), organization: "", role: "", startDate: "", endDate: "", description: "" }); s.isDirty = true; }),
      updateVolunteering: (id, patch) =>
        set((s) => {
          const idx = s.resume.volunteering.findIndex((v) => v.id === id);
          if (idx !== -1) Object.assign(s.resume.volunteering[idx], patch);
          s.isDirty = true;
        }),
      removeVolunteering: (id) =>
        set((s) => { s.resume.volunteering = s.resume.volunteering.filter((v) => v.id !== id); s.isDirty = true; }),

      // ── Publications ──────────────────────────────────────────────────────
      addPublication: () =>
        set((s) => { s.resume.publications.push({ id: uuidv4(), title: "", publisher: "", date: "" }); s.isDirty = true; }),
      updatePublication: (id, patch) =>
        set((s) => {
          const idx = s.resume.publications.findIndex((p) => p.id === id);
          if (idx !== -1) Object.assign(s.resume.publications[idx], patch);
          s.isDirty = true;
        }),
      removePublication: (id) =>
        set((s) => { s.resume.publications = s.resume.publications.filter((p) => p.id !== id); s.isDirty = true; }),

      // ── Languages ─────────────────────────────────────────────────────────
      addLanguage: () =>
        set((s) => { s.resume.languages.push({ id: uuidv4(), name: "", proficiency: "Conversational" }); s.isDirty = true; }),
      updateLanguage: (id, patch) =>
        set((s) => {
          const idx = s.resume.languages.findIndex((l) => l.id === id);
          if (idx !== -1) Object.assign(s.resume.languages[idx], patch);
          s.isDirty = true;
        }),
      removeLanguage: (id) =>
        set((s) => { s.resume.languages = s.resume.languages.filter((l) => l.id !== id); s.isDirty = true; }),

      // ── Awards ────────────────────────────────────────────────────────────
      addAward: () =>
        set((s) => { s.resume.awards.push({ id: uuidv4(), title: "", issuer: "", date: "" }); s.isDirty = true; }),
      updateAward: (id, patch) =>
        set((s) => {
          const idx = s.resume.awards.findIndex((a) => a.id === id);
          if (idx !== -1) Object.assign(s.resume.awards[idx], patch);
          s.isDirty = true;
        }),
      removeAward: (id) =>
        set((s) => { s.resume.awards = s.resume.awards.filter((a) => a.id !== id); s.isDirty = true; }),

      // ── Custom Sections ───────────────────────────────────────────────────
      addCustomSection: (title) =>
        set((s) => {
          const id = uuidv4();
          s.resume.customSections.push({ id, title, bullets: [{ id: uuidv4(), content: "" }] });
          s.resume.sectionOrder.push({ id, label: title, visible: true, isCustom: true });
          s.activeSection = id;
          s.isDirty = true;
        }),
      updateCustomSection: (id, patch) =>
        set((s) => {
          const idx = s.resume.customSections.findIndex((cs) => cs.id === id);
          if (idx !== -1) Object.assign(s.resume.customSections[idx], patch);
          // Also update sectionOrder label
          if (patch.title) {
            const sec = s.resume.sectionOrder.find((so) => so.id === id);
            if (sec) sec.label = patch.title;
          }
          s.isDirty = true;
        }),
      removeCustomSection: (id) =>
        set((s) => {
          s.resume.customSections = s.resume.customSections.filter((cs) => cs.id !== id);
          s.resume.sectionOrder = s.resume.sectionOrder.filter((so) => so.id !== id);
          if (s.activeSection === id) s.activeSection = "experience";
          s.isDirty = true;
        }),
      addCustomBullet: (sectionId) =>
        set((s) => {
          const cs = s.resume.customSections.find((c) => c.id === sectionId);
          if (cs) cs.bullets.push({ id: uuidv4(), content: "" });
          s.isDirty = true;
        }),
      updateCustomBullet: (sectionId, bulletId, content) =>
        set((s) => {
          const cs = s.resume.customSections.find((c) => c.id === sectionId);
          if (cs) { const b = cs.bullets.find((b) => b.id === bulletId); if (b) b.content = content; }
          s.isDirty = true;
        }),
      removeCustomBullet: (sectionId, bulletId) =>
        set((s) => {
          const cs = s.resume.customSections.find((c) => c.id === sectionId);
          if (cs) cs.bullets = cs.bullets.filter((b) => b.id !== bulletId);
          s.isDirty = true;
        }),

      // ── UI ────────────────────────────────────────────────────────────────
      setActiveSection: (section) => set((s) => { s.activeSection = section; }),
      setActiveExperience: (id) => set((s) => { s.activeExperienceId = id; }),
      toggleSectionVisibility: (id) =>
        set((s) => {
          const sec = s.resume.sectionOrder.find((sec) => sec.id === id);
          if (sec) sec.visible = !sec.visible;
        }),
      reorderSections: (newOrder) => set((s) => { s.resume.sectionOrder = newOrder; s.isDirty = true; }),
      setShowJobTargetModal: (show) => set((s) => { s.showJobTargetModal = show; }),

      // ── AI ────────────────────────────────────────────────────────────────
      setAIStatus: (status) => set((s) => { s.ai.status = status; }),
      setAIFeature: (feature, targetId = null) => set((s) => { s.ai.feature = feature; s.ai.targetId = targetId; s.ai.streamingContent = ""; }),
      appendAIStream: (token) => set((s) => { s.ai.streamingContent += token; }),
      setAIVariants: (variants) => set((s) => { s.ai.variants = variants; }),
      clearAI: () => set((s) => { s.ai = { status: "idle", feature: null, targetId: null, variants: [], streamingContent: "" }; }),
    })),
    {
      name: "meridian-resume-v1",
      partialize: (state) => ({ resume: state.resume, savedResumes: state.savedResumes }),
    }
  )
);
