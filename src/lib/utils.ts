export const uid = () => Math.random().toString(36).slice(2, 10);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtMonth(v: string): string {
  if (!v) return "";
  const [y, m] = v.split("-");
  if (!m) return y;
  return `${MONTHS[Number(m) - 1] ?? ""} ${y}`.trim();
}

export function fmtRange(start: string, end: string, current = false): string {
  const s = fmtMonth(start);
  const e = current ? "Present" : fmtMonth(end);
  if (s && e) return `${s} – ${e}`;
  return s || e;
}

export const lines = (t: string) =>
  t
    .split("\n")
    .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);

// কমা দিয়ে ভাগ, কিন্তু ব্র্যাকেটের ভেতরের কমা বাদে: "AWS (EC2, S3)"
export const commaList = (t: string) =>
  t
    .split(/,(?![^()]*\))/)
    .map((s) => s.trim())
    .filter(Boolean);

export const stripProtocol = (u: string) => u.replace(/^https?:\/\//, "").replace(/\/$/, "");

export const href = (u: string) => (/^https?:\/\//.test(u) ? u : `https://${u}`);
