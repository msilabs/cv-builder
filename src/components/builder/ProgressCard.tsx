"use client";
import { ArrowRight } from "@/components/ui/icons";
import { useLang } from "@/i18n/lang";
import { cvProgress, openSection, SECTION_OF } from "@/lib/progress";
import type { CV } from "@/lib/types";

export function ProgressCard({ cv }: { cv: CV }) {
  const { t } = useLang();
  const L = t.b.progress;
  const { percent, missing } = cvProgress(cv);
  const color = percent >= 100 ? "bg-emerald-500" : percent >= 60 ? "bg-teal-600" : "bg-amber-500";
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-800">{L.title}</span>
        <span className="font-semibold tabular-nums text-slate-700">{percent}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={L.title}>
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${percent}%` }} />
      </div>
      {missing.length === 0 ? (
        <p className="mt-2 text-sm text-emerald-700">{L.done}</p>
      ) : (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500">{L.next}</span>
          {missing.slice(0, 3).map((k) => (
            <button key={k} type="button" onClick={() => openSection(SECTION_OF[k])}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 transition hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800">
              {L.items[k]} <ArrowRight className="inline h-3 w-3" aria-hidden />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
