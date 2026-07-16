const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  // Wide viewport to match Figma 1440px reference
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto("http://localhost:4885/en/match/fixture-054", { waitUntil: "networkidle" });
  const accept = p.locator("button").filter({ hasText: /accept/i }).first();
  if (await accept.isVisible()) await accept.click();
  await p.waitForTimeout(1500);
  const heading = p.locator("h2").filter({ hasText: /lineup/i }).first();
  if (await heading.isVisible()) { await heading.scrollIntoViewIfNeeded(); await p.waitForTimeout(800); }
  await p.screenshot({ path: "ss-figma-lineup.png" });
  await b.close();
  console.log("done");
})();