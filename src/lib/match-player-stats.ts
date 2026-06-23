import {
  resolveEventSide,
  resolveTimelineEventDisplay,
  type TimelineEventSide,
} from "@/components/match/timeline-event-badge";
import type {
  MatchEventItem,
  MatchLineupSide,
} from "@/types/match-detail";

export type MatchPlayerStatRow = {
  readonly playerName: string;
  readonly teamName: string;
  readonly teamSide: TimelineEventSide;
  readonly number: number | null;
  readonly position: string | null;
  readonly goals: number;
  readonly assists: number;
  readonly shots: number | null;
  readonly shotsOnTarget: number | null;
  readonly passAccuracy: string | null;
  readonly fouls: number | null;
  readonly yellowCards: number;
  readonly redCards: number;
  readonly substitutedOn: boolean;
  readonly substitutedOff: boolean;
  readonly rating: number | null;
};

type PlayerAccumulator = {
  playerName: string;
  teamName: string;
  teamSide: TimelineEventSide;
  number: number | null;
  position: string | null;
  goals: number;
  assists: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
  substitutedOn: boolean;
  substitutedOff: boolean;
};

export type MatchPlayerStatsInput = {
  readonly events: readonly MatchEventItem[];
  readonly lineups: {
    readonly home: MatchLineupSide | null;
    readonly away: MatchLineupSide | null;
  };
};

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function playerKey(playerName: string, teamName: string): string {
  return `${normalizeName(playerName)}|${normalizeName(teamName)}`;
}

function ensurePlayer(
  map: Map<string, PlayerAccumulator>,
  playerName: string,
  teamName: string,
  teamSide: TimelineEventSide,
): PlayerAccumulator {
  const key = playerKey(playerName, teamName);
  const existing = map.get(key);
  if (existing) {
    return existing;
  }

  const created: PlayerAccumulator = {
    playerName: playerName.trim(),
    teamName: teamName.trim(),
    teamSide,
    number: null,
    position: null,
    goals: 0,
    assists: 0,
    fouls: 0,
    yellowCards: 0,
    redCards: 0,
    substitutedOn: false,
    substitutedOff: false,
  };
  map.set(key, created);
  return created;
}

function seedLineupSide(
  map: Map<string, PlayerAccumulator>,
  side: MatchLineupSide | null,
  teamSide: TimelineEventSide,
  homeTeamName: string,
  awayTeamName: string,
): void {
  if (!side) {
    return;
  }

  const resolvedSide =
    teamSide === "neutral"
      ? resolveEventSide(
          side.teamName,
          homeTeamName,
          awayTeamName,
          side.teamName,
          side.teamName,
        )
      : teamSide;

  for (const player of [...side.startXI, ...side.substitutes]) {
    const entry = ensurePlayer(
      map,
      player.name,
      side.teamName,
      resolvedSide === "neutral" ? teamSide : resolvedSide,
    );
    entry.number = entry.number ?? player.number;
    entry.position = entry.position ?? player.position;
  }
}

function isCardRed(detail: string): boolean {
  const normalized = detail.toLowerCase();
  return (
    normalized.includes("red") ||
    normalized.includes("yellow-red") ||
    normalized.includes("yellow red") ||
    normalized.includes("second yellow")
  );
}

function isCardYellow(detail: string): boolean {
  const normalized = detail.toLowerCase();
  return normalized.includes("yellow") && !isCardRed(normalized);
}

function hasTrackedActivity(row: MatchPlayerStatRow): boolean {
  return (
    row.goals > 0 ||
    row.assists > 0 ||
    (row.fouls ?? 0) > 0 ||
    row.yellowCards > 0 ||
    row.redCards > 0 ||
    row.substitutedOn ||
    row.substitutedOff
  );
}

function comparePlayerRows(
  left: MatchPlayerStatRow,
  right: MatchPlayerStatRow,
): number {
  if (right.goals !== left.goals) {
    return right.goals - left.goals;
  }
  if (right.assists !== left.assists) {
    return right.assists - left.assists;
  }
  if (right.teamSide !== left.teamSide) {
    if (left.teamSide === "home") return -1;
    if (right.teamSide === "home") return 1;
  }
  return left.playerName.localeCompare(right.playerName, undefined, {
    sensitivity: "base",
  });
}

/** Derive per-player match stats from timeline events and lineups (no API shape changes). */
export function aggregateMatchPlayerStats(
  input: MatchPlayerStatsInput,
  homeTeamName: string,
  awayTeamName: string,
): MatchPlayerStatRow[] {
  const map = new Map<string, PlayerAccumulator>();
  const lineupHomeName = input.lineups.home?.teamName ?? null;
  const lineupAwayName = input.lineups.away?.teamName ?? null;

  seedLineupSide(
    map,
    input.lineups.home,
    "home",
    homeTeamName,
    awayTeamName,
  );
  seedLineupSide(
    map,
    input.lineups.away,
    "away",
    homeTeamName,
    awayTeamName,
  );

  for (const event of input.events) {
    const display = resolveTimelineEventDisplay(event);
    if (display.isPeriod || !event.teamName.trim()) {
      continue;
    }

    const teamSide = resolveEventSide(
      event.teamName,
      homeTeamName,
      awayTeamName,
      lineupHomeName,
      lineupAwayName,
    );

    const type = event.type.toLowerCase();
    const detail = event.detail.toLowerCase();

    if (display.isGoal && display.playerName) {
      const scorer = ensurePlayer(
        map,
        display.playerName,
        event.teamName,
        teamSide,
      );
      scorer.goals += 1;

      const assistName = event.assistName?.trim();
      if (assistName) {
        const assister = ensurePlayer(map, assistName, event.teamName, teamSide);
        assister.assists += 1;
      }
      continue;
    }

    if (type === "card" && display.playerName) {
      const player = ensurePlayer(
        map,
        display.playerName,
        event.teamName,
        teamSide,
      );
      if (isCardRed(detail)) {
        player.redCards += 1;
      } else if (isCardYellow(detail)) {
        player.yellowCards += 1;
      }
      continue;
    }

    if ((type === "subst" || type === "substitution") && display.playerName) {
      const playerOn = ensurePlayer(
        map,
        display.playerName,
        event.teamName,
        teamSide,
      );
      playerOn.substitutedOn = true;

      const playerOffName = event.assistName?.trim();
      if (playerOffName) {
        const playerOff = ensurePlayer(
          map,
          playerOffName,
          event.teamName,
          teamSide,
        );
        playerOff.substitutedOff = true;
      }
      continue;
    }

    if (type.includes("foul") && display.playerName) {
      const player = ensurePlayer(
        map,
        display.playerName,
        event.teamName,
        teamSide,
      );
      player.fouls += 1;
    }
  }

  const rows: MatchPlayerStatRow[] = Array.from(map.values()).map((entry) => ({
    playerName: entry.playerName,
    teamName: entry.teamName,
    teamSide: entry.teamSide,
    number: entry.number,
    position: entry.position,
    goals: entry.goals,
    assists: entry.assists,
    shots: null,
    shotsOnTarget: null,
    passAccuracy: null,
    fouls: entry.fouls > 0 ? entry.fouls : null,
    yellowCards: entry.yellowCards,
    redCards: entry.redCards,
    substitutedOn: entry.substitutedOn,
    substitutedOff: entry.substitutedOff,
    rating: null,
  }));

  return rows.filter(hasTrackedActivity).sort(comparePlayerRows);
}

export function formatPlayerCards(row: MatchPlayerStatRow): string {
  if (row.yellowCards === 0 && row.redCards === 0) {
    return "—";
  }
  const parts: string[] = [];
  if (row.yellowCards > 0) {
    parts.push(`Y${row.yellowCards}`);
  }
  if (row.redCards > 0) {
    parts.push(`R${row.redCards}`);
  }
  return parts.join(" ");
}

export function formatPlayerSubstitution(row: MatchPlayerStatRow): string {
  if (row.substitutedOn && row.substitutedOff) {
    return "On / Off";
  }
  if (row.substitutedOn) {
    return "On";
  }
  if (row.substitutedOff) {
    return "Off";
  }
  return "—";
}

export function formatOptionalStat(value: string | number | null): string {
  if (value == null || value === "") {
    return "—";
  }
  return String(value);
}
