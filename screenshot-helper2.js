const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setViewportSize({ width: 1280, height: 900 });
  // Demo fixture with RSA vs KOR lineups
  await p.goto("http://localhost:4883/en/match/fixture-054", { waitUntil: "networkidle" });
  const accept = p.locator("button").filter({ hasText: /accept/i }).first();
  if (await accept.isVisible()) await accept.click();
  await p.waitForTimeout(1400);
  // Scroll to lineup section
  const heading = p.locator("h2").filter({ hasText: /lineup/i }).first();
  if (await heading.isVisible()) {
    await heading.scrollIntoViewIfNeeded();
    await p.waitForTimeout(600);
  }
  await p.screenshot({ path: "screenshot-demo-lineup-top.png" });
  await p.evaluate(() => window.scrollBy(0, 300));
  await p.waitForTimeout(400);
  await p.screenshot({ path: "screenshot-demo-lineup-pitch.png" });
  await b.close();
  console.log("done");
})();