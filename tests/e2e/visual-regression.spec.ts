import { test, expect, type Page, type Locator } from "@playwright/test";
import { preparePage, STABLE_MATCH_FIXTURE_ID, VISUAL_VIEWPORTS, gotoApp } from "./helpers/test-utils";

const PAGES = [
  { name: "homepage", path: "/" },
  { name: "wc26-standings", path: "/worldcup2026/standings" },
  { name: "match-detail", path: `/match/${STABLE_MATCH_FIXTURE_ID}` },
] as const;

function homepageVisualMasks(page: Page): Locator[] {
  return [
    page.locator('[data-gc-chrome="site-footer"]'),
    page.locator('section[aria-label="Home hero"]'),
    page.locator('section[aria-label="Featured match hero"]'),
    page.locator('[class*="tickerWrap"]'),
    page.locator('section[aria-labelledby="home-today-heading"]'),
    page.locator('section[aria-labelledby="home-news-heading"]'),
    page.locator('section[aria-labelledby="home-clips-heading"]'),
    page.locator('section[aria-labelledby="home-leagues-heading"]'),
  ];
}

async function waitForHomepageStable(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Live Football/i, {
    timeout: 30_000,
  });
  await page
    .locator('section[aria-labelledby="home-news-heading"]')
    .waitFor({ state: "visible", timeout: 30_000 });
  await expect(page.locator('[class*="animate-skeleton-shimmer"]')).toHaveCount(0, {
    timeout: 30_000,
  });
}

async function captureHomepageScreenshot(page: Page, viewportWidth: number): Promise<void> {
  await page.setViewportSize({ width: viewportWidth, height: 900 });
  await gotoApp(page, "/");
  await waitForHomepageStable(page);
  await gotoApp(page, "/");
  await waitForHomepageStable(page);
  await expect(page).toHaveScreenshot(`homepage-${viewportWidth}.png`, {
    fullPage: true,
    mask: homepageVisualMasks(page),
  });
}

test.describe("Visual regression baselines", () => {
  test.beforeEach(async ({ page }) => {
    await preparePage(page);
  });

  for (const viewportWidth of VISUAL_VIEWPORTS) {
    for (const { name, path } of PAGES) {
      test(`${name} at ${viewportWidth}px`, async ({ page }) => {
        if (name === "homepage") {
          await captureHomepageScreenshot(page, viewportWidth);
          return;
        }
        await page.setViewportSize({ width: viewportWidth, height: 900 });
        await gotoApp(page, path);
        await page.waitForTimeout(500);
        const mask =
          name === "match-detail"
            ? [page.locator('[data-gc-chrome="site-footer"]')]
            : [page.locator('[data-gc-chrome="site-footer"]')];
        await expect(page).toHaveScreenshot(`${name}-${viewportWidth}.png`, {
          fullPage: true,
          mask,
        });
      });
    }
  }
});
