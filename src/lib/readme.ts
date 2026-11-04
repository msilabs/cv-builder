// CV ডেটা থেকে GitHub প্রোফাইল README (Markdown) তৈরি
import type { CV, ReadmeSettings, SectionKey } from "./types";
import { commaList, fmtRange, href, lines } from "./utils";
import { techIcon } from "./techIcons";

export function githubUsername(url: string): string {
  const m = url.trim().match(/github\.com\/([A-Za-z0-9-]+)/i);
  if (m) return m[1];
  return /^[A-Za-z0-9-]+$/.test(url.trim()) ? url.trim() : "";
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Markdown টেক্সটে বিশেষ চিহ্ন নিরাপদ রাখা
const md = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
const firstName = (n: string) => n.trim().split(/\s+/)[0] || n;

function shieldLabel(s: string) {
  return encodeURIComponent(s).replace(/-/g, "--").replace(/_/g, "__");
}

// হালকা রঙের ব্যাজে (যেমন JavaScript-এর হলুদ) সাদা লোগো পড়া যায় না
const isLight = (hex: string) => {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 170;
};

export function techBadge(name: string) {
  const ic = techIcon(name);
  const color = ic?.color ?? "555555";
  const logo = ic?.si ? `&logo=${ic.si}&logoColor=${isLight(color) ? "black" : "white"}` : "";
  return `<img src="https://img.shields.io/badge/${shieldLabel(name)}-${color}?style=for-the-badge${logo}" alt="${esc(name)}" />`;
}

interface Link {
  label: string;
  url: string;
  color: string;
  logo?: string;
}

function socialLinks(cv: CV): Link[] {
  const p = cv.personal;
  const out: Link[] = [];
  if (p.linkedin) out.push({ label: "LinkedIn", url: href(p.linkedin), color: "0A66C2" });
  if (p.website) out.push({ label: "Portfolio", url: href(p.website), color: "0F766E", logo: "googlechrome" });
  if (p.email) out.push({ label: "Email", url: `mailto:${p.email}`, color: "D14836", logo: "gmail" });
  if (p.twitter) out.push({ label: "X", url: p.twitter.includes(".") ? href(p.twitter) : `https://x.com/${p.twitter.replace(/^@/, "")}`, color: "000000", logo: "x" });
  if (p.blog) out.push({ label: "Blog", url: href(p.blog), color: "12100E", logo: "medium" });
  if (p.codeforces) out.push({ label: "Codeforces", url: `https://codeforces.com/profile/${p.codeforces}`, color: "1F8ACB", logo: "codeforces" });
  if (p.leetcode) out.push({ label: "LeetCode", url: `https://leetcode.com/u/${p.leetcode}`, color: "FFA116", logo: "leetcode" });
  return out;
}

const linkBadge = (l: Link) =>
  `<a href="${esc(l.url)}"><img src="https://img.shields.io/badge/${shieldLabel(l.label)}-${l.color}?style=for-the-badge${l.logo ? `&logo=${l.logo}&logoColor=white` : ""}" alt="${esc(l.label)}" /></a>`;

const show = (rs: ReadmeSettings, k: SectionKey) => !rs.hidden.includes(k);

// ফিচারড প্রজেক্ট আগে; কোনোটা ফিচারড না থাকলে প্রথম ৪টা
export function pickProjects(cv: CV, max = 4) {
  const f = cv.projects.filter((p) => p.featured && p.name);
  return (f.length ? f : cv.projects.filter((p) => p.name)).slice(0, max);
}

const currentJob = (cv: CV) => cv.experience.find((e) => e.current && (e.role || e.company));

function statsBlock(user: string, center = false) {
  if (!user) return "";
  const a = center ? ' align="center"' : "";
  return `<p${a}>
  <img height="165" src="https://github-readme-stats.vercel.app/api?username=${user}&show_icons=true&hide_border=true&count_private=true" alt="GitHub stats" />
  <img height="165" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${user}&layout=compact&hide_border=true" alt="Top languages" />
</p>`;
}

function projectLines(cv: CV) {
  return pickProjects(cv).map((p) => {
    const title = p.link ? `[${md(p.name)}](${href(p.link)})` : md(p.name);
    const desc = lines(p.bullets)[0];
    const extra = [p.tech && `_${md(p.tech)}_`, p.repo && `[Source](${href(p.repo)})`].filter(Boolean).join(" · ");
    return `- **${title}**${desc ? ` — ${md(desc)}` : ""}${extra ? `  \n  ${extra}` : ""}`;
  });
}

function experienceLines(cv: CV) {
  return cv.experience
    .filter((e) => e.role || e.company)
    .slice(0, 4)
    .map((e) => `- **${md(e.role)}**${e.company ? ` @ ${md(e.company)}` : ""}${fmtRange(e.start, e.end, e.current) ? ` · _${fmtRange(e.start, e.end, e.current)}_` : ""}`);
}

function tail(cv: CV, rs: ReadmeSettings) {
  const out: string[] = [];
  if (show(rs, "education") && cv.education.length) {
    out.push("## 🎓 Education\n");
    for (const e of cv.education) out.push(`- **${md(e.degree)}** — ${md(e.institution)}${e.result ? ` (${md(e.result)})` : ""}`);
    out.push("");
  }
  if (show(rs, "achievements") && cv.achievements.length) {
    out.push("## 🏆 Achievements\n", ...cv.achievements.map((a) => `- ${md(a.text)}`), "");
  }
  if (show(rs, "certifications") && cv.certifications.length) {
    out.push("## 📜 Certifications\n", ...cv.certifications.map((a) => `- ${md(a.text)}`), "");
  }
  if (show(rs, "languages") && cv.languages) out.push(`## 🌐 Languages\n\n${md(cv.languages)}\n`);
  return out;
}

function classic(cv: CV, rs: ReadmeSettings) {
  const p = cv.personal;
  const user = githubUsername(p.github);
  const o: string[] = [];
  o.push(`# Hi there, I'm ${md(firstName(p.fullName) || "a developer")} 👋\n`);
  const sub = [p.title, p.location].filter(Boolean).map(md).join(" · ");
  if (sub) o.push(`### ${sub}\n`);
  if (p.tagline) o.push(`${md(p.tagline)}\n`);
  if (cv.openToWork) o.push(`> 🟢 **Open to new opportunities** — feel free to reach out!\n`);

  const about: string[] = [];
  const job = currentJob(cv);
  if (job) about.push(`- 💼 Currently working as **${md(job.role)}**${job.company ? ` at **${md(job.company)}**` : ""}`);
  const fp = pickProjects(cv, 1)[0];
  if (fp) about.push(`- 🚀 Recently built **${md(fp.name)}**${fp.tech ? ` with ${md(fp.tech)}` : ""}`);
  if (show(rs, "achievements") && cv.achievements[0]) about.push(`- 🏆 ${md(cv.achievements[0].text)}`);
  if (p.email) about.push(`- 📫 Reach me at **${md(p.email)}**`);
  if ((show(rs, "summary") && cv.summary) || about.length) {
    o.push("## 🙋 About me\n");
    if (show(rs, "summary") && cv.summary) o.push(`${md(cv.summary)}\n`);
    if (about.length) o.push(about.join("\n") + "\n");
  }

  if (show(rs, "skills") && cv.skills.length) {
    o.push("## 🛠 Tech stack\n");
    for (const s of cv.skills) {
      const items = commaList(s.items);
      if (!items.length) continue;
      if (s.name) o.push(`**${md(s.name)}**  `);
      o.push(`<p>\n  ${items.map(techBadge).join("\n  ")}\n</p>\n`);
    }
  }
  if (show(rs, "experience") && cv.experience.length) o.push("## 💼 Experience\n", experienceLines(cv).join("\n") + "\n");
  if (show(rs, "projects") && cv.projects.length) o.push("## 🚀 Featured projects\n", projectLines(cv).join("\n") + "\n");
  o.push(...tail(cv, rs));
  if (rs.showStats && user) o.push("## 📊 GitHub stats\n", statsBlock(user) + "\n");
  const links = socialLinks(cv);
  if (links.length) o.push("## 🤝 Connect with me\n", `<p>\n  ${links.map(linkBadge).join("\n  ")}\n</p>\n`);
  return o;
}

function centered(cv: CV, rs: ReadmeSettings) {
  const p = cv.personal;
  const user = githubUsername(p.github);
  const o: string[] = [];
  o.push(`<h1 align="center">Hi 👋, I'm ${esc(p.fullName || "a developer")}</h1>`);
  const sub = [p.title, p.location && `from ${p.location}`].filter(Boolean).join(" ");
  if (sub) o.push(`<h3 align="center">${esc(sub)}</h3>`);
  if (p.tagline) o.push(`<p align="center">${esc(p.tagline)}</p>`);
  if (cv.openToWork) o.push(`<p align="center"><img src="https://img.shields.io/badge/Open%20to%20work-22C55E?style=flat-square" alt="Open to work" /></p>`);
  const links = socialLinks(cv);
  if (links.length) o.push(`<p align="center">\n  ${links.map(linkBadge).join("\n  ")}\n</p>`);
  o.push("");
  if (show(rs, "summary") && cv.summary) o.push("## 🙋 About me\n", `${md(cv.summary)}\n`);

  if (show(rs, "skills") && cv.skills.length) {
    const all = cv.skills.flatMap((s) => commaList(s.items));
    const ids = [...new Set(all.map((n) => techIcon(n)?.skill).filter(Boolean))] as string[];
    const rest = all.filter((n) => !techIcon(n)?.skill);
    o.push("## 🛠 Languages & tools\n");
    if (ids.length) o.push(`<p align="center">\n  <a href="https://skillicons.dev"><img src="https://skillicons.dev/icons?i=${ids.join(",")}&perline=10" alt="Tech stack" /></a>\n</p>\n`);
    if (rest.length) o.push(`<p align="center">${esc(rest.join(" · "))}</p>\n`);
  }
  if (show(rs, "experience") && cv.experience.length) o.push("## 💼 Experience\n", experienceLines(cv).join("\n") + "\n");
  if (show(rs, "projects") && cv.projects.length) o.push("## 🚀 Featured projects\n", projectLines(cv).join("\n") + "\n");
  o.push(...tail(cv, rs));
  if (rs.showStats && user) o.push("## 📊 GitHub stats\n", statsBlock(user, true) + "\n");
  return o;
}

function code(cv: CV, rs: ReadmeSettings) {
  const p = cv.personal;
  const user = githubUsername(p.github);
  const varName = (firstName(p.fullName) || "me").toLowerCase().replace(/[^a-z0-9_]/g, "") || "me";
  const job = currentJob(cv);
  const q = (s: string) => JSON.stringify(s);
  const body: string[] = [];
  if (p.title) body.push(`  role: ${q(p.title)},`);
  if (p.location) body.push(`  location: ${q(p.location)},`);
  if (job?.company) body.push(`  currentlyAt: ${q(job.company)},`);
  if (show(rs, "skills") && cv.skills.length) {
    body.push("  stack: {");
    for (const s of cv.skills) {
      const key = (s.name || "tools").replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")).replace(/^./, (c) => c.toLowerCase()) || "tools";
      body.push(`    ${/^[a-z_$][\w$]*$/i.test(key) ? key : q(key)}: [${commaList(s.items).map(q).join(", ")}],`);
    }
    body.push("  },");
  }
  if (show(rs, "languages") && cv.languages) body.push(`  speaks: [${cv.languages.split(",").map((x) => q(x.trim())).join(", ")}],`);
  body.push(`  openToWork: ${cv.openToWork},`);
  const o: string[] = [];
  o.push(`### Hi, I'm ${md(p.fullName || "a developer")} 👋\n`);
  if (p.tagline) o.push(`${md(p.tagline)}\n`);
  o.push("```ts", `const ${varName} = {`, ...body, "};", "```\n");
  if (show(rs, "summary") && cv.summary) o.push(`${md(cv.summary)}\n`);
  if (show(rs, "experience") && cv.experience.length) o.push("#### 💼 Experience\n", experienceLines(cv).join("\n") + "\n");
  if (show(rs, "projects") && cv.projects.length) o.push("#### 🚀 Things I've built\n", projectLines(cv).join("\n") + "\n");
  o.push(...tail(cv, rs).map((l) => l.replace(/^## /, "#### ")));
  if (rs.showStats && user) o.push(statsBlock(user) + "\n");
  const links = socialLinks(cv);
  if (links.length) o.push("#### 🤝 Find me on\n", links.map((l) => `[${l.label}](${l.url})`).join(" · ") + "\n");
  return o;
}

// ছবি/বাইরের সার্ভিস ছাড়া, শুধু লেখা: সবচেয়ে দ্রুত আর কখনো ভাঙে না
function minimal(cv: CV, rs: ReadmeSettings) {
  const p = cv.personal;
  const o: string[] = [];
  o.push(`## ${md(p.fullName || "Hello")}\n`);
  const sub = [p.title, p.location].filter(Boolean).map(md).join(" — ");
  if (sub) o.push(`**${sub}**\n`);
  if (p.tagline) o.push(`${md(p.tagline)}\n`);
  if (cv.openToWork) o.push("Currently open to new opportunities.\n");
  if (show(rs, "summary") && cv.summary) o.push(`${md(cv.summary)}\n`);
  if (show(rs, "skills") && cv.skills.length) {
    o.push("### Stack\n");
    for (const s of cv.skills) if (s.items) o.push(`- ${s.name ? `**${md(s.name)}:** ` : ""}${md(commaList(s.items).join(", "))}`);
    o.push("");
  }
  if (show(rs, "experience") && cv.experience.length) o.push("### Experience\n", experienceLines(cv).join("\n") + "\n");
  if (show(rs, "projects") && cv.projects.length) o.push("### Projects\n", projectLines(cv).join("\n") + "\n");
  o.push(...tail(cv, rs).map((l) => l.replace(/^## \S+ /, "### ")));
  const links = socialLinks(cv);
  if (links.length) o.push("### Links\n", links.map((l) => `[${l.label}](${l.url})`).join(" · ") + "\n");
  return o;
}

export const README_STYLE_IDS: ReadmeSettings["style"][] = ["classic", "centered", "code", "minimal"];

export function generateReadme(cv: CV, rs: ReadmeSettings): string {
  const fn = { classic, centered, code, minimal }[rs.style] ?? classic;
  return (
    fn(cv, rs)
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim() + "\n"
  );
}
