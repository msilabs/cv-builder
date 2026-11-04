import { expect, test } from "@playwright/test";
import { loadSample, openBuilder } from "./helpers";

test("mobile: no horizontal scroll and edit/preview switch works", async ({ page }) => {
  await openBuilder(page);
  await loadSample(page);
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  const vw = await page.evaluate(() => window.innerWidth);
  expect(sw).toBeLessThanOrEqual(vw);
  await page.getByRole("button", { name: /প্রিভিউ/ }).click();
  await expect(page.locator("#cv-page")).toBeInViewport();
});
