/** @typedef {import('./types.mjs').SyncConfig} SyncConfig */

/** @returns {SyncConfig} */
export function loadConfig() {
  const figmaToken = process.env.FIGMA_TOKEN?.trim();
  const apiFootballKey = process.env.API_FOOTBALL_KEY?.trim();

  if (!figmaToken) {
    throw new Error("FIGMA_TOKEN is required");
  }
  if (!apiFootballKey) {
    throw new Error("API_FOOTBALL_KEY is required");
  }

  const apiFixtureIdRaw = process.env.API_FOOTBALL_FIXTURE_ID?.trim();
  const apiFixtureId = apiFixtureIdRaw ? Number.parseInt(apiFixtureIdRaw, 10) : null;

  return {
    figmaToken,
    apiFootballKey,
    figmaFileKey: process.env.FIGMA_FILE_KEY?.trim() || "vV10C5mvxJ2wlb27PyxEt3",
    localFixtureId: process.env.WC26_FIGMA_FIXTURE_ID?.trim() || "fixture-104",
    apiFixtureId: Number.isFinite(apiFixtureId) ? apiFixtureId : null,
    pollIntervalMs: Number(process.env.FIGMA_LINEUP_POLL_MS ?? 60_000),
    lineupRevealMs: Number(process.env.FIGMA_LINEUP_REVEAL_MS ?? 30 * 60 * 1000),
    pluginPort: Number(process.env.FIGMA_LINEUP_PLUGIN_PORT ?? 8765),
    kickoffUtc: process.env.WC26_FINAL_KICKOFF_UTC?.trim() || "2026-07-19T19:00:00.000Z",
    venueLabel:
      process.env.WC26_FINAL_VENUE?.trim() || "New York/New Jersey Stadium, East Rutherford",
  };
}
