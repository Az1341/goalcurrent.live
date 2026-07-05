import { test, expect } from "@playwright/test";
import { preparePage, gotoApp, runAxeScan, waitForShell } from "./helpers/test-utils";

test.describe("Live match journey", () => {
  test.beforeEach(async ({ page }) => {
    await preparePage(page);
  });

  test("homepage to live to match detail", async ({ page }) => {
    await gotoApp(page, "/");
    await runAxeScan(page, "homepage-start");

    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Live", exact: true })
      .click();
    await expect(page).toHaveURL(/\/live/);
    await waitForShell(page);

    const matchLink = page.locator("main a[href^='/match/fixture-']").first();
    await expect(matchLink).toBeVisible({ timeout: 30_000 });
    await runAxeScan(page, "live-centre");

    await matchLink.click();
    await expect(page).toHaveURL(/\/match\/fixture-/);
    await expect(page.locator("[data-gc-shell]").first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/vs/i).first()).toBeVisible();

    await runAxeScan(page, "match-detail");
  });
});