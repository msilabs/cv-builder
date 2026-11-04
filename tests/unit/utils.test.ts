import { describe, expect, it } from "vitest";
import { commaList, fmtMonth, fmtRange, href, lines, stripProtocol } from "@/lib/utils";
import { techIcon, techKey } from "@/lib/techIcons";

describe("utils", () => {
  it("formats months and ranges", () => {
    expect(fmtMonth("2023-03")).toBe("Mar 2023");
    expect(fmtMonth("2016")).toBe("2016");
    expect(fmtMonth("")).toBe("");
    expect(fmtRange("2021-09", "2023-02")).toBe("Sep 2021 – Feb 2023");
    expect(fmtRange("2023-03", "", true)).toBe("Mar 2023 – Present");
    expect(fmtRange("", "2016-06")).toBe("Jun 2016");
  });

  it("splits bullet lines and strips markers", () => {
    expect(lines("- Built A\n• Led B\n\n* Did C ")).toEqual(["Built A", "Led B", "Did C"]);
  });

  it("splits comma lists but keeps commas inside parentheses", () => {
    expect(commaList("Docker, AWS (EC2, S3), Git")).toEqual(["Docker", "AWS (EC2, S3)", "Git"]);
    expect(commaList(" , ")).toEqual([]);
  });

  it("normalises links", () => {
    expect(href("github.com/me")).toBe("https://github.com/me");
    expect(href("http://a.b")).toBe("http://a.b");
    expect(stripProtocol("https://tanvir.dev/")).toBe("tanvir.dev");
  });

  it("maps skill names to icons", () => {
    expect(techKey("Next.js")).toBe("nextjs");
    expect(techKey("AWS (EC2, S3)")).toBe("aws");
    expect(techKey("Tailwind CSS")).toBe("tailwindcss");
    expect(techIcon("React Native")?.skill).toBe("react");
    expect(techIcon("Unknown thing")).toBeUndefined();
  });
});
