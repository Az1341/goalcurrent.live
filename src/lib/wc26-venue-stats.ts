import { WC26_FIXTURES } from "@/data/wc26";
import type { Venue } from "@/types/venue";
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

/** Verified summary from schedule metadata — no invented capacity or history. */
export function buildVenueDescription(
  venue: Venue,
  stats: VenueStats,
): string {
  const parts = [
    `${venue.name} is a FIFA World Cup 2026 host venue in ${venue.city}, ${venue.country}.`,
  ];

  if (stats.matchCount > 0) {
    const matchLabel = stats.matchCount === 1 ? "match" : "matches";
    parts.push(
      `${stats.matchCount} group-stage ${matchLabel} on the official schedule.`,
    );
  }

  if (stats.hostsOpeningMatch) {
    parts.push("Hosts the tournament opening match.");
  }

  if (stats.hostsFinal) {
    parts.push("Hosts the World Cup final.");
  }

  return parts.join(" ");
}

export function formatVenueTimezoneLabel(timezone?: string): string | undefined {
  if (!timezone) {
    return undefined;
  }

  const city = timezone.split("/").pop()?.replace(/_/g, " ");
  return city ? `${city} (${timezone})` : timezone;
}
