import type { Team, TeamId } from "@/types/team";
import {
  TEAMS_PER_GROUP,
  WC26_GROUP_IDS,
  type Wc26GroupId,
} from "@/types/group";

function makeTeamId(groupId: Wc26GroupId, slot: number): TeamId {
  return `team-${groupId}-${slot}`;
}

/** Placeholder nations — four slots per group, no results attached. */
export const WC26_TEAMS: readonly Team[] = WC26_GROUP_IDS.flatMap((groupId) =>
  Array.from({ length: TEAMS_PER_GROUP }, (_, index) => {
    const slot = index + 1;
    const letter = groupId.toUpperCase();

    return {
      id: makeTeamId(groupId, slot),
      name: `Group ${letter} Placeholder ${slot}`,
      code: `${letter}${slot}`,
      groupId,
    } satisfies Team;
  }),
);

const teamById = new Map<TeamId, Team>(
  WC26_TEAMS.map((team) => [team.id, team]),
);

export function getTeamById(id: TeamId): Team | undefined {
  return teamById.get(id);
}

export function getTeamsByGroup(groupId: Wc26GroupId): readonly Team[] {
  return WC26_TEAMS.filter((team) => team.groupId === groupId);
}

export { makeTeamId as buildTeamId };
