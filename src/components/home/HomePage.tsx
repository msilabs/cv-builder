import Link from "next/link";
import { TemplateThumb } from "@/components/builder/TemplateThumb";
import { templates } from "@/components/templates";
import { StarButton } from "@/components/toolbar/GitHubButtons";
import { dict, type Lang } from "@/i18n/dict";
import { ISSUES_URL, REPO_URL } from "@/lib/site";
import type { TemplateId } from "@/lib/types";
import { HeroShowcase } from "./HeroShowcase";
import { HomeLangSwitch, LangRedirect } from "./LangLinks";

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-400">{children}</p>
);
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{children}</h2>
);
const Sub = ({ children }: { children: React.ReactNode }) => <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-400">{children}</p>;

const Check = () => (
  <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400" fill="currentColor" aria-hidden>
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
  </svg>
);

const VIEW_HASH: Record<string, string> = { cv: "", readme: "#readme", portfolio: "#portfolio" };

export function HomePage({ lang }: { lang: Lang }) {
  const t = dict[lang];
  const h = t.home;
  const ids = Object.keys(templates) as TemplateId[];
  const primaryBtn = "inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal-700/25 transition hover:bg-teal-800 hover:shadow-teal-700/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700";
  const secondaryBtn = "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800";

  return (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <LangRedirect lang={lang} />

      {/* নেভিগেশন */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href={lang === "bn" ? "/" : "/en/"} className="text-xl font-bold tracking-tight text-teal-700 dark:text-teal-400">
            {t.brand.a}<span className="text-slate-900 dark:text-white">{t.brand.b}</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-slate-600 md:flex dark:text-slate-400">
            <a href="#outputs" className="hover:text-slate-900 dark:hover:text-white">{h.nav.outputs}</a>
            <a href="#templates" className="hover:text-slate-900 dark:hover:text-white">{h.nav.templates}</a>
            <a href="#ai" className="hover:text-slate-900 dark:hover:text-white">{h.nav.ai}</a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white">{h.nav.faq}</a>
          </nav>
          <div className="flex items-center gap-2">
            <HomeLangSwitch lang={lang} />
            <span className="hidden sm:block"><StarButton compact /></span>
            <Link href="/builder" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">{h.nav.start}</Link>
          </div>
        </div>
      </header>

      <main>
        {/* হিরো */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_0%,rgba(20,184,166,0.12),transparent),radial-gradient(40%_40%_at_90%_20%,rgba(139,92,246,0.10),transparent)]" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:pb-24">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 dark:border-teal-900 dark:bg-teal-950/60 dark:text-teal-300">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> {h.hero.badge}
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem] dark:text-white">
                {h.hero.title1}{" "}
                <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-teal-400 dark:via-emerald-400 dark:to-teal-300">{h.hero.title2}</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">{h.hero.sub}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/builder" className={primaryBtn}>{h.hero.cta} <span aria-hidden>→</span></Link>
                <a href="#templates" className={secondaryBtn}>{h.hero.secondary}</a>
              </div>
              <p className="mt-3 text-sm text-slate-500">{h.hero.note}</p>
            </div>
            <HeroShowcase />
          </div>
        </section>

        {/* আস্থার সারি */}
        <section className="border-y border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 text-sm font-medium text-slate-700 md:grid-cols-4 dark:text-slate-300">
            {h.trust.map((x, i) => (
              <li key={x} className="flex items-center justify-center gap-2 text-center">
                <span aria-hidden>{["🔒", "🚫", "🧾", "⚖️"][i]}</span> {x}
              </li>
            ))}
          </ul>
        </section>

        {/* তিন আউটপুট */}
        <section id="outputs" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:py-24">
          <Eyebrow>{h.outputs.eyebrow}</Eyebrow>
          <H2>{h.outputs.title}</H2>
          <Sub>{h.outputs.sub}</Sub>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {h.outputs.items.map((o) => (
              <div key={o.key} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-2xl dark:bg-teal-950" aria-hidden>{o.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{o.title}</h3>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{o.desc}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {o.points.map((p) => <li key={p} className="flex gap-2"><Check />{p}</li>)}
                </ul>
                <Link href={`/builder${VIEW_HASH[o.key]}`} className="mt-6 text-sm font-semibold text-teal-700 group-hover:underline dark:text-teal-400">{o.cta} →</Link>
              </div>
            ))}
          </div>
        </section>

        {/* টেমপ্লেট গ্যালারি */}
        <section id="templates" className="scroll-mt-20 bg-slate-50 py-20 sm:py-24 dark:bg-slate-900/40">
          <div className="mx-auto max-w-6xl px-4">
            <Eyebrow>{h.templates.eyebrow}</Eyebrow>
            <H2>{h.templates.title}</H2>
            <Sub>{h.templates.sub}</Sub>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {ids.map((id) => (
                <Link key={id} href={`/builder?t=${id}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-xl sm:p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex justify-center overflow-hidden rounded-lg bg-slate-100 p-3 sm:p-5 dark:bg-slate-800">
                    <div className="shadow-md transition duration-300 group-hover:scale-[1.02]">
                      <TemplateThumb id={id} accent="#0f766e" width={220} />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">{t.tpl[id].name}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${templates[id].ats ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300"}`}>
                      {templates[id].ats ? h.templates.ats : h.templates.design}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">{t.tpl[id].desc}</p>
                  <p className="mt-2 hidden text-sm font-semibold text-teal-700 sm:block dark:text-teal-400">{h.templates.use}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* AI */}
        <section id="ai" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>{h.ai.eyebrow}</Eyebrow>
              <H2>{h.ai.title}</H2>
              <Sub>{h.ai.sub}</Sub>
              <ol className="mt-8 space-y-5">
                {h.ai.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-800 dark:bg-violet-950 dark:text-violet-300">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{s.title}</p>
                      <p className="text-slate-600 dark:text-slate-400">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-500">
                {["ChatGPT", "Claude", "Gemini"].map((n) => <span key={n} className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">{n}</span>)}
              </div>
            </div>
            <div aria-hidden className="rounded-3xl bg-gradient-to-br from-violet-100 via-white to-teal-50 p-6 sm:p-10 dark:from-violet-950/60 dark:via-slate-900 dark:to-teal-950/40">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">🤖 {h.ai.guardTitle}</p>
                <div className="mt-4 space-y-2 rounded-xl border border-slate-200 p-3 font-mono text-[12px] text-slate-600 dark:border-slate-700 dark:text-slate-400">
                  <p><span className="text-red-500">−</span> Built checkout flow for the web store</p>
                  <p><span className="text-emerald-600">+</span> Built a faster checkout flow for the web store</p>
                  <p><span className="text-emerald-600">+</span> Grew conversion by <mark className="rounded bg-amber-200 px-1 text-amber-900">25%</mark> after redesign</p>
                </div>
                <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200">
                  <p className="font-semibold">⚠ {h.ai.guardSample}</p>
                  <p className="mt-1"><code className="rounded bg-white px-1.5 py-0.5 dark:bg-amber-900">25%</code></p>
                </div>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{h.ai.guardDesc}</p>
                <p className="mt-3 inline-flex rounded-md bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-800 dark:bg-violet-950 dark:text-violet-300">↩ {h.ai.undo}</p>
              </div>
            </div>
          </div>
        </section>

        {/* কীভাবে কাজ করে */}
        <section className="border-y border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-6xl px-4">
            <Eyebrow>{h.how.eyebrow}</Eyebrow>
            <H2>{h.how.title}</H2>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {h.how.steps.map((s, i) => (
                <li key={s.title} className="relative rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-5xl font-bold text-teal-600/15 dark:text-teal-400/20">0{i + 1}</span>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{s.title}</p>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* বাংলাদেশের জন্য */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <Eyebrow>{h.bd.eyebrow}</Eyebrow>
              <H2>{h.bd.title}</H2>
              <ul className="mt-8 space-y-3 text-slate-700 dark:text-slate-300">
                {h.bd.points.map((p) => <li key={p} className="flex gap-3"><Check />{p}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-6 sm:p-8 dark:border-teal-900 dark:bg-teal-950/30">
              <p className="font-semibold text-slate-900 dark:text-white">💡 {h.bd.tipsTitle}</p>
              <ul className="mt-4 space-y-3 text-slate-700 dark:text-slate-300">
                {h.bd.tips.map((p, i) => (
                  <li key={p} className="flex gap-3"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-teal-700 ring-1 ring-teal-200 dark:bg-slate-900 dark:text-teal-400 dark:ring-teal-800">{i + 1}</span>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* প্রশ্নোত্তর */}
        <section id="faq" className="scroll-mt-20 bg-slate-50 py-20 sm:py-24 dark:bg-slate-900/40">
          <div className="mx-auto max-w-3xl px-4">
            <div className="text-center">
              <Eyebrow>{h.faq.eyebrow}</Eyebrow>
              <H2>{h.faq.title}</H2>
            </div>
            <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
              {h.faq.items.map((f) => (
                <details key={f.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white">
                    {f.q}
                    <span className="text-xl text-slate-400 transition group-open:rotate-45" aria-hidden>+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* শেষ আহ্বান */}
        <section className="px-4 py-20 sm:py-24">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 px-6 py-14 text-center text-white shadow-2xl sm:px-12">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_80%_0%,rgba(52,211,153,0.35),transparent)]" />
            <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">{h.final.title}</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-lg text-teal-50/90">{h.final.sub}</p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/builder" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-teal-800 shadow-lg transition hover:bg-teal-50">{h.final.cta} <span aria-hidden>→</span></Link>
              <a href={REPO_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10">⭐ GitHub</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {t.brand.a}{t.brand.b} · {h.footer.made} 🇧🇩</p>
          <div className="flex items-center gap-5">
            <a className="hover:text-teal-700 dark:hover:text-teal-400" href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
            <a className="hover:text-teal-700 dark:hover:text-teal-400" href={ISSUES_URL} target="_blank" rel="noreferrer">{h.footer.issue}</a>
            <a className="hover:text-teal-700 dark:hover:text-teal-400" href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">{h.footer.license}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
