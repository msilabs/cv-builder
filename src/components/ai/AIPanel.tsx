"use client";
import { ArrowLeft, Check, Copy, ExternalLink, FileUp, Lock, Mail, PenLine, Target, TriangleAlert, WandSparkles } from "@/components/ui/icons";
import { useLang } from "@/i18n/lang";
import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { AI_LINKS, AI_TASKS, type AITask, buildPrompt, diffCV, mergeAI } from "@/lib/ai";
import { copyText } from "@/lib/files";
import { extractJSON } from "@/lib/normalize";
import { isEmptyCV } from "@/lib/sample";
import { useStore } from "@/lib/store";
import type { CV } from "@/lib/types";

const TASK_ICONS: Record<AITask, React.ComponentType<{ className?: string }>> = {
  fromText: FileUp, improve: WandSparkles, tailor: Target, summary: PenLine, coverLetter: Mail,
};

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <div className="flex gap-3">
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">{n}</span>
    <div className="min-w-0 flex-1">
      <p className="mb-2 font-semibold text-slate-800">{title}</p>
      {children}
    </div>
  </div>
);

export function AIPanel({ open, onClose, onApplied, initialTask }: { open: boolean; onClose: () => void; onApplied: (prev: CV, profileId: string, message: string) => void; initialTask?: AITask | null }) {
  const { cv, profile, setCV, addProfile } = useStore();
  const { t } = useLang();
  const L = t.b.ai;
  const [task, setTask] = useState<AITask | null>(initialTask ?? null);
  const [extra, setExtra] = useState("");
  const [copied, setCopied] = useState(false);
  const [answer, setAnswer] = useState("");
  const [asNew, setAsNew] = useState(initialTask ? AI_TASKS[initialTask].asNewVersion : true);
  const [newName, setNewName] = useState("");

  const meta = task ? AI_TASKS[task] : null;


  const parsed = useMemo(() => {
    if (!task || !meta?.returnsJson || !answer.trim()) return null;
    try {
      const merged = mergeAI(cv, extractJSON(answer));
      return { merged, diff: diffCV(cv, merged, L.diff), error: "" };
    } catch (e) {
      const m = (e as Error).message;
      return { merged: null, diff: null, error: t.b.errors[m] ?? t.b.errors.parse };
    }
  }, [answer, cv, task, meta, L.diff, t.b.errors]);

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
      const name = newName.trim() || `${profile.name}${task === "tailor" ? L.tailorSuffix : L.aiSuffix}`;
      addProfile(name, parsed.merged, structuredClone(profile.settings));
      onApplied(cv, "", L.createdVersion(name));
    } else {
      const prev = cv;
      setCV(parsed.merged);
      onApplied(prev, profile.id, L.applied);
    }
    close();
  };

  const textarea = "w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20";

  return (
    <Modal open={open} onClose={close} title={L.title} wide>
      {!task ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {L.intro}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {(Object.keys(AI_TASKS) as AITask[]).map((t) => (
              <button key={t} type="button" onClick={() => choose(t)}
                className="rounded-xl border border-slate-200 p-3 text-left transition hover:border-teal-500 hover:bg-teal-50/50">
                {(() => { const TaskIcon = TASK_ICONS[t]; return <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700" aria-hidden><TaskIcon className="h-4 w-4" /></span>; })()}
                <span className="mt-1 block font-semibold text-slate-800">{L.tasks[t].title}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{L.tasks[t].desc}</span>
              </button>
            ))}
          </div>
          <p className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
            <span className="flex gap-2"><Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />{L.privacy}</span>
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-sm text-teal-700 hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden />{L.back}</button>
          <p className="flex items-center gap-2 text-base font-semibold text-slate-900">{(() => { const TaskIcon = TASK_ICONS[task]; return <TaskIcon className="h-5 w-5 text-violet-700" aria-hidden />; })()}{L.tasks[task].title}</p>

          {meta!.needs && (
            <Step n={1} title={meta!.needs === "jd" ? L.stepJd : L.stepOldCv}>
              <textarea className={textarea} rows={6} value={extra} onChange={(e) => setExtra(e.target.value)}
                placeholder={meta!.needs === "jd" ? "We are looking for a Backend Engineer with Node.js, PostgreSQL..." : L.oldCvPlaceholder} />
            </Step>
          )}

          <Step n={meta!.needs ? 2 : 1} title={L.stepCopy}>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={copyPrompt} disabled={!!meta!.needs && !extra.trim()}
                className="inline-flex items-center gap-1.5 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40">
                {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                {copied ? L.copied : L.copy}
              </button>
              {AI_LINKS.map((l) => (
                <a key={l.name} href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">{l.name}<ExternalLink className="h-3.5 w-3.5" aria-hidden /></a>
              ))}
            </div>
            {meta!.needs && !extra.trim() && <p className="mt-1.5 text-xs text-amber-700">{L.needInput}</p>}
            <details className="mt-2 text-xs text-slate-500">
              <summary className="cursor-pointer">{L.showPrompt}</summary>
              <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-3 text-[11px] text-slate-100">{buildPrompt(task, cv, extra)}</pre>
            </details>
          </Step>

          {meta!.returnsJson ? (
            <Step n={meta!.needs ? 3 : 2} title={L.stepPaste}>
              <textarea className={`${textarea} font-mono text-xs`} rows={7} value={answer} onChange={(e) => setAnswer(e.target.value)}
                placeholder={L.pastePlaceholder} />
              {parsed?.error && <p className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">{L.parseError(parsed.error)}</p>}
              {parsed?.diff && (
                <div className="mt-3 space-y-3">
                  <div className="rounded-lg border border-slate-200 p-3">
                    <p className="text-sm font-semibold text-slate-800">{L.changesTitle(parsed.diff.changes.length)}</p>
                    {parsed.diff.changes.length ? (
                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-600">{parsed.diff.changes.map((c, i) => <li key={i}>{c}</li>)}</ul>
                    ) : (
                      <p className="mt-1 text-sm text-slate-500">{L.noChanges}</p>
                    )}
                  </div>
                  {parsed.diff.newNumbers.length > 0 && (
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                      <p className="flex items-center gap-1.5 font-semibold"><TriangleAlert className="h-4 w-4" aria-hidden />{L.numbersTitle}</p>
                      <p className="mt-1">{parsed.diff.newNumbers.map((n) => <code key={n} className="mr-1.5 rounded bg-white px-1.5 py-0.5">{n}</code>)}</p>
                      <p className="mt-1 text-xs">{L.numbersHint}</p>
                    </div>
                  )}
                  <div className="space-y-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <label className="flex items-start gap-2">
                      <input type="radio" className="mt-1" checked={asNew} onChange={() => setAsNew(true)} />
                      <span className="flex-1">
                        {L.asNew} <span className="text-xs text-slate-500">{L.asNewHint(profile.name)}</span>
                        {asNew && (
                          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={task === "tailor" ? L.tailorPlaceholder : `${profile.name}${L.aiSuffix}`}
                            className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-teal-600" />
                        )}
                      </span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="radio" className="mt-1" checked={!asNew} onChange={() => setAsNew(false)} />
                      <span>{L.inPlace(profile.name)} <span className="text-xs text-slate-500">{L.inPlaceHint}</span></span>
                    </label>
                  </div>
                  <button type="button" onClick={apply} disabled={!parsed.diff.changes.length}
                    className="w-full rounded-md bg-teal-700 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-40">
                    <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4" aria-hidden />{L.apply}</span>
                  </button>
                </div>
              )}
            </Step>
          ) : (
            <Step n={3} title={L.stepUse}>
              <p className="text-sm text-slate-600">{L.coverUse}</p>
            </Step>
          )}
        </div>
      )}
    </Modal>
  );
}
