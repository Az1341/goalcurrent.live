type MatchweekFixture = {
  kickoffUtc: string;
  matchweek: number | null;
};

/** How long a matchweek stays the default after its median kickoff. */
const RECENT_WEEK_GRACE_MS = 48 * 60 * 60 * 1000;

/**
 * Picks the matchweek the fixtures page should open on: the most recently
 * played round for ~48h after its median kickoff, then the next round.
 * Median kickoff (not min/max) keeps postponed/rescheduled games from
 * pinning the default to an old round. Returns null when no fixture has a
 * matchweek.
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
      return { week, median: sorted[Math.floor(sorted.length / 2)] };
    })
    .sort((a, b) => a.median - b.median || a.week - b.week);

  const current = weeks.find(
    ({ median }) => median + RECENT_WEEK_GRACE_MS >= now,
  );
  return (current ?? weeks[weeks.length - 1]).week;
}
