import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { applyConfirmedGroupResults } from "@/lib/wc26/group-confirmed-results";
import {
  applyConfirmedKnockoutResults,
  applyConfirmedKnockoutResultsToApiMatches,
} from "@/lib/wc26/knockout-confirmed-results";
import { getConfirmedKnockoutPairingByFixtureId } from "@/lib/wc26/knockout-confirmed-pairings";
import { isKnockoutPlaceholderTeam } from "@/data/wc26/knockout-fixtures";
import { isCompletedMatchStatus } from "@/lib/wc26-tournament-stats";
import { getFixtureScore } from "@/lib/wc26-fixture-overlay";
import { WC26_FIXTURES } from "@/data/wc26";
import type { Wc26ApiMatch } from "@/types/fixture-overlay";

/** Apply all editorial confirmed scores (group + knockout) onto fixtures. */
export function applyAllConfirmedResults(
  fixtures: readonly EffectiveFixture[],
): EffectiveFixture[] {
  return applyConfirmedKnockoutResults(applyConfirmedGroupResults(fixtures));
}

function statusShortFor(status: string): string {
  const normalized = status.trim().toLowerCase();
  if (normalized === "pen") return "PEN";
  if (normalized === "aet") return "AET";
  if (normalized === "ft") return "FT";
  return status.toUpperCase();
}

function fixtureToApiMatch(fixture: EffectiveFixture): Wc26ApiMatch | null {
  const score = getFixtureScore(fixture);
  if (!score || !fixture.matchNumber) {
    return null;
  }
  if (!isCompletedMatchStatus(fixture.status)) {
    return null;
  }

  const pairing = getConfirmedKnockoutPairingByFixtureId(fixture.id);
  const homeTeamId =
    fixture.overlayHomeTeamId ??
    pairing?.homeTeamId ??
    (!isKnockoutPlaceholderTeam(fixture.homeTeamId)
      ? fixture.homeTeamId
      : undefined);
  const awayTeamId =
    fixture.overlayAwayTeamId ??
    pairing?.awayTeamId ??
    (!isKnockoutPlaceholderTeam(fixture.awayTeamId)
      ? fixture.awayTeamId
      : undefined);

  return {
    fixtureId: fixture.id,
    matchNumber: fixture.matchNumber,
    status: String(fixture.status),
    statusShort: statusShortFor(String(fixture.status)),
    elapsed:
      String(fixture.status) === "aet" || String(fixture.status) === "pen"
        ? 120
        : 90,
    homeScore: score.home,
    awayScore: score.away,
    kickoffUtc: fixture.kickoffUtc,
    ...(homeTeamId ? { homeTeamId } : {}),
    ...(awayTeamId ? { awayTeamId } : {}),
    ...(fixture.apiFixtureId != null ? { apiFixtureId: fixture.apiFixtureId } : {}),
    ...(fixture.penaltiesHome != null ? { penaltiesHome: fixture.penaltiesHome } : {}),
    ...(fixture.penaltiesAway != null ? { penaltiesAway: fixture.penaltiesAway } : {}),
  };
}

/** Hardcoded finished matches for API fallback when provider is unavailable. */
export function buildConfirmedStaticApiMatches(): readonly Wc26ApiMatch[] {
  return applyAllConfirmedResults(WC26_FIXTURES)
    .map(fixtureToApiMatch)
    .filter((row): row is Wc26ApiMatch => row !== null);
}

/** Merge API rows with editorial confirmed scores for any missing finished slots. */
export function applyAllConfirmedResultsToApiMatches(
  matches: readonly Wc26ApiMatch[],
): Wc26ApiMatch[] {
  const merged = applyConfirmedKnockoutResultsToApiMatches(matches);
  const byFixtureId = new Map(merged.map((row) => [row.fixtureId, row] as const));

  for (const staticRow of buildConfirmedStaticApiMatches()) {
    if (!byFixtureId.has(staticRow.fixtureId)) {
      byFixtureId.set(staticRow.fixtureId, staticRow);
    }
  }

  return [...byFixtureId.values()].sort(
    (left, right) => left.matchNumber - right.matchNumber,
  );
}
