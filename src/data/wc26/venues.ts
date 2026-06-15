import type { Venue, VenueId } from "@/types/venue";

/** Sixteen host stadiums — location metadata only. */
export const WC26_VENUES: readonly Venue[] = [
  {
    id: "venue-atlanta",
    name: "Mercedes-Benz Stadium",
    city: "Atlanta",
    country: "USA",
    capacity: 71000,
  },
  {
    id: "venue-boston",
    name: "Gillette Stadium",
    city: "Foxborough",
    country: "USA",
    capacity: 65878,
  },
  {
    id: "venue-dallas",
    name: "AT&T Stadium",
    city: "Arlington",
    country: "USA",
    capacity: 80000,
  },
  {
    id: "venue-houston",
    name: "NRG Stadium",
    city: "Houston",
    country: "USA",
    capacity: 72220,
  },
  {
    id: "venue-kc",
    name: "Arrowhead Stadium",
    city: "Kansas City",
    country: "USA",
    capacity: 76416,
  },
  {
    id: "venue-la",
    name: "SoFi Stadium",
    city: "Inglewood",
    country: "USA",
    capacity: 70000,
  },
  {
    id: "venue-miami",
    name: "Hard Rock Stadium",
    city: "Miami Gardens",
    country: "USA",
    capacity: 65326,
  },
  {
    id: "venue-nj",
    name: "MetLife Stadium",
    city: "East Rutherford",
    country: "USA",
    capacity: 82500,
  },
  {
    id: "venue-philadelphia",
    name: "Lincoln Financial Field",
    city: "Philadelphia",
    country: "USA",
    capacity: 69796,
  },
  {
    id: "venue-seattle",
    name: "Lumen Field",
    city: "Seattle",
    country: "USA",
    capacity: 68740,
  },
  {
    id: "venue-sf",
    name: "Levi's Stadium",
    city: "Santa Clara",
    country: "USA",
    capacity: 68500,
  },
  {
    id: "venue-toronto",
    name: "BMO Field",
    city: "Toronto",
    country: "Canada",
    capacity: 45736,
  },
  {
    id: "venue-vancouver",
    name: "BC Place",
    city: "Vancouver",
    country: "Canada",
    capacity: 54500,
  },
  {
    id: "venue-guadalajara",
    name: "Estadio Akron",
    city: "Zapopan",
    country: "Mexico",
    capacity: 49850,
  },
  {
    id: "venue-mexico-city",
    name: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
    capacity: 87523,
  },
  {
    id: "venue-monterrey",
    name: "Estadio BBVA",
    city: "Guadalupe",
    country: "Mexico",
    capacity: 53500,
  },
];

const venueById = new Map<VenueId, Venue>(
  WC26_VENUES.map((venue) => [venue.id, venue]),
);

export function getVenueById(id: VenueId): Venue | undefined {
  return venueById.get(id);
}

/** Total host venues in the placeholder dataset. */
export const WC26_VENUE_COUNT = 16;
