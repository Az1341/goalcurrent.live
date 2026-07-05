import { test, expect } from "@playwright/test";
import { preparePage, gotoApp, runAxeScan, waitForShell } from "./helpers/test-utils";

test.describe("Favourites persistence", () => {
  test.beforeEach(async ({ page }) => {
    await preparePage(page);
  });

  test("adding a match favourite persists after reload", async ({ page }) => {
    await gotoApp(page, "/");

    const addButton = page
      .getByRole("region", { name: "Featured match" })
      .getByRole("button", { name: /Add .+ to favourites/i })
      .first();
    await expect(addButton).toBeVisible({ timeout: 30_000 });

    const ariaLabel = (await addButton.getAttribute("aria-label")) ?? "";
    const matchLabel = ariaLabel.replace(/^Add\s+/, "").replace(/\s+to favourites$/, "");
    const [homeTeam, awayTeam] = matchLabel.split(" vs ");

    await addButton.click();
    await expect(
      page.getByRole("button", { name: `Remove ${matchLabel} from favourites` }).first(),
    ).toHaveAttribute("aria-pressed", "true", { timeout: 10_000 });

    await page.reload();
    await waitForShell(page);
    await expect(
      page.getByRole("button", { name: `Remove ${matchLabel} from favourites` }).first(),
    ).toHaveAttribute("aria-pressed", "true");

    await gotoApp(page, "/favourites");
    await expect(page.getByRole("heading", { level: 1, name: "Favourites" })).toBeVisible();
    if (homeTeam) {
      await expect(page.getByText(homeTeam, { exact: true }).first()).toBeVisible();
    }
    if (awayTeam) {
      await expect(page.getByText(awayTeam, { exact: true }).first()).toBeVisible();
    }

    await runAxeScan(page, "favourites");
  });
});