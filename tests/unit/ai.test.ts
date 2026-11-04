import { describe, expect, it } from "vitest";
import { buildPrompt, diffCV, mergeAI, toAIJson } from "@/lib/ai";
import { builderEn } from "@/i18n/builder.en";
import { sampleCV } from "@/lib/sample";

const withPhoto = { ...sampleCV, personal: { ...sampleCV.personal, photo: "data:image/png;base64,AAAA" } };

describe("AI prompts", () => {
  it("never include phone, email or photo", () => {
    const json = JSON.stringify(toAIJson(withPhoto));
    expect(json).not.toContain(sampleCV.personal.email);
    expect(json).not.toContain(sampleCV.personal.phone);
    expect(json).not.toContain("base64");
    for (const task of ["fromText", "improve", "tailor", "summary", "coverLetter"] as const) {
      const p = buildPrompt(task, withPhoto, "Backend role");
      expect(p).not.toContain(sampleCV.personal.email);
      expect(p).not.toContain("1712-345678");
      expect(p).toMatch(/Never invent facts/);
    }
  });

  it("includes the job description when tailoring", () => {
    expect(buildPrompt("tailor", sampleCV, "Needs Go and Kafka")).toContain("Needs Go and Kafka");
  });
});

describe("mergeAI", () => {
  it("replaces only returned sections and keeps contact details", () => {
    const merged = mergeAI(sampleCV, { summary: "New", personal: { email: "hacker@x.com", phone: "0", title: "Lead" } });
    expect(merged.summary).toBe("New");
    expect(merged.personal.title).toBe("Lead");
    expect(merged.personal.email).toBe(sampleCV.personal.email);
    expect(merged.personal.phone).toBe(sampleCV.personal.phone);
    expect(merged.experience).toEqual(sampleCV.experience);
  });

  it("rejects replies without known sections", () => {
    expect(() => mergeAI(sampleCV, { foo: 1 })).toThrow("no-sections");
    expect(() => mergeAI(sampleCV, null)).toThrow("no-json");
  });
});

describe("diffCV", () => {
  it("lists changes and flags numbers that were not there before", () => {
    const after = mergeAI(sampleCV, { summary: "Cut latency by 40% and grew revenue by 25% for 200k+ users." });
    const d = diffCV(sampleCV, after, builderEn.ai.diff);
    expect(d.changes).toContain("Summary rewritten");
    expect(d.newNumbers).toContain("25%");
    expect(d.newNumbers).not.toContain("40%");
    expect(d.newNumbers).not.toContain("200k");
  });

  it("ignores years", () => {
    const after = mergeAI(sampleCV, { summary: "Since 2019 I build apps." });
    expect(diffCV(sampleCV, after, builderEn.ai.diff).newNumbers).toEqual([]);
  });
});
