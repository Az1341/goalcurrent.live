import { resolveTeamId } from "@/lib/teamIdentity";
import type { TopScorerRow } from "@/lib/wc26-top-scorers";
import type { TeamId } from "@/types/team";

export function filterTopScorersForTeams(
  scorers: readonly TopScorerRow[],
  teamIds: ReadonlySet<TeamId>,
  limit: number,
): TopScorerRow[] {
  const filtered = scorers.filter((row) => {
    const teamId = resolveTeamId(row.teamName);
    return teamId != null && teamIds.has(teamId);
  });

  return filtered.slice(0, limit).map((row, index) => ({
    ...row,
    rank: index + 1,
  }));
}
