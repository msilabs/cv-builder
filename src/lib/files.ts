import type { Profile } from "./store";
import { DATA_VERSION } from "./store";

export function downloadText(filename: string, text: string, mime = "text/plain") {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9ঀ-৿]+/g, "-")
    .replace(/^-+|-+$/g, "") || "cv";

// ভার্সন নম্বর সহ এক্সপোর্ট, যাতে ভবিষ্যতে ফরম্যাট বদলালেও পুরোনো ফাইল খোলা যায়
export function exportProfile(p: Profile) {
  const payload = { app: "cvbanao", version: DATA_VERSION, exportedAt: new Date().toISOString(), name: p.name, cv: p.cv, settings: p.settings };
  downloadText(`${slug(p.cv.personal.fullName || p.name)}-cv.json`, JSON.stringify(payload, null, 2), "application/json");
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}
