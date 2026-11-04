"use client";
import { useEffect, useRef, useState } from "react";
import { btnOutline } from "@/components/ui/styles";

export function Menu({ label, children, align = "right", badge, buttonClass, ariaLabel, caret = true }: {
  label: React.ReactNode; children: (close: () => void) => React.ReactNode; align?: "left" | "right"; badge?: boolean; buttonClass?: string; ariaLabel?: string; caret?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-expanded={open} aria-haspopup="menu" aria-label={ariaLabel} onClick={() => setOpen(!open)}
        className={`relative ${buttonClass ?? btnOutline}`}>
        {label} {caret && <span className="text-[10px] text-slate-400" aria-hidden>▾</span>}
        {badge && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />}
      </button>
      {open && (
        <div role="menu" className={`absolute z-40 mt-1.5 min-w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 ${align === "right" ? "right-0" : "left-0"}`}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function MenuItem({ onClick, children, danger, hint }: { onClick: () => void; children: React.ReactNode; danger?: boolean; hint?: string }) {
  return (
    <button type="button" onClick={onClick}
      className={`block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 ${danger ? "text-red-600" : "text-slate-700"}`}>
      {children}
      {hint && <span className="block text-[11px] text-slate-400">{hint}</span>}
    </button>
  );
}

export const MenuDivider = () => <div className="my-1 border-t border-slate-100" />;
