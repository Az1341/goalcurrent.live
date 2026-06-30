import { getFixtureById } from "@/data/wc26";

/** Max allowed drift before rejecting API kickoffUtc over FIFA static schedule. */
export const WC26_KICKOFF_MERGE_MAX_DELTA_MS = 30 * 60 * 1000;

function parseKickoffMs(iso: string): number | null {
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : null;
}

/**
 * Whether API-Football kickoffUtc may replace the static FIFA schedule value.
 * Knockout (and group) fixtures reject large deltas to avoid wrong local display.
 */
export function shouldApplyApiKickoffUtc(
  fixtureId: string,
  apiKickoffUtc: string,
): boolean {
  const staticFixture = getFixtureById(fixtureId);
  if (!staticFixture) {
    return true;
  }

  const staticMs = parseKickoffMs(staticFixture.kickoffUtc);
  const apiMs = parseKickoffMs(apiKickoffUtc);
  if (staticMs === null || apiMs === null) {
    return false;
  }

  return Math.abs(apiMs - staticMs) <= WC26_KICKOFF_MERGE_MAX_DELTA_MS;
}

/** Returns API kickoffUtc only when verified against static schedule. */
export function resolveOverlayKickoffUtc(
  fixtureId: string,
  apiKickoffUtc: string | undefined,
): string | undefined {
  if (!apiKickoffUtc) {
    return undefined;
  }
  return shouldApplyApiKickoffUtc(fixtureId, apiKickoffUtc)
    ? apiKickoffUtc
    : undefined;
}
