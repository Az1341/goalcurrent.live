import { getTeamById } from "@/data/wc26";
import {
  DEMO_KOR_LINEUP,
  DEMO_RSA_LINEUP,
  RSA_KOR_DEMO_FORMATIONS,
  isRsaKorDemoFixture,
} from "@/data/wc26/demo-lineups-rsa-kor";
import {
  FINAL_ARG_LINEUP,
  FINAL_ESP_ARG_FORMATIONS,
  FINAL_ESP_LINEUP,
  isWc26FinalLineupFixture,
} from "@/data/wc26/final-lineups-esp-arg";
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
  const useFinal = isWc26FinalLineupFixture(params.matchNumber);

  const homeLineup = detail.lineups.home?.startXI?.length
    ? detail.lineups.home.startXI
    : useFinal
      ? FINAL_ESP_LINEUP
      : useDemo
        ? DEMO_RSA_LINEUP
        : [];
  const awayLineup = detail.lineups.away?.startXI?.length
    ? detail.lineups.away.startXI
    : useFinal
      ? FINAL_ARG_LINEUP
      : useDemo
        ? DEMO_KOR_LINEUP
        : [];

  return {
    home: homeLineup,
    away: awayLineup,
    homeFormation:
      detail.lineups.home?.formation ??
      (useFinal
        ? FINAL_ESP_ARG_FORMATIONS.home
        : useDemo
          ? RSA_KOR_DEMO_FORMATIONS.home
          : null),
    awayFormation:
      detail.lineups.away?.formation ??
      (useFinal
        ? FINAL_ESP_ARG_FORMATIONS.away
        : useDemo
          ? RSA_KOR_DEMO_FORMATIONS.away
          : null),
    homeTeamName: homeTeam?.name ?? params.homeTeamId,
    awayTeamName: awayTeam?.name ?? params.awayTeamId,
    hasLineup: homeLineup.length > 0 || awayLineup.length > 0,
    homeBench: detail.lineups.home?.substitutes ?? [],
    awayBench: detail.lineups.away?.substitutes ?? [],
  };
}