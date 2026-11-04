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
  tagline: string; // এক লাইনের পরিচিতি (README/পোর্টফোলিও)
  twitter: string;
  blog: string;
  codeforces: string; // username
  leetcode: string; // username
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
  featured: boolean; // README/পোর্টফোলিওতে আগে দেখাবে
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
  openToWork: boolean;
}

export type SectionKey = "summary" | "skills" | "experience" | "projects" | "education" | "achievements" | "certifications" | "languages";

export type TemplateId = "classic" | "modern" | "minimal" | "compact" | "timeline" | "elegant";

export type ReadmeStyle = "classic" | "centered" | "code" | "minimal";
export type PortfolioTheme = "clean" | "midnight" | "bento";

export interface ReadmeSettings {
  style: ReadmeStyle;
  showStats: boolean; // github-readme-stats কার্ড (বাইরের সার্ভিস)
  hidden: SectionKey[];
}

export interface PortfolioSettings {
  theme: PortfolioTheme;
  accent: string;
  showEmail: boolean;
  showPhone: boolean; // পাবলিক সাইট, তাই ডিফল্ট বন্ধ
  showLocation: boolean;
  showPhoto: boolean;
  hidden: SectionKey[];
}

export interface Settings {
  template: TemplateId;
  accent: string;
  showPhoto: boolean;
  hidden: SectionKey[]; // CV থেকে লুকানো সেকশন
  readme: ReadmeSettings;
  portfolio: PortfolioSettings;
}

export interface TemplateProps {
  cv: CV;
  settings: Settings;
}
