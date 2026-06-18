import type { Fixture, FixtureStage } from "@/types/fixture";
import type { Wc26GroupId } from "@/types/group";
import { WC26_GROUP_IDS } from "@/types/group";
import { getTeamById, getVenueById } from "@/data/wc26";
import {
  formatVisitorKickoffTime,
  formatVisitorTimezone as formatVisitorTimezoneFromFormat,
} from "@/lib/wc26-format";
import {
  formatFixtureStatusLabel,
  isLiveMatchStatus,
} from "@/lib/wc26-live";
import { isEffectiveFixtureCompleted } from "@/lib/wc26-fixture-overlay";
import {
  getUkBroadcaster,
  ukBroadcasterChannels,
} from "@/data/wc26/uk-broadcasters";

export type FixtureStatusFilter = "" | "upcoming" | "live" | "ft";

export type FixturePageFilters = {
  search: string;
  groupId: "" | Wc26GroupId;
  stage: "" | FixtureStage;
  status: FixtureStatusFilter;
  dateKey: string;
};

export type CalendarDay = {
  dateKey: string;
  count: number;
  dow: string;
  dayNum: number;
  month: string;
};

export const WC26_TV_REGIONS = [
  { code: "GB", label: "United Kingdom — BBC / ITV" },
  { code: "US", label: "United States — FOX / Telemundo" },
  { code: "CA", label: "Canada — CTV / TSN / RDS" },
  { code: "AU", label: "Australia — SBS" },
  { code: "DE", label: "Germany — ARD / ZDF" },
  { code: "FR", label: "France — TF1 / M6 / beIN" },
] as const;

export type Wc26TvRegionCode = (typeof WC26_TV_REGIONS)[number]["code"];

const TV_BY_REGION: Record<Wc26TvRegionCode, readonly string[]> = {
  GB: ["BBC", "ITV"],
  US: ["FOX", "Telemundo"],
  CA: ["CTV", "TSN", "RDS"],
  AU: ["SBS"],
  DE: ["ARD", "ZDF"],
  FR: ["TF1", "M6", "beIN"],
};

export function getTvChannels(region: Wc26TvRegionCode): readonly string[] {
  return TV_BY_REGION[region] ?? TV_BY_REGION.GB;
}

export function isWc26TvRegionCode(value: string): value is Wc26TvRegionCode {
  return (WC26_TV_REGIONS as readonly { code: string }[]).some(
    (entry) => entry.code === value,
  );
}

export function formatTvBroadcastLine(region: Wc26TvRegionCode): string {
  return getTvChannels(region).join(" / ");
}

export function getTvBroadcastDisplay(region: Wc26TvRegionCode | null): {
  available: boolean;
  line: string;
  regionalLine: string;
} {
  if (!region || !isWc26TvRegionCode(region)) {
    return {
      available: false,
      line: "Broadcast information unavailable for your region",
      regionalLine: "Broadcast information unavailable for your region",
    };
  }
  const channels = getTvChannels(region);
  if (channels.length === 0) {
    return {
      available: false,
      line: "Broadcast information unavailable for your region",
      regionalLine: "Broadcast information unavailable for your region",
    };
  }
  const line = channels.join(" / ");
  return {
    available: true,
    line,
    regionalLine: `Regional coverage: ${line}`,
  };
}

export type MatchTvBroadcastDisplay = {
  available: boolean;
  line: string;
  regionalLine: string;
  label: "Watch on:" | "Regional coverage:";
  channels: readonly string[];
  fixtureSpecific: boolean;
};

export function getMatchTvChannels(
  region: Wc26TvRegionCode,
  matchNumber?: number,
): readonly string[] {
  if (region === "GB" && matchNumber !== undefined) {
    const uk = getUkBroadcaster(matchNumber);
    if (uk) {
      return ukBroadcasterChannels(uk);
    }
  }
  return getTvChannels(region);
}

export function getMatchTvBroadcastDisplay(
  region: Wc26TvRegionCode | null,
  matchNumber?: number,
): MatchTvBroadcastDisplay {
  const unavailable: MatchTvBroadcastDisplay = {
    available: false,
    line: "Broadcast information unavailable for your region",
    regionalLine: "Broadcast information unavailable for your region",
    label: "Regional coverage:",
    channels: [],
    fixtureSpecific: false,
  };

  if (!region || !isWc26TvRegionCode(region)) {
    return unavailable;
  }

  if (region === "GB" && matchNumber !== undefined) {
    const uk = getUkBroadcaster(matchNumber);
    if (uk) {
      const channels = ukBroadcasterChannels(uk);
      const line = channels.join(" / ");
      return {
        available: true,
        line,
        regionalLine: `Watch on: ${line}`,
        label: "Watch on:",
        channels,
        fixtureSpecific: true,
      };
    }
  }

  const regional = getTvBroadcastDisplay(region);
  return {
    ...regional,
    label: "Regional coverage:",
    channels: getTvChannels(region),
    fixtureSpecific: false,
  };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Local calendar date key (YYYY-MM-DD) for a UTC kickoff. */
export function localDateKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function formatLocalKickoff(iso: string): string {
  return formatVisitorKickoffTime(iso);
}

export function formatVisitorTimezone(): string {
  return formatVisitorTimezoneFromFormat();
}

export function formatLongLocalDate(dateKey: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateKey}T12:00:00`));
}

export function shortDayParts(dateKey: string): {
  dow: string;
  dayNum: number;
  month: string;
} {
  const d = new Date(`${dateKey}T12:00:00`);
  return {
    dow: new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(d),
    dayNum: d.getDate(),
    month: new Intl.DateTimeFormat(undefined, { month: "short" }).format(d),
  };
}

export function formatStageLabel(stage: FixtureStage): string {
  if (stage === "group") {
    return "Group Stage";
  }
  return stage
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export type FixtureMatchClass = "live" | "ft" | "upcoming";

export function classifyFixtureMatch(
  fixture: Fixture & { readonly homeScore?: number; readonly awayScore?: number },
): FixtureMatchClass {
  if (isLiveMatchStatus(fixture.status)) {
    return "live";
  }
  if (isEffectiveFixtureCompleted(fixture)) {
    return "ft";
  }
  return "upcoming";
}

export function fixtureStatusBadgeLabel(fixture: Fixture): string {
  const matchClass = classifyFixtureMatch(fixture);
  if (matchClass === "live") {
    return formatFixtureStatusLabel(fixture.status);
  }
  if (matchClass === "ft") {
    return formatFixtureStatusLabel(fixture.status);
  }
  return `${formatLocalKickoff(fixture.kickoffUtc)} ${formatVisitorTimezone()}`;
}

export function buildCalendarDays(fixtures: readonly Fixture[]): CalendarDay[] {
  const counts = new Map<string, number>();
  for (const fixture of fixtures) {
    const key = localDateKey(fixture.kickoffUtc);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, count]) => {
      const parts = shortDayParts(dateKey);
      return {
        dateKey,
        count,
        dow: parts.dow,
        dayNum: parts.dayNum,
        month: parts.month,
      };
    });
}

export function pickDefaultDateKey(
  days: readonly CalendarDay[],
  now: Date = new Date(),
): string {
  if (days.length === 0) {
    return "";
  }
  const todayKey = localDateKey(now.toISOString());
  if (days.some((d) => d.dateKey === todayKey)) {
    return todayKey;
  }
  const future = days.find((d) => d.dateKey >= todayKey);
  return future?.dateKey ?? days[0].dateKey;
}

export function getDistinctStages(
  fixtures: readonly Fixture[],
): readonly FixtureStage[] {
  const stages = new Set<FixtureStage>();
  for (const fixture of fixtures) {
    stages.add(fixture.stage);
  }
  return [...stages].sort();
}

export function fixtureSearchHaystack(fixture: Fixture): string {
  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  const venue = getVenueById(fixture.venueId);
  return [
    home?.name,
    away?.name,
    home?.code,
    away?.code,
    venue?.name,
    venue?.city,
    fixture.groupId,
    fixture.stage,
    String(fixture.matchNumber),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function filterFixturesForPage(
  fixtures: readonly Fixture[],
  filters: FixturePageFilters,
): Fixture[] {
  const query = filters.search.trim().toLowerCase();

  return fixtures.filter((fixture) => {
    if (filters.dateKey && localDateKey(fixture.kickoffUtc) !== filters.dateKey) {
      return false;
    }

    if (filters.groupId && fixture.groupId !== filters.groupId) {
      return false;
    }

    if (filters.stage && fixture.stage !== filters.stage) {
      return false;
    }

    if (filters.status) {
      const matchClass = classifyFixtureMatch(fixture);
      if (filters.status === "ft" && matchClass !== "ft") {
        return false;
      }
      if (filters.status === "live" && matchClass !== "live") {
        return false;
      }
      if (filters.status === "upcoming" && matchClass !== "upcoming") {
        return false;
      }
    }

    if (query && !fixtureSearchHaystack(fixture).includes(query)) {
      return false;
    }

    return true;
  });
}

export function sortFixturesByKickoff(fixtures: readonly Fixture[]): Fixture[] {
  return [...fixtures].sort(
    (a, b) =>
      new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime() ||
      a.matchNumber - b.matchNumber,
  );
}

export function isWc26GroupFilter(value: string): value is Wc26GroupId {
  return (WC26_GROUP_IDS as readonly string[]).includes(value);
}
