import { chromium } from "playwright";

export async function runVisualTask(url: string): Promise<string> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const title = await page.title();
  await browser.close();
  return title;
}
