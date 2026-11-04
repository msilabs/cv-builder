"use client";
// ভাষা: বাংলা ডিফল্ট; বাংলাদেশের বাইরের ব্রাউজারে প্রথমবার ইংরেজি; বাছাই মনে থাকে
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { dict, type Dict, type Lang } from "./dict";

export const LANG_KEY = "cvbanao:lang";

export function storedLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return v === "bn" || v === "en" ? v : null;
  } catch {
    return null;
  }
}

export function saveLang(l: Lang) {
  try {
    localStorage.setItem(LANG_KEY, l);
  } catch {}
}

export function detectLang(): Lang {
  const s = storedLang();
  if (s) return s;
  const langs = typeof navigator !== "undefined" ? navigator.languages || [navigator.language] : [];
  if (langs.some((l) => l?.toLowerCase().startsWith("bn"))) return "bn";
  try {
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Dhaka") return "bn";
  } catch {}
  return "en";
}

interface Ctx {
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
}

const LangCtx = createContext<Ctx>({ lang: "bn", t: dict.bn, setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");
  useEffect(() => {
    setLangState(detectLang());
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = useCallback((l: Lang) => {
    saveLang(l);
    setLangState(l);
  }, []);
  return <LangCtx.Provider value={{ lang, t: dict[lang], setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

export function LangToggle({ lang, onChange, className = "" }: { lang: Lang; onChange: (l: Lang) => void; className?: string }) {
  return (
    <div role="group" aria-label="Language" className={`flex h-9 shrink-0 items-center rounded-lg border border-slate-300 bg-white p-0.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900 ${className}`}>
      {(["bn", "en"] as const).map((l) => (
        <button key={l} type="button" aria-pressed={lang === l} onClick={() => onChange(l)}
          className={`h-full rounded-md px-2 ${lang === l ? "bg-teal-700 text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
          {l === "bn" ? "বাং" : "EN"}
        </button>
      ))}
    </div>
  );
}
