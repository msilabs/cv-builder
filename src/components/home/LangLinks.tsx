"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { detectLang, type Lang, saveLang, storedLang } from "@/i18n/detect";

// হোম পেজে ভাষা বদলালে / আর /en/ এর মধ্যে যাওয়া, পছন্দ মনে রাখা
export function HomeLangSwitch({ lang }: { lang: Lang }) {
  return (
    <div role="group" aria-label="Language" className="flex shrink-0 rounded-md border border-slate-300 bg-white p-0.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900">
      {(["bn", "en"] as const).map((l) => (
        <Link key={l} href={l === "bn" ? "/" : "/en/"} onClick={() => saveLang(l)} aria-current={lang === l ? "page" : undefined}
          className={`rounded px-2 py-1 ${lang === l ? "bg-teal-700 text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
          {l === "bn" ? "বাং" : "EN"}
        </Link>
      ))}
    </div>
  );
}

// প্রথমবার: বাংলাদেশের বাইরের ব্রাউজার হলে ইংরেজি পেজে
export function LangRedirect({ lang }: { lang: Lang }) {
  const router = useRouter();
  useEffect(() => {
    document.documentElement.lang = lang;
    if (lang === "en") {
      if (!storedLang()) saveLang("en");
      return;
    }
    if (detectLang() === "en") router.replace("/en/");
  }, [lang, router]);
  return null;
}
