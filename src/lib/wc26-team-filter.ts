import type { Team } from "@/types/team";
import type { Wc26GroupId } from "@/types/group";
import { groupLabel } from "@/lib/wc26-groups";

export type TeamGroupFilter = Wc26GroupId | "all";

export function filterTeams(
  teams: readonly Team[],
  query: string,
  groupFilter: TeamGroupFilter,
): Team[] {
  const normalizedQuery = query.trim().toLowerCase();

  return teams.filter((team) => {
    if (groupFilter !== "all" && team.groupId !== groupFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return matchesTeamQuery(team, normalizedQuery);
  });
}

function matchesTeamQuery(team: Team, query: string): boolean {
  if (team.name.toLowerCase().includes(query)) {
    return true;
  }

  if (team.code.toLowerCase().includes(query)) {
    return true;
  }

  const label = groupLabel(team.groupId).toLowerCase();
  if (label.includes(query)) {
    return true;
  }

  if (`group ${team.groupId}`.includes(query)) {
    return true;
  }

  if (team.groupId === query) {
    return true;
  }

  return team.aliases.some((alias) => alias.toLowerCase().includes(query));
}

export function formatTeamResultCount(
  filteredCount: number,
  totalCount: number,
  query: string,
  groupFilter: TeamGroupFilter,
): string {
  const isFiltered =
    query.trim().length > 0 || groupFilter !== "all";

  if (!isFiltered) {
    return `${totalCount} Teams`;
  }

  const noun = filteredCount === 1 ? "Team" : "Teams";
  return `${filteredCount} ${noun} Found`;
}
