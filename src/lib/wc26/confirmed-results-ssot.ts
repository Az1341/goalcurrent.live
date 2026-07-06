import raw from "@/data/wc26-confirmed-results.json";
import type { TeamId } from "@/types/team";

export type ConfirmedGroupResult = {
  readonly matchNumber: number;
  readonly homeScore: number;
  readonly awayScore: number;
};

export type ConfirmedKnockoutPairing = {
  readonly fixtureId: string;
  readonly matchNumber: number;
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
};

export type ConfirmedKnockoutResult = {
  readonly matchNumber: number;
  readonly winnerTeamId: TeamId;
  readonly homeScore: number;
  readonly awayScore: number;
  readonly penaltiesHome?: number;
  readonly penaltiesAway?: number;
  readonly matchStatus?: "ft" | "aet" | "pen";
};

type Wc26ConfirmedResultsFile = {
  readonly groupResults: readonly ConfirmedGroupResult[];
  readonly knockoutPairings: readonly ConfirmedKnockoutPairing[];
  readonly knockoutResults: readonly ConfirmedKnockoutResult[];
};

const data = raw as Wc26ConfirmedResultsFile;

export const WC26_CONFIRMED_GROUP_RESULTS = data.groupResults;
export const WC26_CONFIRMED_KNOCKOUT_PAIRINGS = data.knockoutPairings;
export const WC26_CONFIRMED_KNOCKOUT_RESULTS = data.knockoutResults;