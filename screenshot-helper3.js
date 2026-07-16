const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setViewportSize({ width: 1280, height: 900 });
  await p.goto("http://localhost:4884/en/match/fixture-054", { waitUntil: "networkidle" });
  const accept = p.locator("button").filter({ hasText: /accept/i }).first();
  if (await accept.isVisible()) await accept.click();
  await p.waitForTimeout(1400);
  const heading = p.locator("h2").filter({ hasText: /lineup/i }).first();
  if (await heading.isVisible()) { await heading.scrollIntoViewIfNeeded(); await p.waitForTimeout(700); }
  await p.screenshot({ path: "ss-lineup-final-top.png" });
  await p.evaluate(() => window.scrollBy(0, 250));
  await p.waitForTimeout(400);
  await p.screenshot({ path: "ss-lineup-final-pitch.png" });
  await b.close();
  console.log("done");
})();