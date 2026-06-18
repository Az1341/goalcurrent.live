import { WC26_FIXTURES } from "@/data/wc26";
import type { VenueId } from "@/types/venue";

export type VenueStats = {
  readonly matchCount: number;
  readonly hostsOpeningMatch: boolean;
  readonly hostsFinal: boolean;
};

const statsByVenue = buildVenueStatsMap();

function buildVenueStatsMap(): ReadonlyMap<VenueId, VenueStats> {
  const mutable = new Map<VenueId, { matchCount: number; hostsOpeningMatch: boolean; hostsFinal: boolean }>();

  for (const fixture of WC26_FIXTURES) {
    const current = mutable.get(fixture.venueId) ?? {
      matchCount: 0,
      hostsOpeningMatch: false,
      hostsFinal: false,
    };

    mutable.set(fixture.venueId, {
      matchCount: current.matchCount + 1,
      hostsOpeningMatch: current.hostsOpeningMatch || fixture.matchNumber === 1,
      hostsFinal: current.hostsFinal || fixture.stage === "final",
    });
  }

  return mutable;
}

export function getVenueStats(venueId: VenueId): VenueStats {
  return (
    statsByVenue.get(venueId) ?? {
      matchCount: 0,
      hostsOpeningMatch: false,
      hostsFinal: false,
    }
  );
}
