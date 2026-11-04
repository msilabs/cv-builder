"use client";
import { useEffect, useRef, useState } from "react";

export function Menu({ label, children, align = "right", badge, buttonClass }: {
  label: React.ReactNode; children: (close: () => void) => React.ReactNode; align?: "left" | "right"; badge?: boolean; buttonClass?: string;
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
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}
        className={buttonClass ?? "relative flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"}>
        {label} <span className="text-[10px] text-slate-400">▾</span>
        {badge && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />}
      </button>
      {open && (
        <div className={`absolute z-40 mt-1 min-w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-xl ${align === "right" ? "right-0" : "left-0"}`}>
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
