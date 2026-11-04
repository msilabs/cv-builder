"use client";
import { Info, Save, Sparkles, TriangleAlert, Undo2, X } from "@/components/ui/icons";
// ফর্মের ওপরের সতর্কবার্তা: স্টোরেজ, অন্য ট্যাব, AI-এর পরিবর্তন, নমুনা ডেটা
import { useState } from "react";
import { useDialogs } from "@/components/ui/Dialogs";
import { btnPrimary } from "@/components/ui/styles";
import { useLang } from "@/i18n/lang";
import { exportProfile } from "@/lib/files";
import { emptyCV } from "@/lib/sample";
import { useStore } from "@/lib/store";
import type { CV } from "@/lib/types";
import { useOtherTabs } from "@/lib/useOtherTabs";

export interface AINotice {
  message: string;
  prev: CV;
  profileId: string;
}

export function BuilderNotices({ notice, onDismissNotice, leftovers }: { notice: AINotice | null; onDismissNotice: () => void; leftovers: string[] }) {
  const { t } = useLang();
  const B = t.b;
  const { confirm } = useDialogs();
  const { profile, saveState, markBackup, setCV, loaded } = useStore();
  const otherTabs = useOtherTabs();
  const [otherTabsDismissed, setOtherTabsDismissed] = useState(false);

  return (
    <>
      {saveState === "error" && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
          <p className="flex items-center gap-1.5 font-semibold"><TriangleAlert className="h-4 w-4" aria-hidden />{B.storage.title}</p>
          <p className="mt-1">{B.storage.body}</p>
          <button type="button" className={`${btnPrimary} mt-2`} onClick={() => { exportProfile(profile); markBackup(); }}><Save className="h-4 w-4" aria-hidden />{B.storage.backup}</button>
        </div>
      )}
      {otherTabs > 0 && !otherTabsDismissed && (
        <div role="status" className="flex items-start justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
          <p className="flex gap-2"><Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{B.otherTab.text}</p>
          <button type="button" className="shrink-0 text-xs font-semibold text-sky-800 underline" onClick={() => setOtherTabsDismissed(true)}>{B.otherTab.dismiss}</button>
        </div>
      )}
      {notice && (
        <div role="status" className="flex items-start justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm text-violet-900">
          <p className="flex gap-2"><Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /><span>{notice.message} {B.notice.review}</span></p>
          <div className="flex shrink-0 gap-2">
            {notice.profileId && notice.profileId === profile.id && (
              <button type="button" className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-semibold text-violet-800 ring-1 ring-violet-300 hover:bg-violet-100"
                onClick={() => { setCV(notice.prev); onDismissNotice(); }}><Undo2 className="h-3.5 w-3.5" aria-hidden />{B.notice.undo}</button>
            )}
            <button type="button" aria-label={B.actions.close} className="px-1 text-violet-600 hover:text-violet-800" onClick={onDismissNotice}><X className="h-4 w-4" aria-hidden /></button>
          </div>
        </div>
      )}
      {loaded && leftovers.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="flex items-center gap-1.5 font-semibold"><TriangleAlert className="h-4 w-4" aria-hidden />{B.leftover.title}</p>
          <p className="mt-1">{B.leftover.body} <b>{leftovers.join(", ")}</b></p>
          <button type="button" className="mt-2 rounded-md bg-amber-700 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-800"
            onClick={async () => (await confirm({ message: B.leftover.confirmClear, confirmLabel: B.dialogs.clear, danger: true })) && setCV(emptyCV)}>
            {B.leftover.clear}
          </button>
        </div>
      )}
    </>
  );
}
