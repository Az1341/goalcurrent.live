import type { TopScorerRow } from "@/lib/wc26-top-scorers";

export type Wc26TopScorerSourceId =
  | "api-football"
  | "scorebat"
  | "espn"
  | "livescore";

export type Wc26SourceGoalFetchResult = {
  readonly source: Wc26TopScorerSourceId;
  readonly available: boolean;
  readonly goals: readonly import("@/lib/wc26-top-scorers").ScorerGoalEvent[];
};

export type ApiFootballTopScorersResult = {
  readonly scorers: TopScorerRow[];
  readonly totalGoals: number;
  readonly apiAvailable: boolean;
  readonly matchesProcessed: number;
  readonly matchesWithVerifiedEvents: number;
  readonly matchesExcluded: number;
};
