"use client";
import { useEffect, useState } from "react";
import { ISSUES_URL, REPO, REPO_URL } from "@/lib/site";

const GitHubIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

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
        <span className={compact ? "hidden sm:inline" : ""}>⭐ Star</span>
      </span>
      {stars !== null && <span className="flex h-full items-center border-l border-slate-300 bg-slate-50 px-2 text-xs font-semibold tabular-nums dark:border-slate-700 dark:bg-slate-800">{stars}</span>}
    </a>
  );
}

export function IssueLink({ className = "", label, title }: { className?: string; label: string; title: string }) {
  return (
    <a href={ISSUES_URL} target="_blank" rel="noreferrer" title={title} aria-label={label}
      className={`flex h-9 items-center gap-1 rounded-lg px-2 text-sm text-slate-600 hover:bg-slate-100 ${className}`}>
      🐞 <span className="hidden 2xl:inline">{label}</span>
    </a>
  );
}
