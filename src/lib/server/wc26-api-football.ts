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
import { normalizeWc26MatchStatus } from "@/lib/wc26-match-status";
import { getConfirmedKnockoutPairingByFixtureId } from "@/lib/wc26/knockout-confirmed-pairings";
import { applyConfirmedKnockoutResults } from "@/lib/wc26/knockout-confirmed-results";
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
  score?: {
    penalty?: {
      home: number | null;
      away: number | null;
    };
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
    return applyConfirmedKnockoutResults(WC26_FIXTURES);
  }

  const overlay = new Map<string, Wc26ApiMatch>();
  for (const entry of entries) {
    overlay.set(entry.fixtureId, entry);
  }

  return applyConfirmedKnockoutResults(
    WC26_FIXTURES.map((fixture) => {
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
      penaltiesHome: entry.penaltiesHome,
      penaltiesAway: entry.penaltiesAway,
    };
  }),
  );
}

function orientScoresForLocalFixture(
  fixtureId: string,
  homeName: string,
  awayName: string,
  goalsHome: number | null,
  goalsAway: number | null,
): { homeScore: number | null; awayScore: number | null } {
  if (goalsHome === null || goalsAway === null) {
    return { homeScore: goalsHome, awayScore: goalsAway };
  }

  const apiHome = resolveTeamId(homeName);
  const apiAway = resolveTeamId(awayName);
  if (!apiHome || !apiAway) {
    return { homeScore: goalsHome, awayScore: goalsAway };
  }

  const confirmed = getConfirmedKnockoutPairingByFixtureId(fixtureId);
  if (confirmed) {
    if (apiHome === confirmed.homeTeamId && apiAway === confirmed.awayTeamId) {
      return { homeScore: goalsHome, awayScore: goalsAway };
    }
    if (apiHome === confirmed.awayTeamId && apiAway === confirmed.homeTeamId) {
      return { homeScore: goalsAway, awayScore: goalsHome };
    }
  }

  const fixture = getFixtureById(fixtureId);
  if (fixture && fixture.stage !== "group") {
    return { homeScore: goalsHome, awayScore: goalsAway };
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
    (homeTeamId && awayTeamId
      ? undefined
      : findFixtureIdByKickoffUtc(raw.fixture.date));
  if (!fixtureId) {
    return null;
  }

  const fixture = getFixtureById(fixtureId);
  if (!fixture) {
    return null;
  }

  const statusShort = raw.fixture.status.short;
  const mappedStatus = mapApiStatusShort(statusShort);
  if (!mappedStatus) {
    return null;
  }
  const status = normalizeWc26MatchStatus(
    mappedStatus,
    raw.fixture.status.elapsed,
  );

  const confirmed = getConfirmedKnockoutPairingByFixtureId(fixtureId);
  const resolvedHomeTeamId = homeTeamId ?? confirmed?.homeTeamId;
  const resolvedAwayTeamId = awayTeamId ?? confirmed?.awayTeamId;

  const isFinished = status === "ft" || status === "aet" || status === "pen";
  const { homeScore, awayScore } = orientScoresForLocalFixture(
    fixtureId,
    homeName,
    awayName,
    raw.goals.home,
    raw.goals.away,
  );

  if (isFinished && (homeScore === null || awayScore === null)) {
    return null;
  }

  const base: Wc26ApiMatch = {
    fixtureId,
    matchNumber: fixture.matchNumber,
    status,
    statusShort,
    elapsed: raw.fixture.status.elapsed,
    homeScore,
    awayScore,
    kickoffUtc: raw.fixture.date,
    apiFixtureId: raw.fixture.id,
    ...(raw.score?.penalty?.home != null && raw.score?.penalty?.away != null
      ? {
          penaltiesHome: raw.score.penalty.home,
          penaltiesAway: raw.score.penalty.away,
        }
      : {}),
  };

  if (confirmed) {
    return {
      ...base,
      homeTeamId: resolvedHomeTeamId ?? confirmed.homeTeamId,
      awayTeamId: resolvedAwayTeamId ?? confirmed.awayTeamId,
    };
  }

  return {
    ...base,
    ...(resolvedHomeTeamId ? { homeTeamId: resolvedHomeTeamId } : {}),
    ...(resolvedAwayTeamId ? { awayTeamId: resolvedAwayTeamId } : {}),
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
