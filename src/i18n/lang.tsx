"use client";
// ভাষা: বাংলা ডিফল্ট; বাংলাদেশের বাইরের ব্রাউজারে প্রথমবার ইংরেজি; বাছাই মনে থাকে
import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { dict, type Dict, type Lang } from "./dict";

import { detectLang, saveLang, subscribeLang } from "./detect";

export { detectLang, saveLang, storedLang, LANG_KEY } from "./detect";

interface Ctx {
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
}

const LangCtx = createContext<Ctx>({ lang: "bn", t: dict.bn, setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  // সার্ভারে (static build) বাংলা; ব্রাউজারে বাছাই করা বা চিনে নেওয়া ভাষা
  const lang = useSyncExternalStore(subscribeLang, detectLang, () => "bn" as Lang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = useCallback((l: Lang) => saveLang(l), []);
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
