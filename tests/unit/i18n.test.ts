import { describe, expect, it } from "vitest";
import { dict } from "@/i18n/dict";

// দুই অভিধানে একই চাবি আছে কিনা (TypeScript ধরে, তবু রানটাইমেও যাচাই)
function shape(v: unknown, path = ""): string[] {
  if (typeof v === "function") return [`${path}()`];
  if (Array.isArray(v)) return [`${path}[${v.length}]`, ...v.flatMap((x, i) => shape(x, `${path}[${i}]`))];
  if (v && typeof v === "object") return Object.entries(v).flatMap(([k, x]) => shape(x, path ? `${path}.${k}` : k));
  return [path];
}

describe("dictionaries", () => {
  it("Bangla and English have the same keys", () => {
    expect(shape(dict.en).sort()).toEqual(shape(dict.bn).sort());
  });

  it("no empty strings", () => {
    const empty = (d: unknown, p = ""): string[] =>
      typeof d === "string" ? (d.trim() || p === "b.actions.download" ? [] : [p]) : d && typeof d === "object" ? Object.entries(d).flatMap(([k, x]) => empty(x, p ? `${p}.${k}` : k)) : [];
    expect(empty(dict.bn)).toEqual([]);
    expect(empty(dict.en)).toEqual([]);
  });

  it("English text contains no Bangla script (except the brand)", () => {
    const strings = (d: unknown): string[] =>
      typeof d === "string" ? [d] : typeof d === "function" ? [String((d as (...a: unknown[]) => unknown)("x", 1, 2, 3))] : d && typeof d === "object" ? Object.values(d).flatMap(strings) : [];
    const bad = strings({ ...dict.en, brand: undefined }).filter((s) => /[ঀ-৿]/.test(s));
    expect(bad).toEqual([]);
  });
});
