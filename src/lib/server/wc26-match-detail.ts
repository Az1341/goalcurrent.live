import { getFixtureById, getTeamById } from "@/data/wc26";
import { findFixtureIdByTeamNames } from "@/lib/wc26-fixture-match";
import { resolveTeamId } from "@/lib/teamIdentity";
import { isWc26ApiConfigured } from "@/lib/server/wc26-api-football";
import type {
  MatchDetailPayload,
  MatchEventItem,
  MatchLineupPlayer,
  MatchLineupSide,
  MatchStatisticPair,
} from "@/types/match-detail";
import { MATCH_STAT_LABELS } from "@/lib/wc26-match";

const BASE_URL = "https://v3.football.api-sports.io";
const WC_LEAGUE = 1;
const WC_SEASON = 2026;

const STAT_KEYS = [
  "ball_possession",
  "total_shots",
  "shots_on_goal",
  "corner_kicks",
  "fouls",
  "yellow_cards",
  "red_cards",
] as const;

function getApiKey(): string | undefined {
  return process.env.API_FOOTBALL_KEY?.trim() || undefined;
}

async function apiFetchResponse<T>(path: string): Promise<T[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return [];
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-apisports-key": apiKey },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`api-sports ${res.status} — ${path}`);
  }

  const json = (await res.json()) as {
    errors?: Record<string, string>;
    response?: T[];
  };

  if (json.errors && Object.keys(json.errors).length > 0) {
    throw new Error(JSON.stringify(json.errors));
  }

  return json.response ?? [];
}

type ApiFixtureRow = {
  fixture: { id: number; date: string };
  teams: { home: { name: string }; away: { name: string } };
};

type ApiEventRow = {
  time: { elapsed: number | null; extra: number | null };
  team: { name: string };
  player: { name: string };
  assist: { name: string | null } | null;
  type: string;
  detail: string;
};

type ApiLineupRow = {
  team: { name: string };
  coach: { name: string | null } | null;
  formation: string | null;
  startXI: Array<{ player: { name: string; number: number | null; pos: string | null } }>;
  substitutes: Array<{ player: { name: string; number: number | null; pos: string | null } }>;
};

type ApiStatRow = {
  team: { name: string };
  statistics: Array<{ type: string; value: string | number | null }>;
};

function emptyPayload(fixtureId: string): MatchDetailPayload {
  return {
    fixtureId,
    configured: isWc26ApiConfigured(),
    apiAvailable: false,
    fetchedAt: new Date().toISOString(),
    events: [],
    lineups: { home: null, away: null },
    statistics: [],
  };
}

async function findApiFootballFixtureId(fixtureId: string): Promise<number | null> {
  const fixture = getFixtureById(fixtureId);
  if (!fixture) {
    return null;
  }

  const date = fixture.kickoffUtc.slice(0, 10);
  const rows = await apiFetchResponse<ApiFixtureRow>(
    `/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}&date=${date}`,
  );

  for (const row of rows) {
    const localId = findFixtureIdByTeamNames(row.teams.home.name, row.teams.away.name);
    if (localId === fixtureId) {
      return row.fixture.id;
    }
  }

  return null;
}

function mapEvents(rows: ApiEventRow[]): MatchEventItem[] {
  return rows.map((event) => ({
    minute: event.time.elapsed,
    extra: event.time.extra,
    teamName: event.team.name,
    playerName: event.player.name,
    assistName: event.assist?.name ?? null,
    type: event.type,
    detail: event.detail,
  }));
}

function mapPlayers(
  players: Array<{ player: { name: string; number: number | null; pos: string | null } }>,
): MatchLineupPlayer[] {
  return players.map((entry) => ({
    name: entry.player.name,
    number: entry.player.number,
    position: entry.player.pos,
  }));
}

function mapLineupSide(row: ApiLineupRow): MatchLineupSide {
  return {
    teamName: row.team.name,
    formation: row.formation,
    coach: row.coach?.name ?? null,
    startXI: mapPlayers(row.startXI ?? []),
    substitutes: mapPlayers(row.substitutes ?? []),
  };
}

function statKey(type: string): string {
  return type.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

function mapStatistics(
  rows: ApiStatRow[],
  homeTeamName: string,
  awayTeamName: string,
): MatchStatisticPair[] {
  const byTeam = new Map<string, Record<string, string | number | null>>();
  for (const row of rows) {
    const data: Record<string, string | number | null> = {};
    for (const item of row.statistics ?? []) {
      data[statKey(item.type)] = item.value;
    }
    byTeam.set(row.team.name, data);
  }

  // Resolve team stats using fuzzy name matching via resolveTeamId
  // Handles cases like API returning "Iran" when our data has "IR Iran"
  function findStats(officialName: string): Record<string, string | number | null> {
    // 1. Exact match
    if (byTeam.has(officialName)) return byTeam.get(officialName)!;
    // 2. Resolve via teamIdentity aliases
    const ourId = resolveTeamId(officialName);
    for (const [apiName, data] of byTeam.entries()) {
      const apiId = resolveTeamId(apiName);
      if (apiId && apiId === ourId) return data;
    }
    // 3. Case-insensitive partial match
    const lower = officialName.toLowerCase();
    for (const [apiName, data] of byTeam.entries()) {
      if (apiName.toLowerCase().includes(lower) || lower.includes(apiName.toLowerCase())) {
        return data;
      }
    }
    return {};
  }

  const homeStats = findStats(homeTeamName);
  const awayStats = findStats(awayTeamName);

  return STAT_KEYS.filter((key) => homeStats[key] != null || awayStats[key] != null).map(
    (key) => ({
      key,
      label: MATCH_STAT_LABELS[key] ?? key,
      home: homeStats[key] ?? null,
      away: awayStats[key] ?? null,
    }),
  );
}

function resolveLineupSides(
  rows: ApiLineupRow[],
  fixtureId: string,
): { home: MatchLineupSide | null; away: MatchLineupSide | null } {
  const fixture = getFixtureById(fixtureId);
  if (!fixture) {
    return { home: null, away: null };
  }

  let home: MatchLineupSide | null = null;
  let away: MatchLineupSide | null = null;

  for (const row of rows) {
    const side = mapLineupSide(row);
    const teamId = resolveTeamId(row.team.name);
    if (teamId === fixture.homeTeamId) {
      home = side;
    } else if (teamId === fixture.awayTeamId) {
      away = side;
    }
  }

  if (rows.length === 2 && (!home || !away)) {
    const mapped = rows.map(mapLineupSide);
    return { home: home ?? mapped[0], away: away ?? mapped[1] };
  }

  return { home, away };
}

export async function fetchWc26EventsForApiFixture(
  apiFixtureId: number,
): Promise<{ events: MatchEventItem[]; apiAvailable: boolean }> {
  if (!isWc26ApiConfigured()) {
    return { events: [], apiAvailable: false };
  }

  try {
    const rows = await apiFetchResponse<ApiEventRow>(
      `/fixtures/events?fixture=${apiFixtureId}`,
    );
    return { events: mapEvents(rows), apiAvailable: true };
  } catch {
    return { events: [], apiAvailable: false };
  }
}

export async function fetchWc26MatchEvents(
  fixtureId: string,
): Promise<{ events: MatchEventItem[]; apiAvailable: boolean }> {
  if (!getFixtureById(fixtureId) || !isWc26ApiConfigured()) {
    return { events: [], apiAvailable: false };
  }

  try {
    const apiFixtureId = await findApiFootballFixtureId(fixtureId);
    if (!apiFixtureId) {
      return { events: [], apiAvailable: false };
    }

    const rows = await apiFetchResponse<ApiEventRow>(
      `/fixtures/events?fixture=${apiFixtureId}`,
    );

    return { events: mapEvents(rows), apiAvailable: true };
  } catch {
    return { events: [], apiAvailable: false };
  }
}

export async function fetchWc26MatchDetail(
  fixtureId: string,
): Promise<MatchDetailPayload> {
  if (!getFixtureById(fixtureId)) {
    return emptyPayload(fixtureId);
  }

  if (!isWc26ApiConfigured()) {
    return emptyPayload(fixtureId);
  }

  try {
    const apiFixtureId = await findApiFootballFixtureId(fixtureId);
    if (!apiFixtureId) {
      return emptyPayload(fixtureId);
    }

    const [events, lineups, statistics] = await Promise.all([
      apiFetchResponse<ApiEventRow>(`/fixtures/events?fixture=${apiFixtureId}`),
      apiFetchResponse<ApiLineupRow>(`/fixtures/lineups?fixture=${apiFixtureId}`),
      apiFetchResponse<ApiStatRow>(`/fixtures/statistics?fixture=${apiFixtureId}`),
    ]);

    const fixture = getFixtureById(fixtureId)!;
    const homeTeam = getTeamById(fixture.homeTeamId);
    const awayTeam = getTeamById(fixture.awayTeamId);

    return {
      fixtureId,
      configured: true,
      apiAvailable: true,
      fetchedAt: new Date().toISOString(),
      events: mapEvents(events),
      lineups: resolveLineupSides(lineups, fixtureId),
      statistics: mapStatistics(
        statistics,
        homeTeam?.name ?? fixture.homeTeamId,
        awayTeam?.name ?? fixture.awayTeamId,
      ),
    };
  } catch {
    return emptyPayload(fixtureId);
  }
}
