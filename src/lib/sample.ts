import type { CV, SectionKey, Settings } from "./types";

export const emptyCV: CV = {
  personal: { fullName: "", title: "", email: "", phone: "", location: "", github: "", linkedin: "", website: "", photo: "", tagline: "", twitter: "", blog: "", codeforces: "", leetcode: "" },
  summary: "",
  skills: [],
  experience: [],
  projects: [],
  education: [],
  achievements: [],
  certifications: [],
  languages: "",
  openToWork: false,
};

export const defaultSettings: Settings = {
  template: "classic",
  accent: "#0f766e",
  showPhoto: false,
  hidden: [],
  readme: { style: "classic", showStats: false, hidden: ["education", "languages"] },
  portfolio: { theme: "clean", accent: "#0f766e", showEmail: true, showPhone: false, showLocation: true, showPhoto: true, hidden: [] },
};

export const sampleCV: CV = {
  personal: {
    fullName: "Tanvir Ahmed",
    title: "Full Stack Developer",
    email: "tanvir.ahmed@example.com",
    phone: "+880 1712-345678",
    location: "Mirpur, Dhaka, Bangladesh",
    github: "github.com/tanvir-dev",
    linkedin: "linkedin.com/in/tanvir-dev",
    website: "tanvir.dev",
    photo: "",
    tagline: "Building fintech & mobile products from Dhaka, Bangladesh",
    twitter: "",
    blog: "",
    codeforces: "tanvir_cf",
    leetcode: "",
  },
  summary:
    "Full stack developer with 3+ years of experience building scalable web and mobile applications using React, Next.js, Node.js and Flutter. Shipped fintech and e-commerce products used by 200k+ users across Bangladesh.",
  skills: [
    { id: "s1", name: "Languages", items: "JavaScript, TypeScript, Dart, Python, SQL" },
    { id: "s2", name: "Frontend", items: "React, Next.js, Tailwind CSS, Redux Toolkit" },
    { id: "s3", name: "Backend", items: "Node.js, Express, NestJS, PostgreSQL, MongoDB, Redis" },
    { id: "s4", name: "Mobile", items: "Flutter, React Native" },
    { id: "s5", name: "DevOps & Tools", items: "Docker, AWS (EC2, S3), GitHub Actions, Nginx, Git" },
  ],
  experience: [
    {
      id: "e1",
      company: "PayFlow Fintech Ltd.",
      role: "Software Engineer",
      location: "Gulshan, Dhaka",
      start: "2023-03",
      end: "",
      current: true,
      bullets:
        "Built merchant dashboard with Next.js and NestJS, serving 15k+ merchants\nReduced API response time by 40% by introducing Redis caching and query optimisation\nIntegrated SSLCommerz and Nagad payment gateways for online checkout\nMentored 2 junior developers and led weekly code reviews",
    },
    {
      id: "e2",
      company: "Startup Studio BD",
      role: "Junior Web Developer",
      location: "Dhanmondi, Dhaka",
      start: "2021-09",
      end: "2023-02",
      current: false,
      bullets:
        "Developed 6+ client websites and e-commerce stores using React and Laravel\nBuilt a Flutter delivery app published on Google Play with 10k+ downloads",
    },
  ],
  projects: [
    {
      id: "p1",
      name: "BusKoi – Dhaka Bus Route Finder",
      tech: "Flutter, Firebase, Google Maps API",
      link: "play.google.com/store/apps/details?id=com.buskoi",
      repo: "github.com/tanvir-dev/buskoi",
      featured: true,
      bullets: "Route finder for 150+ Dhaka city bus routes with Bangla & English support\n4.6★ rating with 25k+ downloads on Google Play",
    },
    {
      id: "p2",
      name: "DevJobs BD",
      tech: "Next.js, PostgreSQL, Prisma",
      link: "devjobs-bd.vercel.app",
      repo: "github.com/tanvir-dev/devjobs-bd",
      featured: true,
      bullets: "Job board aggregating tech jobs from Bangladeshi companies with salary insights",
    },
  ],
  education: [
    {
      id: "ed1",
      degree: "B.Sc. in Computer Science & Engineering",
      institution: "Khulna University of Engineering & Technology (KUET)",
      result: "CGPA: 3.62 / 4.00",
      start: "2017-01",
      end: "2021-06",
    },
    {
      id: "ed2",
      degree: "Higher Secondary Certificate (HSC) – Science",
      institution: "Notre Dame College, Dhaka",
      result: "GPA: 5.00 / 5.00",
      start: "",
      end: "2016-06",
    },
  ],
  achievements: [
    { id: "a1", text: "ICPC Dhaka Regional 2019 – Ranked 38th among 300+ teams" },
    { id: "a2", text: "Codeforces Specialist (max rating 1520) · 800+ problems solved" },
    { id: "a3", text: "Champion, NASA Space Apps Challenge Khulna 2020" },
  ],
  certifications: [{ id: "c1", text: "AWS Certified Cloud Practitioner (2024)" }],
  languages: "Bangla (Native), English (Professional)",
  openToWork: true,
};

// CV-তে নমুনার কোন লেখা এখনো রয়ে গেছে তা খুঁজে বের করে (ভুলে রেখে দেওয়া আটকাতে)
export type LeftoverKey = "fullName" | "email" | "phone" | "github" | "linkedin" | "website" | "summary" | "experience" | "projects" | "education" | "achievements" | "certifications";

export function findSampleLeftovers(cv: CV): LeftoverKey[] {
  const s = sampleCV;
  const found = new Set<LeftoverKey>();
  const norm = (t: string) => t.trim().toLowerCase();
  const has = (values: string[], target: string) => {
    const n = norm(target);
    return n.length > 2 && values.some((v) => norm(v) === n);
  };
  const sampleLines = (arr: { bullets: string }[]) => arr.flatMap((x) => x.bullets.split("\n"));

  const p = s.personal;
  const personalKeys = ["fullName", "email", "phone", "github", "linkedin", "website"] as const;
  for (const k of personalKeys) if (has([p[k]], cv.personal[k])) found.add(k);
  if (has([s.summary], cv.summary)) found.add("summary");

  for (const e of cv.experience) {
    if (has(s.experience.map((x) => x.company), e.company)) found.add("experience");
    if (e.bullets.split("\n").some((l) => has(sampleLines(s.experience), l))) found.add("experience");
  }
  for (const pr of cv.projects) {
    if (has(s.projects.map((x) => x.name), pr.name) || has(s.projects.flatMap((x) => [x.link, x.repo]), pr.link) || has(s.projects.flatMap((x) => [x.link, x.repo]), pr.repo)) found.add("projects");
    if (pr.bullets.split("\n").some((l) => has(sampleLines(s.projects), l))) found.add("projects");
  }
  for (const ed of cv.education) if (has(s.education.map((x) => x.institution), ed.institution)) found.add("education");
  for (const a of cv.achievements) if (has(s.achievements.map((x) => x.text), a.text)) found.add("achievements");
  for (const c of cv.certifications) if (has(s.certifications.map((x) => x.text), c.text)) found.add("certifications");
  return [...found];
}

// লুকানো সেকশন খালি করে দেয়, যাতে প্রিভিউ/PDF-এ না আসে (আসল ডেটা অক্ষত থাকে)
export function visibleCV(cv: CV, hidden: SectionKey[]): CV {
  if (!hidden.length) return cv;
  const out = { ...cv };
  for (const k of hidden) {
    if (k === "summary" || k === "languages") out[k] = "";
    else out[k] = [];
  }
  return out;
}

export const isEmptyCV = (cv: CV) =>
  !cv.personal.fullName && !cv.summary && cv.experience.length === 0 && cv.projects.length === 0 && cv.skills.length === 0;
