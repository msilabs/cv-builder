"use client";
import { useEffect, useId, useRef } from "react";
import { useLang } from "@/i18n/lang";

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// অ্যাক্সেসিবল ডায়ালগ: ফোকাস ভেতরে আটকে থাকে, বন্ধ হলে আগের জায়গায় ফেরে
export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  const { t } = useLang();
  const box = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // প্রথম ইনপুট/বোতামে ফোকাস (autoFocus থাকলে সেটাই)
    const t0 = setTimeout(() => {
      const el = box.current;
      if (!el || el.contains(document.activeElement)) return;
      const first = el.querySelector<HTMLElement>("[autofocus], input, textarea") ?? el.querySelectorAll<HTMLElement>(FOCUSABLE)[1] ?? el;
      first.focus();
    }, 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !box.current) return;
      const items = [...box.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((x) => x.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t0);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (opener && document.contains(opener)) opener.focus();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:items-center print:hidden" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={`my-8 w-full rounded-2xl bg-white shadow-2xl outline-none ${wide ? "max-w-3xl" : "max-w-md"}`}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h2 id={titleId} className="font-semibold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label={t.b.actions.close} className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
