import { describe, expect, it } from "vitest";
import { extractJSON, normalizeCV, normalizeSettings, normMonth, parseImport } from "@/lib/normalize";
import { defaultSettings } from "@/lib/sample";

describe("normMonth", () => {
  it.each([
    ["2023-3", "2023-03"],
    ["2023/03", "2023-03"],
    ["March 2023", "2023-03"],
    ["Sep. 2021", "2021-09"],
    ["2016", "2016"],
    ["soon", ""],
    [undefined, ""],
  ])("%s → %s", (input, out) => expect(normMonth(input)).toBe(out));
});

describe("normalizeCV", () => {
  it("accepts arrays from AI and fills missing fields", () => {
    const cv = normalizeCV({
      personal: { fullName: "A", unknownField: "x" },
      experience: [{ company: "X", start: "March 2022", end: "Present", bullets: ["One", "Two"] }],
      skills: [{ name: "FE", items: ["React", "Vue"] }],
      achievements: ["Won", { text: "Also" }],
      languages: ["Bangla", "English"],
    });
    expect(cv.personal.fullName).toBe("A");
    expect(cv.personal.email).toBe("");
    expect((cv.personal as unknown as Record<string, unknown>).unknownField).toBeUndefined();
    expect(cv.experience[0]).toMatchObject({ start: "2022-03", end: "", current: true, bullets: "One\nTwo" });
    expect(cv.experience[0].id).toBeTruthy();
    expect(cv.skills[0].items).toBe("React, Vue");
    expect(cv.achievements.map((a) => a.text)).toEqual(["Won", "Also"]);
    expect(cv.languages).toBe("Bangla, English");
  });

  it("only keeps uploaded data:image photos", () => {
    expect(normalizeCV({ personal: { photo: "https://evil.example/x.gif" } }).personal.photo).toBe("");
    expect(normalizeCV({ personal: { photo: "javascript:alert(1)" } }).personal.photo).toBe("");
    const ok = "data:image/png;base64,iVBORw0KGgo=";
    expect(normalizeCV({ personal: { photo: ok } }).personal.photo).toBe(ok);
  });

  it("never throws on junk", () => {
    expect(() => normalizeCV(null)).not.toThrow();
    expect(() => normalizeCV({ experience: "nope", skills: [1, null] })).not.toThrow();
  });
});

describe("normalizeSettings", () => {
  it("merges with defaults", () => {
    const s = normalizeSettings({ template: "modern", readme: { style: "code" } });
    expect(s.template).toBe("modern");
    expect(s.readme.style).toBe("code");
    expect(s.readme.hidden).toEqual(defaultSettings.readme.hidden);
    expect(s.portfolio.showPhone).toBe(false);
  });
});

describe("extractJSON", () => {
  it("handles code fences and chatter", () => {
    expect(extractJSON('Sure!\n```json\n{"a":1}\n```\nBye')).toEqual({ a: 1 });
  });
  it("fixes trailing commas and smart quotes", () => {
    expect(extractJSON('{“a”: [1, 2,],}')).toEqual({ a: [1, 2] });
  });
  it("throws coded errors", () => {
    expect(() => extractJSON("no json here")).toThrow("no-json");
    expect(() => extractJSON("{ broken: ")).toThrow();
    expect(() => extractJSON("{ a: b c }")).toThrow("parse");
  });
});

describe("parseImport", () => {
  it("reads v2 export, v1 export and raw CV", () => {
    expect(parseImport({ app: "cvbanao", version: 2, name: "X", cv: { personal: { fullName: "V2" } } }).name).toBe("X");
    expect(parseImport({ cv: { personal: { fullName: "V1" } }, settings: { template: "modern" } }).settings?.template).toBe("modern");
    expect(parseImport({ personal: { fullName: "Raw" } }).cv.personal.fullName).toBe("Raw");
  });
  it("rejects data without CV", () => {
    expect(() => parseImport({ hello: 1 })).toThrow("no-cv");
    expect(() => parseImport(null)).toThrow("empty");
  });
});
