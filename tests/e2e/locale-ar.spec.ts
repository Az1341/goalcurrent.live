import { test, expect } from "@playwright/test";
import { preparePage, gotoApp, runAxeScan, waitForShell } from "./helpers/test-utils";

test.describe("Arabic locale RTL smoke", () => {
  test.beforeEach(async ({ page }) => {
    await preparePage(page);
  });

  test("switching to ar renders RTL layout without breakage", async ({ page }) => {
    await gotoApp(page, "/");

    const languageButton = page.getByRole("button", { name: "Language" });
    await languageButton.hover();
    const arOption = page.getByRole("menuitem", { name: "AR" });
    await expect(arOption).toBeVisible({ timeout: 10_000 });
    await arOption.click();

    await expect(page).toHaveURL(/\/ar(\/|$)/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await waitForShell(page);

    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('img[src="/logo.svg"]')).toBeVisible();

    const heroBox = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(heroBox).not.toBeNull();
    expect(heroBox!.width).toBeGreaterThan(100);
    expect(heroBox!.height).toBeGreaterThan(10);

    await runAxeScan(page, "locale-ar");
  });
});