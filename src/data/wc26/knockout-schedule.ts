import type { FixtureStage } from "@/types/fixture";
import type { VenueId } from "@/types/venue";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { stadiumLocalTimeToUtcIso } from "@/lib/wc26/time-converter";

export type KnockoutScheduleEntry = {
  readonly matchNumber: number;
  readonly stage: FixtureStage;
  readonly venueId: VenueId;
  /** Official FIFA local stadium kick-off (wall clock at venue). */
  readonly localDate: string;
  readonly localHour: number;
  readonly localMinute: number;
  readonly kickoffUtc: string;
};

type RawKnockoutSlot = {
  readonly matchNumber: number;
  readonly stage: FixtureStage;
  readonly venueId: VenueId;
  readonly localDate: string;
  readonly localHour: number;
  readonly localMinute: number;
};

/** Official FIFA knockout slots — local stadium times converted to UTC. */
const KNOCKOUT_RAW: readonly RawKnockoutSlot[] = [
  // Round of 32 — 28 June to 3 July 2026
  { matchNumber: 73, stage: "round-of-32", venueId: "venue-la", localDate: "2026-06-28", localHour: 15, localMinute: 0 },
  { matchNumber: 74, stage: "round-of-32", venueId: "venue-boston", localDate: "2026-06-29", localHour: 16, localMinute: 30 },
  { matchNumber: 75, stage: "round-of-32", venueId: "venue-monterrey", localDate: "2026-06-29", localHour: 21, localMinute: 0 },
  { matchNumber: 76, stage: "round-of-32", venueId: "venue-houston", localDate: "2026-06-29", localHour: 13, localMinute: 0 },
  { matchNumber: 77, stage: "round-of-32", venueId: "venue-nj", localDate: "2026-06-30", localHour: 17, localMinute: 0 },
  { matchNumber: 78, stage: "round-of-32", venueId: "venue-dallas", localDate: "2026-06-30", localHour: 13, localMinute: 0 },
  { matchNumber: 79, stage: "round-of-32", venueId: "venue-mexico-city", localDate: "2026-06-30", localHour: 21, localMinute: 0 },
  { matchNumber: 80, stage: "round-of-32", venueId: "venue-atlanta", localDate: "2026-07-01", localHour: 12, localMinute: 0 },
  { matchNumber: 81, stage: "round-of-32", venueId: "venue-sf", localDate: "2026-07-01", localHour: 20, localMinute: 0 },
  { matchNumber: 82, stage: "round-of-32", venueId: "venue-seattle", localDate: "2026-07-01", localHour: 16, localMinute: 0 },
  { matchNumber: 83, stage: "round-of-32", venueId: "venue-toronto", localDate: "2026-07-02", localHour: 19, localMinute: 0 },
  { matchNumber: 84, stage: "round-of-32", venueId: "venue-la", localDate: "2026-07-02", localHour: 15, localMinute: 0 },
  { matchNumber: 85, stage: "round-of-32", venueId: "venue-vancouver", localDate: "2026-07-02", localHour: 23, localMinute: 0 },
  { matchNumber: 86, stage: "round-of-32", venueId: "venue-miami", localDate: "2026-07-03", localHour: 18, localMinute: 0 },
  { matchNumber: 87, stage: "round-of-32", venueId: "venue-kc", localDate: "2026-07-03", localHour: 21, localMinute: 30 },
  { matchNumber: 88, stage: "round-of-32", venueId: "venue-dallas", localDate: "2026-07-03", localHour: 14, localMinute: 0 },
  // Round of 16 — 4 to 7 July 2026
  { matchNumber: 89, stage: "round-of-16", venueId: "venue-philadelphia", localDate: "2026-07-04", localHour: 17, localMinute: 0 },
  { matchNumber: 90, stage: "round-of-16", venueId: "venue-houston", localDate: "2026-07-04", localHour: 12, localMinute: 0 },
  { matchNumber: 91, stage: "round-of-16", venueId: "venue-nj", localDate: "2026-07-05", localHour: 16, localMinute: 0 },
  { matchNumber: 92, stage: "round-of-16", venueId: "venue-mexico-city", localDate: "2026-07-05", localHour: 18, localMinute: 0 },
  { matchNumber: 93, stage: "round-of-16", venueId: "venue-dallas", localDate: "2026-07-06", localHour: 14, localMinute: 0 },
  { matchNumber: 94, stage: "round-of-16", venueId: "venue-seattle", localDate: "2026-07-06", localHour: 14, localMinute: 0 },
  { matchNumber: 95, stage: "round-of-16", venueId: "venue-atlanta", localDate: "2026-07-07", localHour: 12, localMinute: 0 },
  { matchNumber: 96, stage: "round-of-16", venueId: "venue-vancouver", localDate: "2026-07-07", localHour: 13, localMinute: 0 },
  // Quarter-finals — 9 to 11 July 2026
  { matchNumber: 97, stage: "quarter-final", venueId: "venue-boston", localDate: "2026-07-09", localHour: 16, localMinute: 0 },
  { matchNumber: 98, stage: "quarter-final", venueId: "venue-la", localDate: "2026-07-10", localHour: 12, localMinute: 0 },
  { matchNumber: 99, stage: "quarter-final", venueId: "venue-miami", localDate: "2026-07-11", localHour: 17, localMinute: 0 },
  { matchNumber: 100, stage: "quarter-final", venueId: "venue-kc", localDate: "2026-07-11", localHour: 21, localMinute: 0 },
  // Semi-finals — 14 to 15 July 2026
  { matchNumber: 101, stage: "semi-final", venueId: "venue-dallas", localDate: "2026-07-14", localHour: 14, localMinute: 0 },
  { matchNumber: 102, stage: "semi-final", venueId: "venue-atlanta", localDate: "2026-07-15", localHour: 15, localMinute: 0 },
  // Bronze + Final — 18 to 19 July 2026
  { matchNumber: 103, stage: "third-place", venueId: "venue-miami", localDate: "2026-07-18", localHour: 17, localMinute: 0 },
  { matchNumber: 104, stage: "final", venueId: "venue-nj", localDate: "2026-07-19", localHour: 15, localMinute: 0 },
] as const;

function buildKnockoutScheduleEntry(
  slot: RawKnockoutSlot,
): KnockoutScheduleEntry {
  return {
    ...slot,
    kickoffUtc: stadiumLocalTimeToUtcIso(
      slot.venueId,
      slot.localDate,
      slot.localHour,
      slot.localMinute,
    ),
  };
}

export const WC26_KNOCKOUT_SCHEDULE: readonly KnockoutScheduleEntry[] =
  KNOCKOUT_RAW.map(buildKnockoutScheduleEntry);

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
