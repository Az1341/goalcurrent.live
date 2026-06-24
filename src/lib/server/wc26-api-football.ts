import { getFixtureById } from "@/data/wc26";
import { apiFootballFetch } from "@/lib/api-football/client";
import {
  ApiFootballAuthError,
} from "@/lib/api-football/errors";
import {
  findFixtureIdByTeamNames,
  mapApiStatusShort,
} from "@/lib/wc26-fixture-match";
import type { Wc26ApiMatch } from "@/types/fixture-overlay";

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

function normalizeApiFixture(raw: ApiFootballFixture): Wc26ApiMatch | null {
  const homeName = raw.teams.home.name;
  const awayName = raw.teams.away.name;
  const fixtureId = findFixtureIdByTeamNames(homeName, awayName);
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
  if (
    isFinished &&
    (raw.goals.home === null || raw.goals.away === null)
  ) {
    return null;
  }

  return {
    fixtureId,
    matchNumber: fixture.matchNumber,
    status,
    statusShort,
    elapsed: raw.fixture.status.elapsed,
    homeScore: raw.goals.home,
    awayScore: raw.goals.away,
    kickoffUtc: raw.fixture.date,
    apiFixtureId: raw.fixture.id,
  };
}

export async function fetchFinishedWc26Matches(): Promise<Wc26ApiMatch[]> {
  const raw = await apiFetch(
    `/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}&status=FT-AET-PEN`,
  );

  return raw
    .map(normalizeApiFixture)
    .filter((match): match is Wc26ApiMatch => match !== null)
    .filter((match) => ["ft", "aet", "pen"].includes(match.status));
}

export async function fetchLiveWc26Matches(): Promise<Wc26ApiMatch[]> {
  const raw = await apiFetch(
    `/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}&live=all`,
  );

  return raw
    .map(normalizeApiFixture)
    .filter((match): match is Wc26ApiMatch => match !== null)
    .filter((match) => match.status !== "ft" && match.status !== "aet" && match.status !== "pen");
}
