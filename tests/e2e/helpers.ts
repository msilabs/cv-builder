import { expect, type Page } from "@playwright/test";

export async function openBuilder(page: Page, lang: "bn" | "en" = "bn") {
  await page.addInitScript((l) => {
    if (!sessionStorage.getItem("e2e-init")) {
      localStorage.clear();
      localStorage.setItem("cvbanao:lang", l);
      sessionStorage.setItem("e2e-init", "1");
    }
  }, lang);
  await page.goto("/builder/");
  await expect(page.locator("#field-fullName")).toBeVisible();
}

export async function loadSample(page: Page) {
  await page.getByRole("button", { name: /নমুনা দেখুন|See an example/ }).first().click();
  await expect(page.locator("#cv-page")).toContainText("Tanvir Ahmed");
}

export const pdfPages = (buf: Buffer) => (buf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
