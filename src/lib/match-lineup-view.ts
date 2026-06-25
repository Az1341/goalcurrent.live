import { getTeamById } from "@/data/wc26";
import {
  DEMO_KOR_LINEUP,
  DEMO_RSA_LINEUP,
  RSA_KOR_DEMO_FORMATIONS,
  isRsaKorDemoFixture,
} from "@/data/wc26/demo-lineups-rsa-kor";
import type { MatchDetailPayload, MatchLineupPlayer } from "@/types/match-detail";

export type ResolvedMatchLineupView = {
  home: readonly MatchLineupPlayer[];
  away: readonly MatchLineupPlayer[];
  homeFormation: string | null;
  awayFormation: string | null;
  homeTeamName: string;
  awayTeamName: string;
  hasLineup: boolean;
  homeBench: readonly MatchLineupPlayer[];
  awayBench: readonly MatchLineupPlayer[];
};

export function resolveMatchLineupView(
  params: { matchNumber: number; homeTeamId: string; awayTeamId: string },
  detail: MatchDetailPayload,
): ResolvedMatchLineupView {
  const homeTeam = getTeamById(params.homeTeamId);
  const awayTeam = getTeamById(params.awayTeamId);
  const useDemo = isRsaKorDemoFixture(params.matchNumber);

  const homeLineup = detail.lineups.home?.startXI?.length
    ? detail.lineups.home.startXI
    : useDemo
      ? DEMO_RSA_LINEUP
      : [];
  const awayLineup = detail.lineups.away?.startXI?.length
    ? detail.lineups.away.startXI
    : useDemo
      ? DEMO_KOR_LINEUP
      : [];

  return {
    home: homeLineup,
    away: awayLineup,
    homeFormation:
      detail.lineups.home?.formation ??
      (useDemo ? RSA_KOR_DEMO_FORMATIONS.home : null),
    awayFormation:
      detail.lineups.away?.formation ??
      (useDemo ? RSA_KOR_DEMO_FORMATIONS.away : null),
    homeTeamName: homeTeam?.name ?? params.homeTeamId,
    awayTeamName: awayTeam?.name ?? params.awayTeamId,
    hasLineup: homeLineup.length > 0 || awayLineup.length > 0,
    homeBench: detail.lineups.home?.substitutes ?? [],
    awayBench: detail.lineups.away?.substitutes ?? [],
  };
}