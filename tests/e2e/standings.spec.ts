import { test, expect } from "@playwright/test";
import { preparePage, gotoApp, runAxeScan } from "./helpers/test-utils";

test.describe("Competition hub standings", () => {
  test.beforeEach(async ({ page }) => {
    await preparePage(page);
  });

  test("worldcup2026 standings table renders", async ({ page }) => {
    await gotoApp(page, "/worldcup2026/standings");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(/standings/i);
    await expect(page.getByRole("columnheader", { name: "PTS" }).first()).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "P" }).first()).toBeVisible();

    await runAxeScan(page, "wc26-standings");
  });
});