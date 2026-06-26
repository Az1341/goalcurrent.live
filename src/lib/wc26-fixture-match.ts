import { WC26_FIXTURES } from "@/data/wc26";
import { resolveTeamId } from "@/lib/teamIdentity";
import type { TeamId } from "@/types/team";

const fixtureIdByTeamPair = new Map<string, string>();
const fixtureIdByMatchNumber = new Map<number, string>();
const fixtureKickoffMs = new Map<string, number>();

for (const fixture of WC26_FIXTURES) {
  fixtureIdByTeamPair.set(
    teamPairKey(fixture.homeTeamId, fixture.awayTeamId),
    fixture.id,
  );
  fixtureIdByMatchNumber.set(fixture.matchNumber, fixture.id);
  fixtureKickoffMs.set(fixture.id, Date.parse(fixture.kickoffUtc));
}

function teamPairKey(homeTeamId: TeamId, awayTeamId: TeamId): string {
  return `${homeTeamId}|${awayTeamId}`;
}

const KICKOFF_MATCH_TOLERANCE_MS = 3 * 60 * 60 * 1000;

/** Resolve a local WC26 fixture id from API team names. */
export function findFixtureIdByTeamNames(
  homeName: string,
  awayName: string,
): string | undefined {
  const homeTeamId = resolveTeamId(homeName);
  const awayTeamId = resolveTeamId(awayName);
  if (!homeTeamId || !awayTeamId) {
    return undefined;
  }
  return fixtureIdByTeamPair.get(teamPairKey(homeTeamId, awayTeamId));
}

/** Fallback when API team names are TBD — match by kickoff time. */
export function findFixtureIdByKickoffUtc(kickoffUtc: string): string | undefined {
  const targetMs = Date.parse(kickoffUtc);
  if (!Number.isFinite(targetMs)) {
    return undefined;
  }

  let bestId: string | undefined;
  let bestDelta = Number.POSITIVE_INFINITY;

  for (const fixture of WC26_FIXTURES) {
    if (fixture.stage === "group") {
      continue;
    }
    const scheduledMs = fixtureKickoffMs.get(fixture.id);
    if (scheduledMs === undefined) {
      continue;
    }
    const delta = Math.abs(scheduledMs - targetMs);
    if (delta <= KICKOFF_MATCH_TOLERANCE_MS && delta < bestDelta) {
      bestDelta = delta;
      bestId = fixture.id;
    }
  }

  return bestId;
}

export function findFixtureIdByMatchNumber(
  matchNumber: number,
): string | undefined {
  return fixtureIdByMatchNumber.get(matchNumber);
}

/** Map api-football short status codes to overlay status strings. */
export function mapApiStatusShort(short: string): string | null {
  const normalized = short.trim().toUpperCase();
  if (normalized === "NS" || normalized === "TBD" || normalized === "PST") {
    return null;
  }

  const mapped: Record<string, string> = {
    FT: "ft",
    AET: "aet",
    PEN: "pen",
    "1H": "1h",
    HT: "ht",
    "2H": "2h",
    ET: "et",
    BT: "et",
    P: "penalties",
    INT: "live",
    LIVE: "live",
  };

  return mapped[normalized] ?? normalized.toLowerCase();
}
