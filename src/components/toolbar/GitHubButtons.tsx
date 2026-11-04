"use client";
import { Bug, GitHubIcon, Star } from "@/components/ui/icons";
import { useEffect, useState } from "react";
import { ISSUES_URL, REPO, REPO_URL } from "@/lib/site";


// স্টার সংখ্যা GitHub API থেকে (ব্যর্থ হলে শুধু বোতাম)
function useStars() {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    const key = "cvbanao:stars";
    try {
      const c = JSON.parse(sessionStorage.getItem(key) || "null");
      if (c && Date.now() - c.t < 30 * 60 * 1000) {
        Promise.resolve(c.n).then(setStars);
        return;
      }
    } catch {}
    fetch(`https://api.github.com/repos/${REPO}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (typeof d?.stargazers_count !== "number") return;
        setStars(d.stargazers_count);
        try {
          sessionStorage.setItem(key, JSON.stringify({ n: d.stargazers_count, t: Date.now() }));
        } catch {}
      })
      .catch(() => {});
  }, []);
  return stars;
}

export function StarButton({ compact = false, title }: { compact?: boolean; title: string }) {
  const stars = useStars();
  return (
    <a href={REPO_URL} target="_blank" rel="noreferrer" title={title}
      className="flex h-9 shrink-0 items-center overflow-hidden rounded-lg border border-slate-300 bg-white text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
      <span className="flex items-center gap-1.5 px-2.5">
        <GitHubIcon />
        <span className={`items-center gap-1 ${compact ? "hidden sm:inline-flex" : "inline-flex"}`}><Star className="h-3.5 w-3.5 text-amber-500" aria-hidden />Star</span>
      </span>
      {stars !== null && <span className="flex h-full items-center border-l border-slate-300 bg-slate-50 px-2 text-xs font-semibold tabular-nums dark:border-slate-700 dark:bg-slate-800">{stars}</span>}
    </a>
  );
}

export function IssueLink({ className = "", label, title }: { className?: string; label: string; title: string }) {
  return (
    <a href={ISSUES_URL} target="_blank" rel="noreferrer" title={title} aria-label={label}
      className={`flex h-9 items-center gap-1 rounded-lg px-2 text-sm text-slate-600 hover:bg-slate-100 ${className}`}>
      <Bug className="h-4 w-4" aria-hidden /> <span className="hidden 2xl:inline">{label}</span>
    </a>
  );
}
