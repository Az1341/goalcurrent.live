import type { FixtureStage } from "@/types/fixture";
import type { VenueId } from "@/types/venue";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";

export type KnockoutScheduleEntry = {
  readonly matchNumber: number;
  readonly stage: FixtureStage;
  readonly venueId: VenueId;
  readonly kickoffUtc: string;
};

export const WC26_KNOCKOUT_SCHEDULE: readonly KnockoutScheduleEntry[] = [
  { matchNumber: 73, stage: "round-of-32", venueId: "venue-la", kickoffUtc: "2026-06-28T19:00:00.000Z" },
  { matchNumber: 74, stage: "round-of-32", venueId: "venue-boston", kickoffUtc: "2026-06-29T20:30:00.000Z" },
  { matchNumber: 75, stage: "round-of-32", venueId: "venue-houston", kickoffUtc: "2026-06-29T17:00:00.000Z" },
  { matchNumber: 76, stage: "round-of-32", venueId: "venue-monterrey", kickoffUtc: "2026-06-30T01:00:00.000Z" },
  { matchNumber: 77, stage: "round-of-32", venueId: "venue-dallas", kickoffUtc: "2026-06-30T17:00:00.000Z" },
  { matchNumber: 78, stage: "round-of-32", venueId: "venue-nj", kickoffUtc: "2026-06-30T21:00:00.000Z" },
  { matchNumber: 79, stage: "round-of-32", venueId: "venue-mexico-city", kickoffUtc: "2026-07-01T01:00:00.000Z" },
  { matchNumber: 80, stage: "round-of-32", venueId: "venue-atlanta", kickoffUtc: "2026-07-01T16:00:00.000Z" },
  { matchNumber: 81, stage: "round-of-32", venueId: "venue-seattle", kickoffUtc: "2026-07-01T20:00:00.000Z" },
  { matchNumber: 82, stage: "round-of-32", venueId: "venue-sf", kickoffUtc: "2026-07-02T00:00:00.000Z" },
  { matchNumber: 83, stage: "round-of-32", venueId: "venue-la", kickoffUtc: "2026-07-02T19:00:00.000Z" },
  { matchNumber: 84, stage: "round-of-32", venueId: "venue-toronto", kickoffUtc: "2026-07-02T23:00:00.000Z" },
  { matchNumber: 85, stage: "round-of-32", venueId: "venue-vancouver", kickoffUtc: "2026-07-03T03:00:00.000Z" },
  { matchNumber: 86, stage: "round-of-32", venueId: "venue-dallas", kickoffUtc: "2026-07-03T18:00:00.000Z" },
  { matchNumber: 87, stage: "round-of-32", venueId: "venue-miami", kickoffUtc: "2026-07-03T22:00:00.000Z" },
  { matchNumber: 88, stage: "round-of-32", venueId: "venue-kc", kickoffUtc: "2026-07-04T01:30:00.000Z" },
  { matchNumber: 89, stage: "round-of-16", venueId: "venue-philadelphia", kickoffUtc: "2026-07-04T21:00:00.000Z" },
  { matchNumber: 90, stage: "round-of-16", venueId: "venue-houston", kickoffUtc: "2026-07-04T17:00:00.000Z" },
  { matchNumber: 91, stage: "round-of-16", venueId: "venue-nj", kickoffUtc: "2026-07-05T20:00:00.000Z" },
  { matchNumber: 92, stage: "round-of-16", venueId: "venue-mexico-city", kickoffUtc: "2026-07-06T00:00:00.000Z" },
  { matchNumber: 93, stage: "round-of-16", venueId: "venue-dallas", kickoffUtc: "2026-07-06T19:00:00.000Z" },
  { matchNumber: 94, stage: "round-of-16", venueId: "venue-seattle", kickoffUtc: "2026-07-07T00:00:00.000Z" },
  { matchNumber: 95, stage: "round-of-16", venueId: "venue-atlanta", kickoffUtc: "2026-07-07T16:00:00.000Z" },
  { matchNumber: 96, stage: "round-of-16", venueId: "venue-vancouver", kickoffUtc: "2026-07-07T20:00:00.000Z" },
  { matchNumber: 97, stage: "quarter-final", venueId: "venue-boston", kickoffUtc: "2026-07-09T20:00:00.000Z" },
  { matchNumber: 98, stage: "quarter-final", venueId: "venue-la", kickoffUtc: "2026-07-10T19:00:00.000Z" },
  { matchNumber: 99, stage: "quarter-final", venueId: "venue-miami", kickoffUtc: "2026-07-11T21:00:00.000Z" },
  { matchNumber: 100, stage: "quarter-final", venueId: "venue-kc", kickoffUtc: "2026-07-12T01:00:00.000Z" },
  { matchNumber: 101, stage: "semi-final", venueId: "venue-dallas", kickoffUtc: "2026-07-14T19:00:00.000Z" },
  { matchNumber: 102, stage: "semi-final", venueId: "venue-atlanta", kickoffUtc: "2026-07-15T19:00:00.000Z" },
  { matchNumber: 103, stage: "third-place", venueId: "venue-miami", kickoffUtc: "2026-07-18T21:00:00.000Z" },
  { matchNumber: 104, stage: "final", venueId: "venue-nj", kickoffUtc: "2026-07-19T19:00:00.000Z" },
] as const;

const scheduleByMatchNumber = new Map<number, KnockoutScheduleEntry>(
  WC26_KNOCKOUT_SCHEDULE.map((entry) => [entry.matchNumber, entry]),
);

export function getKnockoutScheduleByMatchNumber(
  matchNumber: number,
): KnockoutScheduleEntry | undefined {
  return scheduleByMatchNumber.get(matchNumber);
}

export function resolveBracketMatchSchedule(
  matchNumber: number,
  fixtures: readonly EffectiveFixture[],
): Pick<KnockoutScheduleEntry, "kickoffUtc" | "venueId"> | null {
  const fromFixture = fixtures.find(
    (fixture) =>
      fixture.matchNumber === matchNumber && fixture.stage !== "group",
  );
  if (fromFixture) {
    return { kickoffUtc: fromFixture.kickoffUtc, venueId: fromFixture.venueId };
  }
  const fromSchedule = getKnockoutScheduleByMatchNumber(matchNumber);
  if (!fromSchedule) return null;
  return { kickoffUtc: fromSchedule.kickoffUtc, venueId: fromSchedule.venueId };
}
