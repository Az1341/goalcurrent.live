type MatchweekFixture = {
  kickoffUtc: string;
  matchweek: number | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;
/** How long a matchweek stays the default after its last kickoff. */
const RECENT_WEEK_GRACE_MS = DAY_MS;
/**
 * Kickoffs further than this from the round's median are rescheduled
 * outliers (postponed games) and don't extend the round.
 */
const ROUND_SPAN_MS = 4 * DAY_MS;

/**
 * Picks the matchweek the fixtures page should open on: the current round
 * until 24h after its last kickoff (so Monday-night games keep it selected),
 * then the next round. Kickoffs more than 4 days from the round's median are
 * ignored so a postponed game can't pin the default to an old round.
 * Returns null when no fixture has a matchweek.
 */
export function resolveCurrentMatchweek(
  fixtures: readonly MatchweekFixture[],
  now: number = Date.now(),
): number | null {
  const kickoffsByWeek = new Map<number, number[]>();
  for (const fixture of fixtures) {
    if (fixture.matchweek === null) continue;
    const kickoff = new Date(fixture.kickoffUtc).getTime();
    if (!Number.isFinite(kickoff)) continue;
    const list = kickoffsByWeek.get(fixture.matchweek);
    if (list) list.push(kickoff);
    else kickoffsByWeek.set(fixture.matchweek, [kickoff]);
  }
  if (kickoffsByWeek.size === 0) return null;

  const weeks = [...kickoffsByWeek.entries()]
    .map(([week, kickoffs]) => {
      const sorted = kickoffs.sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      const lastKickoff = sorted
        .filter((kickoff) => kickoff - median <= ROUND_SPAN_MS)
        .at(-1) as number;
      return { week, median, lastKickoff };
    })
    .sort((a, b) => a.median - b.median || a.week - b.week);

  const current = weeks.find(
    ({ lastKickoff }) => lastKickoff + RECENT_WEEK_GRACE_MS >= now,
  );
  return (current ?? weeks[weeks.length - 1]).week;
}
