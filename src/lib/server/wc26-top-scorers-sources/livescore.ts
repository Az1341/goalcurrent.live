import { getTeamDisplayName } from "@/lib/teamIdentity";
import type { ScorerGoalEvent } from "@/lib/wc26-top-scorers";
import type { Wc26SourceGoalFetchResult } from "./types";

const LIVESCORE_DATE_BASE =
  "https://prod-cdn-mev-api.livescore.com/v1/api/app/date";
const LIVESCORE_INCIDENTS_BASE =
  "https://prod-cdn-public-api.livescore.com/v1/api/app/incidents/soccer";

const TOURNAMENT_START = new Date("2026-06-11T00:00:00.000Z");
const INCIDENT_CONCURRENCY = 4;

type LiveScoreTeam = {
  Nm?: string;
};

type LiveScoreEvent = {
  Eid?: string;
  Epr?: number;
  Esid?: number;
  T1?: LiveScoreTeam[];
  T2?: LiveScoreTeam[];
};

type LiveScoreStage = {
  CompN?: string;
  Cnm?: string;
  Snm?: string;
  Events?: LiveScoreEvent[];
};

type LiveScoreDateResponse = {
  Stages?: LiveScoreStage[];
};

type LiveScoreIncident = {
  IT?: number;
  Pn?: string;
  Min?: number;
};

type LiveScoreIncidentsResponse = {
  Incs?: Record<string, LiveScoreIncident[]>;
};

function isWorldCupStage(stage: LiveScoreStage): boolean {
  const label = `${stage.CompN ?? ""} ${stage.Cnm ?? ""} ${stage.Snm ?? ""}`.toLowerCase();
  return label.includes("world cup") || label.includes("fifa");
}

function isFinishedEvent(event: LiveScoreEvent): boolean {
  return event.Epr === 2 || event.Esid === 6;
}

function formatDateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function tournamentDateKeys(now: Date = new Date()): string[] {
  const keys: string[] = [];
  const cursor = new Date(TOURNAMENT_START);
  const end = now > TOURNAMENT_START ? now : TOURNAMENT_START;

  while (cursor <= end) {
    keys.push(formatDateKey(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return keys;
}

function isGoalIncident(incident: LiveScoreIncident): boolean {
  const type = incident.IT ?? 0;
  return type === 1 || type === 2 || type === 3;
}

function goalsFromIncidents(
  payload: LiveScoreIncidentsResponse,
  homeTeam: string,
  awayTeam: string,
): ScorerGoalEvent[] {
  const goals: ScorerGoalEvent[] = [];

  for (const [side, incidents] of Object.entries(payload.Incs ?? {})) {
    const teamName = side === "1" ? homeTeam : awayTeam;
    for (const incident of incidents) {
      if (!isGoalIncident(incident)) {
        continue;
      }
      const playerName = incident.Pn?.trim();
      if (!playerName) {
        continue;
      }
      goals.push({
        playerName,
        teamName: getTeamDisplayName(teamName) ?? teamName,
        isOwnGoal: incident.IT === 2,
      });
    }
  }

  return goals;
}

async function fetchIncidentsForEvent(
  eventId: string,
  homeTeam: string,
  awayTeam: string,
): Promise<ScorerGoalEvent[]> {
  try {
    const res = await fetch(
      `${LIVESCORE_INCIDENTS_BASE}/${encodeURIComponent(eventId)}?locale=en`,
      { next: { revalidate: 0 } },
    );
    if (!res.ok) {
      return [];
    }
    const json = (await res.json()) as LiveScoreIncidentsResponse;
    return goalsFromIncidents(json, homeTeam, awayTeam);
  } catch {
    return [];
  }
}

async function mapWithConcurrency<T, R>(
  items: readonly T[],
  mapper: (item: T) => Promise<R>,
  concurrency: number,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index]!);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

async function fetchFinishedWorldCupEvents(): Promise<
  Array<{ eventId: string; homeTeam: string; awayTeam: string }>
> {
  const matches: Array<{ eventId: string; homeTeam: string; awayTeam: string }> =
    [];

  for (const dateKey of tournamentDateKeys()) {
    try {
      const res = await fetch(
        `${LIVESCORE_DATE_BASE}/${dateKey}/soccer/0?countryCode=US&locale=en`,
        { next: { revalidate: 0 } },
      );
      if (!res.ok) {
        continue;
      }

      const json = (await res.json()) as LiveScoreDateResponse;
      for (const stage of json.Stages ?? []) {
        if (!isWorldCupStage(stage)) {
          continue;
        }

        for (const event of stage.Events ?? []) {
          if (!isFinishedEvent(event)) {
            continue;
          }
          const eventId = event.Eid?.trim();
          const homeTeam = event.T1?.[0]?.Nm?.trim();
          const awayTeam = event.T2?.[0]?.Nm?.trim();
          if (!eventId || !homeTeam || !awayTeam) {
            continue;
          }
          matches.push({ eventId, homeTeam, awayTeam });
        }
      }
    } catch {
      continue;
    }
  }

  return matches;
}

/** LiveScore incidents feed for completed World Cup matches. */
export async function fetchLiveScoreWc26ScorerGoals(): Promise<Wc26SourceGoalFetchResult> {
  try {
    const matches = await fetchFinishedWorldCupEvents();
    if (matches.length === 0) {
      return { source: "livescore", available: true, goals: [] };
    }

    const goalLists = await mapWithConcurrency(
      matches,
      (match) =>
        fetchIncidentsForEvent(match.eventId, match.homeTeam, match.awayTeam),
      INCIDENT_CONCURRENCY,
    );

    const goals = goalLists.flat();
    return {
      source: "livescore",
      available: true,
      goals,
    };
  } catch {
    return { source: "livescore", available: false, goals: [] };
  }
}
