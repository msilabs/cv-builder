// AI (ChatGPT, Claude, Gemini) দিয়ে CV লেখানোর প্রম্পট, আর উত্তর নিরাপদে মিশিয়ে নেওয়া
import type { CV } from "./types";
import { normalizeCV } from "./normalize";
import { commaList, lines } from "./utils";

export type AITask = "fromText" | "improve" | "tailor" | "summary" | "coverLetter";

export const AI_TASKS: Record<AITask, { title: string; desc: string; icon: string; needs?: "oldCv" | "jd"; returnsJson: boolean; asNewVersion: boolean }> = {
  fromText: { icon: "📥", title: "পুরোনো CV বা LinkedIn থেকে শুরু", desc: "পুরোনো CV-র লেখা দিন, AI সেটা এখানকার ফরম্যাটে সাজিয়ে দেবে", needs: "oldCv", returnsJson: true, asNewVersion: false },
  improve: { icon: "✨", title: "CV-র লেখা উন্নত করুন", desc: "ভাষা আরও পরিষ্কার ও প্রফেশনাল, ATS-বান্ধব করবে", returnsJson: true, asNewVersion: false },
  tailor: { icon: "🎯", title: "নির্দিষ্ট জবের জন্য সাজান", desc: "জব ডেসক্রিপশন দিন, সেই অনুযায়ী আলাদা CV ভার্সন হবে", needs: "jd", returnsJson: true, asNewVersion: true },
  summary: { icon: "📝", title: "সামারি ও tagline লিখুন", desc: "শুধু সামারি আর এক লাইনের পরিচিতি নতুন করে লিখবে", returnsJson: true, asNewVersion: false },
  coverLetter: { icon: "✉️", title: "কভার লেটার লিখুন", desc: "জব ডেসক্রিপশন অনুযায়ী কভার লেটার (সাধারণ লেখা, ইমপোর্ট লাগবে না)", needs: "jd", returnsJson: false, asNewVersion: false },
};

// AI-কে যা পাঠানো হবে: id, ছবি, ফোন, ইমেইল বাদ; লাইনগুলো অ্যারে করে (AI-এর জন্য সহজ)
export function toAIJson(cv: CV) {
  const p = cv.personal;
  return {
    personal: { fullName: p.fullName, title: p.title, tagline: p.tagline, location: p.location, github: p.github, linkedin: p.linkedin, website: p.website },
    summary: cv.summary,
    openToWork: cv.openToWork,
    skills: cv.skills.map((s) => ({ name: s.name, items: commaList(s.items) })),
    experience: cv.experience.map((e) => ({ company: e.company, role: e.role, location: e.location, start: e.start, end: e.current ? "Present" : e.end, current: e.current, bullets: lines(e.bullets) })),
    projects: cv.projects.map((x) => ({ name: x.name, tech: x.tech, link: x.link, repo: x.repo, featured: x.featured, bullets: lines(x.bullets) })),
    education: cv.education.map((e) => ({ degree: e.degree, institution: e.institution, result: e.result, start: e.start, end: e.end })),
    achievements: cv.achievements.map((a) => a.text),
    certifications: cv.certifications.map((a) => a.text),
    languages: cv.languages,
  };
}

const SCHEMA = `{
  "personal": { "fullName": "", "title": "", "tagline": "", "location": "", "github": "", "linkedin": "", "website": "" },
  "summary": "",
  "openToWork": false,
  "skills": [{ "name": "Frontend", "items": ["React", "Next.js"] }],
  "experience": [{ "company": "", "role": "", "location": "", "start": "YYYY-MM", "end": "YYYY-MM", "current": false, "bullets": [""] }],
  "projects": [{ "name": "", "tech": "Flutter, Firebase", "link": "", "repo": "", "featured": false, "bullets": [""] }],
  "education": [{ "degree": "", "institution": "", "result": "CGPA: 3.50 / 4.00", "start": "YYYY-MM", "end": "YYYY-MM" }],
  "achievements": [""],
  "certifications": [""],
  "languages": "Bangla (Native), English (Professional)"
}`;

const HONESTY = `STRICT RULES:
- Never invent facts. Do not add companies, projects, degrees, dates, numbers, percentages, user counts or achievements that are not in my data.
- If a bullet would be stronger with a metric I did not give, keep it without a metric. Do not guess numbers.
- Write in clear, professional English suitable for software engineering roles. Start bullets with strong action verbs. Keep each bullet to one line where possible.
- Keep Bangladeshi formats as they are (e.g. "CGPA: 3.62 / 4.00", "GPA: 5.00 / 5.00", SSC, HSC).`;

const JSON_OUT = `OUTPUT FORMAT:
- Reply with ONLY one JSON object inside a single \`\`\`json code block. No explanation before or after.
- Use exactly this structure and these keys:
${SCHEMA}
- Dates must be "YYYY-MM". For a current job use "current": true and "end": "".`;

export function buildPrompt(task: AITask, cv: CV, extra: string): string {
  const data = JSON.stringify(toAIJson(cv), null, 2);
  const input = extra.trim();
  switch (task) {
    case "fromText":
      return `You are an expert tech recruiter and CV writer for software developers in Bangladesh.

Convert my existing CV / LinkedIn text below into structured JSON for a CV builder.

${HONESTY}
- Group skills into sensible categories (e.g. Languages, Frontend, Backend, Mobile, DevOps & Tools).
- Leave a field as an empty string if the information is not in my text. Do not include phone numbers or email addresses.

${JSON_OUT}

MY CURRENT CV TEXT:
"""
${input || "(paste your old CV or LinkedIn profile text here)"}
"""`;
    case "improve":
      return `You are an expert tech recruiter and CV writer for software developers.

Improve the wording of my CV below so it is clearer, more impactful and ATS-friendly.

${HONESTY}
- Keep the same jobs, projects, education and their order. You may rewrite bullets, the summary and the tagline, and tidy skill groups.
- Summary: 2–3 sentences. Tagline: one short line.

${JSON_OUT}

MY CV (JSON):
\`\`\`json
${data}
\`\`\``;
    case "tailor":
      return `You are an expert tech recruiter. Tailor my CV for the job description below.

${HONESTY}
- Reorder skills and bullets so the most relevant ones for this job come first.
- Use keywords from the job description ONLY where they truthfully match my experience.
- Rewrite the summary for this role. Set "featured": true on the projects most relevant to this job.
- You may drop clearly irrelevant bullets, but never add new experience.

${JSON_OUT}

JOB DESCRIPTION:
"""
${input || "(paste the job description here)"}
"""

MY CV (JSON):
\`\`\`json
${data}
\`\`\``;
    case "summary":
      return `You are an expert tech CV writer. Based on my CV below, write:
1. "summary": a 2–3 sentence professional summary (years of experience, core stack, one key impact from my data).
2. "tagline": one short, friendly line for my GitHub README and portfolio (max 70 characters, one emoji allowed).

${HONESTY}

OUTPUT FORMAT: Reply with ONLY this JSON inside a single \`\`\`json code block:
{ "summary": "", "personal": { "tagline": "" } }

MY CV (JSON):
\`\`\`json
${data}
\`\`\``;
    case "coverLetter":
      return `You are an expert tech recruiter. Write a concise cover letter (250–350 words) for the job below using only facts from my CV.

${HONESTY}
- Friendly, confident and specific. Mention 2–3 relevant achievements or projects from my CV.
- Plain text only, no JSON. End with my name.

JOB DESCRIPTION:
"""
${input || "(paste the job description here)"}
"""

MY CV (JSON):
\`\`\`json
${data}
\`\`\``;
  }
}

// AI যে অংশ পাঠিয়েছে শুধু সেটুকু বদলায়; ফোন, ইমেইল, ছবি সবসময় আগের মতো
export function mergeAI(current: CV, raw: unknown): CV {
  if (!raw || typeof raw !== "object") throw new Error("উত্তরে JSON অবজেক্ট নেই");
  const r = raw as Record<string, unknown>;
  const n = normalizeCV(r);
  const out: CV = { ...current };
  let touched = 0;
  const keys = ["summary", "openToWork", "skills", "experience", "projects", "education", "achievements", "certifications", "languages"] as const;
  for (const k of keys) {
    if (k in r) {
      (out as unknown as Record<string, unknown>)[k] = n[k];
      touched++;
    }
  }
  if (r.personal && typeof r.personal === "object") {
    const rp = r.personal as Record<string, unknown>;
    const personal = { ...current.personal };
    for (const k of Object.keys(personal) as (keyof CV["personal"])[]) {
      if (k === "email" || k === "phone" || k === "photo") continue;
      if (k in rp && n.personal[k]) personal[k] = n.personal[k];
    }
    out.personal = personal;
    touched++;
  }
  if (!touched) throw new Error("উত্তরে CV-র কোনো চেনা অংশ (summary, experience ইত্যাদি) পাওয়া যায়নি");
  return out;
}

const LABELS: Record<string, string> = {
  fullName: "নাম", title: "পদবি", tagline: "tagline", location: "ঠিকানা", github: "GitHub", linkedin: "LinkedIn", website: "ওয়েবসাইট",
};

export interface AIDiff {
  changes: string[];
  newNumbers: string[];
}

const textOf = (cv: CV) =>
  [cv.summary, cv.personal.tagline, cv.personal.title, ...cv.experience.map((e) => e.bullets), ...cv.projects.map((p) => p.bullets), ...cv.achievements.map((a) => a.text), ...cv.certifications.map((a) => a.text)].join("\n");

// ৪০%, 15k+, 200,000, 3x ইত্যাদি; সাল (2019) আর তারিখ বাদ
const numbers = (t: string) =>
  new Set(
    (t.match(/\d[\d,.]*\s*(?:%|k\b|K\b|\+|x\b|M\b|million|users|ms)?/g) ?? [])
      .map((s) => s.trim().replace(/[.,]$/, ""))
      .filter((s) => !/^(19|20)\d{2}$/.test(s) && !/^\d$/.test(s)),
  );

export function diffCV(a: CV, b: CV): AIDiff {
  const changes: string[] = [];
  for (const k of Object.keys(LABELS) as (keyof CV["personal"])[]) if (a.personal[k] !== b.personal[k]) changes.push(`${LABELS[k]} বদলেছে`);
  if (a.summary !== b.summary) changes.push("সামারি নতুন করে লেখা হয়েছে");
  if (a.openToWork !== b.openToWork) changes.push(`Open to work: ${b.openToWork ? "চালু" : "বন্ধ"}`);
  const sk = (c: CV) => c.skills.map((s) => `${s.name}:${s.items}`).join("|");
  if (sk(a) !== sk(b)) changes.push(`স্কিল সাজানো হয়েছে (${b.skills.length}টা গ্রুপ)`);
  const listDiff = (label: string, x: { bullets: string }[], y: { bullets: string }[], names: (i: number) => string) => {
    if (x.length !== y.length) changes.push(`${label}: ${x.length}টা থেকে ${y.length}টা`);
    y.forEach((item, i) => {
      if (!x[i]) return;
      const before = lines(x[i].bullets), after = lines(item.bullets);
      const changed = after.filter((l) => !before.includes(l)).length;
      if (changed) changes.push(`${label} "${names(i)}": ${changed}টা পয়েন্ট বদলেছে`);
    });
  };
  listDiff("অভিজ্ঞতা", a.experience, b.experience, (i) => b.experience[i].role || b.experience[i].company);
  listDiff("প্রজেক্ট", a.projects, b.projects, (i) => b.projects[i].name);
  if (a.education.length !== b.education.length) changes.push(`শিক্ষা: ${a.education.length}টা থেকে ${b.education.length}টা`);
  const st = (l: { text: string }[]) => l.map((x) => x.text).join("|");
  if (st(a.achievements) !== st(b.achievements)) changes.push("অর্জনের তালিকা বদলেছে");
  if (st(a.certifications) !== st(b.certifications)) changes.push("সার্টিফিকেশন বদলেছে");
  if (a.languages !== b.languages) changes.push("ভাষা বদলেছে");
  const old = numbers(textOf(a));
  const newNumbers = [...numbers(textOf(b))].filter((x) => !old.has(x));
  return { changes, newNumbers };
}

export const AI_LINKS = [
  { name: "ChatGPT", url: "https://chatgpt.com/" },
  { name: "Claude", url: "https://claude.ai/new" },
  { name: "Gemini", url: "https://gemini.google.com/app" },
];
