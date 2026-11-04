"use client";
import { btnOutline, btnPrimary } from "@/components/ui/styles";
import { useLang } from "@/i18n/lang";
import { exportProfile } from "@/lib/files";
import { useStore } from "@/lib/store";

export function CrashNotice({ reset }: { reset: () => void }) {
  const { t } = useLang();
  const { profile, markBackup } = useStore();
  const C = t.b.crash;
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-900">
      <p className="font-semibold">⚠ {C.title}</p>
      <p className="mt-1">{C.body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={btnPrimary} onClick={() => { exportProfile(profile); markBackup(); }}>{C.backup}</button>
        <button type="button" className={btnOutline} onClick={reset}>{C.retry}</button>
      </div>
    </div>
  );
}
