const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setViewportSize({ width: 1280, height: 900 });
  await p.goto("http://localhost:4882/en/match/fixture-099", { waitUntil: "networkidle" });
  const accept = p.locator("button").filter({ hasText: /accept/i }).first();
  if (await accept.isVisible()) await accept.click();
  await p.waitForTimeout(1400);
  const heading = p.locator("h2").filter({ hasText: /lineup/i }).first();
  if (await heading.isVisible()) { await heading.scrollIntoViewIfNeeded(); await p.waitForTimeout(800); }
  await p.screenshot({ path: "screenshot-lineup-section.png" });
  await p.evaluate(() => window.scrollBy(0, 260));
  await p.waitForTimeout(400);
  await p.screenshot({ path: "screenshot-lineup-pitch.png" });
  await b.close();
  console.log("done");
})();