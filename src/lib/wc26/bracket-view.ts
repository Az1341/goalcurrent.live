import { isKnockoutPlaceholderTeam } from "@/data/wc26";
import {
  getFixtureScore,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import {
  isLiveMatchStatus,
  type HomepageMatchView,
} from "@/lib/wc26-live";
import { isCompletedMatchStatus } from "@/lib/wc26-tournament-stats";
import type {
  BracketRoundView,
  ResolvedBracketMatch,
  ResolvedBracketSide,
} from "@/lib/wc26-standings";
import { findFixtureIdByMatchNumber } from "@/lib/wc26-fixture-match";
import type { VenueId } from "@/types/venue";

export type BracketRoundKey =
  | "r32"
  | "r16"
  | "qf"
  | "sf"
  | "third"
  | "final";

export type BracketMatchStatus = "scheduled" | "live" | "finished";

export type BracketTeamSlotView = {
  readonly teamId: string | null;
  readonly label: string;
  readonly pending: boolean;
  readonly isWinner: boolean;
};

export type BracketMatchCardView = {
  readonly fixtureId: string;
  readonly matchNumber: number;
  readonly round: string;
  readonly roundKey: BracketRoundKey;
  readonly home: BracketTeamSlotView;
  readonly away: BracketTeamSlotView;
  readonly score: { readonly home: number; readonly away: number } | null;
  readonly status: BracketMatchStatus;
  readonly elapsed: number | null;
  readonly kickoffUtc: string | null;
  readonly venueId: VenueId | null;
  readonly isFinal: boolean;
  readonly isThirdPlace: boolean;
};

export type BracketColumnView = {
  readonly roundKey: BracketRoundKey;
  readonly roundLabel: string;
  readonly matches: readonly BracketMatchCardView[];
};

export type BracketGridView = {
  readonly columns: readonly BracketColumnView[];
};

const ROUND_KEY_BY_LABEL: Record<string, BracketRoundKey> = {
  "Round of 32": "r32",
  "Round of 16": "r16",
  "Quarter-finals": "qf",
  "Semi-finals": "sf",
  "Third place": "third",
  Final: "final",
};

function roundKeyFromLabel(round: string): BracketRoundKey {
  return ROUND_KEY_BY_LABEL[round] ?? "r32";
}

function fixtureForMatch(
  matchNumber: number,
  fixtures: readonly EffectiveFixture[],
): EffectiveFixture | undefined {
  return fixtures.find((fixture) => fixture.matchNumber === matchNumber);
}

function resolveMatchStatus(
  fixture: EffectiveFixture | undefined,
): BracketMatchStatus {
  if (!fixture) {
    return "scheduled";
  }
  if (isLiveMatchStatus(fixture.status)) {
    return "live";
  }
  if (isCompletedMatchStatus(fixture.status)) {
    return "finished";
  }
  return "scheduled";
}

function parseScoreString(
  score: string | null,
): { home: number; away: number } | null {
  if (!score) {
    return null;
  }
  const parts = score.split(/[–\-:]/).map((part) => part.trim());
  if (parts.length !== 2) {
    return null;
  }
  const home = Number(parts[0]);
  const away = Number(parts[1]);
  if (!Number.isFinite(home) || !Number.isFinite(away)) {
    return null;
  }
  return { home, away };
}

function scoreForMatch(
  match: ResolvedBracketMatch,
  fixture: EffectiveFixture | undefined,
): { home: number; away: number } | null {
  if (fixture) {
    const overlayScore = getFixtureScore(fixture);
    if (overlayScore) {
      return overlayScore;
    }
  }
  return parseScoreString(match.score);
}

function mapSide(
  side: ResolvedBracketSide,
  winnerTeamId: string | null,
): BracketTeamSlotView {
  const teamId =
    side.teamId && !isKnockoutPlaceholderTeam(side.teamId) ? side.teamId : null;
  return {
    teamId,
    label: side.label.replace(/ ✓$/, ""),
    pending: side.pending,
    isWinner: Boolean(winnerTeamId && teamId && winnerTeamId === teamId),
  };
}

export function mapResolvedMatchToCardView(
  match: ResolvedBracketMatch,
  fixtures: readonly EffectiveFixture[],
): BracketMatchCardView {
  const fixture = fixtureForMatch(match.matchNumber, fixtures);
  const fixtureId =
    fixture?.id ?? findFixtureIdByMatchNumber(match.matchNumber) ?? "";
  const roundKey = roundKeyFromLabel(match.round);
  const status = resolveMatchStatus(fixture);

  return {
    fixtureId,
    matchNumber: match.matchNumber,
    round: match.round,
    roundKey,
    home: mapSide(match.home, match.winnerTeamId),
    away: mapSide(match.away, match.winnerTeamId),
    score: scoreForMatch(match, fixture),
    status,
    elapsed: fixture?.elapsed ?? null,
    kickoffUtc: match.kickoffUtc,
    venueId: match.venueId,
    isFinal: roundKey === "final",
    isThirdPlace: roundKey === "third",
  };
}

export function buildBracketGridView(
  rounds: readonly BracketRoundView[],
  fixtures: readonly EffectiveFixture[],
): BracketGridView {
  const columns: BracketColumnView[] = [];
  const finalColumnMatches: BracketMatchCardView[] = [];

  for (const round of rounds) {
    const cards = round.matches.map((match) =>
      mapResolvedMatchToCardView(match, fixtures),
    );
    const roundKey = roundKeyFromLabel(round.round);

    if (roundKey === "third" || roundKey === "final") {
      finalColumnMatches.push(...cards);
      continue;
    }

    columns.push({
      roundKey,
      roundLabel: round.round,
      matches: cards,
    });
  }

  if (finalColumnMatches.length > 0) {
    columns.push({
      roundKey: "final",
      roundLabel: "Final",
      matches: finalColumnMatches,
    });
  }

  return { columns };
}

export function hasLiveKnockoutMatch(
  fixtures: readonly EffectiveFixture[],
): boolean {
  return fixtures.some(
    (fixture) =>
      fixture.stage !== "group" && isLiveMatchStatus(fixture.status),
  );
}

export function pickNextKnockoutFixture(
  fixtures: readonly EffectiveFixture[],
): EffectiveFixture | null {
  const knockout = fixtures
    .filter((fixture) => fixture.stage !== "group")
    .sort(
      (left, right) =>
        new Date(left.kickoffUtc).getTime() - new Date(right.kickoffUtc).getTime(),
    );

  const live = knockout.find((fixture) => isLiveMatchStatus(fixture.status));
  if (live) {
    return live;
  }

  const now = Date.now();
  const upcoming = knockout.find(
    (fixture) =>
      !isCompletedMatchStatus(fixture.status) &&
      new Date(fixture.kickoffUtc).getTime() >= now,
  );
  return upcoming ?? knockout[knockout.length - 1] ?? null;
}

export type { HomepageMatchView };
