"use client";
import { useEffect } from "react";
import { TEMPLATE_IDS } from "@/lib/templateMeta";
import type { Settings, TemplateId } from "@/lib/types";

// হোম পেজের গ্যালারি থেকে /builder?t=modern এলে সেই টেমপ্লেট বাছাই করে URL পরিষ্কার করা
export function useTemplateFromQuery(loaded: boolean, setSettings: (fn: (s: Settings) => Settings) => void) {
  useEffect(() => {
    if (!loaded) return;
    const params = new URLSearchParams(window.location.search);
    const tpl = params.get("t") as TemplateId | null;
    if (!tpl || !TEMPLATE_IDS.includes(tpl)) return;
    setSettings((s) => ({ ...s, template: tpl }));
    params.delete("t");
    const q = params.toString();
    history.replaceState(null, "", `${window.location.pathname}${q ? `?${q}` : ""}${window.location.hash}`);
  }, [loaded, setSettings]);
}
