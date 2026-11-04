// CV কতটা তৈরি: ছোট চেকলিস্ট, প্রতিটা কোন সেকশনে
import type { CV } from "./types";
import { commaList } from "./utils";

export type ProgressKey = "basics" | "contact" | "links" | "summary" | "skills" | "work" | "projects" | "education";
export type SectionId = "personal" | "summary" | "skills" | "experience" | "projects" | "education";

export const SECTION_OF: Record<ProgressKey, SectionId> = {
  basics: "personal", contact: "personal", links: "personal", summary: "summary",
  skills: "skills", work: "experience", projects: "projects", education: "education",
};

const CHECKS: Record<ProgressKey, (cv: CV) => boolean> = {
  basics: (cv) => !!cv.personal.fullName.trim() && !!cv.personal.title.trim(),
  contact: (cv) => !!cv.personal.email.trim() && !!cv.personal.phone.trim(),
  links: (cv) => !!cv.personal.github.trim() || !!cv.personal.linkedin.trim(),
  summary: (cv) => cv.summary.trim().length >= 60,
  skills: (cv) => cv.skills.filter((s) => commaList(s.items).length > 0).length >= 2,
  work: (cv) => cv.experience.some((e) => e.role || e.company) || cv.projects.filter((p) => p.name).length >= 2,
  projects: (cv) => cv.projects.some((p) => p.name),
  education: (cv) => cv.education.some((e) => e.degree || e.institution),
};

export function cvProgress(cv: CV) {
  const keys = Object.keys(CHECKS) as ProgressKey[];
  const done = keys.filter((k) => CHECKS[k](cv));
  const missing = keys.filter((k) => !CHECKS[k](cv));
  const sectionDone = (s: SectionId) => keys.filter((k) => SECTION_OF[k] === s).every((k) => CHECKS[k](cv));
  return { done, missing, percent: Math.round((done.length / keys.length) * 100), sectionDone };
}

// নির্দিষ্ট সেকশন খুলে সেখানে স্ক্রল করা
export const openSection = (id: SectionId) => window.dispatchEvent(new CustomEvent("cv:open-section", { detail: id }));
