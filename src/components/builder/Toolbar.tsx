"use client";
import Link from "next/link";
import { IssueLink, StarButton } from "@/components/toolbar/GitHubButtons";
import { Menu } from "@/components/toolbar/Menu";
import { SaveIndicator } from "@/components/toolbar/SaveIndicator";
import { btnGhost } from "@/components/ui/styles";
import { LangToggle, useLang } from "@/i18n/lang";
import { ISSUES_URL, REPO_URL } from "@/lib/site";
import { useStore } from "@/lib/store";
import { BrandMark } from "./BrandMark";

// এক সারির টুলবার; ছোট স্ক্রিনে ভাষা, সমস্যা জানানো আর Star "আরও" মেনুতে
export function Toolbar({ left, center, right }: { left?: React.ReactNode; center?: React.ReactNode; right?: React.ReactNode }) {
  const { saveState, savedAt } = useStore();
  const { lang, setLang, t } = useLang();
  return (
    <>
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
        <Link href={lang === "en" ? "/en/" : "/"} title={t.b.toolbar.home} className="flex shrink-0 items-center gap-2 font-bold tracking-tight text-teal-700">
          <BrandMark />
          <span className="hidden sm:inline">{t.brand.a}<span className="text-slate-900">{t.brand.b}</span></span>
        </Link>
        <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" aria-hidden />
        <div className="flex min-w-0 items-center gap-2">
          {left}
          <span className="hidden lg:inline"><SaveIndicator state={saveState} savedAt={savedAt} /></span>
        </div>
        {center && <div className="hidden flex-1 justify-center lg:flex">{center}</div>}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {right}
          <div className="hidden items-center gap-2 xl:flex">
            <LangToggle lang={lang} onChange={setLang} />
            <IssueLink />
            <StarButton compact />
          </div>
          <div className="xl:hidden">
            <Menu caret={false} ariaLabel={t.b.toolbar.more} buttonClass={`${btnGhost} w-9 px-0 text-lg`} label={<span aria-hidden>⋯</span>}>
              {(close) => (
                <div className="w-56 space-y-1 p-1">
                  <div className="flex items-center justify-between px-2 py-1.5 text-sm text-slate-600">
                    {t.b.toolbar.language}
                    <LangToggle lang={lang} onChange={(l) => { setLang(l); close(); }} />
                  </div>
                  <div className="px-2 pb-1 lg:hidden"><SaveIndicator state={saveState} savedAt={savedAt} /></div>
                  <div className="border-t border-slate-100" />
                  <a href={ISSUES_URL} target="_blank" rel="noreferrer" onClick={close} className="block rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-100">🐞 {t.b.github.issue}</a>
                  <a href={REPO_URL} target="_blank" rel="noreferrer" onClick={close} className="block rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-100">⭐ {t.b.github.starTitle}</a>
                </div>
              )}
            </Menu>
          </div>
        </div>
      </div>
      {center && <div className="border-t border-slate-100 px-3 py-2 lg:hidden">{center}</div>}
    </>
  );
}
