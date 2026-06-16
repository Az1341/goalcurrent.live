import { WC26_FIXTURES } from "@/data/wc26";
import type { Fixture, FixtureStatus } from "@/types/fixture";

export const WC26_FIXTURES_UPDATED_EVENT = "wc26:fixtures-updated";

type StatusOverlay = Readonly<Record<string, string>>;

let statusOverlay: StatusOverlay = {};

/** Replace the full runtime status overlay (for future API sync). */
export function setFixtureStatusOverlay(next: StatusOverlay): void {
  statusOverlay = { ...next };
  notifyFixtureUpdate();
}

/** Merge partial status updates into the overlay. */
export function mergeFixtureStatusOverlay(partial: StatusOverlay): void {
  statusOverlay = { ...statusOverlay, ...partial };
  notifyFixtureUpdate();
}

/** Clear overlay — revert to static scheduled fixtures. */
export function clearFixtureStatusOverlay(): void {
  statusOverlay = {};
  notifyFixtureUpdate();
}

function notifyFixtureUpdate(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(WC26_FIXTURES_UPDATED_EVENT));
}

function toFixtureStatus(status: string): FixtureStatus | string {
  const normalized = status.trim().toLowerCase();
  if (normalized === "scheduled" || normalized === "postponed" || normalized === "cancelled") {
    return normalized;
  }
  return status;
}

/** WC26 fixtures with optional runtime status overlay applied. */
export function getEffectiveFixtures(): readonly Fixture[] {
  if (Object.keys(statusOverlay).length === 0) {
    return WC26_FIXTURES;
  }

  return WC26_FIXTURES.map((fixture) => {
    const override = statusOverlay[fixture.id];
    if (!override) {
      return fixture;
    }
    return {
      ...fixture,
      status: toFixtureStatus(override) as FixtureStatus,
    };
  });
}
