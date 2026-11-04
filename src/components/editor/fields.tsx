"use client";
import { useLang } from "@/i18n/lang";
import { useState } from "react";

const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20";

export function Field({
  label, value, onChange, placeholder, type = "text", textarea, rows = 4, hint, disabled, id,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; textarea?: boolean; rows?: number; hint?: string; disabled?: boolean; id?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {textarea ? (
        <textarea className={inputCls} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} className={`${inputCls} disabled:bg-slate-100 disabled:text-slate-400`} type={type} value={value} placeholder={placeholder} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
    </label>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  const { t } = useLang();
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} title={on ? t.b.fields.shown : t.b.fields.hiddenTitle} onClick={onChange}
      className={`relative h-5 w-9 shrink-0 rounded-full transition ${on ? "bg-teal-600" : "bg-slate-300"}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
    </button>
  );
}

export function Section({ title, icon, children, defaultOpen = false, count, visible, onToggleVisible }: {
  title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean; count?: number; visible?: boolean; onToggleVisible?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { t } = useLang();
  const hidden = visible === false;
  return (
    <section className={`rounded-xl border bg-white shadow-sm transition ${hidden ? "border-dashed border-slate-300" : "border-slate-200 hover:border-slate-300"}`}>
      <div className="flex items-center gap-3 pr-4">
        <button type="button" onClick={() => setOpen(!open)} className="flex min-w-0 flex-1 items-center justify-between px-4 py-3 text-left">
          <span className={`flex items-center gap-2 font-semibold ${hidden ? "text-slate-400" : "text-slate-800"}`}>
            <span aria-hidden className={hidden ? "opacity-40" : ""}>{icon}</span> {title}
            {count !== undefined && count > 0 && <span className="rounded-full bg-teal-50 px-2 text-xs font-medium text-teal-700">{count}</span>}
            {hidden && <span className="rounded bg-slate-100 px-1.5 text-[11px] font-normal text-slate-500">{t.b.fields.hidden}</span>}
          </span>
          <span className={`text-slate-400 transition ${open ? "rotate-180" : ""}`}>▾</span>
        </button>
        {onToggleVisible && <Toggle on={!hidden} onChange={onToggleVisible} label={t.b.fields.toggle(title)} />}
      </div>
      {open && <div className="space-y-3 border-t border-slate-100 px-4 py-4">{children}</div>}
    </section>
  );
}

export function ItemCard({ title, onRemove, onUp, onDown, children }: { title: string; onRemove: () => void; onUp?: () => void; onDown?: () => void; children: React.ReactNode }) {
  const { t } = useLang();
  const btn = "rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-30";
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium text-slate-700">{title}</p>
        <div className="flex shrink-0 gap-1">
          <button type="button" className={btn} onClick={onUp} disabled={!onUp} title={t.b.fields.up} aria-label={t.b.fields.up}>↑</button>
          <button type="button" className={btn} onClick={onDown} disabled={!onDown} title={t.b.fields.down} aria-label={t.b.fields.down}>↓</button>
          <button type="button" className="rounded px-1.5 py-0.5 text-xs text-red-500 hover:bg-red-50" onClick={onRemove}>{t.b.fields.remove}</button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="w-full rounded-lg border-2 border-dashed border-slate-300 py-2 text-sm font-medium text-slate-500 transition hover:border-teal-500 hover:text-teal-700">
      + {children}
    </button>
  );
}

// লিস্ট হেল্পার
export function listOps<T extends { id: string }>(list: T[], set: (l: T[]) => void) {
  return {
    update: (id: string, patch: Partial<T>) => set(list.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    remove: (id: string) => set(list.filter((x) => x.id !== id)),
    move: (i: number, d: -1 | 1) => {
      const j = i + d;
      if (j < 0 || j >= list.length) return;
      const c = [...list];
      [c[i], c[j]] = [c[j], c[i]];
      set(c);
    },
    add: (item: T) => set([...list, item]),
  };
}
