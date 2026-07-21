/**
 * World Cup 2026 archive helpers — curated historical presentation.
 * Uses repository SSOT only. Do not invent winners, scores, or awards.
 */

import {
  WC26_CONFIRMED_KNOCKOUT_PAIRINGS,
  WC26_CONFIRMED_KNOCKOUT_RESULTS,
} from "@/lib/wc26/confirmed-results-ssot";
import {
  WC26_FINAL_FIXTURE_ID,
  WC26_FINAL_MATCH_NUMBER,
} from "@/lib/wc26/final-winner";
import { getTeamById } from "@/data/wc26";
import type { TeamId } from "@/types/team";

/** Curated archive data as-of date (ISO calendar date, UTC). */
export const WC26_ARCHIVE_DATA_AS_OF = "2026-07-19";

export const WC26_ARCHIVE_LABEL = "World Cup 2026 Archive";

export const WC26_ARCHIVE_HUB_HREF = "/worldcup2026";

export type Wc26ArchiveFinalSummary = {
  readonly fixtureId: string;
  readonly matchNumber: number;
  readonly winnerTeamId: TeamId;
  readonly runnerUpTeamId: TeamId;
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
  readonly homeScore: number;
  readonly awayScore: number;
  readonly matchStatus: "ft" | "aet" | "pen";
  readonly penaltiesHome: number | null;
  readonly penaltiesAway: number | null;
  readonly winnerName: string;
  readonly runnerUpName: string;
};

/** Tournament is complete when the final has a verified knockout result. */
export function isWc26TournamentComplete(): boolean {
  return getWc26ArchiveFinalSummary() != null;
}

/**
 * Resolve the verified final from confirmed-results SSOT.
 * Returns null if pairing or result is missing — callers must omit champion UI.
 */
export function getWc26ArchiveFinalSummary(): Wc26ArchiveFinalSummary | null {
  const pairing = WC26_CONFIRMED_KNOCKOUT_PAIRINGS.find(
    (p) =>
      p.fixtureId === WC26_FINAL_FIXTURE_ID &&
      p.matchNumber === WC26_FINAL_MATCH_NUMBER,
  );
  const result = WC26_CONFIRMED_KNOCKOUT_RESULTS.find(
    (r) => r.matchNumber === WC26_FINAL_MATCH_NUMBER,
  );
  if (!pairing || !result) return null;

  const winnerTeamId = result.winnerTeamId;
  const runnerUpTeamId =
    winnerTeamId === pairing.homeTeamId
      ? pairing.awayTeamId
      : pairing.homeTeamId;

  const winner = getTeamById(winnerTeamId);
  const runnerUp = getTeamById(runnerUpTeamId);
  if (!winner || !runnerUp) return null;

  return {
    fixtureId: pairing.fixtureId,
    matchNumber: pairing.matchNumber,
    winnerTeamId,
    runnerUpTeamId,
    homeTeamId: pairing.homeTeamId,
    awayTeamId: pairing.awayTeamId,
    homeScore: result.homeScore,
    awayScore: result.awayScore,
    matchStatus: result.matchStatus ?? "ft",
    penaltiesHome: result.penaltiesHome ?? null,
    penaltiesAway: result.penaltiesAway ?? null,
    winnerName: winner.name,
    runnerUpName: runnerUp.name,
  };
}

export function formatArchiveScoreLine(summary: Wc26ArchiveFinalSummary): string {
  const base = `${summary.homeScore}\u2013${summary.awayScore}`;
  if (
    summary.matchStatus === "pen" &&
    summary.penaltiesHome != null &&
    summary.penaltiesAway != null
  ) {
    return `${base} (${summary.penaltiesHome}\u2013${summary.penaltiesAway} pens)`;
  }
  if (summary.matchStatus === "aet") {
    return `${base} AET`;
  }
  return base;
}

/** Hub article links retained for the archive (existing URLs only). */
export const WC26_ARCHIVE_HUB_ARTICLES = [
  {
    href: "/articles/spain-world-cup-2026-champion-masterclass",
    title: "Spain World Cup 2026 champion masterclass",
  },
  {
    href: "/articles/england-6-4-france-third-place-recap",
    title: "England 6\u20134 France third-place recap",
  },
  {
    href: "/articles/england-argentina-world-cup-semifinal-analysis",
    title: "England\u2013Argentina semi-final analysis",
  },
  {
    href: "/articles/world-cup-2026-july-3-recap",
    title: "World Cup 2026 \u00b7 3 July recap",
  },
  {
    href: "/worldcup2026/news/morocco-knock-out-netherlands-on-penalties",
    title: "Morocco knock out Netherlands on penalties",
  },
] as const;

export const WC26_ARCHIVE_MATCH_REPORTS = [
  {
    href: "/worldcup2026/match/fixture-104",
    title: "Final \u00b7 Match 104",
  },
  {
    href: "/worldcup2026/match/fixture-103",
    title: "Third-place \u00b7 Match 103",
  },
] as const;