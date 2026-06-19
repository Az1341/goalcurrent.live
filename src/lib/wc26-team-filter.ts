import type { Team } from "@/types/team";
import type { Wc26GroupId } from "@/types/group";
import { groupLabel } from "@/lib/wc26-groups";

export type TeamGroupFilter = Wc26GroupId | "all";

/** Search runs across all groups; group chips apply only when the query is empty. */
export function getEffectiveGroupFilter(
  query: string,
  groupFilter: TeamGroupFilter,
): TeamGroupFilter {
  return query.trim() ? "all" : groupFilter;
}

export function filterTeams(
  teams: readonly Team[],
  query: string,
  groupFilter: TeamGroupFilter,
): Team[] {
  const normalizedQuery = query.trim().toLowerCase();
  const effectiveGroupFilter = getEffectiveGroupFilter(query, groupFilter);

  return teams.filter((team) => {
    if (
      effectiveGroupFilter !== "all" &&
      team.groupId !== effectiveGroupFilter
    ) {
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
  const effectiveGroupFilter = getEffectiveGroupFilter(query, groupFilter);
  const isFiltered =
    query.trim().length > 0 || effectiveGroupFilter !== "all";

  if (!isFiltered) {
    return `${totalCount} Teams`;
  }

  const noun = filteredCount === 1 ? "Team" : "Teams";
  return `${filteredCount} ${noun} Found`;
}

export function formatTeamSearchSummary(
  filteredCount: number,
  totalCount: number,
  query: string,
  groupFilter: TeamGroupFilter,
): string {
  const trimmedQuery = query.trim();
  const effectiveGroupFilter = getEffectiveGroupFilter(query, groupFilter);

  if (!trimmedQuery && effectiveGroupFilter === "all") {
    return `All ${totalCount} qualified nations at FIFA World Cup 2026. Search by team name, FIFA code, or group.`;
  }

  const parts = [`Showing ${filteredCount} of ${totalCount} qualified nations`];

  if (trimmedQuery) {
    parts.push(`matching “${trimmedQuery}” across all groups`);
  } else if (effectiveGroupFilter !== "all") {
    parts.push(`in Group ${effectiveGroupFilter.toUpperCase()}`);
  }

  return `${parts.join(" ")}.`;
}

export function formatTeamEmptyMessage(
  query: string,
  groupFilter: TeamGroupFilter,
): string {
  const trimmedQuery = query.trim();
  const effectiveGroupFilter = getEffectiveGroupFilter(query, groupFilter);

  if (trimmedQuery && effectiveGroupFilter !== "all") {
    return `No teams found for “${trimmedQuery}” in Group ${effectiveGroupFilter.toUpperCase()}. Clear the group filter or search all groups.`;
  }

  if (trimmedQuery) {
    return `No teams match “${trimmedQuery}”. Try a different team name or FIFA code.`;
  }

  if (effectiveGroupFilter !== "all") {
    return `No teams in Group ${effectiveGroupFilter.toUpperCase()}.`;
  }

  return "No teams match your current filters.";
}
