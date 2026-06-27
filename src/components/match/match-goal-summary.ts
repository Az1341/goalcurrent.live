import { formatEventMinute } from "@/lib/wc26-match";
import { isCountableGoal, isOwnGoalEvent } from "@/lib/wc26-goal-events";
import type { MatchEventItem } from "@/types/match-detail";
import { compareTimelineEvents, resolveEventSide } from "./timeline-event-badge";

export type GoalScorerLine = {
  readonly minute: string;
  readonly playerName: string;
  readonly symbol: string;
};

export type MatchGoalSummary = {
  readonly home: readonly GoalScorerLine[];
  readonly away: readonly GoalScorerLine[];
};

function goalScorerMeta(event: MatchEventItem): { symbol: string; playerName: string } {
  const playerName = event.playerName.trim() || "Goal";
  const detail = event.detail.toLowerCase();

  if (detail.includes("own") || isOwnGoalEvent(event)) {
    return { symbol: "🥅", playerName };
  }
  if (detail.includes("penalty")) {
    return { symbol: "🎯", playerName };
  }
  return { symbol: "⚽", playerName };
}

export function extractMatchGoalSummary(
  events: readonly MatchEventItem[],
  homeTeamName: string,
  awayTeamName: string,
  lineupHomeName?: string | null,
  lineupAwayName?: string | null,
  maxElapsedMinute?: number | null,
): MatchGoalSummary | null {
  const home: GoalScorerLine[] = [];
  const away: GoalScorerLine[] = [];
  const seen = new Set<string>();

  for (const event of [...events].sort(compareTimelineEvents)) {
    if (!isCountableGoal(event)) {
      continue;
    }

    if (
      maxElapsedMinute != null &&
      event.minute != null &&
      event.minute > maxElapsedMinute
    ) {
      continue;
    }

    const side = resolveEventSide(
      event.teamName,
      homeTeamName,
      awayTeamName,
      lineupHomeName,
      lineupAwayName,
    );
    if (side !== "home" && side !== "away") {
      continue;
    }

    const meta = goalScorerMeta(event);
    const minute = formatEventMinute(event.minute, event.extra);
    const dedupeKey = `${side}-${minute}-${meta.playerName}`;
    if (seen.has(dedupeKey)) {
      continue;
    }
    seen.add(dedupeKey);

    const line: GoalScorerLine = {
      minute,
      playerName: meta.playerName,
      symbol: meta.symbol,
    };

    if (side === "home") {
      home.push(line);
    } else {
      away.push(line);
    }
  }

  if (home.length === 0 && away.length === 0) {
    return null;
  }

  return { home, away };
}
