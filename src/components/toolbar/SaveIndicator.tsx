"use client";
import { useEffect, useState } from "react";
import type { SaveState } from "@/lib/store";

export function SaveIndicator({ state, savedAt }: { state: SaveState; savedAt: number | null }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick((x) => x + 1), 30000);
    return () => clearInterval(t);
  }, []);
  if (state === "error") return <span className="text-xs font-medium text-red-600" title="ব্রাউজারের স্টোরেজ ভর্তি বা বন্ধ। JSON সেভ করে ব্যাকআপ নিন।">⚠ সেভ হয়নি</span>;
  if (state === "saving") return <span className="text-xs text-slate-400">সেভ হচ্ছে…</span>;
  if (state === "saved" && savedAt) {
    const s = Math.round((Date.now() - savedAt) / 1000);
    const when = s < 60 ? "এইমাত্র" : `${Math.round(s / 60)} মিনিট আগে`;
    return <span className="text-xs text-teal-700" title={`ব্রাউজারে সেভ হয়েছে (${when})`}>✓ সেভ হয়েছে</span>;
  }
  return <span className="text-xs text-slate-400" title="আপনার ডেটা এই ব্রাউজারে অটো-সেভ হয়">🔒 ব্রাউজারে সেভ</span>;
}
