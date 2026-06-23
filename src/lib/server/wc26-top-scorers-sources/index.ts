import { fetchApiFootballWc26TopScorers } from "./api-football";
import { fetchEspnWc26ScorerGoals } from "./espn";
import { fetchLiveScoreWc26ScorerGoals } from "./livescore";
import { mergeTopScorerRowsFromSources } from "./normalize";
import { fetchScoreBatWc26ScorerGoals } from "./scorebat";

export { fetchApiFootballWc26TopScorers } from "./api-football";
export type { ApiFootballTopScorersResult, Wc26SourceGoalFetchResult } from "./types";

/** Tier 2: merge ScoreBat, ESPN, and LiveScore goal events. */
export async function fetchMultiSourceWc26TopScorers() {
  const [scorebat, espn, livescore] = await Promise.all([
    fetchScoreBatWc26ScorerGoals(),
    fetchEspnWc26ScorerGoals(),
    fetchLiveScoreWc26ScorerGoals(),
  ]);

  const scorers = mergeTopScorerRowsFromSources([scorebat, espn, livescore]);
  const apiAvailable = scorebat.available || espn.available || livescore.available;

  return {
    scorers,
    totalGoals: scorers.reduce((sum, row) => sum + row.goals, 0),
    apiAvailable,
    sources: {
      scorebat: scorebat.available,
      espn: espn.available,
      livescore: livescore.available,
    },
  };
}
