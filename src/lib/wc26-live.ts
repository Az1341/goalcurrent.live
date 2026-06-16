import type { Fixture, FixtureStatus } from "@/types/fixture";
import type { TeamId } from "@/types/team";
import { getTeamById, getVenueById, groupLabel } from "@/data/wc26";
import {
  getFixtureScore,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import { formatKickoffUtc } from "@/lib/wc26-format";
import {
  formatLocalKickoff,
  formatVisitorTimezone,
} from "@/lib/wc26-fixtures-page";
import { isCompletedMatchStatus } from "@/lib/wc26-tournament-stats";
const LIVE_STATUSES = new Set([
  "live",
  "in play",
  "in-play",
  "1h",
  "2h",
  "ht",
  "halftime",
  "half-time",
  "et",
  "extra time",
  "penalties",
]);

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase();
}

/** True when a fixture status represents a match in progress. */
export function isLiveMatchStatus(status: FixtureStatus | string): boolean {
  if (isCompletedMatchStatus(status)) {
    return false;
  }
  return LIVE_STATUSES.has(normalizeStatus(String(status)));
}

function utcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export type LiveFixtureBuckets = {
  readonly live: readonly Fixture[];
  readonly today: readonly Fixture[];
  readonly upcoming: readonly Fixture[];
  readonly completed: readonly Fixture[];
};

function sortByKickoffAsc(a: Fixture, b: Fixture): number {
  return new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime();
}

function sortByKickoffDesc(a: Fixture, b: Fixture): number {
  return new Date(b.kickoffUtc).getTime() - new Date(a.kickoffUtc).getTime();
}

/** Partition effective fixtures into Live Match Centre sections. */
export function partitionFixturesForLiveCentre(
  fixtures: readonly Fixture[],
  now: Date = new Date(),
): LiveFixtureBuckets {
  const live: Fixture[] = [];
  const today: Fixture[] = [];
  const upcoming: Fixture[] = [];
  const completed: Fixture[] = [];

  const todayKey = utcDateKey(now);

  for (const fixture of fixtures) {
    const { status } = fixture;

    if (isLiveMatchStatus(status)) {
      live.push(fixture);
      continue;
    }

    if (isCompletedMatchStatus(status)) {
      completed.push(fixture);
      continue;
    }

    const kickoffKey = utcDateKey(new Date(fixture.kickoffUtc));
    if (kickoffKey === todayKey) {
      today.push(fixture);
    } else {
      upcoming.push(fixture);
    }
  }

  live.sort(sortByKickoffAsc);
  today.sort(sortByKickoffAsc);
  upcoming.sort(sortByKickoffAsc);
  completed.sort(sortByKickoffDesc);

  return { live, today, upcoming, completed };
}

/** Human-readable status label — no scores. */
export function formatFixtureStatusLabel(status: FixtureStatus | string): string {
  const normalized = normalizeStatus(String(status));

  switch (normalized) {
    case "scheduled":
      return "Scheduled";
    case "postponed":
      return "Postponed";
    case "cancelled":
      return "Cancelled";
    case "live":
      return "Live";
    case "ht":
    case "halftime":
    case "half-time":
      return "HT";
    case "1h":
      return "1H";
    case "2h":
      return "2H";
    case "ft":
    case "finished":
    case "full-time":
    case "completed":
      return "FT";
    case "aet":
      return "AET";
    case "pen":
      return "Pens";
    case "et":
    case "extra time":
      return "ET";
    case "penalties":
      return "Pens";
    default:
      return String(status).toUpperCase();
  }
}

export type HomepageMatchClass = "live" | "ft" | "upcoming";

export type HomepageMatchView = {
  readonly fixtureId: string;
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
  readonly homeName: string;
  readonly awayName: string;
  readonly matchClass: HomepageMatchClass;
  readonly statusLabel: string;
  readonly score: { home: number; away: number } | null;
  readonly kickoffLabel: string;
  readonly venueLabel: string;
  readonly roundLabel: string;
  readonly elapsed: number | null;
};

function classifyHomepageMatch(fixture: EffectiveFixture): HomepageMatchClass {
  if (isLiveMatchStatus(fixture.status)) {
    return "live";
  }
  if (isCompletedMatchStatus(fixture.status)) {
    return "ft";
  }
  return "upcoming";
}

function homepageStatusLabel(fixture: EffectiveFixture, matchClass: HomepageMatchClass): string {
  if (matchClass === "live") {
    const base = formatFixtureStatusLabel(fixture.status);
    if (fixture.elapsed != null) {
      return `${base} ${fixture.elapsed}'`;
    }
    return base;
  }
  if (matchClass === "ft") {
    return formatFixtureStatusLabel(fixture.status);
  }
  return formatLocalKickoff(fixture.kickoffUtc);
}

export function buildHomepageMatchView(fixture: EffectiveFixture): HomepageMatchView {
  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  const venue = getVenueById(fixture.venueId);
  const matchClass = classifyHomepageMatch(fixture);
  const roundLabel = fixture.groupId
    ? groupLabel(fixture.groupId)
    : fixture.stage.replace(/-/g, " ");

  return {
    fixtureId: fixture.id,
    homeTeamId: fixture.homeTeamId,
    awayTeamId: fixture.awayTeamId,
    homeName: home?.name ?? fixture.homeTeamId,
    awayName: away?.name ?? fixture.awayTeamId,
    matchClass,
    statusLabel: homepageStatusLabel(fixture, matchClass),
    score: getFixtureScore(fixture),
    kickoffLabel: `${formatKickoffUtc(fixture.kickoffUtc)} UTC · ${formatVisitorTimezone()}`,
    venueLabel: venue ? `${venue.name}, ${venue.city}` : "",
    roundLabel,
    elapsed: fixture.elapsed ?? null,
  };
}

/** Featured: first live, else first today, else next upcoming. */
export function selectFeaturedFixture(
  fixtures: readonly EffectiveFixture[],
): EffectiveFixture | undefined {
  const buckets = partitionFixturesForLiveCentre(fixtures);
  return buckets.live[0] ?? buckets.today[0] ?? buckets.upcoming[0];
}

/** Homepage live football rows — live, recent FT, then upcoming (excludes featured). */
export function selectHomepageFixtures(
  fixtures: readonly EffectiveFixture[],
  excludeFixtureId?: string,
  limit = 6,
): readonly HomepageMatchView[] {
  const buckets = partitionFixturesForLiveCentre(fixtures);
  const ordered = [
    ...buckets.live,
    ...buckets.completed,
    ...buckets.today,
    ...buckets.upcoming,
  ];

  const seen = new Set<string>();
  const views: HomepageMatchView[] = [];

  for (const fixture of ordered) {
    if (fixture.id === excludeFixtureId || seen.has(fixture.id)) {
      continue;
    }
    seen.add(fixture.id);
    views.push(buildHomepageMatchView(fixture));
    if (views.length >= limit) {
      break;
    }
  }

  return views;
}

/** Header ribbon ticker — live + recent results + next kickoffs. */
export function selectRibbonFixtures(
  fixtures: readonly EffectiveFixture[],
  limit = 8,
): readonly HomepageMatchView[] {
  const buckets = partitionFixturesForLiveCentre(fixtures);
  const ordered = [
    ...buckets.live,
    ...buckets.completed.slice(0, 4),
    ...buckets.today,
    ...buckets.upcoming,
  ];

  const seen = new Set<string>();
  const views: HomepageMatchView[] = [];

  for (const fixture of ordered) {
    if (seen.has(fixture.id)) {
      continue;
    }
    seen.add(fixture.id);
    views.push(buildHomepageMatchView(fixture));
    if (views.length >= limit) {
      break;
    }
  }

  return views;
}
