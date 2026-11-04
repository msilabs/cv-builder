import type { CV, Settings } from "./types";

export const emptyCV: CV = {
  personal: { fullName: "", title: "", email: "", phone: "", location: "", github: "", linkedin: "", website: "", photo: "" },
  summary: "",
  skills: [],
  experience: [],
  projects: [],
  education: [],
  achievements: [],
  certifications: [],
  languages: "",
};

export const defaultSettings: Settings = { template: "classic", accent: "#0f766e", showPhoto: false };

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
      bullets: "Route finder for 150+ Dhaka city bus routes with Bangla & English support\n4.6★ rating with 25k+ downloads on Google Play",
    },
    {
      id: "p2",
      name: "DevJobs BD",
      tech: "Next.js, PostgreSQL, Prisma",
      link: "devjobs-bd.vercel.app",
      repo: "github.com/tanvir-dev/devjobs-bd",
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
};
