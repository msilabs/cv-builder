import { describe, expect, it } from "vitest";
import { generatePortfolio, PORTFOLIO_THEME_IDS } from "@/lib/portfolio";
import { defaultSettings, sampleCV } from "@/lib/sample";
import type { CV } from "@/lib/types";

const ps = defaultSettings.portfolio;

describe("generatePortfolio", () => {
  it("escapes HTML in every field", () => {
    const evil: CV = {
      ...sampleCV,
      personal: { ...sampleCV.personal, fullName: '<script>alert(1)</script>', tagline: '"><img src=x onerror=alert(2)>' },
      summary: "</style><script>x()</script>",
    };
    const html = generatePortfolio(evil, ps);
    expect(html).not.toContain("<script>alert");
    expect(html).not.toContain("<img src=x");
    expect(html).not.toContain("</style><script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("drops dangerous links", () => {
    const evil: CV = { ...sampleCV, personal: { ...sampleCV.personal, website: "javascript:alert(3)", github: "data:text/html,hi" } };
    const html = generatePortfolio(evil, ps);
    expect(html).not.toMatch(/<a[^>]+href="javascript:/i);
    expect(html).not.toMatch(/<a[^>]+href="data:/i);
  });

  it("hides the phone number unless asked", () => {
    expect(generatePortfolio(sampleCV, ps)).not.toContain("1712-345678");
    expect(generatePortfolio(sampleCV, { ...ps, showPhone: true })).toContain("1712-345678");
  });

  it("respects hidden sections and shows featured projects first", () => {
    const html = generatePortfolio(sampleCV, { ...ps, hidden: ["education"] });
    expect(html).not.toContain('id="education"');
    expect(html.indexOf("BusKoi")).toBeLessThan(html.indexOf("DevJobs BD"));
  });

  it("only embeds uploaded photos", () => {
    const cv = { ...sampleCV, personal: { ...sampleCV.personal, photo: "https://evil.example/p.png" } };
    expect(generatePortfolio(cv, ps)).not.toContain("evil.example");
  });

  it("renders every theme as a full document", () => {
    for (const theme of PORTFOLIO_THEME_IDS) {
      const html = generatePortfolio(sampleCV, { ...ps, theme });
      expect(html.startsWith("<!doctype html>")).toBe(true);
      expect(html).toContain('<meta property="og:title"');
    }
  });
});
