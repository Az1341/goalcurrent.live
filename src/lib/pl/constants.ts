export const PL_LEAGUE_ID = 39 as const;
export const PL_SEASON = 2026 as const;
export const PL_LEAGUE_NAME = "Premier League" as const;

export const PL_SEASON_START_ISO = "2026-08-22T11:00:00.000Z";

export const API_FOOTBALL_BASE_URL = "https://v3.football.api-sports.io";

/** Standings endpoint cache when season has started (seconds). */
export const PL_STANDINGS_CACHE_ACTIVE = 300;

/** Standings endpoint cache pre-season / empty (seconds). */
export const PL_STANDINGS_CACHE_PRESEASON = 3600;
