"use client";
import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { AI_LINKS, AI_TASKS, type AITask, buildPrompt, diffCV, mergeAI } from "@/lib/ai";
import { copyText } from "@/lib/files";
import { extractJSON } from "@/lib/normalize";
import { isEmptyCV } from "@/lib/sample";
import { useStore } from "@/lib/store";
import type { CV } from "@/lib/types";

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <div className="flex gap-3">
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">{n}</span>
    <div className="min-w-0 flex-1">
      <p className="mb-2 font-semibold text-slate-800">{title}</p>
      {children}
    </div>
  </div>
);

export function AIPanel({ open, onClose, onApplied }: { open: boolean; onClose: () => void; onApplied: (prev: CV, profileId: string, message: string) => void }) {
  const { cv, profile, setCV, addProfile } = useStore();
  const [task, setTask] = useState<AITask | null>(null);
  const [extra, setExtra] = useState("");
  const [copied, setCopied] = useState(false);
  const [answer, setAnswer] = useState("");
  const [asNew, setAsNew] = useState(true);
  const [newName, setNewName] = useState("");

  const meta = task ? AI_TASKS[task] : null;

  const parsed = useMemo(() => {
    if (!task || !meta?.returnsJson || !answer.trim()) return null;
    try {
      const merged = mergeAI(cv, extractJSON(answer));
      return { merged, diff: diffCV(cv, merged), error: "" };
    } catch (e) {
      return { merged: null, diff: null, error: (e as Error).message };
    }
  }, [answer, cv, task, meta]);

  const reset = () => {
    setTask(null);
    setExtra("");
    setAnswer("");
    setCopied(false);
    setNewName("");
  };
  const close = () => {
    reset();
    onClose();
  };

  const choose = (t: AITask) => {
    setTask(t);
    setAnswer("");
    setCopied(false);
    setAsNew(AI_TASKS[t].asNewVersion || (t === "fromText" && !isEmptyCV(cv)));
    setNewName(t === "tailor" ? "" : "");
  };

  const copyPrompt = async () => {
    if (!task) return;
    if (await copyText(buildPrompt(task, cv, extra))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const apply = () => {
    if (!parsed?.merged || !task) return;
    if (asNew) {
      const name = newName.trim() || (task === "tailor" ? `${profile.name} – জবের জন্য` : `${profile.name} – AI`);
      addProfile(name, parsed.merged, structuredClone(profile.settings));
      onApplied(cv, "", `"${name}" নামে নতুন ভার্সন তৈরি হয়েছে। মূল ভার্সন অক্ষত আছে।`);
    } else {
      const prev = cv;
      setCV(parsed.merged);
      onApplied(prev, profile.id, "AI-এর পরিবর্তন বসানো হয়েছে।");
    }
    close();
  };

  const textarea = "w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20";

  return (
    <Modal open={open} onClose={close} title="🤖 AI সহায়তা" wide>
      {!task ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            আপনার পছন্দের AI (ChatGPT, Claude, Gemini) দিয়ে CV লেখাতে পারবেন, কোনো API key বা টাকা লাগবে না। প্রম্পট কপি করে AI-কে দিন, তারপর উত্তর এখানে পেস্ট করুন।
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {(Object.keys(AI_TASKS) as AITask[]).map((t) => (
              <button key={t} type="button" onClick={() => choose(t)}
                className="rounded-xl border border-slate-200 p-3 text-left transition hover:border-teal-500 hover:bg-teal-50/50">
                <span className="text-lg" aria-hidden>{AI_TASKS[t].icon}</span>
                <span className="mt-1 block font-semibold text-slate-800">{AI_TASKS[t].title}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{AI_TASKS[t].desc}</span>
              </button>
            ))}
          </div>
          <p className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
            🔒 AI-কে পাঠানো লেখা থেকে আপনার ফোন নম্বর, ইমেইল আর ছবি নিজে থেকে বাদ দেওয়া হয়। ইমপোর্টের সময় এগুলো আগের মতোই থাকে।
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <button type="button" onClick={reset} className="text-sm text-teal-700 hover:underline">← অন্য কাজ বাছাই করুন</button>
          <p className="text-base font-semibold text-slate-900">{meta!.icon} {meta!.title}</p>

          {meta!.needs && (
            <Step n={1} title={meta!.needs === "jd" ? "জব ডেসক্রিপশন পেস্ট করুন" : "পুরোনো CV বা LinkedIn-এর লেখা পেস্ট করুন"}>
              <textarea className={textarea} rows={6} value={extra} onChange={(e) => setExtra(e.target.value)}
                placeholder={meta!.needs === "jd" ? "We are looking for a Backend Engineer with Node.js, PostgreSQL..." : "PDF বা Word থেকে পুরো লেখা কপি করে এখানে দিন (ফোন আর ইমেইল মুছে দিতে পারেন)"} />
            </Step>
          )}

          <Step n={meta!.needs ? 2 : 1} title="প্রম্পট কপি করে AI-তে পেস্ট করুন">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={copyPrompt} disabled={!!meta!.needs && !extra.trim()}
                className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40">
                {copied ? "✓ কপি হয়েছে" : "📋 প্রম্পট কপি করুন"}
              </button>
              {AI_LINKS.map((l) => (
                <a key={l.name} href={l.url} target="_blank" rel="noreferrer" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">{l.name} ↗</a>
              ))}
            </div>
            {meta!.needs && !extra.trim() && <p className="mt-1.5 text-xs text-amber-700">আগে উপরের বক্সে লেখা দিন।</p>}
            <details className="mt-2 text-xs text-slate-500">
              <summary className="cursor-pointer">প্রম্পটটা দেখুন</summary>
              <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-3 text-[11px] text-slate-100">{buildPrompt(task, cv, extra)}</pre>
            </details>
          </Step>

          {meta!.returnsJson ? (
            <Step n={meta!.needs ? 3 : 2} title="AI-এর পুরো উত্তর এখানে পেস্ট করুন">
              <textarea className={`${textarea} font-mono text-xs`} rows={7} value={answer} onChange={(e) => setAnswer(e.target.value)}
                placeholder='AI যে JSON দিয়েছে সেটা কপি করে পেস্ট করুন। ```json ব্লক বা আগে-পরের লেখা থাকলেও সমস্যা নেই।' />
              {parsed?.error && <p className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">⚠ উত্তর বোঝা যায়নি: {parsed.error}। AI-কে বলুন &quot;Reply with only the JSON code block&quot;।</p>}
              {parsed?.diff && (
                <div className="mt-3 space-y-3">
                  <div className="rounded-lg border border-slate-200 p-3">
                    <p className="text-sm font-semibold text-slate-800">যা বদলাবে ({parsed.diff.changes.length})</p>
                    {parsed.diff.changes.length ? (
                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-600">{parsed.diff.changes.map((c, i) => <li key={i}>{c}</li>)}</ul>
                    ) : (
                      <p className="mt-1 text-sm text-slate-500">কোনো পরিবর্তন পাওয়া যায়নি।</p>
                    )}
                  </div>
                  {parsed.diff.newNumbers.length > 0 && (
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                      <p className="font-semibold">⚠ AI নতুন সংখ্যা যোগ করেছে, সত্যি কিনা যাচাই করুন</p>
                      <p className="mt-1">{parsed.diff.newNumbers.map((n) => <code key={n} className="mr-1.5 rounded bg-white px-1.5 py-0.5">{n}</code>)}</p>
                      <p className="mt-1 text-xs">আপনার দেওয়া তথ্যে এগুলো ছিল না। ভুল হলে ইমপোর্টের পর ঠিক করে নিন, নইলে ইন্টারভিউতে সমস্যা হতে পারে।</p>
                    </div>
                  )}
                  <div className="space-y-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <label className="flex items-start gap-2">
                      <input type="radio" className="mt-1" checked={asNew} onChange={() => setAsNew(true)} />
                      <span className="flex-1">
                        নতুন ভার্সন হিসেবে রাখুন <span className="text-xs text-slate-500">(&quot;{profile.name}&quot; অক্ষত থাকবে)</span>
                        {asNew && (
                          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={task === "tailor" ? "যেমন: Pathao – Backend Engineer" : `${profile.name} – AI`}
                            className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-teal-600" />
                        )}
                      </span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="radio" className="mt-1" checked={!asNew} onChange={() => setAsNew(false)} />
                      <span>&quot;{profile.name}&quot; এই ভার্সনেই বসান <span className="text-xs text-slate-500">(পরে ↩ দিয়ে ফেরত আনা যাবে)</span></span>
                    </label>
                  </div>
                  <button type="button" onClick={apply} disabled={!parsed.diff.changes.length}
                    className="w-full rounded-md bg-teal-700 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-40">
                    ✓ পরিবর্তন বসান
                  </button>
                </div>
              )}
            </Step>
          ) : (
            <Step n={3} title="AI-এর উত্তর ব্যবহার করুন">
              <p className="text-sm text-slate-600">কভার লেটার সাধারণ লেখা, তাই এখানে ইমপোর্ট লাগবে না। AI-এর উত্তর কপি করে ইমেইল বা আবেদন ফর্মে দিন। পাঠানোর আগে একবার পড়ে নিজের মতো করে নিন।</p>
            </Step>
          )}
        </div>
      )}
    </Modal>
  );
}
