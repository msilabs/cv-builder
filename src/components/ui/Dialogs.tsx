"use client";
import { CircleCheck, Info, TriangleAlert } from "./icons";
// ব্রাউজারের confirm/prompt/alert-এর বদলে সাইটের ডিজাইনের ডায়ালগ ও টোস্ট
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/lang";
import { Modal } from "./Modal";
import { btnOutline, btnPrimary } from "./styles";

interface ConfirmOpts { title?: string; message: string; confirmLabel?: string; danger?: boolean }
interface PromptOpts { title: string; label?: string; defaultValue?: string; confirmLabel?: string }
type ToastKind = "success" | "error" | "info";
interface Toast { id: number; text: string; kind: ToastKind }

interface Ctx {
  confirm: (o: ConfirmOpts) => Promise<boolean>;
  prompt: (o: PromptOpts) => Promise<string | null>;
  toast: (text: string, kind?: ToastKind) => void;
}

const DialogCtx = createContext<Ctx | null>(null);

type Pending =
  | { type: "confirm"; opts: ConfirmOpts; resolve: (v: boolean) => void }
  | { type: "prompt"; opts: PromptOpts; resolve: (v: string | null) => void };

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLang();
  const [pending, setPending] = useState<Pending | null>(null);
  const [value, setValue] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const seq = useRef(0);

  const confirm = useCallback((opts: ConfirmOpts) => new Promise<boolean>((resolve) => setPending({ type: "confirm", opts, resolve })), []);
  const prompt = useCallback(
    (opts: PromptOpts) =>
      new Promise<string | null>((resolve) => {
        setValue(opts.defaultValue ?? "");
        setPending({ type: "prompt", opts, resolve });
      }),
    [],
  );
  const toast = useCallback((text: string, kind: ToastKind = "success") => {
    const id = ++seq.current;
    setToasts((l) => [...l, { id, text, kind }]);
    setTimeout(() => setToasts((l) => l.filter((x) => x.id !== id)), 3200);
  }, []);

  useEffect(() => {
    if (pending?.type === "prompt") setTimeout(() => inputRef.current?.select(), 30);
  }, [pending]);

  const close = (ok: boolean) => {
    if (!pending) return;
    if (pending.type === "confirm") pending.resolve(ok);
    else pending.resolve(ok && value.trim() ? value.trim().slice(0, 60) : null);
    setPending(null);
  };

  return (
    <DialogCtx.Provider value={{ confirm, prompt, toast }}>
      {children}
      <Modal open={!!pending} onClose={() => close(false)} title={pending?.type === "prompt" ? pending.opts.title : pending?.opts.title || "CVবানাও"}>
        {pending?.type === "confirm" && (
          <>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{pending.opts.message}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className={btnOutline} onClick={() => close(false)}>{t.b.dialogs.cancel}</button>
              <button type="button" autoFocus onClick={() => close(true)}
                className={pending.opts.danger ? `${btnPrimary} !bg-red-600 hover:!bg-red-700` : btnPrimary}>
                {pending.opts.confirmLabel ?? t.b.dialogs.ok}
              </button>
            </div>
          </>
        )}
        {pending?.type === "prompt" && (
          <form onSubmit={(e) => { e.preventDefault(); close(true); }}>
            {pending.opts.label && <label htmlFor="dlg-input" className="mb-1.5 block text-sm text-slate-600">{pending.opts.label}</label>}
            <input id="dlg-input" ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} maxLength={60}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20" />
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className={btnOutline} onClick={() => close(false)}>{t.b.dialogs.cancel}</button>
              <button type="submit" className={btnPrimary} disabled={!value.trim()}>{pending.opts.confirmLabel ?? t.b.dialogs.save}</button>
            </div>
          </form>
        )}
      </Modal>
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-16 z-[60] flex flex-col items-center gap-2 px-4 print:hidden">
        {toasts.map((x) => (
          <div key={x.id} role="status"
            className={`pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg ring-1 ${
              x.kind === "error" ? "bg-red-600 text-white ring-red-700" : x.kind === "info" ? "bg-slate-900 text-white ring-slate-800" : "bg-teal-700 text-white ring-teal-800"
            }`}>
            {x.kind === "error" ? <TriangleAlert className="h-4 w-4" aria-hidden /> : x.kind === "info" ? <Info className="h-4 w-4" aria-hidden /> : <CircleCheck className="h-4 w-4" aria-hidden />} {x.text}
          </div>
        ))}
      </div>
    </DialogCtx.Provider>
  );
}

export function useDialogs() {
  const c = useContext(DialogCtx);
  if (!c) throw new Error("useDialogs must be used inside DialogProvider");
  return c;
}
