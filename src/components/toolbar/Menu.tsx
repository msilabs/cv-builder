"use client";
import { useEffect, useRef, useState } from "react";
import { btnOutline } from "@/components/ui/styles";

export function Menu({ label, children, align = "right", badge, buttonClass, ariaLabel, caret = true }: {
  label: React.ReactNode; children: (close: () => void) => React.ReactNode; align?: "left" | "right"; badge?: boolean; buttonClass?: string; ariaLabel?: string; caret?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const items = () => [...(panel.current?.querySelectorAll<HTMLElement>('[role="menuitem"], a[href], button') ?? [])];
  const dismiss = () => setOpen(false);
  const close = (refocus = false) => {
    setOpen(false);
    if (refocus) btn.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    // খোলার সাথে সাথে প্রথম আইটেমে ফোকাস (কীবোর্ড ব্যবহারকারীদের জন্য)
    const t0 = setTimeout(() => items()[0]?.focus(), 0);
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => {
      clearTimeout(t0);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    const list = items();
    const i = list.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      list[(i + 1) % list.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      list[(i - 1 + list.length) % list.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      list[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      list[list.length - 1]?.focus();
    } else if (e.key === "Tab") setOpen(false);
  };

  return (
    <div ref={ref} className="relative" onKeyDown={onKeyDown}>
      <button ref={btn} type="button" aria-expanded={open} aria-haspopup="menu" aria-label={ariaLabel} onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === "ArrowDown" && !open) { e.preventDefault(); setOpen(true); } }}
        className={`relative ${buttonClass ?? btnOutline}`}>
        {label} {caret && <span className="text-[10px] text-slate-500" aria-hidden>▾</span>}
        {badge && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />}
      </button>
      {open && (
        <div ref={panel} role="menu" className={`absolute z-40 mt-1.5 min-w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 ${align === "right" ? "right-0" : "left-0"}`}>
          {children(dismiss)}
        </div>
      )}
    </div>
  );
}

export function MenuItem({ onClick, children, danger, hint }: { onClick: () => void; children: React.ReactNode; danger?: boolean; hint?: string }) {
  return (
    <button type="button" role="menuitem" onClick={onClick}
      className={`block w-full rounded-md px-3 py-2 text-left text-sm outline-none hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:ring-2 focus-visible:ring-teal-600/30 ${danger ? "text-red-600" : "text-slate-700"}`}>
      {children}
      {hint && <span className="block text-[11px] text-slate-500">{hint}</span>}
    </button>
  );
}

export const MenuDivider = () => <div role="separator" className="my-1 border-t border-slate-100" />;
