import type { Fixture } from "@/types/fixture";
import type { Wc26GroupId } from "@/types/group";
import { WC26_GROUP_IDS } from "@/types/group";
import { WC26_GROUPS } from "./groups";
import { getTeamById } from "./teams";
import { WC26_VENUES } from "./venues";

/** Tournament metadata — no scores or results. */
export const WC26_TOURNAMENT = {
  name: "FIFA World Cup 2026",
  hosts: ["USA", "Mexico", "Canada"] as const,
  startUtc: "2026-06-11T19:00:00.000Z",
  endUtc: "2026-07-19T23:00:00.000Z",
  teamCount: 48,
  groupCount: 12,
  venueCount: 16,
  /** Total matches in the expanded format — structure reference only. */
  fixtureCount: 104,
} as const;

/**
 * One scheduled group-stage fixture per group (matchday 1, slot 1 vs slot 2).
 * Placeholder kickoffs only — no scores.
 */
function buildGroupOpeners(): Fixture[] {
  return WC26_GROUP_IDS.map((groupId, index) => {
    const group = WC26_GROUPS.find((g) => g.id === groupId);
    const homeTeamId = group?.teamIds[0];
    const awayTeamId = group?.teamIds[1];
    const venue = WC26_VENUES[index % WC26_VENUES.length];

    if (!homeTeamId || !awayTeamId || !getTeamById(homeTeamId) || !getTeamById(awayTeamId)) {
      throw new Error(`Invalid placeholder fixture for group ${groupId}`);
    }

    const kickoff = new Date("2026-06-11T17:00:00.000Z");
    kickoff.setUTCDate(kickoff.getUTCDate() + index);

    return {
      id: `fixture-${groupId}-md1-1`,
      stage: "group",
      groupId,
      matchday: 1,
      homeTeamId,
      awayTeamId,
      venueId: venue.id,
      kickoffUtc: kickoff.toISOString(),
      status: "scheduled",
    } satisfies Fixture;
  });
}

/** Sample scheduled fixtures — structure reference, not the full 104-match slate. */
export const WC26_FIXTURES: readonly Fixture[] = buildGroupOpeners();

const fixtureById = new Map<string, Fixture>(
  WC26_FIXTURES.map((fixture) => [fixture.id, fixture]),
);

export function getFixtureById(id: string): Fixture | undefined {
  return fixtureById.get(id);
}

export function getFixturesByGroup(groupId: Wc26GroupId): readonly Fixture[] {
  return WC26_FIXTURES.filter((fixture) => fixture.groupId === groupId);
}

export function getFixturesByStage(stage: Fixture["stage"]): readonly Fixture[] {
  return WC26_FIXTURES.filter((fixture) => fixture.stage === stage);
}
