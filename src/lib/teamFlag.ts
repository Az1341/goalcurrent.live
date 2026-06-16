import { getTeamById } from "@/data/wc26";
import type { TeamId } from "@/types/team";

const FLAG_BASE = "/flags/4x3";

/** Public flag asset path for a WC26 team id, or undefined when unknown / no flagCode. */
export function getTeamFlagSrc(teamId: TeamId): string | undefined {
  const team = getTeamById(teamId);
  const flagCode = team?.flagCode?.trim();
  if (!flagCode) {
    return undefined;
  }
  return `${FLAG_BASE}/${flagCode}.svg`;
}

/** Accessible alt text label for a team flag image. */
export function getTeamFlagAlt(teamId: TeamId): string {
  const team = getTeamById(teamId);
  return team?.name ?? teamId;
}
