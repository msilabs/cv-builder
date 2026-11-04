// CV ডেটা থেকে এক পৃষ্ঠার পোর্টফোলিও: একটাই index.html, ভেতরে CSS, কোনো JS বা বাইরের ফাইল নেই
import type { CV, PortfolioSettings, PortfolioTheme, SectionKey } from "./types";
import { BASE_CSS, THEMES } from "./portfolio-css";
import { commaList, fmtRange, href, lines, stripProtocol } from "./utils";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// শুধু http(s), mailto, tel লিংক; অন্য কিছু (javascript: ইত্যাদি) বাদ
function safeUrl(u: string): string {
  const v = u.trim();
  if (!v) return "";
  if (/^(mailto:|tel:)/i.test(v)) return v;
  const full = href(v);
  try {
    const url = new URL(full);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

const safeColor = (c: string) => (/^#[0-9a-f]{3,8}$/i.test(c) ? c : "#0f766e");
const safePhoto = (p: string) => (/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(p) ? p : "");

const initials = (n: string) =>
  n
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "CV";

const ext = (url: string, label: string, cls = "") => {
  const u = safeUrl(url);
  return u ? `<a${cls ? ` class="${cls}"` : ""} href="${esc(u)}" target="_blank" rel="noopener">${label}</a>` : "";
};

const bulletList = (t: string) => {
  const ls = lines(t);
  return ls.length ? `<ul>${ls.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>` : "";
};

interface Social {
  label: string;
  url: string;
}

function socials(cv: CV): Social[] {
  const p = cv.personal;
  const out: Social[] = [];
  if (p.github) out.push({ label: "GitHub", url: p.github });
  if (p.linkedin) out.push({ label: "LinkedIn", url: p.linkedin });
  if (p.website) out.push({ label: "Website", url: p.website });
  if (p.twitter) out.push({ label: "X", url: p.twitter.includes(".") ? p.twitter : `x.com/${p.twitter.replace(/^@/, "")}` });
  if (p.blog) out.push({ label: "Blog", url: p.blog });
  if (p.codeforces) out.push({ label: "Codeforces", url: `codeforces.com/profile/${p.codeforces}` });
  if (p.leetcode) out.push({ label: "LeetCode", url: `leetcode.com/u/${p.leetcode}` });
  return out.filter((s) => safeUrl(s.url));
}

export const PORTFOLIO_THEME_IDS = Object.keys(THEMES) as PortfolioTheme[];

export function generatePortfolio(cv: CV, ps: PortfolioSettings): string {
  const p = cv.personal;
  const show = (k: SectionKey) => !ps.hidden.includes(k);
  const name = p.fullName || "Your Name";
  const accent = safeColor(ps.accent);
  const theme = THEMES[ps.theme] ?? THEMES.clean;
  const photo = ps.showPhoto ? safePhoto(p.photo) : "";
  const social = socials(cv);
  const email = ps.showEmail && p.email ? p.email.trim() : "";
  const phone = ps.showPhone && p.phone ? p.phone.trim() : "";
  const location = ps.showLocation ? p.location : "";
  const desc = (p.tagline || cv.summary || `${p.title} portfolio`).slice(0, 160);
  const projects = [...cv.projects.filter((x) => x.name && x.featured), ...cv.projects.filter((x) => x.name && !x.featured)];
  const ini = initials(name);
  const favicon = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${accent}"/><text x="50%" y="54%" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="middle">${esc(ini)}</text></svg>`)}`;

  // দুটো সেকশন পাশাপাশি বসবে কিনা (বেন্টো থিমে), একটা না থাকলে অন্যটা পুরো চওড়া
  const hasAbout = show("summary") && !!cv.summary;
  const hasSkills = show("skills") && cv.skills.some((s) => s.items);
  const hasEdu = show("education") && cv.education.length > 0;
  const hasAwards = (show("achievements") && cv.achievements.length > 0) || (show("certifications") && cv.certifications.length > 0);
  const duo1 = hasAbout && hasSkills;
  const duo2 = hasEdu && hasAwards;
  const nav: string[] = [];
  const S: string[] = [];

  // হিরো
  const heroLinks = [
    email && `<a class="btn primary" href="mailto:${esc(email)}">✉ Get in touch</a>`,
    ...social.slice(0, 3).map((s) => ext(s.url, `${esc(s.label)} ↗`, "btn")),
  ]
    .filter(Boolean)
    .join("");
  S.push(`<section class="hero" id="top"><div>
<p class="eyebrow">Hi, I'm</p>
<h1>${esc(name)}</h1>
${p.title ? `<p class="role">${esc(p.title)}</p>` : ""}
${p.tagline ? `<p class="tagline">${esc(p.tagline)}</p>` : ""}
${location || cv.openToWork ? `<p class="meta">${location ? `<span>📍 ${esc(location)}</span>` : ""}${cv.openToWork ? `<span class="badge">Open to work</span>` : ""}</p>` : ""}
${heroLinks ? `<div class="cta">${heroLinks}</div>` : ""}
</div>${photo ? `<img class="avatar" src="${photo}" alt="${esc(name)}">` : ""}</section>`);

  if (show("summary") && cv.summary) {
    nav.push(`<a href="#about">About</a>`);
    S.push(`<section id="about" class="about${duo1 ? " pair-wide" : ""}"><h2>About</h2><p>${esc(cv.summary)}</p>${show("languages") && cv.languages ? `<p class="muted" style="font-size:14px;margin-top:14px">Languages: ${esc(cv.languages)}</p>` : ""}</section>`);
  }

  if (show("skills") && cv.skills.some((s) => s.items)) {
    nav.push(`<a href="#skills">Skills</a>`);
    const groups = cv.skills
      .filter((s) => commaList(s.items).length)
      .map((s) => `<div>${s.name ? `<h3>${esc(s.name)}</h3>` : ""}<ul class="chips">${commaList(s.items).map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`)
      .join("");
    S.push(`<section id="skills"${duo1 ? ' class="pair-narrow"' : ""}><h2>Skills</h2><div class="skills">${groups}</div></section>`);
  }

  if (show("experience") && cv.experience.length) {
    nav.push(`<a href="#experience">Experience</a>`);
    const items = cv.experience
      .map(
        (e) => `<li><div class="when">${esc(fmtRange(e.start, e.end, e.current))}</div><div>
<h3>${esc(e.role)}${e.company ? ` <span>· ${esc(e.company)}</span>` : ""}</h3>${e.location ? `<p class="muted" style="margin:2px 0 0;font-size:14px">${esc(e.location)}</p>` : ""}${bulletList(e.bullets)}</div></li>`,
      )
      .join("");
    S.push(`<section id="experience"><h2>Experience</h2><ol class="timeline">${items}</ol></section>`);
  }

  if (show("projects") && projects.length) {
    nav.push(`<a href="#projects">Projects</a>`);
    const cards = projects
      .map((x) => {
        const links = [ext(x.link, "Live ↗"), ext(x.repo, "Code ↗")].filter(Boolean).join("");
        return `<article class="project">${x.featured ? `<span class="tag">★ Featured</span>` : ""}<h3>${esc(x.name)}</h3>${x.tech ? `<p class="tech">${esc(x.tech)}</p>` : ""}${bulletList(x.bullets)}${links ? `<p class="links">${links}</p>` : ""}</article>`;
      })
      .join("");
    S.push(`<section id="projects"><h2>Projects</h2><div class="projects">${cards}</div></section>`);
  }

  if (show("education") && cv.education.length) {
    const items = cv.education
      .map((e) => `<div><span><h3>${esc(e.degree)}</h3><span class="muted">${esc(e.institution)}${e.result ? ` · ${esc(e.result)}` : ""}</span></span><span class="when">${esc(fmtRange(e.start, e.end))}</span></div>`)
      .join("");
    S.push(`<section id="education"${duo2 ? ' class="pair-half"' : ""}><h2>Education</h2><div class="edu">${items}</div></section>`);
  }

  const awards = [...(show("achievements") ? cv.achievements : []), ...(show("certifications") ? cv.certifications : [])];
  if (awards.length) {
    S.push(`<section id="achievements"${duo2 ? ' class="pair-half"' : ""}><h2>Achievements</h2><ul style="margin:0">${awards.map((a) => `<li>${esc(a.text)}</li>`).join("")}</ul></section>`);
  }

  // যোগাযোগ
  const contactBtns = [email && `<a class="btn primary" href="mailto:${esc(email)}">✉ ${esc(email)}</a>`, ...social.map((s) => ext(s.url, `${esc(s.label)} ↗`, "btn"))]
    .filter(Boolean)
    .join("");
  const info = [phone && `📞 <a href="tel:${esc(phone.replace(/[^\d+]/g, ""))}">${esc(phone)}</a>`, location && `📍 ${esc(location)}`].filter(Boolean).join(" &nbsp;·&nbsp; ");
  if (contactBtns || info) {
    nav.push(`<a href="#contact">Contact</a>`);
    S.push(`<section id="contact" class="contact"><h2>Let's build something together</h2><p class="muted" style="margin:0">${cv.openToWork ? "I'm currently open to new opportunities." : "Have a project or idea? I'd love to hear about it."}</p><div class="cta">${contactBtns}</div>${info ? `<p class="info">${info}</p>` : ""}</section>`);
  }

  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: p.title || undefined,
    url: safeUrl(p.website) || undefined,
    sameAs: social.map((s) => safeUrl(s.url)),
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(name)}${p.title ? ` — ${esc(p.title)}` : ""}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(name)}${p.title ? ` — ${esc(p.title)}` : ""}">
<meta property="og:description" content="${esc(desc)}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="${accent}">
<link rel="icon" href="${favicon}">
<style>:root{--accent:${accent}}${theme.css}${BASE_CSS}</style>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
</head>
<body>
<header class="nav"><div class="wrap"><a class="brand" href="#top">${esc(ini)}<span>.</span></a><nav>${nav.join("")}</nav></div></header>
<main class="wrap">
${S.join("\n")}
</main>
<footer><div class="wrap">© ${new Date().getFullYear()} ${esc(name)}${social[0] ? ` · ${ext(social[0].url, esc(stripProtocol(safeUrl(social[0].url))))}` : ""}</div></footer>
</body>
</html>
`;
}
