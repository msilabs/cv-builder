import { expect, test } from "@playwright/test";
import { loadSample, openBuilder } from "./helpers";

// UI-তে ইমোজি নয়, SVG আইকন: ইমোজি প্রতিটা অপারেটিং সিস্টেমে আলাদা দেখায়, পতাকা Windows-এ "BD" হয়ে যায়
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{1F1E6}-\u{1F1FF}]/u;

async function uiText(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const clone = document.body.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("#cv-page, iframe, textarea, input, script, style").forEach((n) => n.remove());
    return clone.innerText;
  });
}

test("home page uses SVG icons, not emoji", async ({ page }) => {
  for (const url of ["/", "/en/"]) {
    await page.goto(url);
    const text = await uiText(page);
    expect(text.match(new RegExp(EMOJI, "gu")) ?? [], url).toEqual([]);
  }
});

test("builder uses SVG icons, not emoji", async ({ page }) => {
  await openBuilder(page);
  await loadSample(page);
  for (const tab of ["CV", "GitHub README", "পোর্টফোলিও"]) {
    await page.getByRole("tab", { name: new RegExp(tab) }).click();
    const text = await uiText(page);
    expect(text.match(new RegExp(EMOJI, "gu")) ?? [], tab).toEqual([]);
  }
  await page.getByRole("button", { name: "AI সহায়তা" }).click();
  expect((await uiText(page)).match(new RegExp(EMOJI, "gu")) ?? [], "AI panel").toEqual([]);
});

test("GitHub README tab shows the GitHub mark", async ({ page }) => {
  await openBuilder(page);
  await expect(page.getByRole("tab", { name: /GitHub README/ }).locator("svg path[d^='M8 0C3.58']")).toHaveCount(1);
});
