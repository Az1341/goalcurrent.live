/** Normalised match detail payload from /api/wc26/match/[fixtureId]. */

import type { ApiFootballErrorCode } from "@/lib/api-football/errors";

export type MatchEventItem = {
  readonly minute: number | null;
  readonly extra: number | null;
  readonly teamName: string;
  readonly playerName: string;
  readonly assistName: string | null;
  readonly type: string;
  readonly detail: string;
};

export type MatchLineupPlayer = {
  readonly name: string;
  readonly number: number | null;
  readonly position: string | null;
};

export type MatchLineupSide = {
  readonly teamName: string;
  readonly formation: string | null;
  readonly coach: string | null;
  readonly startXI: readonly MatchLineupPlayer[];
  readonly substitutes: readonly MatchLineupPlayer[];
};

export type MatchStatisticPair = {
  readonly key: string;
  readonly label: string;
  readonly home: string | number | null;
  readonly away: string | number | null;
};

export type MatchDetailPayload = {
  readonly fixtureId: string;
  readonly configured: boolean;
  readonly apiAvailable: boolean;
  readonly fetchedAt: string;
  readonly events: readonly MatchEventItem[];
  readonly lineups: {
    readonly home: MatchLineupSide | null;
    readonly away: MatchLineupSide | null;
  };
  readonly statistics: readonly MatchStatisticPair[];
  readonly error?: ApiFootballErrorCode;
  readonly message?: string;
  readonly stale?: boolean;
};
