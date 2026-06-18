import type { TeamId } from "@/types/team";

/** Short labels for the header ribbon ticker only — official names everywhere else. */
const TICKER_TEAM_NAMES: Partial<Record<TeamId, string>> = {
  bih: "Bosnia",
  kor: "Korea Rep.",
  irn: "Iran",
  civ: "Ivory Coast",
};

export function formatTickerTeamName(teamId: TeamId, officialName: string): string {
  return TICKER_TEAM_NAMES[teamId] ?? officialName;
}

/** Visible match cap by viewport — mobile first (matches master-chrome breakpoints). */
export function getRibbonVisibleLimit(width: number): number {
  if (width >= 1024) {
    return 5;
  }
  if (width >= 768) {
    return 4;
  }
  return 3;
}
