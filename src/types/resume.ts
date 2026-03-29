export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Freelance" | "Internship";
export type TemplateId =
  | "modern-minimal"
  | "classic"
  | "executive"
  | "technical"
  | "compact"
  | "bold"
  | "sidebar"
  | "creative"
  | "academic"
  | "career-changer"
  | "international";

export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface BulletPoint {
  id: string;
  content: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
  employmentType: EmploymentType;
  bullets: BulletPoint[];
  skills: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  url?: string;
  startDate: string;
  endDate: string;
  bullets: BulletPoint[];
  skills: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  description?: string;
}

export interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "Native" | "Fluent" | "Professional" | "Conversational" | "Basic";
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  bullets: BulletPoint[];
}

export type SectionId =
  | "contact"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "volunteering"
  | "publications"
  | "languages"
  | "awards"
  | string;

export interface ResumeSection {
  id: SectionId;
  label: string;
  visible: boolean;
  isCustom?: boolean;
}

export interface ResumeData {
  id: string;
  title: string;
  templateId: TemplateId;
  contact: ContactInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  volunteering: VolunteerExperience[];
  publications: Publication[];
  languages: Language[];
  awards: Award[];
  customSections: CustomSection[];
  sectionOrder: ResumeSection[];
  lastSaved?: Date;
  targetRole?: string;
  targetCompany?: string;
  jobDescription?: string;
}

export interface AIVariant {
  id: string;
  label: string;
  content: string;
}

export type AIStatus = "idle" | "streaming" | "done" | "error";
