import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const viewport of [{width:1487,height:1058}, {width:834,height:1194}, {width:390,height:844}, {width:320,height:568}]) {
  test(`holding page is readable with no external requests at ${viewport.width}px`, async ({page}, testInfo) => {
    await page.setViewportSize(viewport);
    const requests = [];
    const errors = [];
    page.on("request", request => requests.push(request.url()));
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(response.status()).toBe(200);
    await expect(page.getByRole("heading", {level:1})).toHaveText("GoalCurrent is taking a short break.");
    await expect(page.getByText("We’ve paused our live football service while we prepare the next chapter of GoalCurrent.")).toBeVisible();
    await expect(page.getByText("Thank you for visiting. We look forward to welcoming you back.")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator(".stadium").evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    expect(await page.locator(".brand img").evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    expect(requests.every(url => new URL(url).origin === "http://127.0.0.1:4174")).toBe(true);
    expect(errors).toEqual([]);
    const axe = await new AxeBuilder({page}).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(axe.violations).toEqual([]);
    await page.screenshot({path:`holding/evidence/holding-${viewport.width}.png`,fullPage:true});
  });
}
test("old routes inform visitors without soft-404 redirects; provider endpoints stay disabled", async ({page, request}) => {
  const old = await page.goto("/match/123456");
  expect(old.status()).toBe(404);
  await expect(page.getByRole("heading", {level:1})).toHaveText("GoalCurrent is taking a short break.");
  for (const route of ["/api/cron/refresh-content", "/api/live", "/api/fixtures", "/api"]) {
    const response = await request.get(route);
    expect(response.status()).toBe(503);
    expect(await response.json()).toMatchObject({error:"service_paused"});
  }
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  const www = await request.get("/match/123456", {headers:{Host:"www.goalcurrent.live"},maxRedirects:0});
  expect(www.status()).toBe(308);
  expect(www.headers().location).toBe("https://goalcurrent.live/match/123456");
});
test("known old worker registrations and only GoalCurrent caches are retired", async ({page}) => {
  await page.goto("/");
  // The migration deliberately reloads its existing clients. Observe that
  // navigation before checking registration/cache state in the new document.
  const navigation = page.waitForEvent("framenavigated", {
    predicate: (frame) => frame === page.mainFrame(),
  });
  await page.evaluate(async () => {
    await caches.open("goalcurrent-online-old");
    await caches.open("unrelated-cache");
    await navigator.serviceWorker.register("/sw.js");
  });
  await navigation;
  await page.waitForLoadState("domcontentloaded");
  await expect.poll(() => page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)).toBe(0);
  expect(await page.evaluate(() => caches.keys())).toContain("unrelated-cache");
  expect(await page.evaluate(() => caches.keys())).not.toContain("goalcurrent-online-old");
});
