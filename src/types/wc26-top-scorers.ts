import type { TopScorerRow } from "@/lib/wc26-top-scorers";

export type Wc26TopScorersResponse = {
  readonly scorers: readonly TopScorerRow[];
  readonly totalGoals: number;
  readonly configured: boolean;
  readonly apiAvailable: boolean;
  readonly matchesProcessed: number;
  readonly matchesWithVerifiedEvents: number;
  readonly matchesExcluded: number;
  readonly fetchedAt: string;
};
