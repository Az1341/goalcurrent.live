/** Runtime overlay entry for a WC26 fixture — never stored in SSOT data files. */
export type FixtureOverlayEntry = {
  readonly status: string;
  readonly homeScore?: number;
  readonly awayScore?: number;
  readonly elapsed?: number | null;
};

/** Normalised match payload returned by /api/wc26/scores (fixture id resolved server-side). */
export type Wc26ApiMatch = {
  readonly fixtureId: string;
  readonly matchNumber: number;
  readonly status: string;
  readonly statusShort: string;
  readonly elapsed: number | null;
  readonly homeScore: number | null;
  readonly awayScore: number | null;
  readonly kickoffUtc: string;
};

export type Wc26ScoresApiResponse = {
  readonly matches: readonly Wc26ApiMatch[];
  readonly fetchedAt: string;
  readonly configured: boolean;
  readonly phase?: string;
};
