"use client";
import { Check, ChevronDown, ChevronUp, Plus } from "@/components/ui/icons";
import { useLang } from "@/i18n/lang";
import { useEffect, useRef, useState } from "react";

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
        <input id={id} className={`${inputCls} disabled:bg-slate-100 disabled:text-slate-500`} type={type} value={value} placeholder={placeholder} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <span className="mt-1 block text-[11px] text-slate-500">{hint}</span>}
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

export type SectionIcon = React.ComponentType<{ className?: string }>;

export function Section({ title, icon: Icon, children, defaultOpen = false, count, visible, onToggleVisible, id, done }: {
  title: string; icon: SectionIcon; children: React.ReactNode; defaultOpen?: boolean; count?: number; visible?: boolean; onToggleVisible?: () => void;
  id?: string; done?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef<HTMLElement>(null);
  // অগ্রগতি কার্ড থেকে "এই সেকশন খোলো" এলে খুলে সেখানে যাওয়া
  useEffect(() => {
    if (!id) return;
    const on = (e: Event) => {
      if ((e as CustomEvent).detail !== id) return;
      setOpen(true);
      setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    };
    window.addEventListener("cv:open-section", on);
    return () => window.removeEventListener("cv:open-section", on);
  }, [id]);
  const { t } = useLang();
  const hidden = visible === false;
  return (
    <section ref={ref} id={id ? `section-${id}` : undefined} className={`scroll-mt-4 rounded-xl border bg-white shadow-sm transition ${hidden ? "border-dashed border-slate-300" : "border-slate-200 hover:border-slate-300"}`}>
      <div className="flex items-center gap-3 pr-4">
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex min-w-0 flex-1 items-center justify-between rounded-xl px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600/40">
          <span className={`flex items-center gap-2 font-semibold ${hidden ? "text-slate-500" : "text-slate-800"}`}>
            <span aria-hidden className={`flex h-7 w-7 items-center justify-center rounded-lg ${hidden ? "bg-slate-50 text-slate-400" : "bg-teal-50 text-teal-700"}`}><Icon className="h-4 w-4" /></span> {title}
            {done && !hidden && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white" role="img" aria-label={t.b.fields.done}><Check className="h-3 w-3" strokeWidth={3} aria-hidden /></span>}
            {count !== undefined && count > 0 && <span className="rounded-full bg-teal-50 px-2 text-xs font-medium text-teal-700">{count}</span>}
            {hidden && <span className="rounded bg-slate-100 px-1.5 text-[11px] font-normal text-slate-500">{t.b.fields.hidden}</span>}
          </span>
          <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
        {onToggleVisible && <Toggle on={!hidden} onChange={onToggleVisible} label={t.b.fields.toggle(title)} />}
      </div>
      {open && <div className="space-y-3 border-t border-slate-100 px-4 py-4">{children}</div>}
    </section>
  );
}

export function ItemCard({ title, subtitle, onRemove, onUp, onDown, children }: { title: string; subtitle?: string; onRemove: () => void; onUp?: () => void; onDown?: () => void; children: React.ReactNode }) {
  const { t } = useLang();
  const [open, setOpen] = useState(true);
  const btn = "rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-30";
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className={`flex items-center justify-between gap-2 ${open ? "mb-2" : ""}`}>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} title={open ? t.b.item.collapse : t.b.item.expand}
          className="flex min-w-0 flex-1 items-center gap-1.5 text-left">
          <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-500 transition ${open ? "" : "-rotate-90"}`} aria-hidden />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-slate-800">{title}</span>
            {!open && subtitle && <span className="block truncate text-[11px] text-slate-500">{subtitle}</span>}
          </span>
        </button>
        <div className="flex shrink-0 gap-1">
          <button type="button" className={btn} onClick={onUp} disabled={!onUp} title={t.b.fields.up} aria-label={t.b.fields.up}><ChevronUp className="h-4 w-4" aria-hidden /></button>
          <button type="button" className={btn} onClick={onDown} disabled={!onDown} title={t.b.fields.down} aria-label={t.b.fields.down}><ChevronDown className="h-4 w-4" aria-hidden /></button>
          <button type="button" className="rounded px-1.5 py-0.5 text-xs text-red-500 hover:bg-red-50" onClick={onRemove}>{t.b.fields.remove}</button>
        </div>
      </div>
      {open && <div className="grid gap-3 sm:grid-cols-2">{children}</div>}
    </div>
  );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 py-2 text-sm font-medium text-slate-500 transition hover:border-teal-500 hover:text-teal-700">
      <Plus className="h-4 w-4" aria-hidden /> {children}
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
