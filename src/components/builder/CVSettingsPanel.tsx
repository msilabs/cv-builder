"use client";
import { useLang } from "@/i18n/lang";
import { useState } from "react";
import { templates } from "@/components/templates";
import { useStore } from "@/lib/store";
import type { TemplateId } from "@/lib/types";
import { TemplateThumb } from "./TemplateThumb";

export const ACCENTS = ["#0f766e", "#1d4ed8", "#7c3aed", "#be123c", "#c2410c", "#334155", "#006a4e"];

export function AccentPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  const { t } = useLang();
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="text-xs text-slate-500">{t.b.cvPanel.color}</span>
      {ACCENTS.map((c) => (
        <button key={c} type="button" aria-label={t.b.cvPanel.colorAria(c)} onClick={() => onChange(c)}
          className={`h-6 w-6 rounded-full ${value === c ? "ring-2 ring-slate-800 ring-offset-2" : ""}`} style={{ background: c }} />
      ))}
      <input type="color" aria-label={t.b.cvPanel.customColor} value={value} onChange={(e) => onChange(e.target.value)} className="h-6 w-8 cursor-pointer" />
    </div>
  );
}

export function CVSettingsPanel() {
  const { settings, setSettings } = useStore();
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const L = t.b.cvPanel;
  const current = templates[settings.template];
  const ids = Object.keys(templates) as TemplateId[];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{L.heading}</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">
            {t.tpl[settings.template].name} <AtsBadge ats={current.ats} label={current.ats ? L.ats : L.design} />
          </p>
        </div>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
          {open ? L.close : L.all(ids.length)}
        </button>
      </div>
      {open && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ids.map((id) => (
            <button key={id} type="button" onClick={() => setSettings((s) => ({ ...s, template: id }))}
              className={`rounded-lg border p-1.5 text-left transition ${settings.template === id ? "border-teal-600 bg-teal-50 ring-2 ring-teal-600" : "border-slate-200 hover:border-slate-400"}`}>
              <TemplateThumb id={id} accent={settings.accent} width={136} />
              <span className="mt-1.5 block text-xs font-semibold text-slate-800">{t.tpl[id].name} <AtsBadge ats={templates[id].ats} label={templates[id].ats ? L.ats : L.design} /></span>
              <span className="block text-[10.5px] leading-snug text-slate-500">{t.tpl[id].desc}</span>
            </button>
          ))}
        </div>
      )}
      {open && (
        <p className="mt-2 text-[11px] text-slate-400">
          {L.atsNote}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <AccentPicker value={settings.accent} onChange={(c) => setSettings((s) => ({ ...s, accent: c }))} />
        {current.photo && (
          <label className="flex items-center gap-1.5 text-xs text-slate-600">
            <input type="checkbox" checked={settings.showPhoto} onChange={(e) => setSettings((s) => ({ ...s, showPhoto: e.target.checked }))} /> {L.showPhoto}
          </label>
        )}
      </div>
    </div>
  );
}

const AtsBadge = ({ ats, label }: { ats: boolean; label: string }) => (
  <span className={`ml-1 rounded px-1 py-[1px] align-middle text-[9.5px] font-medium ${ats ? "bg-emerald-100 text-emerald-800" : "bg-violet-100 text-violet-800"}`}>
    {label}
  </span>
);
