import type { PlFixtureRow } from "@/lib/pl/types";
import type { UclFixtureRow } from "@/lib/ucl/types";
import type { FacupFixtureRow } from "@/lib/facup/types";
import type { UnlFixtureRow } from "@/lib/unl/types";
import { isLocalToday } from "@/lib/date-utils";
import { PL_LEAGUE_NAME } from "@/lib/pl/constants";
import { UCL_DISPLAY_NAME } from "@/lib/ucl/constants";
import { FACUP_DISPLAY_NAME } from "@/lib/facup/constants";
import { UNL_DISPLAY_NAME } from "@/lib/unl/constants";

export type MatchdayFixture = PlFixtureRow | UclFixtureRow | FacupFixtureRow | UnlFixtureRow;
export type MatchdayFilter = "all" | "live" | "finished" | "upcoming";
export const MATCHDAY_COMPETITIONS = {
  pl: { label: PL_LEAGUE_NAME, href: "/premier-league" },
  ucl: { label: UCL_DISPLAY_NAME, href: "/champions-league" },
  facup: { label: FACUP_DISPLAY_NAME, href: "/fa-cup" },
  unl: { label: UNL_DISPLAY_NAME, href: "/nations-league" },
} as const;
export type MatchdayCompetition = keyof typeof MATCHDAY_COMPETITIONS;
/** A read-only projection of the existing API contracts; never persisted. */
export type MatchdayData = {
  fixtures: readonly MatchdayFixture[];
  source: string;
  configured: boolean;
  fetchedAt?: string;
  stale?: boolean;
  error?: string;
};
export type MatchdaySource = { key: MatchdayCompetition; data?: MatchdayData; loading: boolean; failed: boolean };

export const isFinished = (row: MatchdayFixture) => ["FT", "AET", "PEN"].includes(row.status);
export const isLive = (row: MatchdayFixture) => row.status === "LIVE";
export const isToday = (row: MatchdayFixture, now: Date) => Boolean(row.kickoffUtc && isLocalToday(row.kickoffUtc, now));
export function matchdayHref(key: MatchdayCompetition, fixtureId: number): string {
  return `${MATCHDAY_COMPETITIONS[key].href}/match/${fixtureId}`;
}
export function parseMatchdayId(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
function priority(row: MatchdayFixture) {
  return isLive(row) ? 0 : isFinished(row) ? 1 : row.status === "UPCOMING" ? 2 : 3;
}
function byKickoff<T extends MatchdayFixture>(a: T, b: T) {
  const at = a.kickoffUtc ? Date.parse(a.kickoffUtc) : Infinity;
  const bt = b.kickoffUtc ? Date.parse(b.kickoffUtc) : Infinity;
  return at - bt || a.fixtureId - b.fixtureId;
}
export function todayMatches<T extends MatchdayFixture>(fixtures: readonly T[], now: Date, filter: MatchdayFilter = "all"): T[] {
  const unique = new Map(fixtures.map(row => [row.fixtureId, row]));
  return [...unique.values()].filter(row => (isToday(row, now) || isLive(row)) && (
    filter === "all" || (filter === "live" && isLive(row)) ||
    (filter === "finished" && isFinished(row)) || (filter === "upcoming" && row.status === "UPCOMING")
  )).sort((a, b) => priority(a) - priority(b) || byKickoff(a, b));
}

export function selectFeaturedMatches<T extends MatchdayFixture>(fixtures: readonly T[], now = new Date()): T[] {
  const today = todayMatches(fixtures, now);
  const future = fixtures.filter(row => row.status === "UPCOMING" && row.kickoffUtc &&
    Date.parse(row.kickoffUtc) > now.getTime() && !isToday(row, now)).sort(byKickoff);
  return [...new Map([...today, ...future].map(row => [row.fixtureId, row])).values()];
}

export function scorePair(row: MatchdayFixture): [number, number] | null {
  const valid = (n: number | null) => n !== null && Number.isInteger(n) && n >= 0;
  return (isLive(row) || isFinished(row)) && valid(row.homeScore) && valid(row.awayScore)
    ? [row.homeScore as number, row.awayScore as number] : null;
}

export function matchStatusKey(row: MatchdayFixture) {
  const short = row.statusShort?.toUpperCase();
  if (short === "SUSP" || short === "INT") return "interrupted";
  if (row.status === "LIVE") {
    if (short === "HT" || short === "BT") return "halfTime";
    if (short === "P") return "penalties";
    if (short === "ET") return "extraTime";
    return "live";
  }
  if (isFinished(row)) return short === "PEN" || row.status === "PEN" ? "finishedPenalties" :
    short === "AET" || row.status === "AET" ? "finishedExtraTime" : "finished";
  if (row.status === "POSTPONED") return "postponed";
  if (row.status === "CANCELLED") return "cancelled";
  if (row.status === "ABANDONED") return "abandoned";
  return row.status === "UPCOMING" && (!short || ["NS", "TBD", "UPCOMING"].includes(short)) ? "upcoming" : "unknown";
}

export function sourceHealth(source: MatchdaySource, now: Date) {
  if (!source.data) return source.loading ? "loading" : "unavailable";
  if (!Array.isArray(source.data.fixtures)) return "unavailable";
  if (source.failed || source.data.stale || source.data.error) return "delayed";
  if (source.data.source !== "api-football") return source.data.fixtures.length ? "scheduleOnly" :
    source.data.configured ? "unknown" : "unavailable";
  const checked = Date.parse(source.data.fetchedAt ?? "");
  if (!Number.isFinite(checked) || checked > now.getTime() + 60_000) return "unknown";
  // Existing competition caches can retain a response for five minutes.
  return now.getTime() - checked > 600_000 ? "delayed" : "available";
}
