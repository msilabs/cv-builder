"use client";
import { ExternalLink, Monitor, Smartphone } from "@/components/ui/icons";
import { useLang } from "@/i18n/lang";
import { useState } from "react";
import { AccentPicker } from "@/components/builder/CVSettingsPanel";
import { githubUsername } from "@/lib/readme";
import { PORTFOLIO_THEME_IDS } from "@/lib/portfolio";
import { useStore } from "@/lib/store";
import type { PortfolioSettings, PortfolioTheme } from "@/lib/types";

export function PortfolioSettingsPanel() {
  const { settings, setSettings, cv } = useStore();
  const { t } = useLang();
  const L = t.b.portfolio;
  const ps = settings.portfolio;
  const set = (patch: Partial<PortfolioSettings>) => setSettings((s) => ({ ...s, portfolio: { ...s.portfolio, ...patch } }));
  const check = (key: "showEmail" | "showPhone" | "showLocation" | "showPhoto", label: string, hint?: string, disabled?: boolean) => (
    <label className={`flex items-start gap-2 text-sm ${disabled ? "text-slate-500" : "text-slate-700"}`}>
      <input type="checkbox" className="mt-1" checked={ps[key] && !disabled} disabled={disabled} onChange={(e) => set({ [key]: e.target.checked })} />
      <span>{label}{hint && <span className="block text-[11px] text-slate-500">{hint}</span>}</span>
    </label>
  );
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{L.heading}</p>
      <div className="grid grid-cols-3 gap-2">
        {PORTFOLIO_THEME_IDS.map((id: PortfolioTheme) => (
          <button key={id} type="button" onClick={() => set({ theme: id })}
            className={`rounded-lg border p-2 text-left text-xs ${ps.theme === id ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600" : "border-slate-200 hover:border-slate-300"}`}>
            <span className="block font-semibold text-slate-800">{L.themes[id].name}</span>
            <span className="mt-0.5 block text-[10.5px] leading-snug text-slate-500">{L.themes[id].desc}</span>
          </button>
        ))}
      </div>
      <AccentPicker value={ps.accent} onChange={(c) => set({ accent: c })} />
      <div className="grid gap-2 border-t border-slate-100 pt-3 sm:grid-cols-2">
        {check("showEmail", L.showEmail)}
        {check("showPhone", L.showPhone, L.showPhoneHint)}
        {check("showLocation", L.showLocation, L.showLocationHint)}
        {check("showPhoto", L.showPhoto, cv.personal.photo ? undefined : L.showPhotoHint, !cv.personal.photo)}
      </div>
      <p className="rounded-lg bg-slate-50 p-2 text-[11px] leading-relaxed text-slate-500">
        {L.note}
      </p>
    </div>
  );
}

export function PortfolioHowTo({ github }: { github: string }) {
  const u = githubUsername(github) || "username";
  const { t } = useLang();
  const L = t.b.portfolio;
  return (
    <details className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm" open>
      <summary className="cursor-pointer font-semibold text-slate-800">{L.howTitle}</summary>
      <p className="mt-3 font-medium text-slate-800">{L.pagesTitle(`${u}.github.io`)}</p>
      <ol className="mt-1.5 list-decimal space-y-1 pl-5">
        <li>
          {L.pages1(`${u}.github.io`)}{" "}
          <a href="https://github.com/new" target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-teal-700 underline">github.com/new<ExternalLink className="h-3 w-3" aria-hidden /></a>
        </li>
        <li>{L.pages2}</li>
        <li>{L.pages3(`https://${u}.github.io`)}</li>
      </ol>
      <p className="mt-3 font-medium text-slate-800">{L.netlifyTitle}</p>
      <p className="mt-1">
        <a className="text-teal-700 underline" href="https://app.netlify.com/drop" target="_blank" rel="noreferrer">app.netlify.com/drop</a> {L.netlify}
      </p>
      <p className="mt-3 text-[11px] text-slate-500">{L.update}</p>
    </details>
  );
}

export function PortfolioPreviewPane({ html }: { html: string }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const { t } = useLang();
  const btn = (d: typeof device, label: React.ReactNode) => (
    <button type="button" onClick={() => setDevice(d)}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-sm ${device === d ? "bg-white font-medium text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>{label}</button>
  );
  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-slate-200/70 p-1">
          {btn("desktop", <><Monitor className="h-4 w-4" aria-hidden />{t.b.portfolio.desktop}</>)}
          {btn("mobile", <><Smartphone className="h-4 w-4" aria-hidden />{t.b.portfolio.mobile}</>)}
        </div>
        <span className="text-xs text-slate-500">{t.b.portfolio.size((new Blob([html]).size / 1024).toFixed(0))}</span>
      </div>
      <div className="flex flex-1 justify-center">
        <iframe title="Portfolio preview" sandbox="allow-popups allow-popups-to-escape-sandbox" srcDoc={html}
          className={`min-h-[75vh] rounded-xl border border-slate-200 bg-white shadow-sm transition-all ${device === "mobile" ? "w-[390px] max-w-full" : "w-full"}`} />
      </div>
    </div>
  );
}
