"use client";
import { useLang } from "@/i18n/lang";
import { useEffect, useState } from "react";
import type { SaveState } from "@/lib/store";

export function SaveIndicator({ state, savedAt }: { state: SaveState; savedAt: number | null }) {
  const [, tick] = useState(0);
  const { t } = useLang();
  const L = t.b.save;
  useEffect(() => {
    const t = setInterval(() => tick((x) => x + 1), 30000);
    return () => clearInterval(t);
  }, []);
  if (state === "error") return <span className="text-xs font-medium text-red-600" title={L.errorTitle}>{L.error}</span>;
  if (state === "saving") return <span className="whitespace-nowrap text-xs text-slate-400">{L.saving}</span>;
  if (state === "saved" && savedAt) {
    const s = Math.round((Date.now() - savedAt) / 1000);
    const when = s < 60 ? L.justNow : L.minutesAgo(Math.round(s / 60));
    return <span className="whitespace-nowrap text-xs text-teal-700" title={L.savedTitle(when)}>{L.saved}</span>;
  }
  return <span className="whitespace-nowrap text-xs text-slate-400" title={L.idleTitle}>{L.idle}</span>;
}
