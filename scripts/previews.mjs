// হোম পেজের প্রিভিউ ছবি তৈরি: আসল বিল্ডার থেকে স্ক্রিনশট
// ব্যবহার: npm run build && npm run previews
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";

const OUT = "src/assets/previews";
const PORT = 4174;
const server = spawn("npx", ["serve", "out", "-l", String(PORT), "--no-clipboard"], { stdio: "ignore" });
await sleep(2500);

const browser = await chromium.launch();

// স্ক্রিনশট ছোট করা (ব্রাউজারের canvas দিয়ে, বাড়তি লাইব্রেরি ছাড়া)
async function shrink(page, path, width) {
  const src = `data:image/jpeg;base64,${(await readFile(path)).toString("base64")}`;
  const out = await page.evaluate(async ({ src, width }) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = width;
    c.height = Math.round((img.naturalHeight / img.naturalWidth) * width);
    const g = c.getContext("2d");
    g.imageSmoothingQuality = "high";
    g.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.82).split(",")[1];
  }, { src, width });
  await writeFile(path, Buffer.from(out, "base64"));
}
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1.5, timezoneId: "Asia/Dhaka" });
  const page = await ctx.newPage();
  await page.addInitScript(() => localStorage.setItem("cvbanao:lang", "bn"));
  await page.goto(`http://localhost:${PORT}/builder/`);
  await page.getByRole("button", { name: /নমুনা দেখুন/ }).first().click();
  await page.getByText("✓ সেভ হয়েছে").waitFor();

  // ৬টা টেমপ্লেট
  await page.getByRole("button", { name: /সব টেমপ্লেট/ }).click();
  for (const id of ["classic", "compact", "elegant", "modern", "timeline", "minimal"]) {
    await page.evaluate((t) => {
      const d = JSON.parse(localStorage.getItem("cvbanao:data:v2"));
      d.profiles[0].settings.template = t;
      localStorage.setItem("cvbanao:data:v2", JSON.stringify(d));
    }, id);
    await page.reload();
    await page.locator("#cv-page").waitFor();
    await sleep(300);
    await page.locator("#cv-page").evaluate((el) => (el.style.transform = "none"));
    await page.locator("#cv-page").screenshot({ path: `${OUT}/tpl-${id}.jpg`, type: "jpeg", quality: 90 });
    await shrink(page, `${OUT}/tpl-${id}.jpg`, 520);
    console.log("template", id);
  }

  // পোর্টফোলিও (মিডনাইট) আর README (কোড স্টাইল)
  await page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem("cvbanao:data:v2"));
    d.profiles[0].settings.template = "classic";
    d.profiles[0].settings.portfolio.theme = "midnight";
    d.profiles[0].settings.readme.style = "code";
    d.profiles[0].settings.readme.hidden = ["education", "languages", "achievements", "certifications"];
    localStorage.setItem("cvbanao:data:v2", JSON.stringify(d));
  });
  await sleep(300);
  const shot = async (hash, file, w, h) => {
    const p = await ctx.newPage();
    await p.goto(`http://localhost:${PORT}/builder/${hash}`);
    const frame = p.locator("main iframe");
    await frame.waitFor({ state: "attached" });
    const html = await frame.getAttribute("srcdoc");
    const v = await ctx.newPage();
    await v.setViewportSize({ width: w, height: h });
    await v.setContent(html);
    await sleep(400);
    await v.screenshot({ path: `${OUT}/${file}`, type: "jpeg", quality: 90 });
    await shrink(v, `${OUT}/${file}`, Math.round(w * 0.8));
    await v.close();
    await p.close();
    console.log("preview", file);
  };
  await shot("#portfolio", "portfolio.jpg", 1200, 760);
  await shot("#readme", "readme.jpg", 860, 640);
} finally {
  await browser.close();
  server.kill();
}
