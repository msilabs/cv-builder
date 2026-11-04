"use client";
import { useState } from "react";
import { copyText, downloadText } from "@/lib/files";
import { githubUsername, README_STYLES } from "@/lib/readme";
import { useStore } from "@/lib/store";
import type { ReadmeStyle } from "@/lib/types";
import { MarkdownFrame } from "./MarkdownFrame";

export function ReadmeSettingsPanel() {
  const { settings, setSettings, cv } = useStore();
  const rs = settings.readme;
  const set = (patch: Partial<typeof rs>) => setSettings((s) => ({ ...s, readme: { ...s.readme, ...patch } }));
  const user = githubUsername(cv.personal.github);
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">README স্টাইল</p>
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(README_STYLES) as ReadmeStyle[]).map((id) => (
          <button key={id} type="button" onClick={() => set({ style: id })}
            className={`rounded-lg border p-2 text-left text-xs ${rs.style === id ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600" : "border-slate-200 hover:border-slate-300"}`}>
            <span className="block font-semibold text-slate-800">{README_STYLES[id].name}</span>
            <span className="mt-0.5 block text-[10.5px] text-slate-500">{README_STYLES[id].desc}</span>
          </button>
        ))}
      </div>
      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input type="checkbox" className="mt-1" checked={rs.showStats} disabled={rs.style === "minimal"} onChange={(e) => set({ showStats: e.target.checked })} />
        <span>
          GitHub stats কার্ড দেখাও
          <span className="block text-[11px] text-slate-400">বাইরের ফ্রি সার্ভিস (github-readme-stats), মাঝে মাঝে লোড নাও হতে পারে।{!user && " আগে GitHub লিংক দিন।"}</span>
        </span>
      </label>
      <p className="rounded-lg bg-slate-50 p-2 text-[11px] leading-relaxed text-slate-500">
        নিচের ফর্মের সুইচগুলো এখন শুধু README-র জন্য কাজ করবে। CV-র সেটিং আলাদা থাকবে। প্রজেক্টে ⭐ দিলে সেটা README-তে আগে আসবে।
      </p>
    </div>
  );
}

export function ReadmeHowTo({ user }: { user: string }) {
  const u = user || "your-username";
  return (
    <details className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm" open>
      <summary className="cursor-pointer font-semibold text-slate-800">GitHub প্রোফাইলে কীভাবে বসাবেন?</summary>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5">
        <li>
          <a className="text-teal-700 underline" href="https://github.com/new" target="_blank" rel="noreferrer">github.com/new</a> এ গিয়ে
          ঠিক আপনার username দিয়ে repo বানান: <code className="rounded bg-slate-100 px-1">{u}</code>
        </li>
        <li>Public রাখুন আর &quot;Add a README file&quot; টিক দিন।</li>
        <li>README.md খুলে ✏️ (Edit) চাপুন, এখান থেকে কপি করা লেখা পেস্ট করুন।</li>
        <li>Commit করলেই <code className="rounded bg-slate-100 px-1">github.com/{u}</code> এ দেখা যাবে।</li>
      </ol>
    </details>
  );
}

export function ReadmePreviewPane({ markdown }: { markdown: string }) {
  const [mode, setMode] = useState<"preview" | "code">("preview");
  const tabBtn = (m: typeof mode, label: string) => (
    <button type="button" onClick={() => setMode(m)}
      className={`rounded-md px-3 py-1 text-sm ${mode === m ? "bg-white font-medium text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>
  );
  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-slate-200/70 p-1">
          {tabBtn("preview", "👁 প্রিভিউ")}
          {tabBtn("code", "</> Markdown")}
        </div>
        <span className="text-xs text-slate-400">{markdown.split("\n").length} লাইন</span>
      </div>
      {mode === "preview" ? (
        <MarkdownFrame markdown={markdown} />
      ) : (
        <textarea readOnly value={markdown} spellCheck={false}
          className="min-h-[70vh] w-full flex-1 rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-[13px] leading-relaxed text-slate-100" />
      )}
    </div>
  );
}

export function useReadmeActions(markdown: string, beforeExport: () => boolean) {
  const [copied, setCopied] = useState(false);
  return {
    copied,
    copy: async () => {
      if (!beforeExport()) return;
      if (await copyText(markdown)) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    },
    download: () => beforeExport() && downloadText("README.md", markdown, "text/markdown"),
  };
}
