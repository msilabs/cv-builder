// পোর্টফোলিওর CSS: সব থিমের সাধারণ অংশ আর প্রতিটা থিমের রং/বিন্যাস
import type { PortfolioTheme } from "./types";

export const BASE_CSS = `
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

export const THEMES: Record<PortfolioTheme, { css: string }> = {
  clean: {
    css: `:root{--bg:#ffffff;--fg:#0f172a;--muted:#64748b;--card:#ffffff;--chip:#f8fafc;--line:#e2e8f0}
@media (prefers-color-scheme:dark){:root{--bg:#0b1120;--fg:#e2e8f0;--muted:#94a3b8;--card:#111827;--chip:#1e293b;--line:#1f2a3d}}`,
  },
  midnight: {
    css: `:root{--bg:#070b14;--fg:#e5e7eb;--muted:#8b95a7;--card:#0d1424;--chip:#111a2e;--line:#1b2538}
body{background:radial-gradient(1200px 500px at 80% -10%,color-mix(in srgb,var(--accent) 22%,transparent),transparent),var(--bg)}
h1{background:linear-gradient(90deg,var(--fg),color-mix(in srgb,var(--accent) 70%,var(--fg)));-webkit-background-clip:text;background-clip:text;color:transparent}
.chips li,.when,.project .tech{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.project:hover{border-color:color-mix(in srgb,var(--accent) 60%,var(--line))}`,
  },
  bento: {
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
