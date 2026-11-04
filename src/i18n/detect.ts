// ভাষা চেনা ও মনে রাখা: অভিধান ছাড়া, তাই হালকা (হোম পেজেও ব্যবহার হয়)
export type Lang = "bn" | "en";

export const LANG_KEY = "cvbanao:lang";

export function storedLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return v === "bn" || v === "en" ? v : null;
  } catch {
    return null;
  }
}

const LANG_EVENT = "cvbanao:lang-change";

export function saveLang(l: Lang) {
  try {
    localStorage.setItem(LANG_KEY, l);
  } catch {}
  if (typeof window !== "undefined") window.dispatchEvent(new Event(LANG_EVENT));
}

// ভাষা বদলালে (এই ট্যাবে বা অন্য ট্যাবে) সবাইকে জানানো
export function subscribeLang(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === LANG_KEY && cb();
  window.addEventListener(LANG_EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(LANG_EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function detectLang(): Lang {
  const s = storedLang();
  if (s) return s;
  const langs = typeof navigator !== "undefined" ? navigator.languages || [navigator.language] : [];
  if (langs.some((l) => l?.toLowerCase().startsWith("bn"))) return "bn";
  try {
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Dhaka") return "bn";
  } catch {}
  return "en";
}

