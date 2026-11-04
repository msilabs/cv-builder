"use client";
import { Check, LoaderCircle, Lock, TriangleAlert } from "@/components/ui/icons";
import { useLang } from "@/i18n/lang";
import { useNow } from "@/lib/useNow";
import type { SaveState } from "@/lib/store";

export function SaveIndicator({ state, savedAt }: { state: SaveState; savedAt: number | null }) {
  const now = useNow();
  const { t } = useLang();
  const L = t.b.save;
  if (state === "error") return <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600" title={L.errorTitle}><TriangleAlert className="h-3.5 w-3.5" aria-hidden />{L.error}</span>;
  if (state === "saving") return <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-slate-500"><LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden />{L.saving}</span>;
  if (state === "saved" && savedAt) {
    const s = Math.max(0, Math.round((now - savedAt) / 1000));
    const when = s < 60 ? L.justNow : L.minutesAgo(Math.round(s / 60));
    return <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-teal-700" title={L.savedTitle(when)}><Check className="h-3.5 w-3.5" aria-hidden />{L.saved}</span>;
  }
  return <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-slate-500" title={L.idleTitle}><Lock className="h-3.5 w-3.5" aria-hidden />{L.idle}</span>;
}
