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

test("mobile: PDF button explains how to save a PDF first", async ({ page }) => {
  await openBuilder(page);
  await page.locator("#field-fullName").fill("Mobile User");
  await page.getByRole("button", { name: /PDF/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Save as PDF");
  await page.getByRole("button", { name: "বাতিল" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
});
