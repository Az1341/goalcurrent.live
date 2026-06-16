/** Stable identifier for a host stadium. */
export type VenueId = string;

export type HostCountry = "USA" | "Mexico" | "Canada";

/** A World Cup 2026 host venue — location metadata only. */
export interface Venue {
  readonly id: VenueId;
  readonly name: string;
  readonly city: string;
  readonly country: HostCountry;
  /** IANA timezone for the host city when verified. */
  readonly timezone?: string;
  /** Seating capacity when officially verified; omitted otherwise. */
  readonly capacity?: number;
}
