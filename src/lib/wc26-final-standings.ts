import {
  WC26_FINAL_GROUPS,
  type Wc26QualificationStatus,
  type Wc26TeamStanding,
} from "@/data/wc26Standings";
import type { Wc26GroupId } from "@/types/group";
import type { GroupStandings, StandingRow } from "@/types/standing";
import type { TeamId } from "@/types/team";

function toStandingRow(team: Wc26TeamStanding): StandingRow {
  return {
    teamId: team.teamId,
    played: team.mp,
    won: team.w,
    drawn: team.d,
    lost: team.l,
    goalsFor: team.gf,
    goalsAgainst: team.ga,
    goalDifference: team.gd,
    points: team.pts,
  };
}

/** Final hardcoded group tables — group stage complete (28 June 2026). */
export const WC26_FINAL_GROUP_STANDINGS: readonly GroupStandings[] =
  WC26_FINAL_GROUPS.map((group) => ({
    groupId: group.groupId,
    rows: group.teams.map(toStandingRow),
  }));

const qualificationByGroup = new Map<
  Wc26GroupId,
  ReadonlyMap<TeamId, Wc26QualificationStatus>
>(
  WC26_FINAL_GROUPS.map((group) => [
    group.groupId,
    new Map(
      group.teams.map((team) => [team.teamId, team.qualified] as const),
    ),
  ]),
);

export function getWc26FinalQualificationMap(
  groupId: Wc26GroupId,
): ReadonlyMap<TeamId, Wc26QualificationStatus> {
  return qualificationByGroup.get(groupId) ?? new Map();
}

export function isWc26GroupStageComplete(): boolean {
  return true;
}
