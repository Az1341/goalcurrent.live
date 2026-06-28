import { WC26_FIXTURES, getFixtureById } from "@/data/wc26";
import { isKnockoutPlaceholderTeam } from "@/data/wc26/knockout-fixtures";
import {
  findFixtureIdByKickoffUtc,
  findFixtureIdByTeamNames,
} from "@/lib/wc26-fixture-match";
import { resolveFixtureParticipant } from "@/lib/wc26-live";
import { resolveTeamId } from "@/lib/teamIdentity";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";

export type ApiFixtureLookupRow = {
  fixture: { id: number; date: string };
  teams: { home: { name: string }; away: { name: string } };
};

/** Map a local WC26 fixture id to an api-sports fixture id from API rows. */
export function resolveApiFixtureIdForLocal(
  localFixtureId: string,
  rows: readonly ApiFixtureLookupRow[],
): number | null {
  const fixture = getFixtureById(localFixtureId);
  if (!fixture) {
    return null;
  }

  for (const row of rows) {
    const byTeams = findFixtureIdByTeamNames(
      row.teams.home.name,
      row.teams.away.name,
    );
    if (byTeams === localFixtureId) {
      return row.fixture.id;
    }
  }

  for (const row of rows) {
    if (findFixtureIdByKickoffUtc(row.fixture.date) === localFixtureId) {
      return row.fixture.id;
    }
  }

  if (isKnockoutPlaceholderTeam(fixture.homeTeamId)) {
    const home = resolveFixtureParticipant(
      fixture as EffectiveFixture,
      "home",
      WC26_FIXTURES,
    );
    const away = resolveFixtureParticipant(
      fixture as EffectiveFixture,
      "away",
      WC26_FIXTURES,
    );

    for (const row of rows) {
      const apiHome = resolveTeamId(row.teams.home.name);
      const apiAway = resolveTeamId(row.teams.away.name);
      if (!apiHome || !apiAway || isKnockoutPlaceholderTeam(apiHome)) {
        continue;
      }
      if (
        (apiHome === home.teamId && apiAway === away.teamId) ||
        (apiHome === away.teamId && apiAway === home.teamId)
      ) {
        return row.fixture.id;
      }
    }
  }

  return null;
}
