// CV ডেটা থেকে এক পৃষ্ঠার পোর্টফোলিও: একটাই index.html, ভেতরে CSS, কোনো JS বা বাইরের ফাইল নেই
import type { CV, PortfolioSettings, PortfolioTheme, SectionKey } from "./types";
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

const BASE_CSS = `
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Bengali",sans-serif;background:var(--bg);color:var(--fg);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit}
.wrap{max-width:960px;margin:0 auto;padding:0 20px}
.nav{position:sticky;top:0;z-index:10;backdrop-filter:blur(10px);background:color-mix(in srgb,var(--bg) 82%,transparent);border-bottom:1px solid var(--line)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
.brand{font-weight:800;text-decoration:none;letter-spacing:-.02em}
.brand span{color:var(--accent)}
.nav nav{display:flex;gap:20px;font-size:14px}
.nav nav a{text-decoration:none;color:var(--muted)}.nav nav a:hover{color:var(--fg)}
.hero{display:flex;gap:40px;align-items:center;justify-content:space-between;padding:72px 0 48px}
.eyebrow{margin:0;color:var(--accent);font-weight:600;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px}
h1{font-size:clamp(36px,6vw,56px);line-height:1.05;margin:8px 0 8px;letter-spacing:-.03em}
.role{font-size:clamp(18px,2.4vw,22px);margin:0;color:var(--muted);font-weight:500}
.tagline{font-size:17px;margin:16px 0 0;max-width:560px}
.meta{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:18px 0 0;color:var(--muted);font-size:14px}
.badge{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;font-size:13px;font-weight:600;background:color-mix(in srgb,#22c55e 15%,transparent);color:#16a34a}
.badge:before{content:"";width:7px;height:7px;border-radius:50%;background:#22c55e}
.cta{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}
.btn{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:10px;border:1px solid var(--line);text-decoration:none;font-weight:600;font-size:15px;background:var(--card)}
.btn:hover{border-color:var(--accent)}
.btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
.avatar{width:180px;height:180px;border-radius:24px;object-fit:cover;flex-shrink:0;box-shadow:0 20px 50px -20px color-mix(in srgb,var(--accent) 60%,transparent)}
section{padding:40px 0;scroll-margin-top:70px}
h2{font-size:14px;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);margin:0 0 20px}
h3{margin:0;font-size:17px;line-height:1.35}
.muted{color:var(--muted)}
.about p{font-size:17px;margin:0;max-width:720px}
.skills{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
.skills h3{font-size:14px;margin-bottom:10px}
.chips{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.chips li{padding:4px 11px;border-radius:8px;font-size:13.5px;background:var(--chip);border:1px solid var(--line)}
.timeline{list-style:none;margin:0;padding:0}
.timeline>li{display:grid;grid-template-columns:170px 1fr;gap:20px;padding:18px 0;border-top:1px solid var(--line)}
.timeline>li:first-child{border-top:0;padding-top:0}
.when{color:var(--muted);font-size:14px;font-variant-numeric:tabular-nums}
.timeline h3 span{color:var(--muted);font-weight:500}
ul{margin:8px 0 0;padding-left:18px}li{margin:3px 0}
.projects{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.project{border:1px solid var(--line);border-radius:16px;padding:20px;background:var(--card);display:flex;flex-direction:column}
.project .tech{margin:6px 0 0;font-size:13px;color:var(--accent);font-weight:600}
.project ul{flex:1;font-size:14.5px}
.project .tag{float:right;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
.links{display:flex;gap:14px;margin:14px 0 0;font-size:14px;font-weight:600}
.links a{color:var(--accent);text-decoration:none}.links a:hover{text-decoration:underline}
.edu{display:grid;gap:14px}
.edu div{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
.contact{text-align:center;padding:64px 0}
.contact h2{color:var(--fg);font-size:clamp(26px,4vw,36px);text-transform:none;letter-spacing:-.02em;margin-bottom:10px}
.contact .cta{justify-content:center}
.contact .info{margin-top:18px;color:var(--muted);font-size:14px}
footer{border-top:1px solid var(--line);padding:24px 0;color:var(--muted);font-size:13px;text-align:center}
@media (max-width:720px){
 .nav nav{display:none}
 .hero{flex-direction:column-reverse;align-items:flex-start;padding:40px 0 24px;gap:24px}
 .avatar{width:112px;height:112px;border-radius:18px}
 .timeline>li{grid-template-columns:1fr;gap:4px}
}
@media print{.nav{display:none}}
`;

const THEMES: Record<PortfolioTheme, { name: string; desc: string; css: string }> = {
  clean: {
    name: "ক্লিন",
    desc: "হালকা, ডার্ক মোডও নিজে থেকে",
    css: `:root{--bg:#ffffff;--fg:#0f172a;--muted:#64748b;--card:#ffffff;--chip:#f8fafc;--line:#e2e8f0}
@media (prefers-color-scheme:dark){:root{--bg:#0b1120;--fg:#e2e8f0;--muted:#94a3b8;--card:#111827;--chip:#1e293b;--line:#1f2a3d}}`,
  },
  midnight: {
    name: "মিডনাইট",
    desc: "ডার্ক, ডেভেলপার ভাইব",
    css: `:root{--bg:#070b14;--fg:#e5e7eb;--muted:#8b95a7;--card:#0d1424;--chip:#111a2e;--line:#1b2538}
body{background:radial-gradient(1200px 500px at 80% -10%,color-mix(in srgb,var(--accent) 22%,transparent),transparent),var(--bg)}
h1{background:linear-gradient(90deg,var(--fg),color-mix(in srgb,var(--accent) 70%,var(--fg)));-webkit-background-clip:text;background-clip:text;color:transparent}
.chips li,.when,.project .tech{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.project:hover{border-color:color-mix(in srgb,var(--accent) 60%,var(--line))}`,
  },
  bento: {
    name: "বেন্টো",
    desc: "কার্ডের গ্রিড, আধুনিক",
    css: `:root{--bg:#f4f4f5;--fg:#18181b;--muted:#71717a;--card:#ffffff;--chip:#f4f4f5;--line:#e4e4e7}
main.wrap{display:grid;grid-template-columns:repeat(6,1fr);gap:16px;padding-top:24px;padding-bottom:24px}
main.wrap>section{grid-column:span 6;background:var(--card);border:1px solid var(--line);border-radius:24px;padding:28px}
main.wrap>.hero{padding:36px}
main.wrap>.pair-wide{grid-column:span 4}main.wrap>.pair-narrow{grid-column:span 2}main.wrap>.pair-half{grid-column:span 3}
#skills .skills{grid-template-columns:1fr}
.project{background:var(--chip);border-color:transparent}
@media (max-width:720px){main.wrap>section{grid-column:span 6!important;padding:22px}}`,
  },
};

export const PORTFOLIO_THEMES = Object.fromEntries(Object.entries(THEMES).map(([k, v]) => [k, { name: v.name, desc: v.desc }])) as Record<
  PortfolioTheme,
  { name: string; desc: string }
>;

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
