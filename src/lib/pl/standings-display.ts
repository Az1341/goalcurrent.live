import type { PlStandingRow } from "@/lib/pl/types";

/** True when standings are empty or every club is still on zero points. */
export function isPreseasonStandings(standings: PlStandingRow[]): boolean {
  if (!standings.length) return true;
  return standings.every((row) => row.played === 0 && row.points === 0);
}

/** Pre-season: alphabetical order with zeroed stats; in-season: API order. */
export function resolveDisplayStandings(
  standings: PlStandingRow[],
): PlStandingRow[] {
  if (!standings.length) return [];
  if (!isPreseasonStandings(standings)) return standings;

  return [...standings]
    .sort((a, b) => a.teamName.localeCompare(b.teamName))
    .map((row, index) => ({
      ...row,
      rank: index + 1,
      played: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    }));
}

export function buildZeroStandingsFromTeams(
  teams: Array<{ id: number; name: string; logo: string | null }>,
): PlStandingRow[] {
  return teams
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((team, index) => ({
      rank: index + 1,
      teamId: team.id,
      teamName: team.name,
      teamLogo: team.logo,
      played: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
      form: null,
      status: null,
      description: null,
    }));
}
