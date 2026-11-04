"use client";
import { useLang } from "@/i18n/lang";

// নতুন ব্যবহারকারীর জন্য শুরুর চারটা উপায়
export function WelcomeCard({ what, onFill, onSample, onAI, onImport }: {
  what: string; onFill: () => void; onSample: () => void; onAI: () => void; onImport: () => void;
}) {
  const { t } = useLang();
  const W = t.b.welcome;
  const btn = "rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:border-teal-400 hover:text-teal-800";
  return (
    <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-4 text-sm text-slate-700 shadow-sm">
      <p className="font-semibold text-slate-900">{W.title}</p>
      <p className="mt-1 text-slate-600">{W.body(what)}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" className={btn} onClick={onFill}>{W.fill}</button>
        <button type="button" className={btn} onClick={onSample}>{W.sample}</button>
        <button type="button" className={btn} onClick={onAI}>{W.ai}</button>
        <button type="button" className={btn} onClick={onImport}>{W.import}</button>
      </div>
    </div>
  );
}
