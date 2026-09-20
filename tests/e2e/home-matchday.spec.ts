import { test, expect, type Page } from "@playwright/test";
import { preparePage } from "./helpers/test-utils";

const NOW = new Date("2026-09-20T14:00:00Z");
const fixture = (fixtureId: number, patch: Record<string, unknown> = {}) => ({
  fixtureId, kickoffUtc: "2026-09-20T13:00:00Z", status: "LIVE", statusShort: "2H", elapsed: 62,
  homeTeamName: `Home ${fixtureId}`, awayTeamName: `Away ${fixtureId}`, homeTeamId: fixtureId, awayTeamId: fixtureId + 1,
  homeTeamLogo: null, awayTeamLogo: null, homeScore: 2, awayScore: 1, round: "Matchday 1", ...patch,
});
const payload = (fixtures: ReturnType<typeof fixture>[], patch = {}) => ({ configured: true, source: "api-football", fetchedAt: NOW.toISOString(), fixtures, ...patch });
async function setup(page: Page, overrides: Record<string, unknown> = {}, waitForFeeds?: Promise<void>) {
  await preparePage(page);
  await page.clock.install({ time: NOW });
  const responses: Record<string, unknown> = {
    pl: payload([fixture(1, { status: "FT", statusShort: "FT" }), fixture(2), fixture(3, { status: "UPCOMING", statusShort: "NS", homeScore: null, awayScore: null })]),
    ucl: payload([fixture(10, { statusShort: "HT", homeScore: 0, awayScore: 0 })]),
    facup: payload([]),
    unl: payload([fixture(20, { homeTeamName: "Spain", awayTeamName: "England", homeTeamFlag: "es", awayTeamFlag: "gb-eng", groupId: "a3", matchday: 1 })]),
    ...overrides,
  };
  const requests: string[] = [];
  await page.route("**/api/**", async route => {
    const path = new URL(route.request().url()).pathname;
    requests.push(path);
    const match = path.match(/^\/api\/(pl|ucl|facup|unl)\/fixtures$/);
    if (match) { await waitForFeeds; return route.fulfill({ json: responses[match[1]] }); }
    return route.fulfill({ json: {} });
  });
  await page.goto("/");
  await expect(page.getByTestId("matchday-board")).toBeVisible();
  return { responses, requests };
}

test("live scores, results, all competition links, filters and match hub round trip", async ({ page }) => {
  const { requests } = await setup(page);
  const board = page.getByTestId("matchday-board");
  await expect(board.locator("[data-match-id]").first()).toHaveAttribute("data-match-id", "pl:2");
  await expect(board.locator('[data-match-id="ucl:10"]')).toContainText("Half-time");
  for (const [id, href] of [["pl:2", "/premier-league/match/2"], ["ucl:10", "/champions-league/match/10"], ["unl:20", "/nations-league/match/20"]]) {
    await expect(board.locator(`[data-match-id="${id}"] a`)).toHaveAttribute("href", href);
  }
  await board.getByRole("button", { name: /^Results/ }).click();
  await expect(board.locator("[data-match-id]")).toHaveCount(1);
  await board.getByRole("button", { name: /^All/ }).click();
  await board.locator('[data-match-id="ucl:10"] a').click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Home 10 vs Away 10");
  await expect(page.locator('[data-match-id="ucl:10"]')).toContainText("Half-time");
  await page.getByRole("link", { name: /Back to today's/ }).click();
  await expect(board).toBeVisible();
  expect(requests.filter(p => p.includes("wc26"))).toEqual([]);
  expect(requests.filter(p => p === "/api/pl/fixtures").length).toBeLessThanOrEqual(2);
});

test("missing scores, stale coverage, partial outage and more than six matches remain honest", async ({ page }) => {
  await setup(page, {
    pl: payload(Array.from({ length: 8 }, (_, i) => fixture(100 + i, { homeScore: null }))),
    ucl: payload([fixture(10)], { stale: true }), facup: { error: "Unavailable" },
  });
  const board = page.getByTestId("matchday-board");
  await expect(board.locator('[data-match-id="pl:100"]')).toContainText("Score unavailable");
  await expect(board.locator('[data-match-id="pl:100"] strong')).toHaveText(["–", "–"]);
  await expect(board.locator('[data-match-id="ucl:10"]')).toContainText("Last reported live");
  await expect(board.getByText("Live coverage is currently unavailable.")).toBeVisible();
  await expect(board.locator('[data-match-id^="pl:"]')).toHaveCount(6);
  await board.getByRole("button", { name: "Show all 8 matches" }).click();
  await expect(board.locator('[data-match-id^="pl:"]')).toHaveCount(8);
});

test("shared polling updates a score without per-card requests", async ({ page }) => {
  const { responses, requests } = await setup(page);
  await expect(page.locator('[data-match-id="pl:2"] strong')).toHaveText(["2", "1"]);
  responses.pl = payload([fixture(2, { homeScore: 3 })]);
  // Preserve the existing 75s deduplication window; the first timer can
  // overlap the initial request, so advance through two polling cycles.
  await page.clock.runFor(151_000);
  await expect(page.locator('[data-match-id="pl:2"] strong')).toHaveText(["3", "1"]);
  expect(requests.filter(p => p === "/api/pl/fixtures")).toHaveLength(2);
});

for (const width of [320, 375, 390, 1440]) {
  test(`match cards fit ${width}px and appear before promotions`, async ({ page }) => {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 });
    await setup(page);
    const card = page.locator('[data-match-id="pl:2"]');
    await expect(card).toBeVisible();
    const box = await card.boundingBox();
    expect(box!.y).toBeLessThan(650);
    if (width === 390) expect(box!.y + box!.height).toBeLessThan(844);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('img[src="/logo.svg"]').first()).toBeVisible();
    await expect(page.locator('img[src$="/flags/4x3/es.svg"]')).toHaveCount(1);
    await page.screenshot({ path: `test-results/matchday-${width}.png`, fullPage: false });
    if (width === 1440) {
      await page.locator('[data-match-id="unl:20"]').scrollIntoViewIfNeeded();
      const flag = page.locator('img[src$="/flags/4x3/es.svg"]');
      await expect(flag).toHaveJSProperty("complete", true);
      expect(await flag.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      await page.screenshot({ path: "test-results/matchday-nations.png", fullPage: false });
      await page.screenshot({ path: "test-results/matchday-full.png", fullPage: true });
    }
  });
}

test("empty feeds explain no matches and favourite controls stay separate from navigation", async ({ page }) => {
  await setup(page, { pl: payload([]), ucl: payload([]), facup: payload([]), unl: payload([]) });
  await expect(page.getByTestId("matchday-board").getByText("No matches today in this competition.")).toHaveCount(4);
  await expect(page.getByRole("button", { name: "All (0)", exact: true })).toBeVisible();
});

test("keyboard users can filter and favourite a game without opening its hub", async ({ page }) => {
  await setup(page);
  const filter = page.getByRole("button", { name: /^Live \(/ });
  await filter.focus();
  await page.keyboard.press("Enter");
  await expect(filter).toHaveAttribute("aria-pressed", "true");
  const favourite = page.locator('[data-match-id="pl:2"] button');
  await favourite.focus();
  await page.keyboard.press("Enter");
  await expect(favourite).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/\/$/);
});

test("loading is explicit and unknown counts never appear as zero", async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await setup(page, {}, pending);
  await expect(page.getByTestId("matchday-board").getByText("Loading fixtures…")).toHaveCount(4);
  await expect(page.getByRole("button", { name: "All (–)", exact: true })).toBeVisible();
  release();
  await expect(page.locator('[data-match-id="pl:2"]')).toBeVisible();
});
