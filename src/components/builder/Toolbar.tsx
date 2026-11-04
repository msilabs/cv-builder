"use client";
import Link from "next/link";
import { IssueLink, StarButton } from "@/components/toolbar/GitHubButtons";
import { SaveIndicator } from "@/components/toolbar/SaveIndicator";
import { LangToggle, useLang } from "@/i18n/lang";
import { useStore } from "@/lib/store";

export function Toolbar({ left, center, right }: { left?: React.ReactNode; center?: React.ReactNode; right?: React.ReactNode }) {
  const { saveState, savedAt } = useStore();
  const { lang, setLang, t } = useLang();
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <Link href={lang === "en" ? "/en/" : "/"} className="shrink-0 font-bold text-teal-700">{t.brand.a}<span className="text-slate-800">{t.brand.b}</span></Link>
        {left}
        <SaveIndicator state={saveState} savedAt={savedAt} />
      </div>
      {center && <div className="order-last flex w-full justify-center md:order-none md:w-auto md:flex-1">{center}</div>}
      <div className="ml-auto flex items-center gap-2">
        {right}
        <LangToggle lang={lang} onChange={setLang} />
        <IssueLink />
        <StarButton compact />
      </div>
    </div>
  );
}
