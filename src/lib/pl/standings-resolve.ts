import { fetchPlTeams } from "@/lib/pl/endpoints";
import { buildZeroStandingsFromTeams } from "@/lib/pl/standings-display";
import type {
  PlFixtureRow,
  PlStandingsApiResponse,
} from "@/lib/pl/types";

function extractTeamsFromFixtures(
  fixtures: PlFixtureRow[],
): Array<{ id: number; name: string; logo: string | null }> {
  const teams = new Map<
    number,
    { id: number; name: string; logo: string | null }
  >();

  for (const fixture of fixtures) {
    teams.set(fixture.homeTeamId, {
      id: fixture.homeTeamId,
      name: fixture.homeTeamName,
      logo: fixture.homeTeamLogo,
    });
    teams.set(fixture.awayTeamId, {
      id: fixture.awayTeamId,
      name: fixture.awayTeamName,
      logo: fixture.awayTeamLogo,
    });
  }

  return [...teams.values()];
}

/** When official standings are missing, build a zero pre-season table from clubs. */
export async function resolveStandingsWithClubFallback(
  body: PlStandingsApiResponse,
  fixtures: PlFixtureRow[] = [],
): Promise<PlStandingsApiResponse> {
  if (body.standings.length) {
    return body;
  }

  const teamsBody = await fetchPlTeams();
  if (teamsBody.teams.length) {
    return {
      ...body,
      standings: buildZeroStandingsFromTeams(
        teamsBody.teams.map((team) => ({
          id: team.teamId,
          name: team.name,
          logo: team.logo,
        })),
      ),
      source: "api-football",
      error: undefined,
    };
  }

  const fromFixtures = extractTeamsFromFixtures(fixtures);
  if (fromFixtures.length) {
    return {
      ...body,
      standings: buildZeroStandingsFromTeams(fromFixtures),
      source: "api-football",
      error: undefined,
    };
  }

  return body;
}
