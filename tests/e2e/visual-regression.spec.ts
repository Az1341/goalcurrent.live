import { test, expect } from "@playwright/test";
import { preparePage, STABLE_MATCH_FIXTURE_ID, VISUAL_VIEWPORTS, gotoApp, waitForShell } from "./helpers/test-utils";

const PAGES = [
  { name: "homepage", path: "/" },
  { name: "wc26-standings", path: "/worldcup2026/standings" },
  { name: "match-detail", path: `/match/${STABLE_MATCH_FIXTURE_ID}` },
] as const;

test.describe("Visual regression baselines", () => {
  test.beforeEach(async ({ page }) => {
    await preparePage(page);
  });

  for (const viewportWidth of VISUAL_VIEWPORTS) {
    for (const { name, path } of PAGES) {
      test(`${name} at ${viewportWidth}px`, async ({ page }) => {
        await page.setViewportSize({ width: viewportWidth, height: 900 });
        await gotoApp(page, path);
        await page.waitForTimeout(500);

        await expect(page).toHaveScreenshot(`${name}-${viewportWidth}.png`, { fullPage: true });
      });
    }
  }
});