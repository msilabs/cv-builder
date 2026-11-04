"use client";
import { templates } from "@/components/templates";
import { useStore } from "@/lib/store";
import type { TemplateId } from "@/lib/types";

export const ACCENTS = ["#0f766e", "#1d4ed8", "#7c3aed", "#be123c", "#c2410c", "#334155", "#006a4e"];

export function AccentPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="text-xs text-slate-500">রং:</span>
      {ACCENTS.map((c) => (
        <button key={c} type="button" aria-label={`রং ${c}`} onClick={() => onChange(c)}
          className={`h-6 w-6 rounded-full ${value === c ? "ring-2 ring-slate-800 ring-offset-2" : ""}`} style={{ background: c }} />
      ))}
      <input type="color" aria-label="নিজের রং" value={value} onChange={(e) => onChange(e.target.value)} className="h-6 w-8 cursor-pointer" />
    </div>
  );
}

export function CVSettingsPanel() {
  const { settings, setSettings } = useStore();
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">CV টেমপ্লেট</p>
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(templates) as TemplateId[]).map((id) => (
          <button key={id} type="button" onClick={() => setSettings((s) => ({ ...s, template: id }))}
            className={`rounded-lg border p-2 text-left text-xs ${settings.template === id ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600" : "border-slate-200 hover:border-slate-300"}`}>
            <span className="block font-semibold text-slate-800">{templates[id].name}</span>
            <span className="mt-0.5 block text-[10.5px] leading-snug text-slate-500">{templates[id].desc}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <AccentPicker value={settings.accent} onChange={(c) => setSettings((s) => ({ ...s, accent: c }))} />
        {templates[settings.template].photo && (
          <label className="flex items-center gap-1.5 text-xs text-slate-600">
            <input type="checkbox" checked={settings.showPhoto} onChange={(e) => setSettings((s) => ({ ...s, showPhoto: e.target.checked }))} /> ছবি দেখাও
          </label>
        )}
      </div>
    </div>
  );
}
