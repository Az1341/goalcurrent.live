import type { Fixture, FixtureStatus } from "@/types/fixture";
import type { TeamId } from "@/types/team";
import { getTeamById, getVenueById, groupLabel } from "@/data/wc26";
import {
  getFixtureScore,
  isEffectiveFixtureCompleted,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import {
  formatVisitorKickoff,
  formatVisitorKickoffTime,
} from "@/lib/wc26-format";
import { localDateKey } from "@/lib/wc26-fixtures-page";
import { findLiveSimultaneousFinalRoundGroup } from "@/lib/wc26-final-matchday";
import { isCompletedMatchStatus } from "@/lib/wc26-tournament-stats";
import type { Wc26GroupId } from "@/types/group";
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

export type LiveFixtureBuckets = {
  readonly live: readonly EffectiveFixture[];
  readonly today: readonly EffectiveFixture[];
  readonly upcoming: readonly EffectiveFixture[];
  readonly completed: readonly EffectiveFixture[];
};

function sortByKickoffAsc(a: Fixture, b: Fixture): number {
  return new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime();
}

function sortByKickoffDesc(a: Fixture, b: Fixture): number {
  return new Date(b.kickoffUtc).getTime() - new Date(a.kickoffUtc).getTime();
}

/** Partition effective fixtures into Live Match Centre sections. */
export function partitionFixturesForLiveCentre(
  fixtures: readonly EffectiveFixture[],
  now: Date = new Date(),
): LiveFixtureBuckets {
  const live: EffectiveFixture[] = [];
  const today: EffectiveFixture[] = [];
  const upcoming: EffectiveFixture[] = [];
  const completed: EffectiveFixture[] = [];

  const todayKey = localDateKey(now.toISOString());

  for (const fixture of fixtures) {
    const { status } = fixture;

    if (isLiveMatchStatus(status)) {
      live.push(fixture);
      continue;
    }

    if (isEffectiveFixtureCompleted(fixture, now)) {
      completed.push(fixture);
      continue;
    }

    const kickoffAt = new Date(fixture.kickoffUtc);
    const kickoffKey = localDateKey(fixture.kickoffUtc);
    if (kickoffKey === todayKey) {
      today.push(fixture);
    } else if (kickoffAt.getTime() > now.getTime()) {
      upcoming.push(fixture);
    }
  }

  live.sort(sortByKickoffAsc);
  today.sort(sortByKickoffAsc);
  upcoming.sort(sortByKickoffAsc);
  completed.sort(sortByKickoffDesc);

  return { live, today, upcoming, completed };
}

/** Human-readable period label — e.g. "2nd Half", "Half Time", "Full Time". */
export function formatPeriodLabel(status: FixtureStatus | string): string {
  const normalized = normalizeStatus(String(status));
  switch (normalized) {
    case "1h": return "1st Half";
    case "2h": return "2nd Half";
    case "ht": case "halftime": case "half-time": return "Half Time";
    case "et": case "extra time": return "Extra Time";
    case "penalties": return "Penalties";
    case "ft": case "finished": case "full-time": case "completed": return "Full Time";
    case "aet": return "After Extra Time";
    case "pen": return "Penalties";
    case "live": return "Live";
    case "scheduled": return "Scheduled";
    default: return String(status).toUpperCase();
  }
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
      return "Half Time";
    case "1h":
      return "1st Half";
    case "2h":
      return "2nd Half";
    case "ft":
    case "finished":
    case "full-time":
    case "completed":
      return "Full Time";
    case "aet":
      return "AET";
    case "pen":
      return "Penalties";
    case "et":
    case "extra time":
      return "Extra Time";
    case "penalties":
      return "Penalties";
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
  if (isEffectiveFixtureCompleted(fixture)) {
    return "ft";
  }
  return "upcoming";
}

function homepageStatusLabel(fixture: EffectiveFixture, matchClass: HomepageMatchClass): string {
  if (matchClass === "live") {
    // Return human label only — elapsed shown separately in each UI component
    return formatFixtureStatusLabel(fixture.status);
  }
  if (matchClass === "ft") {
    return formatFixtureStatusLabel(fixture.status);
  }
  return formatVisitorKickoffTime(fixture.kickoffUtc);
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
    kickoffLabel: formatVisitorKickoff(fixture.kickoffUtc),
    venueLabel: venue ? `${venue.name}, ${venue.city}` : "",
    roundLabel,
    elapsed: fixture.elapsed ?? null,
  };
}

export type FeaturedFixtureSelection = {
  readonly mode: "single" | "simultaneous-final";
  readonly fixtures: readonly EffectiveFixture[];
  readonly groupId?: Wc26GroupId;
};

/** Featured: simultaneous final-round live deciders, else first live/today/upcoming. */
export function selectFeaturedFixtures(
  fixtures: readonly EffectiveFixture[],
): FeaturedFixtureSelection {
  const simultaneous = findLiveSimultaneousFinalRoundGroup(fixtures);
  if (simultaneous) {
    return {
      mode: "simultaneous-final",
      fixtures: simultaneous.fixtures,
      groupId: simultaneous.groupId,
    };
  }

  const single = selectFeaturedFixture(fixtures);
  return {
    mode: "single",
    fixtures: single ? [single] : [],
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
  excludeFixtureIds: readonly string[] = [],
  limit = 6,
): readonly HomepageMatchView[] {
  const exclude = new Set(excludeFixtureIds);
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
    if (exclude.has(fixture.id) || seen.has(fixture.id)) {
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

/** Homepage upcoming rows — today + future kickoffs (excludes featured). */
export function selectUpcomingHomepageFixtures(
  fixtures: readonly EffectiveFixture[],
  excludeFixtureIds: readonly string[] = [],
  limit = 6,
): readonly HomepageMatchView[] {
  const exclude = new Set(excludeFixtureIds);
  const buckets = partitionFixturesForLiveCentre(fixtures);
  const ordered = [...buckets.today, ...buckets.upcoming];
  const views: HomepageMatchView[] = [];

  for (const fixture of ordered) {
    if (exclude.has(fixture.id)) {
      continue;
    }
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
