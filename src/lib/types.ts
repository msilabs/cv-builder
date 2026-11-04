export interface Personal {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
  photo: string; // data URL (ঐচ্ছিক)
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string; // YYYY-MM
  end: string;
  current: boolean;
  bullets: string; // প্রতি লাইনে একটি পয়েন্ট
}

export interface Project {
  id: string;
  name: string;
  tech: string;
  link: string;
  repo: string;
  bullets: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  result: string;
  start: string;
  end: string;
}

export interface SkillGroup {
  id: string;
  name: string;
  items: string; // কমা দিয়ে আলাদা
}

export interface SimpleItem {
  id: string;
  text: string;
}

export interface CV {
  personal: Personal;
  summary: string;
  skills: SkillGroup[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  achievements: SimpleItem[];
  certifications: SimpleItem[];
  languages: string;
}

export type SectionKey = "summary" | "skills" | "experience" | "projects" | "education" | "achievements" | "certifications" | "languages";

export type TemplateId = "classic" | "modern" | "minimal";

export interface Settings {
  template: TemplateId;
  accent: string;
  showPhoto: boolean;
  hidden: SectionKey[]; // CV থেকে লুকানো সেকশন
}

export interface TemplateProps {
  cv: CV;
  settings: Settings;
}
