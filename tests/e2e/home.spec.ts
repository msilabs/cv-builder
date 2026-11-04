import { expect, test } from "@playwright/test";

test("Bangla home page links to the builder", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("একবার তথ্য দিন");
  await page.getByRole("link", { name: /ফ্রিতে শুরু করুন/ }).first().click();
  await expect(page).toHaveURL(/\/builder\/$/);
});

test.describe("outside Bangladesh", () => {
  test.use({ timezoneId: "Europe/Berlin", locale: "de-DE" });
  test("first visit goes to the English home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Enter your details once");
  });
});

test("template gallery opens the builder with that template", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[href*="?t=timeline"]').click();
  await expect(page).toHaveURL(/\/builder\/$/);
  await expect(page.getByText("টাইমলাইন").first()).toBeVisible();
});

test("home page has one main heading and described preview images", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  const gallery = page.locator("#templates img");
  await expect(gallery).toHaveCount(6);
  for (const alt of await gallery.evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).alt))) expect(alt).toMatch(/টেমপ্লেটে বানানো নমুনা CV/);
  const broken = await page.locator("img").evaluateAll((imgs) => imgs.filter((i) => !(i as HTMLImageElement).complete || (i as HTMLImageElement).naturalWidth === 0).length);
  expect(broken).toBe(0);
});
