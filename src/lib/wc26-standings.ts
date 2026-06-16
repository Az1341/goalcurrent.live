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

function sortStandingRows(rows: readonly StandingRow[]): StandingRow[] {
  return [...rows].sort((left, right) => {
    if (right.points !== left.points) {
      return right.points - left.points;
    }
    if (right.goalDifference !== left.goalDifference) {
      return right.goalDifference - left.goalDifference;
    }
    if (right.goalsFor !== left.goalsFor) {
      return right.goalsFor - left.goalsFor;
    }

    const leftName = getTeamById(left.teamId)?.name ?? left.teamId;
    const rightName = getTeamById(right.teamId)?.name ?? right.teamId;
    return leftName.localeCompare(rightName);
  });
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

function processFixture(
  rows: Map<TeamId, MutableStandingRow>,
  fixture: EffectiveFixture,
): void {
  if (fixture.stage !== "group" || !fixture.groupId) {
    return;
  }

  if (!isCompletedMatchStatus(fixture.status)) {
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
