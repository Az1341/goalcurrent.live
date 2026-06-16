import type { Venue, VenueId } from "@/types/venue";

/** Sixteen official host venues — FIFA World Cup 2026. */
export const WC26_VENUES: readonly Venue[] = [
  {
    id: "venue-mexico-city",
    name: "Mexico City Stadium",
    city: "Mexico City",
    country: "Mexico",
    timezone: "America/Mexico_City",
  },
  {
    id: "venue-guadalajara",
    name: "Guadalajara Stadium",
    city: "Guadalajara",
    country: "Mexico",
    timezone: "America/Mexico_City",
  },
  {
    id: "venue-monterrey",
    name: "Monterrey Stadium",
    city: "Monterrey",
    country: "Mexico",
    timezone: "America/Monterrey",
  },
  {
    id: "venue-toronto",
    name: "Toronto Stadium",
    city: "Toronto",
    country: "Canada",
    timezone: "America/Toronto",
  },
  {
    id: "venue-vancouver",
    name: "BC Place Vancouver",
    city: "Vancouver",
    country: "Canada",
    timezone: "America/Vancouver",
  },
  {
    id: "venue-la",
    name: "Los Angeles Stadium",
    city: "Los Angeles",
    country: "USA",
    timezone: "America/Los_Angeles",
  },
  {
    id: "venue-sf",
    name: "San Francisco Bay Area Stadium",
    city: "Santa Clara",
    country: "USA",
    timezone: "America/Los_Angeles",
  },
  {
    id: "venue-seattle",
    name: "Seattle Stadium",
    city: "Seattle",
    country: "USA",
    timezone: "America/Los_Angeles",
  },
  {
    id: "venue-kc",
    name: "Kansas City Stadium",
    city: "Kansas City",
    country: "USA",
    timezone: "America/Chicago",
  },
  {
    id: "venue-dallas",
    name: "Dallas Stadium",
    city: "Arlington",
    country: "USA",
    timezone: "America/Chicago",
  },
  {
    id: "venue-houston",
    name: "Houston Stadium",
    city: "Houston",
    country: "USA",
    timezone: "America/Chicago",
  },
  {
    id: "venue-atlanta",
    name: "Atlanta Stadium",
    city: "Atlanta",
    country: "USA",
    timezone: "America/New_York",
  },
  {
    id: "venue-miami",
    name: "Miami Stadium",
    city: "Miami Gardens",
    country: "USA",
    timezone: "America/New_York",
  },
  {
    id: "venue-nj",
    name: "New York/New Jersey Stadium",
    city: "East Rutherford",
    country: "USA",
    timezone: "America/New_York",
  },
  {
    id: "venue-boston",
    name: "Boston Stadium",
    city: "Foxborough",
    country: "USA",
    timezone: "America/New_York",
  },
  {
    id: "venue-philadelphia",
    name: "Philadelphia Stadium",
    city: "Philadelphia",
    country: "USA",
    timezone: "America/New_York",
  },
] as const;

const venueById = new Map<VenueId, Venue>(
  WC26_VENUES.map((venue) => [venue.id, venue]),
);

export function getVenueById(id: VenueId): Venue | undefined {
  return venueById.get(id);
}

/** Total host venues. */
export const WC26_VENUE_COUNT = 16;
