import { isKnockoutPlaceholderTeam } from "@/data/wc26";
import {
  getFixtureScore,
  isEffectiveFixtureCompleted,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import {
  isLiveMatchStatus,
  resolveFixtureParticipant,
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

/** UI badge status for bracket match cards. */
export type BracketDisplayStatus = "live" | "ft" | "forthcoming";

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
  readonly displayStatus: BracketDisplayStatus;
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

/** Bracket tree row positions (1-based) for converging layout. */
export const BRACKET_TREE_ROWS = 16;

/** Left-to-right column match order for ESPN-style converging bracket. */
export const BRACKET_CONVERGING_LAYOUT = {
  left: {
    r32: [73, 75, 74, 77, 83, 84, 81, 82] as const,
    r16: [89, 90, 93, 94] as const,
    qf: [97, 98] as const,
    sf: [101] as const,
  },
  center: {
    third: 103,
    final: 104,
  },
  right: {
    sf: [102] as const,
    qf: [99, 100] as const,
    r16: [91, 92, 95, 96] as const,
    r32: [76, 78, 79, 80, 86, 88, 85, 87] as const,
  },
} as const;

export type BracketColumnSide = "left" | "center" | "right";

export type BracketPositionedMatch = BracketMatchCardView & {
  readonly gridRow: number;
};

export type BracketConvergingColumn = {
  readonly side: BracketColumnSide;
  readonly roundKey: BracketRoundKey;
  readonly roundLabel: string;
  readonly columnIndex: number;
  readonly matches: readonly BracketPositionedMatch[];
};

export type BracketConvergingView = {
  readonly columns: readonly BracketConvergingColumn[];
  readonly rowCount: number;
  readonly matchByNumber: ReadonlyMap<number, BracketMatchCardView>;
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
  if (isEffectiveFixtureCompleted(fixture)) {
    return "finished";
  }
  return "scheduled";
}

export function resolveBracketDisplayStatus(
  fixture: EffectiveFixture | undefined,
): BracketDisplayStatus {
  if (!fixture) {
    return "forthcoming";
  }
  if (isLiveMatchStatus(fixture.status)) {
    return "live";
  }
  if (isEffectiveFixtureCompleted(fixture)) {
    return "ft";
  }
  return "forthcoming";
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
  fixture: EffectiveFixture | undefined,
  participantSide: "home" | "away",
  fixtures: readonly EffectiveFixture[],
): BracketTeamSlotView {
  if (fixture) {
    const resolved = resolveFixtureParticipant(fixture, participantSide, fixtures);
    const teamId = isKnockoutPlaceholderTeam(resolved.teamId)
      ? null
      : resolved.teamId;
    const pending =
      !teamId &&
      (side.pending ||
        resolved.label.startsWith("Winner Match") ||
        resolved.label.startsWith("Loser Match") ||
        resolved.label.startsWith("Winner Group") ||
        resolved.label.startsWith("Runner-up Group") ||
        resolved.label.startsWith("Best 3rd"));
    return {
      teamId,
      label: resolved.label.replace(/ ✓$/, ""),
      pending,
      isWinner: Boolean(winnerTeamId && teamId && winnerTeamId === teamId),
    };
  }

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
  const displayStatus = resolveBracketDisplayStatus(fixture);

  return {
    fixtureId,
    matchNumber: match.matchNumber,
    round: match.round,
    roundKey,
    home: mapSide(match.home, match.winnerTeamId, fixture, "home", fixtures),
    away: mapSide(match.away, match.winnerTeamId, fixture, "away", fixtures),
    score: scoreForMatch(match, fixture),
    status,
    displayStatus,
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

function bracketRowForDepth(index: number, depth: 0 | 1 | 2 | 3): number {
  const span = 2 ** (depth + 1);
  return index * span + span / 2;
}

function positionMatches(
  matchNumbers: readonly number[],
  depth: 0 | 1 | 2 | 3,
  matchByNumber: ReadonlyMap<number, BracketMatchCardView>,
): BracketPositionedMatch[] {
  return matchNumbers
    .map((matchNumber, index) => {
      const match = matchByNumber.get(matchNumber);
      if (!match) {
        return null;
      }
      return {
        ...match,
        gridRow: bracketRowForDepth(index, depth),
      };
    })
    .filter((entry): entry is BracketPositionedMatch => entry !== null);
}

export function buildConvergingBracketView(
  rounds: readonly BracketRoundView[],
  fixtures: readonly EffectiveFixture[],
  roundLabels: Record<string, string>,
): BracketConvergingView {
  const allCards = rounds.flatMap((round) =>
    round.matches.map((match) => mapResolvedMatchToCardView(match, fixtures)),
  );
  const matchByNumber = new Map(
    allCards.map((card) => [card.matchNumber, card] as const),
  );

  const layout = BRACKET_CONVERGING_LAYOUT;
  const columns: BracketConvergingColumn[] = [
    {
      side: "left",
      roundKey: "r32",
      roundLabel: roundLabels.r32 ?? "Round of 32",
      columnIndex: 0,
      matches: positionMatches(layout.left.r32, 0, matchByNumber),
    },
    {
      side: "left",
      roundKey: "r16",
      roundLabel: roundLabels.r16 ?? "Round of 16",
      columnIndex: 1,
      matches: positionMatches(layout.left.r16, 1, matchByNumber),
    },
    {
      side: "left",
      roundKey: "qf",
      roundLabel: roundLabels.qf ?? "Quarter-finals",
      columnIndex: 2,
      matches: positionMatches(layout.left.qf, 2, matchByNumber),
    },
    {
      side: "left",
      roundKey: "sf",
      roundLabel: roundLabels.sf ?? "Semi-finals",
      columnIndex: 3,
      matches: positionMatches(layout.left.sf, 3, matchByNumber),
    },
    {
      side: "center",
      roundKey: "final",
      roundLabel: roundLabels.final ?? "Final",
      columnIndex: 4,
      matches: [
        ...(matchByNumber.has(layout.center.third)
          ? [
              {
                ...matchByNumber.get(layout.center.third)!,
                gridRow: 6,
              },
            ]
          : []),
        ...(matchByNumber.has(layout.center.final)
          ? [
              {
                ...matchByNumber.get(layout.center.final)!,
                gridRow: 10,
              },
            ]
          : []),
      ],
    },
    {
      side: "right",
      roundKey: "sf",
      roundLabel: roundLabels.sf ?? "Semi-finals",
      columnIndex: 5,
      matches: positionMatches(layout.right.sf, 3, matchByNumber),
    },
    {
      side: "right",
      roundKey: "qf",
      roundLabel: roundLabels.qf ?? "Quarter-finals",
      columnIndex: 6,
      matches: positionMatches(layout.right.qf, 2, matchByNumber),
    },
    {
      side: "right",
      roundKey: "r16",
      roundLabel: roundLabels.r16 ?? "Round of 16",
      columnIndex: 7,
      matches: positionMatches(layout.right.r16, 1, matchByNumber),
    },
    {
      side: "right",
      roundKey: "r32",
      roundLabel: roundLabels.r32 ?? "Round of 32",
      columnIndex: 8,
      matches: positionMatches(layout.right.r32, 0, matchByNumber),
    },
  ];

  return {
    columns,
    rowCount: BRACKET_TREE_ROWS,
    matchByNumber,
  };
}

export function bracketHasResolvedTeams(view: BracketConvergingView): boolean {
  for (const match of view.matchByNumber.values()) {
    if (match.home.teamId || match.away.teamId) {
      return true;
    }
    if (match.displayStatus === "live" || match.displayStatus === "ft") {
      return true;
    }
  }
  return false;
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
