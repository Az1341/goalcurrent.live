import type { Fixture } from "@/types/fixture";
import type { TeamId } from "@/types/team";
import { WC26_KNOCKOUT_SCHEDULE } from "./knockout-schedule";

/** Placeholder team id for knockout slots before participants are confirmed. */
export const WC26_KNOCKOUT_PLACEHOLDER_TEAM: TeamId = "tbd";

function buildKnockoutFixture(
  matchNumber: number,
  stage: Fixture["stage"],
  venueId: Fixture["venueId"],
  kickoffUtc: string,
): Fixture {
  return {
    id: `fixture-${String(matchNumber).padStart(3, "0")}`,
    matchNumber,
    stage,
    homeTeamId: WC26_KNOCKOUT_PLACEHOLDER_TEAM,
    awayTeamId: WC26_KNOCKOUT_PLACEHOLDER_TEAM,
    venueId,
    kickoffUtc,
    status: "scheduled",
  };
}

/** Official knockout fixtures (matches 73–104) — schedule metadata, TBD participants. */
export const WC26_KNOCKOUT_FIXTURES: readonly Fixture[] =
  WC26_KNOCKOUT_SCHEDULE.map((entry) =>
    buildKnockoutFixture(
      entry.matchNumber,
      entry.stage,
      entry.venueId,
      entry.kickoffUtc,
    ),
  );

export function getKnockoutFixtureByMatchNumber(
  matchNumber: number,
): Fixture | undefined {
  return WC26_KNOCKOUT_FIXTURES.find(
    (fixture) => fixture.matchNumber === matchNumber,
  );
}

export function isKnockoutPlaceholderTeam(teamId: TeamId): boolean {
  return teamId === WC26_KNOCKOUT_PLACEHOLDER_TEAM;
}
