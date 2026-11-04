"use client";
import { FileText, GitHubIcon, Globe } from "@/components/ui/icons";
import { useLang } from "@/i18n/lang";
import { useEffect } from "react";

export type View = "cv" | "readme" | "portfolio";
export const VIEWS: { id: View; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "cv", icon: FileText },
  { id: "readme", icon: GitHubIcon },
  { id: "portfolio", icon: Globe },
];

// URL-এর #readme / #portfolio এর সাথে ট্যাব মিলিয়ে রাখা, যাতে লিংক শেয়ার বা রিলোডে একই ট্যাব থাকে
export function useHashView(view: View, setView: (v: View) => void, available: View[]) {
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace("#", "") as View;
      setView(available.includes(h) ? h : "cv");
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const target = view === "cv" ? window.location.pathname : `#${view}`;
    if ((view === "cv" && window.location.hash) || (view !== "cv" && window.location.hash !== `#${view}`)) history.replaceState(null, "", target);
  }, [view]);
}

export function ViewTabs({ view, setView, available }: { view: View; setView: (v: View) => void; available: View[] }) {
  const { t } = useLang();
  return (
    <div role="tablist" className="flex w-full gap-1 rounded-lg bg-slate-100 p-1 lg:w-auto">
      {VIEWS.filter((v) => available.includes(v.id)).map((v) => (
        <button key={v.id} role="tab" type="button" aria-selected={view === v.id} onClick={() => setView(v.id)}
          className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1 text-sm lg:flex-none ${view === v.id ? "bg-white font-semibold text-teal-800 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
          <v.icon className="hidden h-4 w-4 shrink-0 sm:block" />{t.b.views[v.id]}
        </button>
      ))}
    </div>
  );
}
