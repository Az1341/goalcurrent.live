import type { TeamId } from "@/types/team";

/**
 * Ticker-only short labels. Official names are used everywhere else.
 * Only override when the full name is too long for the ribbon — never truncate with "...".
 */
const TICKER_TEAM_NAMES: Partial<Record<TeamId, string>> = {
  bih: "Bosnia",
  kor: "Korea Rep.",
  civ: "Ivory Coast",
};

export function formatTickerTeamName(teamId: TeamId, officialName: string): string {
  return TICKER_TEAM_NAMES[teamId] ?? officialName;
}

/**
 * Fewer visible matches beats broken names.
 * Desktop (wide): up to 4 · mid desktop: 3 · tablet: 3 · mobile: 2
 */
export function getRibbonVisibleLimit(width: number): number {
  if (width >= 1536) {
    return 4;
  }
  if (width >= 768) {
    return 3;
  }
  return 2;
}

/** Full match label for link title / screen readers (always official names). */
export function formatTickerMatchTitle(
  homeOfficial: string,
  awayOfficial: string,
  score: string | null,
): string {
  if (score) {
    return `${homeOfficial} ${score} ${awayOfficial}`;
  }
  return `${homeOfficial} vs ${awayOfficial}`;
}
