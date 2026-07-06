import { test, expect, type Page, type Locator } from "@playwright/test";
import { preparePage, STABLE_MATCH_FIXTURE_ID, VISUAL_VIEWPORTS, gotoApp } from "./helpers/test-utils";

const PAGES = [
  { name: "homepage", path: "/" },
  { name: "wc26-standings", path: "/worldcup2026/standings" },
  { name: "match-detail", path: `/match/${STABLE_MATCH_FIXTURE_ID}` },
] as const;

function homepageVisualMasks(page: Page): Locator[] {
  const columnByHeading = (name: string) =>
    page.getByRole("heading", { name }).locator("xpath=ancestor::section[1]");

  return [
    page.locator('section[aria-labelledby="featured-match-heading"]'),
    page.getByRole("region", { name: "Live scores ticker" }),
    columnByHeading("Live Now"),
    columnByHeading("Latest Results"),
    columnByHeading("Upcoming Fixtures"),
    page.locator('section[aria-labelledby="wc-standings-preview"]'),
    page.locator('section[aria-labelledby="home-pl-heading"]'),
    page.locator('section[aria-labelledby="wc26-heading"]'),
    page.locator('section[aria-labelledby="home-news-heading"]'),
  ];
}

async function waitForHomepageStable(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForLoadState("networkidle");
  await expect(page.locator('[class*="sectionSkeleton"]')).toHaveCount(0, { timeout: 30_000 });
  await expect(
    page.locator('section[aria-labelledby="home-news-heading"] [class*="newsSkeleton"]'),
  ).toHaveCount(0, { timeout: 30_000 });
  await expect(page.getByText("Loading Premier League data…")).toHaveCount(0, {
    timeout: 30_000,
  });
  await page
    .locator('section[aria-labelledby="home-pl-heading"] nav[aria-label="Premier League quick links"]')
    .waitFor({ state: "visible", timeout: 30_000 });
  await page
    .locator('section[aria-labelledby="wc-standings-preview"] table tbody tr')
    .first()
    .waitFor({ state: "visible", timeout: 30_000 });
  await page
    .locator('section[aria-labelledby="home-articles-heading"]')
    .waitFor({ state: "visible", timeout: 30_000 });
  await page
    .locator('section[aria-labelledby="featured-match-heading"] article')
    .waitFor({ state: "visible", timeout: 30_000 });
  const articleImages = page.locator('section[aria-labelledby="home-articles-heading"] img');
  const imageCount = await articleImages.count();
  for (let index = 0; index < imageCount; index += 1) {
    await articleImages.nth(index).waitFor({ state: "visible", timeout: 30_000 });
  }
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
        await expect(page).toHaveScreenshot(`${name}-${viewportWidth}.png`, { fullPage: true });
      });
    }
  }
});
