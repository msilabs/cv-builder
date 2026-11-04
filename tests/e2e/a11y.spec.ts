import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { loadSample, openBuilder } from "./helpers";

// গুরুতর (serious/critical) অ্যাক্সেসিবিলিটি সমস্যা থাকলে টেস্ট ব্যর্থ
async function audit(page: import("@playwright/test").Page, name: string) {
  const res = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .exclude("iframe")
    .exclude("#cv-page")
    .exclude("[aria-hidden=\"true\"]")
    .analyze();
  const bad = res.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  if (bad.length) console.log(JSON.stringify(bad.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => [n.target.join(" "), n.any[0]?.message?.slice(0, 120)]) })), null, 1));
  expect(bad.map((v) => `${name}: ${v.id} → ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

test("home pages have no serious accessibility issues", async ({ page }) => {
  await page.goto("/");
  await audit(page, "home bn");
  await page.goto("/en/");
  await audit(page, "home en");
});

test("builder has no serious accessibility issues", async ({ page }) => {
  await openBuilder(page);
  await audit(page, "builder empty");
  await loadSample(page);
  for (const tab of ["CV", "GitHub README", "পোর্টফোলিও"]) {
    await page.getByRole("tab", { name: new RegExp(tab) }).click();
    await audit(page, `builder ${tab}`);
  }
});

test("dialog keeps focus inside and returns it on close", async ({ page }) => {
  await openBuilder(page);
  const aiBtn = page.getByRole("button", { name: "AI সহায়তা" });
  await aiBtn.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(aiBtn).toBeFocused();
});

test("menus work with the keyboard", async ({ page }) => {
  await openBuilder(page);
  const fileBtn = page.getByRole("button", { name: /^📁/ });
  await fileBtn.focus();
  await page.keyboard.press("ArrowDown");
  const items = page.getByRole("menuitem");
  await expect(items.first()).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(items.nth(1)).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toBeHidden();
  await expect(fileBtn).toBeFocused();
});
