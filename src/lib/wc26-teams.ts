import { getTeamById } from "@/data/wc26";

/** Canonical team detail route for a WC26 team id (lowercase FIFA slug). */
export function teamHref(teamId: string): string {
  return `/worldcup2026/teams/${encodeURIComponent(teamId)}`;
}

export function isKnownTeamId(teamId: string): boolean {
  return Boolean(getTeamById(teamId));
}
