const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const outDir = path.join(__dirname, "..", "screenshots", "lineup-verification");
const url = "https://goalcurrent.live/match/fixture-100";

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  try {
    const desktop = await browser.newPage();
    await desktop.setViewportSize({ width: 1440, height: 900 });
    await desktop.goto(url, { waitUntil: "networkidle", timeout: 120000 });
    const accept = desktop.locator("button").filter({ hasText: /accept/i }).first();
    if (await accept.isVisible().catch(() => false)) await accept.click();
    await desktop.waitForTimeout(2500);
    await desktop.screenshot({ path: path.join(outDir, "lineup-desktop.png"), fullPage: true });
    await desktop.close();

    const mobile = await browser.newPage();
    await mobile.setViewportSize({ width: 390, height: 844 });
    await mobile.goto(url, { waitUntil: "networkidle", timeout: 120000 });
    const acceptM = mobile.locator("button").filter({ hasText: /accept/i }).first();
    if (await acceptM.isVisible().catch(() => false)) await acceptM.click();
    const heading = mobile.locator("h2").filter({ hasText: /lineup/i }).first();
    if (await heading.isVisible().catch(() => false)) {
      await heading.scrollIntoViewIfNeeded();
      await mobile.waitForTimeout(1200);
    }
    await mobile.screenshot({ path: path.join(outDir, "lineup-mobile.png"), fullPage: true });
    await mobile.close();
    console.log("done", outDir);
  } finally {
    await browser.close();
  }
})();