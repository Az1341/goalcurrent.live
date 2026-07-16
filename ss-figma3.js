const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setViewportSize({ width: 1440, height: 1100 });
  await p.goto("http://localhost:4885/en/match/fixture-054", { waitUntil: "domcontentloaded", timeout: 20000 });
  await p.waitForTimeout(3000);
  const accept = p.locator("button").filter({ hasText: /accept/i }).first();
  if (await accept.isVisible()) await accept.click();
  await p.waitForTimeout(1500);
  const el = p.locator("[class*=lineupPitchWrap]").first();
  if (await el.isVisible()) {
    await el.scrollIntoViewIfNeeded();
    await p.waitForTimeout(600);
    await el.screenshot({ path: "ss-figma-card.png" });
  }
  await p.screenshot({ path: "ss-figma-viewport.png" });
  await b.close();
  console.log("done");
})();