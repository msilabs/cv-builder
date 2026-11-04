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
