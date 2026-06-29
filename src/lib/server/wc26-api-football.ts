import { getFixtureById, WC26_FIXTURES } from "@/data/wc26";
import { apiFootballFetch } from "@/lib/api-football/client";
import {
  ApiFootballAuthError,
} from "@/lib/api-football/errors";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import {
  findFixtureIdByKickoffUtc,
  findFixtureIdByGroupsCfPair,
  findFixtureIdByKnockoutFeederGroups,
  findFixtureIdByKnockoutTeamPairOverride,
  findFixtureIdByKnockoutTeams,
  findFixtureIdByTeamNames,
  mapApiStatusShort,
} from "@/lib/wc26-fixture-match";
import { resolveFixtureParticipant } from "@/lib/wc26-live";
import { resolveTeamId } from "@/lib/teamIdentity";
import type { Wc26ApiMatch } from "@/types/fixture-overlay";
import type { FixtureStatus } from "@/types/fixture";

const WC_LEAGUE = 1;
const WC_SEASON = 2026;
const TOURNAMENT_START = new Date("2026-06-11T19:00:00.000Z");

type ApiFootballFixture = {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
  };
  teams: {
    home: { name: string };
    away: { name: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
};

export class MissingApiKeyError extends ApiFootballAuthError {
  constructor() {
    super("MISSING_API_KEY");
    this.name = "MissingApiKeyError";
  }
}

export function isMissingApiKeyError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("missing application key") ||
    lower.includes("application key missing")
  );
}

function getApiKey(): string | undefined {
  return process.env.API_FOOTBALL_KEY?.trim() || undefined;
}

export function isWc26ApiConfigured(): boolean {
  return Boolean(getApiKey());
}

export function isTournamentLive(now: Date = new Date()): boolean {
  return now >= TOURNAMENT_START;
}

async function apiFetch(path: string): Promise<ApiFootballFixture[]> {
  try {
    const { data } = await apiFootballFetch<ApiFootballFixture[]>(path);
    return data;
  } catch (error) {
    if (error instanceof ApiFootballAuthError) {
      throw new MissingApiKeyError();
    }
    throw error;
  }
}

function applyOverlayEntries(
  entries: readonly Wc26ApiMatch[],
): readonly EffectiveFixture[] {
  if (entries.length === 0) {
    return WC26_FIXTURES;
  }

  const overlay = new Map<string, Wc26ApiMatch>();
  for (const entry of entries) {
    overlay.set(entry.fixtureId, entry);
  }

  return WC26_FIXTURES.map((fixture) => {
    const entry = overlay.get(fixture.id);
    if (!entry) {
      return fixture;
    }

    return {
      ...fixture,
      status: entry.status as FixtureStatus,
      homeScore: entry.homeScore ?? undefined,
      awayScore: entry.awayScore ?? undefined,
      elapsed: entry.elapsed,
      apiFixtureId: entry.apiFixtureId,
      overlayHomeTeamId: entry.homeTeamId,
      overlayAwayTeamId: entry.awayTeamId,
    };
  });
}

function orientScoresForLocalFixture(
  fixtureId: string,
  homeName: string,
  awayName: string,
  goalsHome: number | null,
  goalsAway: number | null,
  fixtures: readonly EffectiveFixture[],
): { homeScore: number | null; awayScore: number | null } {
  if (goalsHome === null || goalsAway === null) {
    return { homeScore: goalsHome, awayScore: goalsAway };
  }

  const fixture = getFixtureById(fixtureId);
  const apiHome = resolveTeamId(homeName);
  const apiAway = resolveTeamId(awayName);
  if (!fixture || !apiHome || !apiAway) {
    return { homeScore: goalsHome, awayScore: goalsAway };
  }

  const localHome = resolveFixtureParticipant(fixture, "home", fixtures);
  const localAway = resolveFixtureParticipant(fixture, "away", fixtures);

  if (apiHome === localHome.teamId && apiAway === localAway.teamId) {
    return { homeScore: goalsHome, awayScore: goalsAway };
  }
  if (apiHome === localAway.teamId && apiAway === localHome.teamId) {
    return { homeScore: goalsAway, awayScore: goalsHome };
  }

  return { homeScore: goalsHome, awayScore: goalsAway };
}

function normalizeApiFixture(
  raw: ApiFootballFixture,
  fixtures: readonly EffectiveFixture[] = WC26_FIXTURES,
): Wc26ApiMatch | null {
  const homeName = raw.teams.home.name;
  const awayName = raw.teams.away.name;
  const homeTeamId = resolveTeamId(homeName);
  const awayTeamId = resolveTeamId(awayName);
  const fixtureId =
    findFixtureIdByTeamNames(homeName, awayName) ??
    findFixtureIdByKnockoutTeamPairOverride(homeName, awayName) ??
    findFixtureIdByKnockoutTeams(homeName, awayName, fixtures, raw.fixture.date) ??
    findFixtureIdByGroupsCfPair(homeName, awayName, fixtures) ??
    findFixtureIdByKnockoutFeederGroups(homeName, awayName, raw.fixture.date) ??
    findFixtureIdByKickoffUtc(raw.fixture.date);
  if (!fixtureId) {
    return null;
  }

  const fixture = getFixtureById(fixtureId);
  if (!fixture) {
    return null;
  }

  const statusShort = raw.fixture.status.short;
  const status = mapApiStatusShort(statusShort);
  if (!status) {
    return null;
  }

  const isFinished = status === "ft" || status === "aet" || status === "pen";
  const { homeScore, awayScore } = orientScoresForLocalFixture(
    fixtureId,
    homeName,
    awayName,
    raw.goals.home,
    raw.goals.away,
    fixtures,
  );

  if (isFinished && (homeScore === null || awayScore === null)) {
    return null;
  }

  return {
    fixtureId,
    matchNumber: fixture.matchNumber,
    status,
    statusShort,
    elapsed: raw.fixture.status.elapsed,
    homeScore,
    awayScore,
    kickoffUtc: raw.fixture.date,
    apiFixtureId: raw.fixture.id,
    ...(homeTeamId ? { homeTeamId } : {}),
    ...(awayTeamId ? { awayTeamId } : {}),
  };
}

function mapFinishedFixtures(
  raw: readonly ApiFootballFixture[],
): Wc26ApiMatch[] {
  const groupMatches: Wc26ApiMatch[] = [];
  const pendingKnockout: ApiFootballFixture[] = [];

  for (const row of raw) {
    const homeName = row.teams.home.name;
    const awayName = row.teams.away.name;
    const fixtureId = findFixtureIdByTeamNames(homeName, awayName);
    if (fixtureId) {
      const mapped = normalizeApiFixture(row);
      if (mapped) {
        groupMatches.push(mapped);
      }
      continue;
    }
    pendingKnockout.push(row);
  }

  const effectiveFixtures = applyOverlayEntries(groupMatches);
  const knockoutMatches = pendingKnockout
    .map((row) => normalizeApiFixture(row, effectiveFixtures))
    .filter((match): match is Wc26ApiMatch => match !== null);

  return [...groupMatches, ...knockoutMatches];
}

function mapLiveFixtures(raw: readonly ApiFootballFixture[]): Wc26ApiMatch[] {
  const groupMatches: Wc26ApiMatch[] = [];
  const pendingKnockout: ApiFootballFixture[] = [];

  for (const row of raw) {
    const homeName = row.teams.home.name;
    const awayName = row.teams.away.name;
    const fixtureId = findFixtureIdByTeamNames(homeName, awayName);
    if (fixtureId) {
      const mapped = normalizeApiFixture(row);
      if (mapped) {
        groupMatches.push(mapped);
      }
      continue;
    }
    pendingKnockout.push(row);
  }

  const effectiveFixtures = applyOverlayEntries(groupMatches);
  const knockoutMatches = pendingKnockout
    .map((row) => normalizeApiFixture(row, effectiveFixtures))
    .filter((match): match is Wc26ApiMatch => match !== null);

  return [...groupMatches, ...knockoutMatches];
}

export async function fetchFinishedWc26Matches(): Promise<Wc26ApiMatch[]> {
  const raw = await apiFetch(
    `/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}&status=FT-AET-PEN`,
  );

  return mapFinishedFixtures(raw).filter((match) =>
    ["ft", "aet", "pen"].includes(match.status),
  );
}

export async function fetchLiveWc26Matches(): Promise<Wc26ApiMatch[]> {
  const raw = await apiFetch(
    `/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}&live=all`,
  );

  return mapLiveFixtures(raw).filter(
    (match) => match.status !== "ft" && match.status !== "aet" && match.status !== "pen",
  );
}
