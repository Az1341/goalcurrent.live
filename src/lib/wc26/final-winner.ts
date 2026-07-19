import { isCompletedMatchStatus } from "@/lib/wc26-tournament-stats";
import type { TeamId } from "@/types/team";
import type { Wc26ApiMatch } from "@/types/fixture-overlay";

export const WC26_FINAL_FIXTURE_ID = "fixture-104";
export const WC26_FINAL_MATCH_NUMBER = 104;

export type FinalWinnerResult = {
  readonly winnerTeamId: TeamId;
  readonly opponentTeamId: TeamId;
  readonly homeScore: number;
  readonly awayScore: number;
  readonly penaltiesHome: number | null;
  readonly penaltiesAway: number | null;
  readonly decidedOnPenalties: boolean;
  readonly resultKey: string;
};

/** Resolve a winner only from an officially completed Match 104 payload. */
export function resolveFinalWinner(
  match: Wc26ApiMatch | null | undefined,
): FinalWinnerResult | null {
  if (
    !match ||
    match.fixtureId !== WC26_FINAL_FIXTURE_ID ||
    match.matchNumber !== WC26_FINAL_MATCH_NUMBER ||
    !isCompletedMatchStatus(match.statusShort || match.status) ||
    match.homeScore == null ||
    match.awayScore == null ||
    !match.homeTeamId ||
    !match.awayTeamId
  ) {
    return null;
  }

  const penaltiesHome = match.penaltiesHome ?? null;
  const penaltiesAway = match.penaltiesAway ?? null;
  const hasDecisiveShootout =
    penaltiesHome != null &&
    penaltiesAway != null &&
    penaltiesHome !== penaltiesAway;

  let homeWon: boolean;
  if (hasDecisiveShootout) {
    homeWon = penaltiesHome > penaltiesAway;
  } else if (match.homeScore !== match.awayScore) {
    homeWon = match.homeScore > match.awayScore;
  } else {
    return null;
  }

  const winnerTeamId = homeWon ? match.homeTeamId : match.awayTeamId;
  const opponentTeamId = homeWon ? match.awayTeamId : match.homeTeamId;
  const shootoutKey = hasDecisiveShootout
    ? `:pens-${penaltiesHome}-${penaltiesAway}`
    : "";

  return {
    winnerTeamId,
    opponentTeamId,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    penaltiesHome,
    penaltiesAway,
    decidedOnPenalties: hasDecisiveShootout,
    resultKey: `${match.fixtureId}:${winnerTeamId}:${match.homeScore}-${match.awayScore}${shootoutKey}`,
  };
}
