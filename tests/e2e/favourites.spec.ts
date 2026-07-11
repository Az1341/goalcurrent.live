import { test, expect } from "@playwright/test";
import { preparePage, gotoApp, runAxeScan, waitForShell, STABLE_MATCH_FIXTURE_ID } from "./helpers/test-utils";

test.describe("Favourites persistence", () => {
  test.beforeEach(async ({ page }) => {
    await preparePage(page);
  });

  test("adding a match favourite persists after reload", async ({ page }) => {
    await gotoApp(page, `/match/${STABLE_MATCH_FIXTURE_ID}`);

    const matchCentre = page.getByRole("region", { name: "Match centre" });
    const addButton = matchCentre.getByRole("button", { name: /Add .+ to favourites/i });
    await expect(addButton).toBeVisible({ timeout: 30_000 });

    const ariaLabel = (await addButton.getAttribute("aria-label")) ?? "";
    const matchLabel = ariaLabel.replace(/^Add\s+/, "").replace(/\s+to favourites$/, "");
    const [homeTeam, awayTeam] = matchLabel.split(" vs ");

    await addButton.click();
    await page.waitForFunction(
      (fixtureId) => {
        const raw = localStorage.getItem("gc_favourites");
        if (!raw) return false;
        try {
          const state = JSON.parse(raw) as { matches?: string[] };
          return Array.isArray(state.matches) && state.matches.includes(fixtureId);
        } catch {
          return false;
        }
      },
      STABLE_MATCH_FIXTURE_ID,
      { timeout: 10_000 },
    );

    const removeButton = matchCentre.getByRole("button", {
      name: `Remove ${matchLabel} from favourites`,
    });
    await expect(removeButton).toHaveAttribute("aria-pressed", "true", { timeout: 10_000 });

    await page.reload();
    await waitForShell(page);
    await expect(
      matchCentre.getByRole("button", { name: `Remove ${matchLabel} from favourites` }),
    ).toHaveAttribute("aria-pressed", "true");

    await gotoApp(page, "/favourites");
    await expect(page.getByRole("heading", { level: 1, name: "Favourites" })).toBeVisible();

    const favMatches = page.getByRole("region", { name: "Favourite matches" });
    await expect(favMatches).toBeVisible();
    if (homeTeam) {
      await expect(favMatches.getByText(homeTeam, { exact: true })).toBeVisible();
    }
    if (awayTeam) {
      await expect(favMatches.getByText(awayTeam, { exact: true })).toBeVisible();
    }

    await runAxeScan(page, "favourites");
  });
});