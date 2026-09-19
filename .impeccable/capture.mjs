import { chromium } from "playwright";

const out = process.argv[2];
const width = Number(process.argv[3] || 1440);
const height = Number(process.argv[4] || 900);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height },
  reducedMotion: "reduce",
});
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.screenshot({ path: out, fullPage: false });
await browser.close();
