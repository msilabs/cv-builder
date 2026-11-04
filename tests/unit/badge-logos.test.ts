import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// README ব্যাজের লোগোর নাম simple-icons-এ সত্যিই আছে কিনা (নাম বদলালে লোগো উধাও হয়)
const iconsDir = "node_modules/simple-icons/icons";
const slugs = new Set(readdirSync(iconsDir).map((f) => f.replace(/\.svg$/, "")));

describe("badge logos", () => {
  it("every tech badge logo exists in simple-icons", () => {
    const ours = [...readFileSync("src/lib/techIcons.ts", "utf8").matchAll(/si: "([^"]+)"/g)].map((m) => m[1]);
    expect(ours.filter((s) => !slugs.has(s))).toEqual([]);
  });
  it("every social badge logo exists in simple-icons", () => {
    const ours = [...readFileSync("src/lib/readme.ts", "utf8").matchAll(/logo: "([^"]+)"/g)].map((m) => m[1]);
    expect(ours.filter((s) => !slugs.has(s))).toEqual([]);
  });
});
