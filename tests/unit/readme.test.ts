import { describe, expect, it } from "vitest";
import { generateReadme, githubUsername, README_STYLE_IDS, techBadge } from "@/lib/readme";
import { defaultSettings, sampleCV } from "@/lib/sample";

const rs = defaultSettings.readme;

describe("README generator", () => {
  it("reads the GitHub username", () => {
    expect(githubUsername("https://github.com/tanvir-dev")).toBe("tanvir-dev");
    expect(githubUsername("tanvir-dev")).toBe("tanvir-dev");
    expect(githubUsername("not a url!")).toBe("");
  });

  it("uses a dark logo on light badges", () => {
    expect(techBadge("JavaScript")).toContain("logoColor=black");
    expect(techBadge("Docker")).toContain("logoColor=white");
    expect(techBadge("C++")).toContain("C%2B%2B");
  });

  it("builds every style", () => {
    for (const style of README_STYLE_IDS) {
      const md = generateReadme(sampleCV, { ...rs, style });
      expect(md).toContain("Tanvir");
      expect(md.endsWith("\n")).toBe(true);
    }
  });

  it("minimal style has no external images", () => {
    expect(generateReadme(sampleCV, { ...rs, style: "minimal" })).not.toContain("<img");
  });

  it("omits hidden sections and stats unless enabled", () => {
    const md = generateReadme(sampleCV, { ...rs, hidden: ["projects", "education"] });
    expect(md).not.toContain("BusKoi");
    expect(md).not.toContain("github-readme-stats");
    expect(generateReadme(sampleCV, { ...rs, showStats: true })).toContain("github-readme-stats");
  });

  it("escapes angle brackets from user text", () => {
    const cv = { ...sampleCV, summary: "I <3 <script>code</script>" };
    expect(generateReadme(cv, { ...rs, hidden: [] })).not.toContain("<script>");
  });
});
