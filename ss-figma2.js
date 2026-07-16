const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setViewportSize({ width: 1440, height: 1100 });
  await p.goto("http://localhost:4885/en/match/fixture-054", { waitUntil: "networkidle" });
  const accept = p.locator("button").filter({ hasText: /accept/i }).first();
  if (await accept.isVisible()) await accept.click();
  await p.waitForTimeout(1500);
  // screenshot the lineup component directly
  const section = p.locator("section").filter({ has: p.locator("h2", { hasText: /lineup/i }) }).first();
  if (await section.isVisible()) {
    await section.scrollIntoViewIfNeeded();
    await p.waitForTimeout(600);
    await section.screenshot({ path: "ss-figma-full.png" });
  } else {
    await p.screenshot({ path: "ss-figma-full.png", fullPage: true });
  }
  await b.close();
  console.log("done");
})();