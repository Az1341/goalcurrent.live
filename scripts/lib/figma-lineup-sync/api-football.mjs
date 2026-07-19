const API_BASE = "https://v3.football.api-sports.io";

/** @param {string} apiKey @param {string} path */
async function apiFetch(apiKey, path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "x-apisports-key": apiKey,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API-Football ${path} failed (${res.status}): ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  if (json.errors && Object.keys(json.errors).length > 0) {
    throw new Error(`API-Football error: ${JSON.stringify(json.errors)}`);
  }

  return json.response ?? [];
}

/** @param {string} apiKey @param {number} fixtureId */
export async function fetchFixture(apiKey, fixtureId) {
  const rows = await apiFetch(apiKey, `/fixtures?id=${fixtureId}`);
  return rows[0] ?? null;
}

/** @param {string} apiKey @param {number} fixtureId */
export async function fetchLineups(apiKey, fixtureId) {
  return apiFetch(apiKey, `/fixtures/lineups?fixture=${fixtureId}`);
}

/**
 * Resolve api-sports fixture id for WC26 final (Argentina vs Spain).
 * @param {import('./types.mjs').SyncConfig} config
 */
export async function resolveApiFixtureId(config) {
  if (config.apiFixtureId) {
    return config.apiFixtureId;
  }

  const kickoffDate = config.kickoffUtc.slice(0, 10);
  const prev = new Date(Date.parse(`${kickoffDate}T00:00:00.000Z`) - 86_400_000)
    .toISOString()
    .slice(0, 10);
  const next = new Date(Date.parse(`${kickoffDate}T00:00:00.000Z`) + 86_400_000)
    .toISOString()
    .slice(0, 10);

  const teamMatchers = [
    (home, away) =>
      includesTeam(home, ["argentina"]) && includesTeam(away, ["spain", "espa"]),
    (home, away) =>
      includesTeam(away, ["argentina"]) && includesTeam(home, ["spain", "espa"]),
  ];

  for (const date of [kickoffDate, prev, next]) {
    const rows = await apiFetch(
      config.apiFootballKey,
      `/fixtures?league=1&season=2026&date=${date}`,
    );

    for (const row of rows) {
      const home = row.teams?.home?.name ?? "";
      const away = row.teams?.away?.name ?? "";
      if (teamMatchers.some((match) => match(home, away))) {
        return row.fixture.id;
      }
    }
  }

  throw new Error(
    `Could not resolve API-Football fixture id for WC26 final on ${kickoffDate}. Set API_FOOTBALL_FIXTURE_ID.`,
  );
}

/** @param {string} name @param {string[]} needles */
function includesTeam(name, needles) {
  const lower = name.toLowerCase();
  return needles.some((needle) => lower.includes(needle));
}

/**
 * @param {string} apiKey
 * @param {number} fixtureId
 * @returns {Promise<import('./types.mjs').MatchLineupPayload>}
 */
export async function fetchMatchLineupPayload(apiKey, fixtureId) {
  const [fixtureRow, lineupRows] = await Promise.all([
    fetchFixture(apiKey, fixtureId),
    fetchLineups(apiKey, fixtureId),
  ]);

  /** @type {import('./types.mjs').ApiLineupSide | null} */
  const home = lineupRows[0] ? mapLineupSide(lineupRows[0]) : null;
  /** @type {import('./types.mjs').ApiLineupSide | null} */
  const away = lineupRows[1] ? mapLineupSide(lineupRows[1]) : null;

  const venue =
    fixtureRow?.fixture?.venue?.name && fixtureRow?.fixture?.venue?.city
      ? `${fixtureRow.fixture.venue.name}, ${fixtureRow.fixture.venue.city}`
      : null;

  return {
    apiFixtureId: fixtureId,
    fetchedAt: new Date().toISOString(),
    home,
    away,
    kickoffLabel: formatKickoffLabel(fixtureRow?.fixture?.date ?? null),
    venueLabel: venue ?? "",
  };
}

/** @param {Record<string, unknown>} row */
function mapLineupSide(row) {
  return {
    teamName: String(row.team?.name ?? ""),
    formation: row.formation ?? null,
    coach: row.coach?.name ?? null,
    startXI: mapPlayers(row.startXI),
    substitutes: mapPlayers(row.substitutes),
  };
}

/** @param {unknown} entries */
function mapPlayers(entries) {
  if (!Array.isArray(entries)) return [];
  return entries.map((entry) => ({
    name: String(entry.player?.name ?? ""),
    number: entry.player?.number ?? null,
    pos: entry.player?.pos ?? null,
    grid: entry.player?.grid ?? null,
  }));
}

/** @param {string | null} iso */
function formatKickoffLabel(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "";

  const datePart = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/London",
  }).format(date);

  return `${datePart} · ${timePart} BST`;
}

/** @param {import('./types.mjs').MatchLineupPayload} payload */
export function lineupsAreReady(payload) {
  const sides = [payload.home, payload.away];
  return sides.every(
    (side) => side && Array.isArray(side.startXI) && side.startXI.length >= 11,
  );
}
