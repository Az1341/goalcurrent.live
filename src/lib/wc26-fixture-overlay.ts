import { WC26_FIXTURES } from "@/data/wc26";
import { isCompletedMatchStatus } from "@/lib/wc26-tournament-stats";
import type { Fixture, FixtureStatus } from "@/types/fixture";
import type { FixtureOverlayEntry } from "@/types/fixture-overlay";

export const WC26_FIXTURES_UPDATED_EVENT = "wc26:fixtures-updated";

/** Fixture with optional runtime overlay fields merged from API sync. */
export type EffectiveFixture = Fixture & {
  readonly homeScore?: number;
  readonly awayScore?: number;
  readonly elapsed?: number | null;
  readonly apiFixtureId?: number;
};

type OverlayState = Record<string, FixtureOverlayEntry>;

let overlay: OverlayState = {};

function notifyFixtureUpdate(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(WC26_FIXTURES_UPDATED_EVENT));
}

function toFixtureStatus(status: string): FixtureStatus | string {
  const normalized = status.trim().toLowerCase();
  if (
    normalized === "scheduled" ||
    normalized === "postponed" ||
    normalized === "cancelled"
  ) {
    return normalized;
  }
  return status;
}

function entryFromStatus(status: string): FixtureOverlayEntry {
  return { status };
}

/** Replace the full runtime overlay (for API sync). */
export function setFixtureOverlay(next: OverlayState): void {
  overlay = { ...next };
  notifyFixtureUpdate();
}

/** Merge partial overlay updates from API sync. */
export function mergeFixtureOverlay(partial: OverlayState): void {
  overlay = { ...overlay, ...partial };
  notifyFixtureUpdate();
}

/** @deprecated Use mergeFixtureOverlay — status-only partial merge. */
export function mergeFixtureStatusOverlay(
  partial: Readonly<Record<string, string>>,
): void {
  const mapped: OverlayState = {};
  for (const [fixtureId, status] of Object.entries(partial)) {
    mapped[fixtureId] = entryFromStatus(status);
  }
  mergeFixtureOverlay(mapped);
}

/** @deprecated Use setFixtureOverlay — status-only full replace. */
export function setFixtureStatusOverlay(next: Readonly<Record<string, string>>): void {
  const mapped: OverlayState = {};
  for (const [fixtureId, status] of Object.entries(next)) {
    mapped[fixtureId] = entryFromStatus(status);
  }
  setFixtureOverlay(mapped);
}

/** Clear overlay — revert to static scheduled fixtures. */
export function clearFixtureOverlay(): void {
  overlay = {};
  notifyFixtureUpdate();
}

/** @deprecated Use clearFixtureOverlay */
export function clearFixtureStatusOverlay(): void {
  clearFixtureOverlay();
}

/** Current overlay snapshot (for debugging/tests). */
export function getFixtureOverlaySnapshot(): Readonly<OverlayState> {
  return overlay;
}

/** WC26 fixtures with runtime overlay applied — status and optional scores. */
export function getEffectiveFixtures(): readonly EffectiveFixture[] {
  if (Object.keys(overlay).length === 0) {
    return WC26_FIXTURES;
  }

  return WC26_FIXTURES.map((fixture) => {
    const entry = overlay[fixture.id];
    if (!entry) {
      return fixture;
    }

    return {
      ...fixture,
      status: toFixtureStatus(entry.status) as FixtureStatus,
      ...(entry.homeScore !== undefined ? { homeScore: entry.homeScore } : {}),
      ...(entry.awayScore !== undefined ? { awayScore: entry.awayScore } : {}),
      ...(entry.elapsed !== undefined ? { elapsed: entry.elapsed } : {}),
      ...(entry.apiFixtureId !== undefined ? { apiFixtureId: entry.apiFixtureId } : {}),
    };
  });
}

export function getFixtureScore(
  fixture: EffectiveFixture,
): { home: number; away: number } | null {
  if (
    typeof fixture.homeScore === "number" &&
    typeof fixture.awayScore === "number"
  ) {
    return { home: fixture.homeScore, away: fixture.awayScore };
  }
  return null;
}

/** True when overlay status or synced scores indicate a finished match. */
export function isEffectiveFixtureCompleted(
  fixture: EffectiveFixture,
  now: Date = new Date(),
): boolean {
  if (isCompletedMatchStatus(fixture.status)) {
    return true;
  }
  const score = getFixtureScore(fixture);
  return (
    score !== null && new Date(fixture.kickoffUtc).getTime() <= now.getTime()
  );
}
