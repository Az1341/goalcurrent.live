import {
  getTeamsByGroup,
  WC26_GROUPS,
  type Wc26GroupId,
} from "@/data/wc26";
import { isKnockoutPlaceholderTeam } from "@/data/wc26/knockout-fixtures";
import {
  getEffectiveFixtures,
  getFixtureScore,
  isEffectiveFixtureCompleted,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import { isLiveMatchStatus } from "@/lib/wc26-live";
import type { BracketMatchTemplate, BracketSlotRef, KnockoutFeedSlot } from "@/lib/wc26/bracket-types";
import { FIFA_KNOCKOUT_ROUND_TEMPLATES, FIFA_ROUND_OF_32_TEMPLATES } from "@/lib/wc26/fifa-bracket-mapping";
import { resolveBracketMatchSchedule } from "@/data/wc26/knockout-schedule";
import { WC26_QUALIFYING_SPOTS } from "@/lib/wc26-groups";
import {
  isWc26GroupStageComplete,
  WC26_FINAL_GROUP_STANDINGS,
} from "@/lib/wc26-final-standings";
import { getConfirmedKnockoutPairingByFixtureId } from "@/lib/wc26/knockout-confirmed-pairings";
import {
  getConfirmedKnockoutResult,
  getConfirmedKnockoutWinner,
} from "@/lib/wc26/knockout-confirmed-results";
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
  if (isWc26GroupStageComplete()) {
    const finalTable = WC26_FINAL_GROUP_STANDINGS.find(
      (table) => table.groupId === groupId,
    );
    if (finalTable) {
      return finalTable;
    }
  }

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
  if (isWc26GroupStageComplete()) {
    return true;
  }
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

export type {
  BracketSlotRef,
} from "@/lib/wc26/bracket-types";

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
  readonly score: string | null;
  readonly winnerTeamId: TeamId | null;
  readonly kickoffUtc: string | null;
  readonly venueId: import("@/types/venue").VenueId | null;
};

/** Official Ro32 templates that involve Group B (FIFA match numbers). */
export const GROUP_B_ROUND_OF_32_MATCHES = FIFA_ROUND_OF_32_TEMPLATES.filter(
  (match) =>
    (match.home.kind === "group-winner" && match.home.groupId === "b") ||
    (match.home.kind === "group-runner-up" && match.home.groupId === "b") ||
    (match.away.kind === "group-winner" && match.away.groupId === "b") ||
    (match.away.kind === "group-runner-up" && match.away.groupId === "b") ||
    (match.home.kind === "group-runner-up" && match.home.groupId === "a"),
);

function allGroupsComplete(fixtures: readonly EffectiveFixture[]): boolean {
  return WC26_GROUPS.every((group) => isGroupComplete(group.id, fixtures));
}

/** Assign ranked third-placed teams to Ro32 slots (match order, exclusive groups). */
function createThirdPlaceAssignmentMap(
  fixtures: readonly EffectiveFixture[],
): Map<string, TeamId> {
  if (!allGroupsComplete(fixtures)) {
    return new Map();
  }

  const ranked = computeRankedThirdPlaceTeams(fixtures);
  const qualifyingGroups = new Set(
    ranked.slice(0, 8).map((entry) => entry.groupId),
  );
  const usedGroups = new Set<Wc26GroupId>();
  const assignments = new Map<string, TeamId>();

  for (const template of FIFA_ROUND_OF_32_TEMPLATES) {
    for (const side of ["home", "away"] as const) {
      const slot = template[side];
      if (slot.kind !== "third-place") {
        continue;
      }

      const key = `${template.matchNumber}-${side}`;
      const candidate = ranked.find(
        (entry) =>
          slot.groups.includes(entry.groupId) &&
          qualifyingGroups.has(entry.groupId) &&
          !usedGroups.has(entry.groupId),
      );

      if (candidate) {
        assignments.set(key, candidate.row.teamId);
        usedGroups.add(candidate.groupId);
      }
    }
  }

  return assignments;
}

function resolveBracketSlot(
  slot: BracketSlotRef,
  fixtures: readonly EffectiveFixture[],
  thirdPlaceMap: ReadonlyMap<string, TeamId>,
  slotKey: string,
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

  if (!allGroupsComplete(fixtures)) {
    return {
      teamId: null,
      label: slot.label,
      pending: true,
    };
  }

  const teamId = thirdPlaceMap.get(slotKey) ?? null;
  return {
    teamId,
    label: teamId ? teamDisplayName(teamId) : slot.label,
    pending: !teamId,
  };
}

export function resolveBracketMatch(
  template: BracketMatchTemplate,
  fixtures: readonly EffectiveFixture[],
  thirdPlaceMap: ReadonlyMap<string, TeamId> = createThirdPlaceAssignmentMap(
    fixtures,
  ),
): ResolvedBracketMatch {
  const home = resolveBracketSlot(
    template.home,
    fixtures,
    thirdPlaceMap,
    `${template.matchNumber}-home`,
  );
  const away = resolveBracketSlot(
    template.away,
    fixtures,
    thirdPlaceMap,
    `${template.matchNumber}-away`,
  );
  const winnerTeamId = resolveKnockoutMatchWinner(template.matchNumber, fixtures);
  const score = formatKnockoutMatchScore(template.matchNumber, fixtures);
  const schedule = resolveBracketMatchSchedule(template.matchNumber, fixtures);

  return {
    matchNumber: template.matchNumber,
    round: template.round,
    home: highlightWinnerSide(home, winnerTeamId),
    away: highlightWinnerSide(away, winnerTeamId),
    score,
    winnerTeamId,
    kickoffUtc: schedule?.kickoffUtc ?? null,
    venueId: schedule?.venueId ?? null,
  };
}

function highlightWinnerSide(
  side: ResolvedBracketSide,
  winnerTeamId: TeamId | null,
): ResolvedBracketSide {
  if (!winnerTeamId || !side.teamId) {
    return side;
  }
  return {
    ...side,
    label:
      side.teamId === winnerTeamId ? `${side.label} ✓` : side.label,
  };
}

function formatKnockoutMatchScore(
  matchNumber: number,
  fixtures: readonly EffectiveFixture[],
): string | null {
  const fixture = fixtures.find(
    (entry) => entry.matchNumber === matchNumber && entry.stage !== "group",
  );
  if (!fixture || !isEffectiveFixtureCompleted(fixture)) {
    return null;
  }
  const score = getFixtureScore(fixture);
  if (!score) {
    return null;
  }
  return `${score.home}–${score.away}`;
}

function resolveKnockoutParticipantTeamId(
  fixture: EffectiveFixture,
  side: "home" | "away",
): TeamId {
  const overlayId =
    side === "home" ? fixture.overlayHomeTeamId : fixture.overlayAwayTeamId;
  if (overlayId && !isKnockoutPlaceholderTeam(overlayId)) {
    return overlayId;
  }
  const confirmed = getConfirmedKnockoutPairingByFixtureId(fixture.id);
  if (confirmed) {
    return side === "home" ? confirmed.homeTeamId : confirmed.awayTeamId;
  }
  const baseId = side === "home" ? fixture.homeTeamId : fixture.awayTeamId;
  return baseId;
}

function resolvePenaltyShootoutWinner(
  fixture: EffectiveFixture,
  homeId: TeamId,
  awayId: TeamId,
): TeamId | null {
  if (
    typeof fixture.penaltiesHome === "number" &&
    typeof fixture.penaltiesAway === "number" &&
    fixture.penaltiesHome !== fixture.penaltiesAway
  ) {
    return fixture.penaltiesHome > fixture.penaltiesAway ? homeId : awayId;
  }

  const confirmed = getConfirmedKnockoutResult(fixture.matchNumber);
  if (
    confirmed?.penaltiesHome !== undefined &&
    confirmed.penaltiesAway !== undefined &&
    confirmed.penaltiesHome !== confirmed.penaltiesAway
  ) {
    return confirmed.penaltiesHome > confirmed.penaltiesAway ? homeId : awayId;
  }

  return null;
}

/** Winner of a completed knockout fixture by official match number. */
export function resolveKnockoutMatchWinner(
  matchNumber: number,
  fixtures: readonly EffectiveFixture[],
): TeamId | null {
  const fixture = fixtures.find(
    (entry) => entry.matchNumber === matchNumber && entry.stage !== "group",
  );
  if (!fixture || !isEffectiveFixtureCompleted(fixture)) {
    return null;
  }

  const score = getFixtureScore(fixture);
  if (!score) {
    const confirmedWinner = getConfirmedKnockoutWinner(matchNumber);
    return confirmedWinner ?? null;
  }

  const homeId = resolveKnockoutParticipantTeamId(fixture, "home");
  const awayId = resolveKnockoutParticipantTeamId(fixture, "away");

  if (score.home > score.away) {
    return homeId;
  }
  if (score.away > score.home) {
    return awayId;
  }

  const penaltyWinner = resolvePenaltyShootoutWinner(fixture, homeId, awayId);
  if (penaltyWinner) {
    return penaltyWinner;
  }

  return getConfirmedKnockoutWinner(matchNumber) ?? null;
}

function resolveKnockoutFeedSlot(
  slot: KnockoutFeedSlot,
  fixtures: readonly EffectiveFixture[],
  resolvedWinners: ReadonlyMap<number, TeamId | null>,
): ResolvedBracketSide {
  const sourceMatch = slot.kind === "winner" ? slot.matchNumber : slot.matchNumber;
  const teamId = resolvedWinners.get(sourceMatch) ?? null;

  if (slot.kind === "loser") {
    const fixture = fixtures.find((entry) => entry.matchNumber === sourceMatch);
    if (!fixture || !teamId) {
      return {
        teamId: null,
        label: `Loser Match ${sourceMatch}`,
        pending: true,
      };
    }
    const loserId =
      teamId === resolveKnockoutParticipantTeamId(fixture, "home")
        ? resolveKnockoutParticipantTeamId(fixture, "away")
        : resolveKnockoutParticipantTeamId(fixture, "home");
    return {
      teamId: loserId,
      label: teamDisplayName(loserId),
      pending: false,
    };
  }

  return {
    teamId,
    label: teamId ? teamDisplayName(teamId) : `Winner Match ${sourceMatch}`,
    pending: !teamId,
  };
}

export function buildRoundOf32BracketView(
  fixtures: readonly EffectiveFixture[],
): readonly ResolvedBracketMatch[] {
  return FIFA_ROUND_OF_32_TEMPLATES.map((template) =>
    resolveBracketMatch(template, fixtures),
  );
}

export type BracketRoundView = {
  readonly round: string;
  readonly matches: readonly ResolvedBracketMatch[];
};

export function buildKnockoutBracketRounds(
  fixtures: readonly EffectiveFixture[],
): readonly BracketRoundView[] {
  const ro32 = buildRoundOf32BracketView(fixtures);
  const winnerByMatch = new Map<number, TeamId | null>();

  for (const match of ro32) {
    winnerByMatch.set(
      match.matchNumber,
      match.winnerTeamId ??
        resolveKnockoutMatchWinner(match.matchNumber, fixtures),
    );
  }

  const rounds: BracketRoundView[] = [
    { round: "Round of 32", matches: ro32 },
  ];

  for (const template of FIFA_KNOCKOUT_ROUND_TEMPLATES) {
    const matches = template.matches.map((entry) => {
      const home = resolveKnockoutFeedSlot(entry.home, fixtures, winnerByMatch);
      const away = resolveKnockoutFeedSlot(entry.away, fixtures, winnerByMatch);
      const winnerTeamId = resolveKnockoutMatchWinner(entry.matchNumber, fixtures);
      const score = formatKnockoutMatchScore(entry.matchNumber, fixtures);
      const schedule = resolveBracketMatchSchedule(entry.matchNumber, fixtures);

      if (winnerTeamId) {
        winnerByMatch.set(entry.matchNumber, winnerTeamId);
      }

      return {
        matchNumber: entry.matchNumber,
        round: template.round,
        home: highlightWinnerSide(home, winnerTeamId),
        away: highlightWinnerSide(away, winnerTeamId),
        score,
        winnerTeamId,
        kickoffUtc: schedule?.kickoffUtc ?? null,
        venueId: schedule?.venueId ?? null,
      };
    });

    rounds.push({ round: template.round, matches });
  }

  return rounds;
}

export type RankedThirdPlaceTeam = {
  readonly groupId: Wc26GroupId;
  readonly row: StandingRow;
};

/** Rank third-placed teams across completed groups (FIFA tie-break subset). */
export function computeRankedThirdPlaceTeams(
  fixtures: readonly EffectiveFixture[] = getEffectiveFixtures(),
): readonly RankedThirdPlaceTeam[] {
  const thirds: RankedThirdPlaceTeam[] = [];

  for (const group of WC26_GROUPS) {
    if (!isGroupComplete(group.id, fixtures)) {
      continue;
    }
    const standings = computeGroupStandings(group.id, fixtures);
    const third = standings.rows[2];
    if (third) {
      thirds.push({ groupId: group.id, row: third });
    }
  }

  return [...thirds].sort((left, right) => {
    if (right.row.points !== left.row.points) {
      return right.row.points - left.row.points;
    }
    if (right.row.goalDifference !== left.row.goalDifference) {
      return right.row.goalDifference - left.row.goalDifference;
    }
    if (right.row.goalsFor !== left.row.goalsFor) {
      return right.row.goalsFor - left.row.goalsFor;
    }
    return compareByName(left.row, right.row);
  });
}

export function areAllGroupStagesComplete(
  fixtures: readonly EffectiveFixture[] = getEffectiveFixtures(),
): boolean {
  return WC26_GROUPS.every((group) => isGroupComplete(group.id, fixtures));
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
