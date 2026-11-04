import { describe, expect, it } from "vitest";
import { cvProgress } from "@/lib/progress";
import { emptyCV, findSampleLeftovers, isEmptyCV, sampleCV, visibleCV } from "@/lib/sample";

describe("cvProgress", () => {
  it("is 0% for empty and 100% for the sample", () => {
    expect(cvProgress(emptyCV).percent).toBe(0);
    expect(cvProgress(sampleCV).percent).toBe(100);
    expect(cvProgress(sampleCV).missing).toEqual([]);
  });

  it("counts work done through projects for freshers", () => {
    const fresher = { ...sampleCV, experience: [] };
    expect(cvProgress(fresher).missing).not.toContain("work");
  });
});

describe("sample helpers", () => {
  it("detects leftover sample data", () => {
    expect(findSampleLeftovers(sampleCV)).toEqual(expect.arrayContaining(["fullName", "email", "summary", "experience", "projects"]));
    expect(findSampleLeftovers(emptyCV)).toEqual([]);
    const mine = { ...sampleCV, personal: { ...sampleCV.personal, fullName: "Someone Else" } };
    expect(findSampleLeftovers(mine)).not.toContain("fullName");
  });

  it("hides sections without touching the original", () => {
    const shown = visibleCV(sampleCV, ["summary", "projects"]);
    expect(shown.summary).toBe("");
    expect(shown.projects).toEqual([]);
    expect(sampleCV.projects.length).toBeGreaterThan(0);
  });

  it("knows when a CV is empty", () => {
    expect(isEmptyCV(emptyCV)).toBe(true);
    expect(isEmptyCV(sampleCV)).toBe(false);
  });
});
