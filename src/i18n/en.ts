import type { Dict } from "./dict";
import { builderEn } from "./builder.en";

export const en: Dict = {
  meta: {
    title: "CVbanao — Free CV, GitHub README & Portfolio Builder for Developers",
    description: "Built for web, mobile and software developers. Enter your details once and get an ATS-friendly CV (PDF), a GitHub profile README and a portfolio site. Free, no sign-up.",
  },
  brand: { a: "CV", b: "বানাও" },
  b: builderEn,
  tpl: {
    classic: { name: "Classic", desc: "Single column, safest choice" },
    compact: { name: "Compact", desc: "Dense, fits more on one page" },
    elegant: { name: "Elegant", desc: "Serif type, refined" },
    modern: { name: "Modern", desc: "Coloured sidebar, skill tags" },
    timeline: { name: "Timeline", desc: "Experience on a timeline" },
    minimal: { name: "Minimal", desc: "Clean with lots of white space" },
  },
  home: {
    nav: { outputs: "Features", templates: "Templates", ai: "AI", faq: "FAQ", start: "Get started" },
    hero: {
      badge: "Open source · 100% free · No sign-up",
      title1: "Enter your details once,",
      title2: "get a CV, GitHub README and portfolio",
      sub: "Made for web, mobile and software developers. An ATS-friendly CV as PDF, a GitHub profile README and a one-page portfolio site, all from one place.",
      cta: "Start for free",
      secondary: "See an example",
      note: "No card, no email. Your first CV in 2 minutes.",
    },
    trust: ["Data stays in your browser", "No watermark", "ATS-friendly PDF", "Open source, MIT licensed"],
    outputs: {
      eyebrow: "One profile, three outputs",
      title: "Write it once, use it everywhere",
      sub: "Add a new job or project and your CV, README and portfolio all update together.",
      items: [
        { key: "cv", title: "ATS-friendly CV", desc: "6 templates, live A4 preview, one-click PDF.", points: ["Easy for applicant tracking systems to read", "CGPA, SSC/HSC and +880 formats", "Separate CV versions per job"], cta: "Build a CV" },
        { key: "readme", title: "GitHub profile README", desc: "4 styles, tech badges generated from your skills.", points: ["Rendered preview", "Copy Markdown in one click", "Optional GitHub stats"], cta: "Build a README" },
        { key: "portfolio", title: "Portfolio site", desc: "3 themes, a single index.html file.", points: ["Free hosting on GitHub Pages", "Mobile-friendly, dark mode", "Phone number hidden by default"], cta: "Build a portfolio" },
      ],
    },
    templates: {
      eyebrow: "CV templates",
      title: "Designs recruiters and ATS both like",
      sub: "ATS-safe templates for online applications, design-led templates for handing over in person.",
      ats: "ATS-safe",
      design: "Design",
      use: "Start with this →",
      alt: (name: string) => `Sample CV in the ${name} template`,
    },
    ai: {
      eyebrow: "AI assistant",
      title: "Write your CV with ChatGPT, no API key needed",
      sub: "Copy a prompt into your favourite AI and paste the reply back. No payment, no account.",
      steps: [
        { title: "Pick a task", desc: "Start from an old CV, improve wording, tailor to a job, or write a cover letter." },
        { title: "Copy the prompt", desc: "Paste it into ChatGPT, Claude or Gemini. Your phone, email and photo are never included." },
        { title: "Paste the reply", desc: "Review what will change, then save it as a new version or apply it." },
      ],
      guardTitle: "Catches made-up facts",
      guardDesc: "If the AI adds numbers that were not in your CV, you get a warning, so nothing invented ends up in an interview.",
      guardSample: "The AI added new numbers, please check they are true",
      undo: "One-click undo",
    },
    how: {
      eyebrow: "How it works",
      title: "Ready in three steps",
      steps: [
        { title: "Add your details", desc: "Fill in the form, or let AI turn your old CV into structured data in a minute." },
        { title: "Choose a design", desc: "CV template, README style and portfolio theme, plus your own accent colour." },
        { title: "Download", desc: "PDF, README.md and index.html. Everything is yours, nothing is locked in." },
      ],
    },
    bd: {
      eyebrow: "Made for Bangladesh",
      title: "The way local recruiters expect it",
      points: [
        "CGPA out of 4.00 and SSC/HSC GPA out of 5.00",
        "+880 phone numbers and Bangladeshi addresses",
        "ICPC, Codeforces and hackathon achievements",
        "Projects with Play Store / App Store links",
      ],
      tipsTitle: "Tips for a strong developer CV",
      tips: [
        "Write your CV in English; almost every tech company in Bangladesh expects it.",
        "Start each bullet with an action verb and add numbers: “Reduced load time by 40%”.",
        "If you are a fresher, projects matter most. Add live links and GitHub.",
        "Keep it to 1–2 pages. Parents' names, religion and marital status are not needed.",
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Common questions",
      items: [
        { q: "Where is my data stored?", a: "Only in your browser (localStorage). Nothing is sent to a server, which is why no login is needed. Save a JSON file to back up or move to another device." },
        { q: "What is ATS and why does it matter?", a: "An Applicant Tracking System is the software job sites use to read and filter CVs. Complex two-column layouts are sometimes misread, so use an “ATS-safe” template for online applications." },
        { q: "Should my CV be in Bangla or English?", a: "English. Almost all tech companies in Bangladesh and every remote job expect an English CV. The interface can be in Bangla, but your CV, README and portfolio are generated in English." },
        { q: "Why is it free? Will it cost later?", a: "It is an open-source (MIT) project with no server costs, so it is free. No watermark and no hidden charges." },
        { q: "Does the AI feature send my data anywhere?", a: "No. You copy the prompt into an AI yourself, and your phone number, email and photo are removed from it." },
      ],
    },
    final: { title: "Get your developer profile in shape today", sub: "CV, GitHub README and portfolio from one set of details.", cta: "Start for free" },
    footer: { made: "Made in Bangladesh", issue: "Report an issue", license: "MIT License" },
    preview: { cv: "CV", readme: "README.md", portfolio: "Portfolio" },
    previewAlt: { cv: "Sample CV in the Classic template", readme: "GitHub profile README in the code style", portfolio: "Portfolio website in the Midnight theme" },
  },
};
