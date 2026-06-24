import {
  getTeamsByGroup,
  WC26_GROUPS,
  type Wc26GroupId,
} from "@/data/wc26";
import {
  getEffectiveFixtures,
  getFixtureScore,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import { isLiveMatchStatus } from "@/lib/wc26-live";
import { WC26_QUALIFYING_SPOTS } from "@/lib/wc26-groups";
import { isCompletedMatchStatus } from "@/lib/wc26-tournament-stats";
import { getTeamById } from "@/lib/teamIdentity";
import type { GroupStandings, StandingRow } from "@/types/standing";
import { createEmptyStandingRow } from "@/types/standing";
import type { TeamId } from "@/types/team";

type MutableStandingRow = {
  teamId: TeamId;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

function compareByName(left: StandingRow, right: StandingRow): number {
  const leftName = getTeamById(left.teamId)?.name ?? left.teamId;
  const rightName = getTeamById(right.teamId)?.name ?? right.teamId;
  return leftName.localeCompare(rightName);
}

function buildHeadToHeadRows(
  teamIds: ReadonlySet<TeamId>,
  fixtures: readonly EffectiveFixture[],
  groupId: Wc26GroupId,
): Map<TeamId, StandingRow> {
  const rows = new Map<TeamId, MutableStandingRow>();
  for (const teamId of teamIds) {
    rows.set(teamId, { ...createEmptyStandingRow(teamId) });
  }

  for (const fixture of fixtures) {
    if (fixture.groupId !== groupId || fixture.stage !== "group") {
      continue;
    }
    if (
      !teamIds.has(fixture.homeTeamId) ||
      !teamIds.has(fixture.awayTeamId)
    ) {
      continue;
    }
    processFixture(rows, fixture);
  }

  return new Map(
    [...rows.entries()].map(([teamId, row]) => [teamId, finalizeRow(row)]),
  );
}

function compareHeadToHead(
  left: StandingRow,
  right: StandingRow,
  tiedTeamIds: ReadonlySet<TeamId>,
  fixtures: readonly EffectiveFixture[],
  groupId: Wc26GroupId,
): number {
  const miniRows = buildHeadToHeadRows(tiedTeamIds, fixtures, groupId);
  const leftMini = miniRows.get(left.teamId);
  const rightMini = miniRows.get(right.teamId);
  if (!leftMini || !rightMini) {
    return 0;
  }

  if (rightMini.points !== leftMini.points) {
    return rightMini.points - leftMini.points;
  }
  if (rightMini.goalDifference !== leftMini.goalDifference) {
    return rightMini.goalDifference - leftMini.goalDifference;
  }
  if (rightMini.goalsFor !== leftMini.goalsFor) {
    return rightMini.goalsFor - leftMini.goalsFor;
  }

  return 0;
}

function sortStandingRows(
  rows: readonly StandingRow[],
  fixtures: readonly EffectiveFixture[],
  groupId: Wc26GroupId,
): StandingRow[] {
  const compare = (left: StandingRow, right: StandingRow): number => {
    if (right.points !== left.points) {
      return right.points - left.points;
    }

    const tiedTeamIds = new Set(
      rows
        .filter((row) => row.points === left.points)
        .map((row) => row.teamId),
    );

    if (tiedTeamIds.size >= 2) {
      const headToHead = compareHeadToHead(
        left,
        right,
        tiedTeamIds,
        fixtures,
        groupId,
      );
      if (headToHead !== 0) {
        return headToHead;
      }
    }

    if (right.goalDifference !== left.goalDifference) {
      return right.goalDifference - left.goalDifference;
    }
    if (right.goalsFor !== left.goalsFor) {
      return right.goalsFor - left.goalsFor;
    }

    return compareByName(left, right);
  };

  return [...rows].sort(compare);
}

function applyResult(
  rows: Map<TeamId, MutableStandingRow>,
  homeTeamId: TeamId,
  awayTeamId: TeamId,
  homeGoals: number,
  awayGoals: number,
): void {
  const home = rows.get(homeTeamId);
  const away = rows.get(awayTeamId);
  if (!home || !away) {
    return;
  }

  home.played += 1;
  away.played += 1;
  home.goalsFor += homeGoals;
  home.goalsAgainst += awayGoals;
  away.goalsFor += awayGoals;
  away.goalsAgainst += homeGoals;

  if (homeGoals > awayGoals) {
    home.won += 1;
    home.points += 3;
    away.lost += 1;
  } else if (homeGoals < awayGoals) {
    away.won += 1;
    away.points += 3;
    home.lost += 1;
  } else {
    home.drawn += 1;
    away.drawn += 1;
    home.points += 1;
    away.points += 1;
  }
}

function finalizeRow(row: MutableStandingRow): StandingRow {
  return {
    ...row,
    goalDifference: row.goalsFor - row.goalsAgainst,
  };
}

function buildEmptyRows(groupId: Wc26GroupId): Map<TeamId, MutableStandingRow> {
  const rows = new Map<TeamId, MutableStandingRow>();
  for (const team of getTeamsByGroup(groupId)) {
    rows.set(team.id, { ...createEmptyStandingRow(team.id) });
  }
  return rows;
}

function shouldCountFixtureForStandings(fixture: EffectiveFixture): boolean {
  if (fixture.stage !== "group" || !fixture.groupId) {
    return false;
  }
  if (isCompletedMatchStatus(fixture.status)) {
    return true;
  }
  if (isLiveMatchStatus(fixture.status) && getFixtureScore(fixture)) {
    return true;
  }
  return false;
}

function processFixture(
  rows: Map<TeamId, MutableStandingRow>,
  fixture: EffectiveFixture,
): void {
  if (!shouldCountFixtureForStandings(fixture)) {
    return;
  }

  const score = getFixtureScore(fixture);
  if (!score) {
    return;
  }

  applyResult(
    rows,
    fixture.homeTeamId,
    fixture.awayTeamId,
    score.home,
    score.away,
  );
}

/** Compute sorted standings for one group from effective fixtures. */
export function computeGroupStandings(
  groupId: Wc26GroupId,
  fixtures: readonly EffectiveFixture[] = getEffectiveFixtures(),
): GroupStandings {
  const rows = buildEmptyRows(groupId);

  for (const fixture of fixtures) {
    if (fixture.groupId !== groupId) {
      continue;
    }
    processFixture(rows, fixture);
  }

  const sorted = sortStandingRows(
    [...rows.values()].map(finalizeRow),
    fixtures,
    groupId,
  );

  return {
    groupId,
    rows: sorted,
  };
}

/** Compute standings for all twelve groups. */
export function computeAllGroupStandings(
  fixtures: readonly EffectiveFixture[] = getEffectiveFixtures(),
): readonly GroupStandings[] {
  return WC26_GROUPS.map((group) => computeGroupStandings(group.id, fixtures));
}

/** True when a row index is inside the automatic qualification zone. */
export function isQualifyingStandingPosition(
  rowIndex: number,
  qualifyingSpots: number,
): boolean {
  return rowIndex >= 0 && rowIndex < qualifyingSpots;
}

export type GroupQualificationResult = {
  readonly groupId: Wc26GroupId;
  readonly complete: boolean;
  readonly winner: StandingRow | null;
  readonly runnerUp: StandingRow | null;
  readonly eliminated: readonly StandingRow[];
  readonly standings: GroupStandings;
};

function groupStageFixtures(
  groupId: Wc26GroupId,
  fixtures: readonly EffectiveFixture[],
): EffectiveFixture[] {
  return fixtures.filter(
    (fixture) => fixture.stage === "group" && fixture.groupId === groupId,
  );
}

/** True when every group-stage fixture for the group is full-time. */
export function isGroupComplete(
  groupId: Wc26GroupId,
  fixtures: readonly EffectiveFixture[] = getEffectiveFixtures(),
): boolean {
  const matches = groupStageFixtures(groupId, fixtures);
  if (matches.length === 0) {
    return false;
  }
  return matches.every((fixture) => isCompletedMatchStatus(fixture.status));
}

export function getGroupQualification(
  groupId: Wc26GroupId,
  fixtures: readonly EffectiveFixture[] = getEffectiveFixtures(),
): GroupQualificationResult {
  const standings = computeGroupStandings(groupId, fixtures);
  const complete = isGroupComplete(groupId, fixtures);
  const winner = standings.rows[0] ?? null;
  const runnerUp = standings.rows[1] ?? null;
  const eliminated = complete
    ? standings.rows.slice(WC26_QUALIFYING_SPOTS)
    : [];

  return {
    groupId,
    complete,
    winner,
    runnerUp,
    eliminated,
    standings,
  };
}

export function getAllGroupQualifications(
  fixtures: readonly EffectiveFixture[] = getEffectiveFixtures(),
): readonly GroupQualificationResult[] {
  return WC26_GROUPS.map((group) => getGroupQualification(group.id, fixtures));
}

export function isTeamQualifiedInGroup(
  groupId: Wc26GroupId,
  teamId: TeamId,
  fixtures: readonly EffectiveFixture[] = getEffectiveFixtures(),
): boolean {
  const result = getGroupQualification(groupId, fixtures);
  if (!result.complete) {
    return false;
  }
  return (
    result.winner?.teamId === teamId || result.runnerUp?.teamId === teamId
  );
}

export function isTeamEliminatedInGroup(
  groupId: Wc26GroupId,
  teamId: TeamId,
  fixtures: readonly EffectiveFixture[] = getEffectiveFixtures(),
): boolean {
  const result = getGroupQualification(groupId, fixtures);
  if (!result.complete) {
    return false;
  }
  return result.eliminated.some((row) => row.teamId === teamId);
}

export function groupPositionLabel(
  groupId: Wc26GroupId,
  position: 1 | 2,
): string {
  return position === 1
    ? `Winner Group ${groupId.toUpperCase()}`
    : `Runner-up Group ${groupId.toUpperCase()}`;
}

export function resolveGroupPositionTeam(
  groupId: Wc26GroupId,
  position: 1 | 2,
  fixtures: readonly EffectiveFixture[] = getEffectiveFixtures(),
): TeamId | null {
  const result = getGroupQualification(groupId, fixtures);
  if (!result.complete) {
    return null;
  }
  const row = position === 1 ? result.winner : result.runnerUp;
  return row?.teamId ?? null;
}

export function teamDisplayName(teamId: TeamId): string {
  return getTeamById(teamId)?.name ?? teamId;
}

export type BracketSlotRef =
  | { readonly kind: "group-winner"; readonly groupId: Wc26GroupId }
  | { readonly kind: "group-runner-up"; readonly groupId: Wc26GroupId }
  | {
      readonly kind: "third-place";
      readonly groups: readonly Wc26GroupId[];
      readonly label: string;
    };

export type BracketMatchTemplate = {
  readonly matchNumber: number;
  readonly round: string;
  readonly home: BracketSlotRef;
  readonly away: BracketSlotRef;
};

export type ResolvedBracketSide = {
  readonly teamId: TeamId | null;
  readonly label: string;
  readonly pending: boolean;
};

export type ResolvedBracketMatch = {
  readonly matchNumber: number;
  readonly round: string;
  readonly home: ResolvedBracketSide;
  readonly away: ResolvedBracketSide;
};

/** Official Ro32 templates that involve Group B (FIFA match numbers). */
export const GROUP_B_ROUND_OF_32_MATCHES: readonly BracketMatchTemplate[] = [
  {
    matchNumber: 73,
    round: "Round of 32",
    home: { kind: "group-runner-up", groupId: "a" },
    away: { kind: "group-runner-up", groupId: "b" },
  },
  {
    matchNumber: 85,
    round: "Round of 32",
    home: { kind: "group-winner", groupId: "b" },
    away: {
      kind: "third-place",
      groups: ["e", "f", "g", "i", "j"],
      label: "Best 3rd place (Groups E/F/G/I/J)",
    },
  },
];

function resolveBracketSlot(
  slot: BracketSlotRef,
  fixtures: readonly EffectiveFixture[],
): ResolvedBracketSide {
  if (slot.kind === "group-winner") {
    const teamId = resolveGroupPositionTeam(slot.groupId, 1, fixtures);
    const qual = getGroupQualification(slot.groupId, fixtures);
    return {
      teamId,
      label: teamId
        ? teamDisplayName(teamId)
        : groupPositionLabel(slot.groupId, 1),
      pending: !qual.complete,
    };
  }

  if (slot.kind === "group-runner-up") {
    const teamId = resolveGroupPositionTeam(slot.groupId, 2, fixtures);
    const qual = getGroupQualification(slot.groupId, fixtures);
    return {
      teamId,
      label: teamId
        ? teamDisplayName(teamId)
        : groupPositionLabel(slot.groupId, 2),
      pending: !qual.complete,
    };
  }

  return {
    teamId: null,
    label: slot.label,
    pending: true,
  };
}

export function resolveBracketMatch(
  template: BracketMatchTemplate,
  fixtures: readonly EffectiveFixture[],
): ResolvedBracketMatch {
  return {
    matchNumber: template.matchNumber,
    round: template.round,
    home: resolveBracketSlot(template.home, fixtures),
    away: resolveBracketSlot(template.away, fixtures),
  };
}

export function buildGroupBBracketView(
  fixtures: readonly EffectiveFixture[],
): readonly ResolvedBracketMatch[] {
  return GROUP_B_ROUND_OF_32_MATCHES.map((template) =>
    resolveBracketMatch(template, fixtures),
  );
}

export function listCompletedGroupQualifiers(
  fixtures: readonly EffectiveFixture[],
): readonly GroupQualificationResult[] {
  return (["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"] as const)
    .map((groupId) => getGroupQualification(groupId, fixtures))
    .filter((result) => result.complete);
}
