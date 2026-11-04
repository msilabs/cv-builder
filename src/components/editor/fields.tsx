"use client";
import { useState } from "react";

const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20";

export function Field({
  label, value, onChange, placeholder, type = "text", textarea, rows = 4, hint, disabled,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; textarea?: boolean; rows?: number; hint?: string; disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {textarea ? (
        <textarea className={inputCls} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={`${inputCls} disabled:bg-slate-100 disabled:text-slate-400`} type={type} value={value} placeholder={placeholder} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
    </label>
  );
}

export function Section({ title, icon, children, defaultOpen = false, count }: { title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean; count?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <span className="flex items-center gap-2 font-semibold text-slate-800">
          <span aria-hidden>{icon}</span> {title}
          {count !== undefined && count > 0 && <span className="rounded-full bg-teal-50 px-2 text-xs font-medium text-teal-700">{count}</span>}
        </span>
        <span className={`text-slate-400 transition ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && <div className="space-y-3 border-t border-slate-100 px-4 py-4">{children}</div>}
    </section>
  );
}

export function ItemCard({ title, onRemove, onUp, onDown, children }: { title: string; onRemove: () => void; onUp?: () => void; onDown?: () => void; children: React.ReactNode }) {
  const btn = "rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-30";
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium text-slate-700">{title}</p>
        <div className="flex shrink-0 gap-1">
          <button type="button" className={btn} onClick={onUp} disabled={!onUp} title="উপরে">↑</button>
          <button type="button" className={btn} onClick={onDown} disabled={!onDown} title="নিচে">↓</button>
          <button type="button" className="rounded px-1.5 py-0.5 text-xs text-red-500 hover:bg-red-50" onClick={onRemove}>মুছুন</button>
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
