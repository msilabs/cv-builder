"use client";
import { useState } from "react";
import { AccentPicker } from "@/components/builder/CVSettingsPanel";
import { githubUsername } from "@/lib/readme";
import { PORTFOLIO_THEMES } from "@/lib/portfolio";
import { useStore } from "@/lib/store";
import type { PortfolioSettings, PortfolioTheme } from "@/lib/types";

export function PortfolioSettingsPanel() {
  const { settings, setSettings, cv } = useStore();
  const ps = settings.portfolio;
  const set = (patch: Partial<PortfolioSettings>) => setSettings((s) => ({ ...s, portfolio: { ...s.portfolio, ...patch } }));
  const check = (key: "showEmail" | "showPhone" | "showLocation" | "showPhoto", label: string, hint?: string, disabled?: boolean) => (
    <label className={`flex items-start gap-2 text-sm ${disabled ? "text-slate-400" : "text-slate-700"}`}>
      <input type="checkbox" className="mt-1" checked={ps[key] && !disabled} disabled={disabled} onChange={(e) => set({ [key]: e.target.checked })} />
      <span>{label}{hint && <span className="block text-[11px] text-slate-400">{hint}</span>}</span>
    </label>
  );
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">পোর্টফোলিও থিম</p>
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(PORTFOLIO_THEMES) as PortfolioTheme[]).map((id) => (
          <button key={id} type="button" onClick={() => set({ theme: id })}
            className={`rounded-lg border p-2 text-left text-xs ${ps.theme === id ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600" : "border-slate-200 hover:border-slate-300"}`}>
            <span className="block font-semibold text-slate-800">{PORTFOLIO_THEMES[id].name}</span>
            <span className="mt-0.5 block text-[10.5px] leading-snug text-slate-500">{PORTFOLIO_THEMES[id].desc}</span>
          </button>
        ))}
      </div>
      <AccentPicker value={ps.accent} onChange={(c) => set({ accent: c })} />
      <div className="grid gap-2 border-t border-slate-100 pt-3 sm:grid-cols-2">
        {check("showEmail", "ইমেইল দেখাও")}
        {check("showPhone", "ফোন নম্বর দেখাও", "পাবলিক সাইট, স্প্যাম আসতে পারে")}
        {check("showLocation", "ঠিকানা দেখাও", "শুধু শহরের নাম দিলেই যথেষ্ট")}
        {check("showPhoto", "ছবি দেখাও", cv.personal.photo ? undefined : "ব্যক্তিগত তথ্যে ছবি আপলোড করুন", !cv.personal.photo)}
      </div>
      <p className="rounded-lg bg-slate-50 p-2 text-[11px] leading-relaxed text-slate-500">
        নিচের ফর্মের সুইচগুলো এখন শুধু পোর্টফোলিওর জন্য কাজ করবে। ⭐ ফিচারড প্রজেক্ট আগে দেখাবে।
      </p>
    </div>
  );
}

export function PortfolioHowTo({ github }: { github: string }) {
  const u = githubUsername(github) || "username";
  return (
    <details className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm" open>
      <summary className="cursor-pointer font-semibold text-slate-800">ফ্রিতে কীভাবে লাইভ করবেন?</summary>
      <p className="mt-3 font-medium text-slate-800">GitHub Pages (সাইট হবে <code className="rounded bg-slate-100 px-1">{u}.github.io</code>)</p>
      <ol className="mt-1.5 list-decimal space-y-1 pl-5">
        <li><a className="text-teal-700 underline" href="https://github.com/new" target="_blank" rel="noreferrer">github.com/new</a> এ <code className="rounded bg-slate-100 px-1">{u}.github.io</code> নামে public repo বানান।</li>
        <li>&quot;uploading an existing file&quot; লিংকে ক্লিক করে ডাউনলোড করা <code className="rounded bg-slate-100 px-1">index.html</code> আপলোড করুন, তারপর Commit চাপুন।</li>
        <li>১-২ মিনিট পর <code className="rounded bg-slate-100 px-1">https://{u}.github.io</code> খুলুন।</li>
      </ol>
      <p className="mt-3 font-medium text-slate-800">আরও সহজ: Netlify Drop</p>
      <p className="mt-1">
        <a className="text-teal-700 underline" href="https://app.netlify.com/drop" target="_blank" rel="noreferrer">app.netlify.com/drop</a> এ
        index.html রাখা ফোল্ডারটা টেনে ছেড়ে দিন, সাথে সাথে লিংক পাবেন।
      </p>
      <p className="mt-3 text-[11px] text-slate-400">তথ্য বদলালে আবার ডাউনলোড করে একই জায়গায় আপলোড করলেই সাইট আপডেট হবে।</p>
    </details>
  );
}

export function PortfolioPreviewPane({ html }: { html: string }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const btn = (d: typeof device, label: string) => (
    <button type="button" onClick={() => setDevice(d)}
      className={`rounded-md px-3 py-1 text-sm ${device === d ? "bg-white font-medium text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>
  );
  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-slate-200/70 p-1">
          {btn("desktop", "🖥 ডেস্কটপ")}
          {btn("mobile", "📱 মোবাইল")}
        </div>
        <span className="text-xs text-slate-400">{(new Blob([html]).size / 1024).toFixed(0)} KB · একটাই ফাইল</span>
      </div>
      <div className="flex flex-1 justify-center">
        <iframe title="Portfolio preview" sandbox="allow-popups allow-popups-to-escape-sandbox" srcDoc={html}
          className={`min-h-[75vh] rounded-xl border border-slate-200 bg-white shadow-sm transition-all ${device === "mobile" ? "w-[390px] max-w-full" : "w-full"}`} />
      </div>
    </div>
  );
}
