/**
 * Homepage matchday selection - pure helpers shared by cards, filters and tests.
 * Competitions: Premier League, Champions League, FA Cup, Nations League.
 */

import { isLocalToday } from "@/lib/date-utils";
import { FACUP_DISPLAY_NAME, FACUP_HUB_PATH } from "@/lib/facup/constants";
import type { FacupFixtureRow } from "@/lib/facup/types";
import { PL_LEAGUE_NAME, PL_SEASON_LABEL } from "@/lib/pl/constants";
import type { PlFixtureRow } from "@/lib/pl/types";
import { UCL_DISPLAY_NAME, UCL_HUB_PATH } from "@/lib/ucl/constants";
import type { UclFixtureRow } from "@/lib/ucl/types";
import { UNL_DISPLAY_NAME, UNL_HUB_PATH } from "@/lib/unl/constants";
import type { UnlFixtureRow } from "@/lib/unl/types";

export type MatchdayCompetitionId = "pl" | "ucl" | "facup" | "unl";

export type MatchdayFilter = "all" | "live" | "finished" | "upcoming";

export type MatchdayStatusBucket =
  | "live"
  | "finished"
  | "upcoming"
  | "other";

export type MatchdayCard = {
  competitionId: MatchdayCompetitionId;
  /** Competition-qualified identity - never collide numeric fixture IDs across comps. */
  qualifiedId: string;
  fixtureId: number;
  kickoffUtc: string | null;
  homeTeamName: string;
  homeTeamLogo: string | null;
  awayTeamName: string;
  awayTeamLogo: string | null;
  /** Normalised display status bucket. */
  bucket: MatchdayStatusBucket;
  /** Provider status string (LIVE, FT, UPCOMING, HT via statusShort, etc.). */
  status: string;
  statusShort: string;
  elapsed: number | null;
  homeScore: number | null;
  awayScore: number | null;
  competitionLabel: string;
  hubHref: string;
  favouriteMatchId: string;
  /** False when this competition only exposes schedule without trustworthy live scores. */
  liveScoresSupported: boolean;
};

export type MatchdayCompetitionMeta = {
  id: MatchdayCompetitionId;
  label: string;
  hubPath: string;
  liveScoresSupported: boolean;
};

export const MATCHDAY_COMPETITIONS: readonly MatchdayCompetitionMeta[] = [
  {
    id: "pl",
    label: `${PL_LEAGUE_NAME} ${PL_SEASON_LABEL}`,
    hubPath: "/premier-league",
    liveScoresSupported: true,
  },
  {
    id: "ucl",
    label: UCL_DISPLAY_NAME,
    hubPath: UCL_HUB_PATH,
    liveScoresSupported: true,
  },
  {
    id: "facup",
    label: FACUP_DISPLAY_NAME,
    hubPath: FACUP_HUB_PATH,
    liveScoresSupported: true,
  },
  {
    id: "unl",
    label: UNL_DISPLAY_NAME,
    hubPath: UNL_HUB_PATH,
    liveScoresSupported: true,
  },
] as const;

const COMPETITION_ORDER: Record<MatchdayCompetitionId, number> = {
  pl: 0,
  ucl: 1,
  facup: 2,
  unl: 3,
};

function kickoffMs(iso: string | null): number {
  if (!iso) return Number.POSITIVE_INFINITY;
  const ms = new Date(iso).getTime();
  return Number.isFinite(ms) ? ms : Number.POSITIVE_INFINITY;
}

function bucketFromStatus(status: string): MatchdayStatusBucket {
  const normalized = status.trim().toUpperCase();
  if (normalized === "LIVE") return "live";
  if (
    normalized === "FT" ||
    normalized === "AET" ||
    normalized === "PEN" ||
    normalized === "ABANDONED"
  ) {
    return "finished";
  }
  if (normalized === "UPCOMING") return "upcoming";
  return "other";
}

export function matchdayHubHref(
  competitionId: MatchdayCompetitionId,
  fixtureId: number,
): string {
  switch (competitionId) {
    case "pl":
      return `/premier-league/match/${fixtureId}`;
    case "ucl":
      return `/champions-league/match/${fixtureId}`;
    case "facup":
      return `/fa-cup/match/${fixtureId}`;
    case "unl":
      return `/nations-league/match/${fixtureId}`;
  }
}

export function matchdayFavouriteId(
  competitionId: MatchdayCompetitionId,
  fixtureId: number,
): string {
  return `${competitionId}:${fixtureId}`;
}

export function formatMatchdayScore(
  homeScore: number | null,
  awayScore: number | null,
): { home: string; away: string; known: boolean } {
  if (homeScore == null || awayScore == null) {
    return { home: "-", away: "-", known: false };
  }
  return {
    home: String(homeScore),
    away: String(awayScore),
    known: true,
  };
}

function toCard(
  competitionId: MatchdayCompetitionId,
  row: {
    fixtureId: number;
    kickoffUtc: string | null;
    homeTeamName: string;
    homeTeamLogo: string | null;
    awayTeamName: string;
    awayTeamLogo: string | null;
    status: string;
    statusShort: string;
    elapsed: number | null;
    homeScore: number | null;
    awayScore: number | null;
  },
  label: string,
  liveScoresSupported: boolean,
): MatchdayCard {
  return {
    competitionId,
    qualifiedId: matchdayFavouriteId(competitionId, row.fixtureId),
    fixtureId: row.fixtureId,
    kickoffUtc: row.kickoffUtc,
    homeTeamName: row.homeTeamName,
    homeTeamLogo: row.homeTeamLogo,
    awayTeamName: row.awayTeamName,
    awayTeamLogo: row.awayTeamLogo,
    bucket: bucketFromStatus(row.status),
    status: row.status,
    statusShort: row.statusShort ?? "",
    elapsed: row.elapsed,
    homeScore: row.homeScore,
    awayScore: row.awayScore,
    competitionLabel: label,
    hubHref: matchdayHubHref(competitionId, row.fixtureId),
    favouriteMatchId: matchdayFavouriteId(competitionId, row.fixtureId),
    liveScoresSupported,
  };
}

export function normalizePlFixtures(
  fixtures: readonly PlFixtureRow[],
): MatchdayCard[] {
  const label = `${PL_LEAGUE_NAME} ${PL_SEASON_LABEL}`;
  return fixtures.map((f) =>
    toCard(
      "pl",
      {
        fixtureId: f.fixtureId,
        kickoffUtc: f.kickoffUtc,
        homeTeamName: f.homeTeamName,
        homeTeamLogo: f.homeTeamLogo,
        awayTeamName: f.awayTeamName,
        awayTeamLogo: f.awayTeamLogo,
        status: f.status,
        statusShort: f.statusShort,
        elapsed: f.elapsed,
        homeScore: f.homeScore,
        awayScore: f.awayScore,
      },
      label,
      true,
    ),
  );
}

export function normalizeUclFixtures(
  fixtures: readonly UclFixtureRow[],
): MatchdayCard[] {
  return fixtures.map((f) =>
    toCard(
      "ucl",
      {
        fixtureId: f.fixtureId,
        kickoffUtc: f.kickoffUtc,
        homeTeamName: f.homeTeamName,
        homeTeamLogo: f.homeTeamLogo,
        awayTeamName: f.awayTeamName,
        awayTeamLogo: f.awayTeamLogo,
        status: f.status,
        statusShort: f.statusShort,
        elapsed: f.elapsed,
        homeScore: f.homeScore,
        awayScore: f.awayScore,
      },
      UCL_DISPLAY_NAME,
      true,
    ),
  );
}

export function normalizeFacupFixtures(
  fixtures: readonly FacupFixtureRow[],
): MatchdayCard[] {
  return fixtures.map((f) =>
    toCard(
      "facup",
      {
        fixtureId: f.fixtureId,
        kickoffUtc: f.kickoffUtc,
        homeTeamName: f.homeTeamName,
        homeTeamLogo: f.homeTeamLogo,
        awayTeamName: f.awayTeamName,
        awayTeamLogo: f.awayTeamLogo,
        status: f.status,
        statusShort: f.statusShort,
        elapsed: f.elapsed,
        homeScore: f.homeScore,
        awayScore: f.awayScore,
      },
      FACUP_DISPLAY_NAME,
      true,
    ),
  );
}

export function normalizeUnlFixtures(
  fixtures: readonly UnlFixtureRow[],
): MatchdayCard[] {
  return fixtures.map((f) =>
    toCard(
      "unl",
      {
        fixtureId: f.fixtureId,
        kickoffUtc: f.kickoffUtc,
        homeTeamName: f.homeTeamName,
        homeTeamLogo: f.homeTeamLogo,
        awayTeamName: f.awayTeamName,
        awayTeamLogo: f.awayTeamLogo,
        status: f.status,
        statusShort: f.statusShort,
        elapsed: f.elapsed,
        homeScore: f.homeScore,
        awayScore: f.awayScore,
      },
      UNL_DISPLAY_NAME,
      true,
    ),
  );
}

/** Deduplicate by competition-qualified ID (first wins). */
export function dedupeMatchdayCards(
  cards: readonly MatchdayCard[],
): MatchdayCard[] {
  const seen = new Set<string>();
  const out: MatchdayCard[] = [];
  for (const card of cards) {
    if (seen.has(card.qualifiedId)) continue;
    seen.add(card.qualifiedId);
    out.push(card);
  }
  return out;
}

function featuredPriority(card: MatchdayCard, now: Date): number {
  if (card.bucket === "live") return 0;
  if (
    card.kickoffUtc &&
    isLocalToday(card.kickoffUtc, now) &&
    card.bucket === "upcoming"
  ) {
    return 1;
  }
  if (
    card.kickoffUtc &&
    isLocalToday(card.kickoffUtc, now) &&
    card.bucket === "finished"
  ) {
    return 2;
  }
  if (card.bucket === "upcoming") return 3;
  return 4;
}

/**
 * Featured homepage slots: live-first, sort within groups by kickoff,
 * exclude historical (non-today) finished fixtures from the pool.
 */
export function orderMatchdayForFeatured(
  cards: readonly MatchdayCard[],
  now: Date = new Date(),
): MatchdayCard[] {
  const eligible = cards.filter((card) => {
    if (card.bucket === "live") return true;
    if (card.bucket === "upcoming") return true;
    if (card.bucket === "finished") {
      return Boolean(card.kickoffUtc && isLocalToday(card.kickoffUtc, now));
    }
    return Boolean(card.kickoffUtc && isLocalToday(card.kickoffUtc, now));
  });

  return [...eligible].sort((a, b) => {
    const priority = featuredPriority(a, now) - featuredPriority(b, now);
    if (priority !== 0) return priority;
    const timeDiff = kickoffMs(a.kickoffUtc) - kickoffMs(b.kickoffUtc);
    if (timeDiff !== 0) return timeDiff;
    const comp =
      COMPETITION_ORDER[a.competitionId] - COMPETITION_ORDER[b.competitionId];
    if (comp !== 0) return comp;
    return a.fixtureId - b.fixtureId;
  });
}

export function isMatchdayToday(
  card: MatchdayCard,
  now: Date = new Date(),
): boolean {
  if (card.bucket === "live") return true;
  if (!card.kickoffUtc) return false;
  return isLocalToday(card.kickoffUtc, now);
}

function matchdayListPriority(card: MatchdayCard): number {
  if (card.bucket === "live") return 0;
  if (card.bucket === "upcoming") return 1;
  if (card.bucket === "finished") return 2;
  return 3;
}

/** Today's board ordering: live -> upcoming -> finished; kickoff within group. */
export function orderTodaysMatchday(
  cards: readonly MatchdayCard[],
  now: Date = new Date(),
): MatchdayCard[] {
  const today = cards.filter((card) => isMatchdayToday(card, now));
  return [...today].sort((a, b) => {
    const priority = matchdayListPriority(a) - matchdayListPriority(b);
    if (priority !== 0) return priority;
    if (a.bucket === "finished" && b.bucket === "finished") {
      return kickoffMs(b.kickoffUtc) - kickoffMs(a.kickoffUtc);
    }
    const timeDiff = kickoffMs(a.kickoffUtc) - kickoffMs(b.kickoffUtc);
    if (timeDiff !== 0) return timeDiff;
    const comp =
      COMPETITION_ORDER[a.competitionId] - COMPETITION_ORDER[b.competitionId];
    if (comp !== 0) return comp;
    return a.fixtureId - b.fixtureId;
  });
}

export function filterMatchdayCards(
  cards: readonly MatchdayCard[],
  filter: MatchdayFilter,
): MatchdayCard[] {
  if (filter === "all") return [...cards];
  if (filter === "live") return cards.filter((c) => c.bucket === "live");
  if (filter === "finished") return cards.filter((c) => c.bucket === "finished");
  return cards.filter((c) => c.bucket === "upcoming");
}

export type MatchdayFilterCounts = {
  all: number;
  live: number;
  finished: number;
  upcoming: number;
};

export function countMatchdayFilters(
  cards: readonly MatchdayCard[],
): MatchdayFilterCounts {
  return {
    all: cards.length,
    live: cards.filter((c) => c.bucket === "live").length,
    finished: cards.filter((c) => c.bucket === "finished").length,
    upcoming: cards.filter((c) => c.bucket === "upcoming").length,
  };
}

export type MatchdayCompetitionGroup = {
  competitionId: MatchdayCompetitionId;
  label: string;
  hubPath: string;
  cards: MatchdayCard[];
  liveScoresSupported: boolean;
};

export function groupMatchdayByCompetition(
  cards: readonly MatchdayCard[],
): MatchdayCompetitionGroup[] {
  const byComp = new Map<MatchdayCompetitionId, MatchdayCard[]>();
  for (const card of cards) {
    const list = byComp.get(card.competitionId) ?? [];
    list.push(card);
    byComp.set(card.competitionId, list);
  }

  return MATCHDAY_COMPETITIONS.flatMap((meta) => {
    const groupCards = byComp.get(meta.id);
    if (!groupCards?.length) return [];
    return [
      {
        competitionId: meta.id,
        label: meta.label,
        hubPath: meta.hubPath,
        cards: groupCards,
        liveScoresSupported: meta.liveScoresSupported,
      },
    ];
  });
}

export type CompetitionFeedState = {
  cards: MatchdayCard[];
  isLoading: boolean;
  error: boolean;
  stale: boolean;
  fetchedAt: string | null;
  configured: boolean;
};

export function mergeMatchdayFeeds(
  feeds: readonly CompetitionFeedState[],
): {
  cards: MatchdayCard[];
  anyLoading: boolean;
  anyError: boolean;
  anyStale: boolean;
  allLoadingEmpty: boolean;
  hasAnyData: boolean;
  earliestFetchedAt: string | null;
} {
  const cards = dedupeMatchdayCards(feeds.flatMap((f) => f.cards));
  const anyLoading = feeds.some((f) => f.isLoading && f.cards.length === 0);
  const anyError = feeds.some((f) => f.error);
  const anyStale = feeds.some((f) => f.stale);
  const allLoadingEmpty =
    feeds.every((f) => f.isLoading && f.cards.length === 0) && feeds.length > 0;
  const hasAnyData = cards.length > 0 || feeds.some((f) => !f.isLoading);
  const fetchedAts = feeds
    .map((f) => f.fetchedAt)
    .filter((v): v is string => Boolean(v));
  const earliestFetchedAt =
    fetchedAts.length === 0
      ? null
      : fetchedAts.reduce((a, b) => (a < b ? a : b));

  return {
    cards,
    anyLoading,
    anyError,
    anyStale,
    allLoadingEmpty,
    hasAnyData,
    earliestFetchedAt,
  };
}
