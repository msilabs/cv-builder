import { expect, test } from "@playwright/test";
import { loadSample, openBuilder, pdfPages } from "./helpers";

test("sample CV prints to a single A4 page", async ({ page }) => {
  await openBuilder(page);
  await loadSample(page);
  await page.emulateMedia({ media: "print" });
  const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
  expect(pdfPages(pdf)).toBe(1);
});

test("data survives a reload", async ({ page }) => {
  await openBuilder(page);
  await page.locator("#field-fullName").fill("Rahim Uddin");
  await expect(page.getByText("✓ সেভ হয়েছে")).toBeVisible();
  await page.reload();
  await expect(page.locator("#field-fullName")).toHaveValue("Rahim Uddin");
});

test("imports an AI-style reply with code fences", async ({ page }) => {
  await openBuilder(page);
  const reply = 'Sure!\n```json\n{"personal":{"fullName":"AI Person"},"experience":[{"company":"X","role":"Eng","start":"March 2022","end":"Present","bullets":["Did A","Did B",]}]}\n```';
  await page.locator('input[type="file"]').first().setInputFiles({ name: "ai.txt", mimeType: "text/plain", buffer: Buffer.from(reply) });
  await expect(page.locator("#cv-page")).toContainText("AI Person");
  await expect(page.locator("#cv-page")).toContainText("Mar 2022 – Present");
});

test("versions: duplicate keeps the original untouched", async ({ page }) => {
  await openBuilder(page);
  await loadSample(page);
  await page.getByRole("button", { name: /মূল CV/ }).click();
  await page.getByText("এই ভার্সনের কপি বানান").click();
  await page.locator("#dlg-input").fill("Pathao – Backend");
  await page.getByRole("button", { name: "সেভ করুন" }).click();
  await page.locator("#field-fullName").fill("Changed In Copy");
  await page.getByRole("button", { name: /Pathao – Backend/ }).click();
  await page.getByRole("button", { name: /^✓?\s*মূল CV/ }).last().click();
  await expect(page.locator("#field-fullName")).toHaveValue("Tanvir Ahmed");
});

test("English mode shows no Bangla text", async ({ page }) => {
  await openBuilder(page, "en");
  await loadSample(page);
  for (const tab of ["CV", "GitHub README", "Portfolio"]) {
    await page.getByRole("tab", { name: new RegExp(tab) }).click();
    const text = await page.locator("body").innerText();
    const bangla = (text.match(/[ঀ-৿]+/g) ?? []).filter((w) => w !== "বানাও" && w !== "বাং");
    expect(bangla, `tab ${tab}`).toEqual([]);
  }
});

test("portfolio download escapes HTML and hides phone", async ({ page }) => {
  await openBuilder(page);
  await loadSample(page);
  await page.locator("#field-fullName").fill('<script>alert(1)</script>');
  await page.getByRole("tab", { name: /পোর্টফোলিও/ }).click();
  const [dl] = await Promise.all([
    page.waitForEvent("download"),
    (async () => {
      await page.getByRole("button", { name: /index\.html/ }).click();
      await page.getByRole("button", { name: "তবুও চালিয়ে যান" }).click();
    })(),
  ]);
  const html = (await (await dl.createReadStream()).toArray()).join("");
  expect(html).not.toContain("<script>alert");
  expect(html).not.toContain("1712-345678");
});

test("two tabs stay in sync", async ({ page, context }) => {
  await openBuilder(page);
  const other = await context.newPage();
  await other.goto("/builder/");
  await other.locator("#field-fullName").fill("From Other Tab");
  await expect(page.locator("#field-fullName")).toHaveValue("From Other Tab");
});

test("hiding a section removes it from the CV only", async ({ page }) => {
  await openBuilder(page);
  await loadSample(page);
  await page.getByRole("switch", { name: /পড়াশোনা/ }).click();
  await expect(page.locator("#cv-page")).not.toContainText("Higher Secondary Certificate");
  await page.getByRole("tab", { name: /README/ }).click();
  await expect(page.getByRole("switch", { name: /পড়াশোনা/ })).toHaveAttribute("aria-checked", "false");
  await page.getByRole("tab", { name: /(^|\s)CV$/ }).click();
  await page.getByRole("switch", { name: /পড়াশোনা/ }).click();
  await expect(page.locator("#cv-page")).toContainText("Higher Secondary Certificate");
});

test("large photos are resized before saving", async ({ page }) => {
  await openBuilder(page);
  await page.locator('input[type="file"][accept="image/*"]').setInputFiles("tests/e2e/fixtures/big-photo.png");
  await expect(page.locator("img[src^='data:image/jpeg']").first()).toBeVisible();
  await expect(page.getByText("✓ সেভ হয়েছে")).toBeVisible();
  const photo = await page.evaluate(() => JSON.parse(localStorage.getItem("cvbanao:data:v2")!).profiles[0].cv.personal.photo as string);
  expect(photo.startsWith("data:image/jpeg")).toBe(true);
  expect(photo.length).toBeLessThan(120_000);
  const width = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    return img.naturalWidth;
  }, photo);
  expect(width).toBe(400);
});

test("warns when the builder is open in another tab", async ({ page, context }) => {
  await openBuilder(page);
  const other = await context.newPage();
  await other.goto("/builder/");
  await expect(page.getByText(/অন্য একটা ট্যাবেও খোলা আছে/)).toBeVisible();
  await page.getByRole("button", { name: "বুঝেছি" }).click();
  await expect(page.getByText(/অন্য একটা ট্যাবেও খোলা আছে/)).toBeHidden();
});
