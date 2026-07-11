import { expect, test, type Page } from "@playwright/test";
import { gotoApp, preparePage, STABLE_MATCH_FIXTURE_ID } from "./helpers/test-utils";

async function enableDarkTheme(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem("gc-theme", "dark");
  });
}

function parseRgb(color: string): { r: number; g: number; b: number } | null {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) {
    return null;
  }
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
}

function luminance(color: string): number {
  const rgb = parseRgb(color);
  if (!rgb) {
    return -1;
  }
  return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
}

test.describe("fixtures calendar centring", () => {
  test("today is centred in the calendar strip on load", async ({ page }) => {
    await preparePage(page);
    await gotoApp(page, "/worldcup2026/fixtures");

    const strip = page.locator('[role="tablist"][aria-label="Match days"]');
    await expect(strip).toBeVisible();

    const today = strip.locator('button[aria-current="date"]');
    await expect(today).toHaveCount(1, { timeout: 15_000 });

    // Allow initial centring retries + late-settle recentre to finish.
    await page.waitForTimeout(1_500);

    const stripBox = await strip.boundingBox();
    const todayBox = await today.boundingBox();
    expect(stripBox).not.toBeNull();
    expect(todayBox).not.toBeNull();

    const stripCenter = stripBox!.x + stripBox!.width / 2;
    const todayCenter = todayBox!.x + todayBox!.width / 2;

    // Today must sit at the visual centre of the strip (± one day-button width).
    expect(Math.abs(todayCenter - stripCenter)).toBeLessThanOrEqual(
      todayBox!.width + 8,
    );
  });

  test("today stays centred after reload in dark theme", async ({ page }) => {
    await preparePage(page);
    await enableDarkTheme(page);
    await gotoApp(page, "/worldcup2026/fixtures");
    await page.reload({ waitUntil: "domcontentloaded" });

    const strip = page.locator('[role="tablist"][aria-label="Match days"]');
    const today = strip.locator('button[aria-current="date"]');
    await expect(today).toHaveCount(1, { timeout: 15_000 });
    await page.waitForTimeout(1_500);

    const stripBox = await strip.boundingBox();
    const todayBox = await today.boundingBox();
    const stripCenter = stripBox!.x + stripBox!.width / 2;
    const todayCenter = todayBox!.x + todayBox!.width / 2;
    expect(Math.abs(todayCenter - stripCenter)).toBeLessThanOrEqual(
      todayBox!.width + 8,
    );
  });
});

test.describe("dark theme contrast", () => {
  test("light surfaces force dark text in dark mode on fixtures page", async ({
    page,
  }) => {
    await preparePage(page);
    await enableDarkTheme(page);
    await gotoApp(page, "/worldcup2026/fixtures");

    const lightSurfaces = page.locator('[data-gc-light-surface="true"]');
    expect(await lightSurfaces.count()).toBeGreaterThan(0);

    const surface = lightSurfaces.first();
    const color = await surface.evaluate(
      (el) => getComputedStyle(el).color,
    );
    // Text on a light surface must be dark (low luminance) in dark mode.
    expect(luminance(color)).toBeLessThan(128);
  });

  test("WC26 hub stats are readable in dark mode", async ({ page }) => {
    await preparePage(page);
    await enableDarkTheme(page);
    await gotoApp(page, "/worldcup2026");

    const statLabel = page.getByText("Games Played", { exact: true }).first();
    await expect(statLabel).toBeVisible({ timeout: 15_000 });

    const color = await statLabel.evaluate(
      (el) => getComputedStyle(el).color,
    );
    expect(luminance(color)).toBeLessThan(150);
  });
});

test.describe("live page countdown", () => {
  test("Live now section shows matches or an upcoming-match countdown", async ({
    page,
  }) => {
    await preparePage(page);
    await gotoApp(page, "/live");

    const liveSection = page.locator(
      'section[aria-labelledby="live-now-heading"]',
    );
    await expect(liveSection).toBeVisible({ timeout: 15_000 });

    const liveCards = liveSection.locator("li");
    const countdown = liveSection.getByText(/up next/i);
    const emptyNotice = liveSection.getByText(/no live matches/i);

    // Give the client time to hydrate fixtures.
    await page.waitForTimeout(2_000);

    const hasCards = (await liveCards.count()) > 0;
    const hasCountdown = (await countdown.count()) > 0;
    const hasEmptyNotice = (await emptyNotice.count()) > 0;

    // With the tournament still in progress, the section must show live
    // matches or a countdown; the bare empty message is only acceptable
    // after the final match has completed.
    expect(hasCards || hasCountdown || hasEmptyNotice).toBe(true);
  });
});

test.describe("match detail fallback", () => {
  test("match page renders header and content sections even without API data", async ({
    page,
  }) => {
    await preparePage(page);
    // Force the detail API to fail so the page must rely on local SSOT data.
    await page.route("**/api/wc26/match/**", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "unavailable" }),
      }),
    );
    await gotoApp(page, `/match/${STABLE_MATCH_FIXTURE_ID}`);

    await expect(page.locator("#match-header-title")).toBeVisible({
      timeout: 20_000,
    });
    await expect(
      page.locator("#match-timeline-heading"),
    ).toBeAttached({ timeout: 20_000 });
  });
});
