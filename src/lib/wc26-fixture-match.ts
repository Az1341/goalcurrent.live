import { WC26_FIXTURES } from "@/data/wc26";
import { resolveTeamId } from "@/lib/teamIdentity";
import type { TeamId } from "@/types/team";

const fixtureIdByTeamPair = new Map<string, string>();

for (const fixture of WC26_FIXTURES) {
  fixtureIdByTeamPair.set(
    teamPairKey(fixture.homeTeamId, fixture.awayTeamId),
    fixture.id,
  );
}

function teamPairKey(homeTeamId: TeamId, awayTeamId: TeamId): string {
  return `${homeTeamId}|${awayTeamId}`;
}

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
