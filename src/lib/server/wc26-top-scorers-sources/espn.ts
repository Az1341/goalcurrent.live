import { getTeamDisplayName } from "@/lib/teamIdentity";
import type { ScorerGoalEvent } from "@/lib/wc26-top-scorers";
import type { Wc26SourceGoalFetchResult } from "./types";

const ESPN_SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?limit=200";

type EspnAthlete = {
  displayName?: string;
  fullName?: string;
};

type EspnCompetitor = {
  id?: string;
  homeAway?: string;
  team?: { displayName?: string; name?: string };
};

type EspnDetail = {
  scoringPlay?: boolean;
  ownGoal?: boolean;
  team?: { id?: string };
  athletesInvolved?: EspnAthlete[];
};

type EspnCompetition = {
  status?: { type?: { completed?: boolean; state?: string } };
  competitors?: EspnCompetitor[];
  details?: EspnDetail[];
};

type EspnEvent = {
  season?: { year?: number };
  competitions?: EspnCompetition[];
};

type EspnScoreboard = {
  events?: EspnEvent[];
};

function teamNameById(
  competitors: readonly EspnCompetitor[],
  teamId: string | undefined,
): string | null {
  if (!teamId) {
    return null;
  }

  for (const competitor of competitors) {
    if (competitor.id === teamId) {
      const name = competitor.team?.displayName ?? competitor.team?.name;
      return name?.trim() ?? null;
    }
  }

  return null;
}

function goalsFromEspnEvent(event: EspnEvent): ScorerGoalEvent[] {
  if (event.season?.year != null && event.season.year !== 2026) {
    return [];
  }

  const competition = event.competitions?.[0];
  if (!competition) {
    return [];
  }

  const completed =
    competition.status?.type?.completed === true ||
    competition.status?.type?.state === "post";
  if (!completed) {
    return [];
  }

  const competitors = competition.competitors ?? [];
  const goals: ScorerGoalEvent[] = [];

  for (const detail of competition.details ?? []) {
    if (!detail.scoringPlay) {
      continue;
    }

    const athlete = detail.athletesInvolved?.[0];
    const playerName =
      athlete?.displayName?.trim() || athlete?.fullName?.trim() || "";
    if (!playerName) {
      continue;
    }

    const teamId = detail.team?.id;
    let teamName = teamNameById(competitors, teamId);

    if (detail.ownGoal) {
      const opponent = competitors.find((entry) => entry.id !== teamId);
      teamName =
        opponent?.team?.displayName?.trim() ??
        opponent?.team?.name?.trim() ??
        teamName;
    }

    if (!teamName) {
      continue;
    }

    goals.push({
      playerName,
      teamName: getTeamDisplayName(teamName) ?? teamName,
      isOwnGoal: Boolean(detail.ownGoal),
    });
  }

  return goals;
}

/** ESPN FIFA World Cup scoreboard goal details. */
export async function fetchEspnWc26ScorerGoals(): Promise<Wc26SourceGoalFetchResult> {
  try {
    const res = await fetch(ESPN_SCOREBOARD_URL, {
      next: { revalidate: 0 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return { source: "espn", available: false, goals: [] };
    }

    const json = (await res.json()) as EspnScoreboard;
    const goals: ScorerGoalEvent[] = [];

    for (const event of json.events ?? []) {
      goals.push(...goalsFromEspnEvent(event));
    }

    return {
      source: "espn",
      available: true,
      goals,
    };
  } catch {
    return { source: "espn", available: false, goals: [] };
  }
}
