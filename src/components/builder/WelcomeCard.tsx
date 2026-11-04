"use client";
import { FlaskConical, FolderOpen, Pencil, Sparkles } from "@/components/ui/icons";
import { useLang } from "@/i18n/lang";

// নতুন ব্যবহারকারীর জন্য শুরুর চারটা উপায়
export function WelcomeCard({ what, onFill, onSample, onAI, onImport }: {
  what: string; onFill: () => void; onSample: () => void; onAI: () => void; onImport: () => void;
}) {
  const { t } = useLang();
  const W = t.b.welcome;
  const btn = "flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:border-teal-400 hover:text-teal-800";
  return (
    <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-4 text-sm text-slate-700 shadow-sm">
      <p className="font-semibold text-slate-900">{W.title}</p>
      <p className="mt-1 text-slate-600">{W.body(what)}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" className={btn} onClick={onFill}><Pencil className="h-4 w-4 shrink-0 text-teal-700" aria-hidden />{W.fill}</button>
        <button type="button" className={btn} onClick={onSample}><FlaskConical className="h-4 w-4 shrink-0 text-teal-700" aria-hidden />{W.sample}</button>
        <button type="button" className={btn} onClick={onAI}><Sparkles className="h-4 w-4 shrink-0 text-teal-700" aria-hidden />{W.ai}</button>
        <button type="button" className={btn} onClick={onImport}><FolderOpen className="h-4 w-4 shrink-0 text-teal-700" aria-hidden />{W.import}</button>
      </div>
    </div>
  );
}
