import { fetchApiFootballWc26TopScorers } from "./api-football";
import { fetchEspnWc26ScorerGoals } from "./espn";
import { fetchLiveScoreWc26ScorerGoals } from "./livescore";
import { mergeTopScorerRowsFromSources, topScorerRowsFromGoalEvents } from "./normalize";
import { fetchScoreBatWc26ScorerGoals } from "./scorebat";
import type { Wc26SourceGoalFetchResult } from "./types";

export {
  fetchApiFootballWc26TopScorers,
  fetchWc26TopScorersRaw,
} from "./api-football";
export type { ApiFootballTopScorersResult, Wc26SourceGoalFetchResult } from "./types";

export type Wc26TopScorersSourceBreakdown = {
  readonly apiFootball: number;
  readonly scorebat: number;
  readonly espn: number;
  readonly livescore: number;
  readonly merged: number;
};

function countSourceScorers(source: Wc26SourceGoalFetchResult): number {
  if (!source.available || source.goals.length === 0) {
    return 0;
  }
  return topScorerRowsFromGoalEvents(source.goals).length;
}

/** Per-source scorer counts (before final pipeline tier selection). */
export async function fetchWc26TopScorersSourceBreakdown(
  mergedCount: number,
): Promise<Wc26TopScorersSourceBreakdown> {
  const [apiFootball, scorebat, espn, livescore] = await Promise.all([
    fetchApiFootballWc26TopScorers(),
    fetchScoreBatWc26ScorerGoals(),
    fetchEspnWc26ScorerGoals(),
    fetchLiveScoreWc26ScorerGoals(),
  ]);

  return {
    apiFootball: apiFootball.scorers.length,
    scorebat: countSourceScorers(scorebat),
    espn: countSourceScorers(espn),
    livescore: countSourceScorers(livescore),
    merged: mergedCount,
  };
}
const EMPTY_SOURCE_GOALS: Wc26SourceGoalFetchResult = {
  source: "scorebat",
  available: false,
  goals: [],
};

async function fetchSourceWithLogging(
  label: "SCOREBAT" | "ESPN" | "LIVESCORE",
  fetcher: () => Promise<Wc26SourceGoalFetchResult>,
  emptySource: Wc26SourceGoalFetchResult,
): Promise<Wc26SourceGoalFetchResult> {
  try {
    const result = await fetcher();
    const scorerCount = topScorerRowsFromGoalEvents(result.goals).length;
    console.info(`${label}: ${scorerCount} scorers returned`);
    return result;
  } catch (err) {
    console.error(`${label} ERROR`, err);
    return emptySource;
  }
}

/** Tier 2: merge ScoreBat, ESPN, and LiveScore goal events. */
export async function fetchMultiSourceWc26TopScorers() {
  const startedAt = Date.now();
  console.info(
    `WC26 top scorers multi-source: start ${new Date(startedAt).toISOString()}`,
  );

  const [scorebat, espn, livescore] = await Promise.all([
    fetchSourceWithLogging("SCOREBAT", fetchScoreBatWc26ScorerGoals, {
      ...EMPTY_SOURCE_GOALS,
      source: "scorebat",
    }),
    fetchSourceWithLogging("ESPN", fetchEspnWc26ScorerGoals, {
      ...EMPTY_SOURCE_GOALS,
      source: "espn",
    }),
    fetchSourceWithLogging("LIVESCORE", fetchLiveScoreWc26ScorerGoals, {
      ...EMPTY_SOURCE_GOALS,
      source: "livescore",
    }),
  ]);

  const scorers = mergeTopScorerRowsFromSources([scorebat, espn, livescore]);
  const apiAvailable = scorebat.available || espn.available || livescore.available;

  const endedAt = Date.now();
  console.info(
    `WC26 top scorers multi-source: end ${new Date(endedAt).toISOString()} duration ${endedAt - startedAt}ms`,
  );

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
