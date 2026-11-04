// বাইরে থেকে আসা (JSON ফাইল, পুরোনো ভার্সন, AI-এর উত্তর) ডেটাকে নিরাপদ CV আকারে আনে
import type { CV, Settings } from "./types";
import { defaultSettings, emptyCV } from "./sample";
import { uid } from "./utils";

type Any = Record<string, unknown>;

const str = (v: unknown): string => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
};
// AI প্রায়ই bullets/items অ্যারে হিসেবে দেয়, আমরা দুটোই মানি
const lineText = (v: unknown): string => (Array.isArray(v) ? v.map(str).filter(Boolean).join("\n") : str(v));
const commaText = (v: unknown): string => (Array.isArray(v) ? v.map(str).filter(Boolean).join(", ") : str(v));
const arr = (v: unknown): Any[] => (Array.isArray(v) ? (v.filter((x) => x && typeof x === "object") as Any[]) : []);
const bool = (v: unknown) => v === true || v === "true";

// "2023-3", "2023/03", "March 2023", "2023" → "2023-03" / "2023"
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
export function normMonth(v: unknown): string {
  const s = str(v).trim();
  if (!s) return "";
  let m = s.match(/^(\d{4})[-/.](\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}`;
  m = s.match(/^([A-Za-z]{3})[a-z]*\.?\s+(\d{4})$/);
  if (m) {
    const i = MONTHS.indexOf(m[1].toLowerCase());
    if (i >= 0) return `${m[2]}-${String(i + 1).padStart(2, "0")}`;
  }
  m = s.match(/^(\d{4})$/);
  if (m) return m[1];
  return "";
}

const simpleList = (v: unknown) =>
  (Array.isArray(v) ? v : [])
    .map((x) => (typeof x === "string" ? x : str((x as Any)?.text)))
    .filter(Boolean)
    .map((text) => ({ id: uid(), text }));

export function normalizeCV(raw: unknown): CV {
  const r = (raw && typeof raw === "object" ? raw : {}) as Any;
  const p = (r.personal && typeof r.personal === "object" ? r.personal : {}) as Any;
  const personal = { ...emptyCV.personal };
  for (const k of Object.keys(personal) as (keyof CV["personal"])[]) personal[k] = str(p[k]);

  return {
    ...emptyCV,
    personal,
    summary: str(r.summary),
    openToWork: bool(r.openToWork),
    skills: arr(r.skills).map((s) => ({ id: str(s.id) || uid(), name: str(s.name), items: commaText(s.items) })),
    experience: arr(r.experience).map((e) => {
      const current = bool(e.current) || /present|current|now/i.test(str(e.end));
      return {
        id: str(e.id) || uid(),
        company: str(e.company),
        role: str(e.role),
        location: str(e.location),
        start: normMonth(e.start),
        end: current ? "" : normMonth(e.end),
        current,
        bullets: lineText(e.bullets),
      };
    }),
    projects: arr(r.projects).map((x) => ({
      id: str(x.id) || uid(),
      name: str(x.name),
      tech: commaText(x.tech),
      link: str(x.link),
      repo: str(x.repo),
      featured: bool(x.featured),
      bullets: lineText(x.bullets),
    })),
    education: arr(r.education).map((x) => ({
      id: str(x.id) || uid(),
      degree: str(x.degree),
      institution: str(x.institution),
      result: str(x.result),
      start: normMonth(x.start),
      end: normMonth(x.end),
    })),
    achievements: simpleList(r.achievements),
    certifications: simpleList(r.certifications),
    languages: commaText(r.languages),
  };
}

export function normalizeSettings(raw: unknown): Settings {
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<Settings>;
  return {
    ...defaultSettings,
    ...r,
    hidden: Array.isArray(r.hidden) ? r.hidden : [],
    readme: { ...defaultSettings.readme, ...(r.readme || {}), hidden: Array.isArray(r.readme?.hidden) ? r.readme.hidden : defaultSettings.readme.hidden },
    portfolio: { ...defaultSettings.portfolio, ...(r.portfolio || {}), hidden: Array.isArray(r.portfolio?.hidden) ? r.portfolio.hidden : defaultSettings.portfolio.hidden },
  };
}

// টেক্সট থেকে JSON বের করা: ```json ব্লক, আগে-পরের ব্যাখ্যা সব সামলায়
export function extractJSON(text: string): unknown {
  let t = text.trim();
  const fence = t.match(/```(?:json|JSON)?\s*([\s\S]*?)```/);
  if (fence) t = fence[1].trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a < 0 || b <= a) throw new Error("কোনো JSON অবজেক্ট পাওয়া যায়নি");
  t = t.slice(a, b + 1);
  try {
    return JSON.parse(t);
  } catch {
    // AI-এর সাধারণ ভুল: শেষে বাড়তি কমা, স্মার্ট কোট
    const fixed = t.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(fixed);
  }
}

export interface ImportResult {
  cv: CV;
  settings?: Settings;
  name?: string;
}

// যেকোনো সমর্থিত আকারের ডেটা চিনে নেয়: v2 এক্সপোর্ট, v1 {cv, settings}, অথবা সরাসরি CV
export function parseImport(data: unknown): ImportResult {
  if (!data || typeof data !== "object") throw new Error("ডেটা খালি বা ভুল");
  const d = data as Any;
  if (d.cv && typeof d.cv === "object") {
    return { cv: normalizeCV(d.cv), settings: d.settings ? normalizeSettings(d.settings) : undefined, name: str(d.name) || undefined };
  }
  if (d.personal || d.experience || d.skills || d.projects || d.education) return { cv: normalizeCV(d) };
  throw new Error("এতে CV-র কোনো তথ্য পাওয়া যায়নি");
}
