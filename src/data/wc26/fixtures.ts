import type { Fixture } from "@/types/fixture";
import type { Wc26GroupId } from "@/types/group";
import type { TeamId } from "@/types/team";
import type { VenueId } from "@/types/venue";

/** Tournament metadata — no scores or results. */
export const WC26_TOURNAMENT = {
  name: "FIFA World Cup 2026",
  hosts: ["USA", "Mexico", "Canada"] as const,
  startUtc: "2026-06-11T19:00:00.000Z",
  endUtc: "2026-07-19T23:00:00.000Z",
  teamCount: 48,
  groupCount: 12,
  venueCount: 16,
  /** Group-stage fixtures loaded in this dataset. */
  groupStageFixtureCount: 72,
  /** Total matches in the expanded format (knockout not loaded yet). */
  fixtureCount: 104,
} as const;

type RawGroupFixture = readonly [
  matchNumber: number,
  groupId: Wc26GroupId,
  matchday: number,
  homeTeamId: TeamId,
  awayTeamId: TeamId,
  venueId: VenueId,
  kickoffUtc: string,
];

/**
 * Official group-stage fixtures — FIFA match schedule (UTC kickoffs).
 * Tuple: [matchNumber, groupId, matchday, home, away, venueId, kickoffUtc]
 */
const GROUP_STAGE_RAW: readonly RawGroupFixture[] = [
  [1, "a", 1, "mex", "rsa", "venue-mexico-city", "2026-06-11T19:00:00.000Z"],
  [2, "a", 1, "kor", "cze", "venue-guadalajara", "2026-06-12T02:00:00.000Z"],
  [3, "b", 1, "can", "bih", "venue-toronto", "2026-06-12T19:00:00.000Z"],
  [4, "d", 1, "usa", "par", "venue-la", "2026-06-13T01:00:00.000Z"],
  [5, "b", 1, "qat", "sui", "venue-sf", "2026-06-13T19:00:00.000Z"],
  [6, "c", 1, "bra", "mar", "venue-nj", "2026-06-13T22:00:00.000Z"],
  [7, "c", 1, "hai", "sco", "venue-boston", "2026-06-14T01:00:00.000Z"],
  [8, "d", 1, "aus", "tur", "venue-vancouver", "2026-06-14T04:00:00.000Z"],
  [9, "e", 2, "ger", "cuw", "venue-houston", "2026-06-14T17:00:00.000Z"],
  [10, "f", 2, "ned", "jpn", "venue-dallas", "2026-06-14T20:00:00.000Z"],
  [11, "e", 2, "civ", "ecu", "venue-philadelphia", "2026-06-14T23:00:00.000Z"],
  [12, "f", 2, "swe", "tun", "venue-monterrey", "2026-06-15T02:00:00.000Z"],
  [13, "h", 2, "esp", "cpv", "venue-atlanta", "2026-06-15T16:00:00.000Z"],
  [14, "g", 2, "bel", "egy", "venue-seattle", "2026-06-15T19:00:00.000Z"],
  [15, "g", 2, "irn", "nzl", "venue-la", "2026-06-16T01:00:00.000Z"],
  [16, "h", 2, "ksa", "uru", "venue-miami", "2026-06-15T22:00:00.000Z"],
  [17, "i", 2, "fra", "sen", "venue-nj", "2026-06-16T19:00:00.000Z"],
  [18, "i", 2, "irq", "nor", "venue-boston", "2026-06-16T22:00:00.000Z"],
  [19, "j", 2, "arg", "alg", "venue-kc", "2026-06-17T01:00:00.000Z"],
  [20, "j", 2, "aut", "jor", "venue-sf", "2026-06-17T04:00:00.000Z"],
  [21, "k", 2, "por", "cod", "venue-houston", "2026-06-17T17:00:00.000Z"],
  [22, "l", 2, "eng", "cro", "venue-dallas", "2026-06-17T20:00:00.000Z"],
  [23, "l", 2, "gha", "pan", "venue-toronto", "2026-06-17T23:00:00.000Z"],
  [24, "k", 2, "uzb", "col", "venue-mexico-city", "2026-06-18T02:00:00.000Z"],
  [25, "a", 2, "cze", "rsa", "venue-atlanta", "2026-06-18T16:00:00.000Z"],
  [26, "b", 2, "sui", "bih", "venue-la", "2026-06-18T19:00:00.000Z"],
  [27, "b", 2, "can", "qat", "venue-vancouver", "2026-06-18T22:00:00.000Z"],
  [28, "a", 2, "mex", "kor", "venue-guadalajara", "2026-06-19T01:00:00.000Z"],
  [29, "d", 2, "usa", "aus", "venue-seattle", "2026-06-19T19:00:00.000Z"],
  [30, "c", 2, "sco", "mar", "venue-boston", "2026-06-19T22:00:00.000Z"],
  [31, "c", 2, "bra", "hai", "venue-philadelphia", "2026-06-20T00:30:00.000Z"],
  [32, "d", 2, "tur", "par", "venue-sf", "2026-06-20T03:00:00.000Z"],
  [33, "f", 2, "ned", "swe", "venue-houston", "2026-06-20T17:00:00.000Z"],
  [34, "e", 2, "ger", "civ", "venue-toronto", "2026-06-20T20:00:00.000Z"],
  [35, "e", 2, "ecu", "cuw", "venue-kc", "2026-06-21T00:00:00.000Z"],
  [36, "f", 2, "tun", "jpn", "venue-monterrey", "2026-06-21T04:00:00.000Z"],
  [37, "h", 3, "esp", "ksa", "venue-atlanta", "2026-06-21T16:00:00.000Z"],
  [38, "g", 3, "bel", "irn", "venue-la", "2026-06-21T19:00:00.000Z"],
  [39, "h", 3, "uru", "cpv", "venue-miami", "2026-06-21T22:00:00.000Z"],
  [40, "g", 3, "nzl", "egy", "venue-vancouver", "2026-06-22T01:00:00.000Z"],
  [41, "j", 3, "arg", "aut", "venue-dallas", "2026-06-22T17:00:00.000Z"],
  [42, "i", 3, "fra", "irq", "venue-philadelphia", "2026-06-22T21:00:00.000Z"],
  [43, "i", 3, "nor", "sen", "venue-nj", "2026-06-23T00:00:00.000Z"],
  [44, "j", 3, "jor", "alg", "venue-sf", "2026-06-23T03:00:00.000Z"],
  [45, "k", 3, "por", "uzb", "venue-houston", "2026-06-23T17:00:00.000Z"],
  [46, "l", 3, "eng", "gha", "venue-boston", "2026-06-23T20:00:00.000Z"],
  [47, "l", 3, "pan", "cro", "venue-toronto", "2026-06-23T23:00:00.000Z"],
  [48, "k", 3, "col", "cod", "venue-guadalajara", "2026-06-24T02:00:00.000Z"],
  [49, "b", 3, "sui", "can", "venue-vancouver", "2026-06-24T19:00:00.000Z"],
  [50, "b", 3, "bih", "qat", "venue-seattle", "2026-06-24T19:00:00.000Z"],
  [51, "c", 3, "sco", "bra", "venue-miami", "2026-06-24T22:00:00.000Z"],
  [52, "c", 3, "mar", "hai", "venue-atlanta", "2026-06-24T22:00:00.000Z"],
  [53, "a", 3, "cze", "mex", "venue-mexico-city", "2026-06-25T01:00:00.000Z"],
  [54, "a", 3, "rsa", "kor", "venue-monterrey", "2026-06-25T01:00:00.000Z"],
  [55, "e", 3, "cuw", "civ", "venue-philadelphia", "2026-06-25T20:00:00.000Z"],
  [56, "e", 3, "ecu", "ger", "venue-nj", "2026-06-25T20:00:00.000Z"],
  [57, "f", 3, "jpn", "swe", "venue-dallas", "2026-06-25T23:00:00.000Z"],
  [58, "f", 3, "tun", "ned", "venue-kc", "2026-06-25T23:00:00.000Z"],
  [59, "d", 3, "tur", "usa", "venue-la", "2026-06-26T02:00:00.000Z"],
  [60, "d", 3, "par", "aus", "venue-sf", "2026-06-26T02:00:00.000Z"],
  [61, "i", 3, "nor", "fra", "venue-boston", "2026-06-26T19:00:00.000Z"],
  [62, "i", 3, "sen", "irq", "venue-toronto", "2026-06-26T19:00:00.000Z"],
  [63, "h", 3, "cpv", "ksa", "venue-houston", "2026-06-27T00:00:00.000Z"],
  [64, "h", 3, "uru", "esp", "venue-guadalajara", "2026-06-27T00:00:00.000Z"],
  [65, "g", 3, "egy", "irn", "venue-seattle", "2026-06-27T03:00:00.000Z"],
  [66, "g", 3, "nzl", "bel", "venue-vancouver", "2026-06-27T03:00:00.000Z"],
  [67, "l", 3, "pan", "eng", "venue-nj", "2026-06-27T21:00:00.000Z"],
  [68, "l", 3, "cro", "gha", "venue-philadelphia", "2026-06-27T21:00:00.000Z"],
  [69, "k", 3, "col", "por", "venue-miami", "2026-06-27T23:30:00.000Z"],
  [70, "k", 3, "cod", "uzb", "venue-atlanta", "2026-06-27T23:30:00.000Z"],
  [71, "j", 3, "alg", "aut", "venue-kc", "2026-06-28T02:00:00.000Z"],
  [72, "j", 3, "jor", "arg", "venue-dallas", "2026-06-28T02:00:00.000Z"],
];

function buildFixture(
  matchNumber: number,
  groupId: Wc26GroupId,
  matchday: number,
  homeTeamId: TeamId,
  awayTeamId: TeamId,
  venueId: VenueId,
  kickoffUtc: string,
): Fixture {
  return {
    id: `fixture-${String(matchNumber).padStart(3, "0")}`,
    matchNumber,
    stage: "group",
    groupId,
    matchday,
    homeTeamId,
    awayTeamId,
    venueId,
    kickoffUtc,
    status: "scheduled",
  };
}

/** All 72 official group-stage fixtures — no scores. */
export const WC26_FIXTURES: readonly Fixture[] = GROUP_STAGE_RAW.map(
  ([matchNumber, groupId, matchday, homeTeamId, awayTeamId, venueId, kickoffUtc]) =>
    buildFixture(
      matchNumber,
      groupId,
      matchday,
      homeTeamId,
      awayTeamId,
      venueId,
      kickoffUtc,
    ),
);

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

/** Group-stage fixtures loaded in this phase. */
export const WC26_GROUP_STAGE_FIXTURE_COUNT = GROUP_STAGE_RAW.length;
