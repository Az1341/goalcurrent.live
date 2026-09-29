import { test, expect, type Page } from "@playwright/test";
import { preparePage, gotoApp, waitForShell } from "./helpers/test-utils";

function todayKickoff(hourUtc: number): string {
  const d = new Date();
  d.setUTCHours(hourUtc, 0, 0, 0);
  return d.toISOString();
}

function plFixture(id: number, overrides: Record<string, unknown> = {}) {
  return {
    fixtureId: id,
    kickoffUtc: todayKickoff(15),
    matchweek: 5,
    round: "Regular Season - 5",
    venue: null,
    homeTeamId: 33,
    homeTeamName: `Home ${id}`,
    homeTeamLogo: null,
    awayTeamId: 34,
    awayTeamName: `Away ${id}`,
    awayTeamLogo: null,
    status: "UPCOMING",
    statusShort: "NS",
    elapsed: null,
    homeScore: null,
    awayScore: null,
    broadcaster: "Sky Sports",
    ...overrides,
  };
}

async function mockMatchdayApis(page: Page): Promise<void> {
  const fixtures = [
    plFixture(9001, {
      status: "LIVE",
      statusShort: "2H",
      elapsed: 67,
      homeScore: 1,
      awayScore: 0,
      homeTeamName: "Arsenal",
      awayTeamName: "Chelsea",
      kickoffUtc: todayKickoff(12),
    }),
    plFixture(9002, {
      status: "LIVE",
      statusShort: "1H",
      elapsed: 12,
      homeScore: null,
      awayScore: null,
      homeTeamName: "Null Score FC",
      awayTeamName: "Missing Goals",
      kickoffUtc: todayKickoff(13),
    }),
    plFixture(9003, {
      status: "FT",
      statusShort: "FT",
      homeScore: 0,
      awayScore: 0,
      homeTeamName: "True Zero",
      awayTeamName: "Nil Nil",
      kickoffUtc: todayKickoff(11),
    }),
    ...Array.from({ length: 7 }, (_, i) =>
      plFixture(9100 + i, {
        kickoffUtc: todayKickoff(18 + (i % 3)),
        homeTeamName: `Extra Home ${i}`,
        awayTeamName: `Extra Away ${i}`,
      }),
    ),
  ];

  await page.route("**/api/pl/fixtures", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        configured: true,
        league: "Premier League",
        leagueId: 39,
        season: 2026,
        fixtures,
        source: "fallback",
        fetchedAt: new Date().toISOString(),
      }),
    });
  });

  for (const path of ["ucl", "facup", "unl"] as const) {
    await page.route(`**/api/${path}/fixtures`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          configured: true,
          competitionKey: path,
          league: path.toUpperCase(),
          leagueId: 1,
          season: 2026,
          fixtures: [],
          source: "fallback",
          fetchedAt: new Date().toISOString(),
          ...(path === "facup" ? { standingsSupported: false } : {}),
        }),
      });
    });
  }

  await page.route("**/api/community-shield/fixture", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        configured: true,
        competition: "FA Community Shield",
        season: 2026,
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        fixtures: [],
      }),
    });
  });
}

test.describe("Homepage matchday board", () => {
  test.beforeEach(async ({ page }) => {
    await preparePage(page);
    await mockMatchdayApis(page);
  });

  test("football scoreboard sits above ads with filters and hub link", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoApp(page, "/");
    await waitForShell(page);

    const matchday = page.locator("[data-gc-home-matchday]");
    await expect(matchday).toBeVisible({ timeout: 30_000 });

    const promo = page.locator("text=Advertisement").first();
    const matchdayBox = await matchday.boundingBox();
    const promoBox = await promo.boundingBox();
    expect(matchdayBox && promoBox).toBeTruthy();
    if (matchdayBox && promoBox) {
      expect(matchdayBox.y).toBeLessThan(promoBox.y);
    }

    await expect(page.getByRole("tab", { name: /Live/i })).toBeVisible();
    await page.getByRole("tab", { name: /Live/i }).click();

    const liveCard = page.locator('[data-gc-matchday-card="pl:9001"]');
    await expect(liveCard).toBeVisible();
    await expect(liveCard.getByText("Match hub")).toBeVisible();

    const nullScoreCard = page.locator('[data-gc-matchday-card="pl:9002"]');
    // May be filtered out on Live tab - switch to All
    await page.getByRole("tab", { name: /All/i }).click();
    await expect(nullScoreCard).toBeVisible();
    await expect(nullScoreCard.locator("[data-gc-score-home]")).not.toHaveText("0");
    await expect(nullScoreCard.locator("[data-gc-score-away]")).not.toHaveText("0");

    const zeroCard = page.locator('[data-gc-matchday-card="pl:9003"]');
    await expect(zeroCard.locator("[data-gc-score-home]")).toHaveText("0");
    await expect(zeroCard.locator("[data-gc-score-away]")).toHaveText("0");

    await expect(page.locator("[data-gc-matchday-show-all=pl]")).toBeVisible();
    await page.locator("[data-gc-matchday-show-all=pl]").click();
    await expect(page.locator("[data-gc-matchday-card^=pl:]")).toHaveCount(10);

    await liveCard.getByRole("link").first().click();
    await expect(page).toHaveURL(/\/premier-league\/match\/9001/);
  });
});
