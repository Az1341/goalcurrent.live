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
  /** api-sports fixture id — present when row comes from the live API feed. */
  readonly apiFixtureId?: number;
};

export type Wc26ScoresApiResponse = {
  readonly matches: readonly Wc26ApiMatch[];
  readonly fetchedAt: string;
  readonly configured: boolean;
  readonly phase?: string;
};

/** Live fixture row returned by GET /api/wc26/fixtures?status=LIVE */
export type Wc26LiveFixturePayload = {
  readonly fixtureId: string;
  readonly homeTeamId: string;
  readonly awayTeamId: string;
  readonly home: { readonly name: string; readonly goals: number };
  readonly away: { readonly name: string; readonly goals: number };
  readonly fixture: {
    readonly status: { readonly elapsed: number | null };
  };
};
