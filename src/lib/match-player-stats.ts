import {
  resolveEventSide,
  resolveTimelineEventDisplay,
  type TimelineEventSide,
} from "@/components/match/timeline-event-badge";
import type {
  MatchEventItem,
  MatchLineupSide,
  MatchPlayerApiStat,
} from "@/types/match-detail";

export type MatchPlayerStatRow = {
  readonly playerName: string;
  readonly teamName: string;
  readonly teamSide: TimelineEventSide;
  readonly number: number | null;
  readonly position: string | null;
  readonly minutes: number | null;
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
  minutes: number | null;
  goals: number;
  assists: number;
  shots: number | null;
  shotsOnTarget: number | null;
  passAccuracy: string | null;
  fouls: number | null;
  yellowCards: number;
  redCards: number;
  substitutedOn: boolean;
  substitutedOff: boolean;
  rating: number | null;
  fromApi: boolean;
};

export type MatchPlayerStatsInput = {
  readonly events: readonly MatchEventItem[];
  readonly lineups: {
    readonly home: MatchLineupSide | null;
    readonly away: MatchLineupSide | null;
  };
  readonly playerStats?: readonly MatchPlayerApiStat[];
};

function normalizeName(value: string): string {
  return stripDiacritics(value.trim().toLowerCase());
}

function stripDiacritics(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "");
}

function isAbbreviatedName(name: string): boolean {
  return /^[\p{L}]\.\s+\S+/u.test(name.trim());
}

function parseAbbreviatedName(
  name: string,
): { initial: string; surname: string } | null {
  const match = name.trim().match(/^([\p{L}])\.?\s+(.+)$/u);
  if (!match) {
    return null;
  }
  return {
    initial: match[1].toLowerCase(),
    surname: normalizeName(match[2]),
  };
}

function getSurname(name: string): string {
  const parts = normalizeName(name).split(/\s+/).filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

function getFirstInitial(name: string): string {
  const parts = normalizeName(name).split(/\s+/).filter(Boolean);
  return parts[0]?.[0]?.toLowerCase() ?? "";
}

function namesReferToSamePlayer(left: string, right: string): boolean {
  const normalizedLeft = normalizeName(left);
  const normalizedRight = normalizeName(right);
  if (normalizedLeft === normalizedRight) {
    return true;
  }

  const abbrevLeft = parseAbbreviatedName(left);
  const abbrevRight = parseAbbreviatedName(right);

  if (abbrevLeft && !abbrevRight) {
    return (
      abbrevLeft.surname === getSurname(right) &&
      abbrevLeft.initial === getFirstInitial(right)
    );
  }

  if (abbrevRight && !abbrevLeft) {
    return (
      abbrevRight.surname === getSurname(left) &&
      abbrevRight.initial === getFirstInitial(left)
    );
  }

  return (
    getSurname(left) === getSurname(right) &&
    getFirstInitial(left) === getFirstInitial(right) &&
    getSurname(left) !== ""
  );
}

function preferDisplayName(left: string, right: string): string {
  const leftAbbrev = isAbbreviatedName(left);
  const rightAbbrev = isAbbreviatedName(right);
  if (leftAbbrev && !rightAbbrev) {
    return right.trim();
  }
  if (!leftAbbrev && rightAbbrev) {
    return left.trim();
  }
  return right.trim().length > left.trim().length ? right.trim() : left.trim();
}

function sameTeamName(left: string, right: string): boolean {
  return normalizeName(left) === normalizeName(right);
}

function playersShouldMerge(
  left: PlayerAccumulator,
  right: PlayerAccumulator,
): boolean {
  if (!sameTeamName(left.teamName, right.teamName)) {
    return false;
  }
  if (
    left.number != null &&
    right.number != null &&
    left.number === right.number
  ) {
    return true;
  }
  return namesReferToSamePlayer(left.playerName, right.playerName);
}

function mergePlayerEntries(
  target: PlayerAccumulator,
  source: PlayerAccumulator,
): void {
  target.playerName = preferDisplayName(target.playerName, source.playerName);
  target.teamSide =
    target.teamSide === "neutral" ? source.teamSide : target.teamSide;
  target.number = target.number ?? source.number;
  target.position = target.position ?? source.position;
  target.minutes =
    target.minutes == null
      ? source.minutes
      : source.minutes == null
        ? target.minutes
        : Math.max(target.minutes, source.minutes);
  target.goals = Math.max(target.goals, source.goals);
  target.assists = Math.max(target.assists, source.assists);
  target.shots = target.shots ?? source.shots;
  target.shotsOnTarget = target.shotsOnTarget ?? source.shotsOnTarget;
  target.passAccuracy = target.passAccuracy ?? source.passAccuracy;
  target.fouls =
    target.fouls == null
      ? source.fouls
      : source.fouls == null
        ? target.fouls
        : Math.max(target.fouls, source.fouls);
  target.yellowCards = Math.max(target.yellowCards, source.yellowCards);
  target.redCards = Math.max(target.redCards, source.redCards);
  target.substitutedOn = target.substitutedOn || source.substitutedOn;
  target.substitutedOff = target.substitutedOff || source.substitutedOff;
  target.rating = target.rating ?? source.rating;
  target.fromApi = target.fromApi || source.fromApi;
}

function dedupePlayerMap(map: Map<string, PlayerAccumulator>): void {
  const keys = [...map.keys()];
  const removed = new Set<string>();

  for (let index = 0; index < keys.length; index += 1) {
    const keyA = keys[index];
    if (removed.has(keyA)) {
      continue;
    }
    const entryA = map.get(keyA);
    if (!entryA) {
      continue;
    }

    for (let other = index + 1; other < keys.length; other += 1) {
      const keyB = keys[other];
      if (removed.has(keyB)) {
        continue;
      }
      const entryB = map.get(keyB);
      if (!entryB || !playersShouldMerge(entryA, entryB)) {
        continue;
      }

      mergePlayerEntries(entryA, entryB);
      map.delete(keyB);
      removed.add(keyB);
    }
  }
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
    minutes: null,
    goals: 0,
    assists: 0,
    shots: null,
    shotsOnTarget: null,
    passAccuracy: null,
    fouls: null,
    yellowCards: 0,
    redCards: 0,
    substitutedOn: false,
    substitutedOff: false,
    rating: null,
    fromApi: false,
  };
  map.set(key, created);
  return created;
}

function seedApiPlayerStats(
  map: Map<string, PlayerAccumulator>,
  rows: readonly MatchPlayerApiStat[],
  homeTeamName: string,
  awayTeamName: string,
  lineupHomeName: string | null,
  lineupAwayName: string | null,
): void {
  for (const api of rows) {
    const teamSide = resolveEventSide(
      api.teamName,
      homeTeamName,
      awayTeamName,
      lineupHomeName,
      lineupAwayName,
    );

    const entry = ensurePlayer(map, api.playerName, api.teamName, teamSide);
    entry.fromApi = true;
    entry.number = api.number ?? entry.number;
    entry.position = api.position ?? entry.position;
    entry.minutes = api.minutes ?? entry.minutes;
    entry.goals = api.goals ?? 0;
    entry.assists = api.assists ?? 0;
    entry.shots = api.shots ?? entry.shots;
    entry.shotsOnTarget = api.shotsOnTarget ?? entry.shotsOnTarget;
    entry.passAccuracy = api.passAccuracy ?? entry.passAccuracy;
    entry.fouls = api.fouls ?? entry.fouls;
    entry.yellowCards = api.yellowCards ?? 0;
    entry.redCards = api.redCards ?? 0;
    entry.substitutedOn = entry.substitutedOn || api.substituted;
    entry.rating = api.rating ?? entry.rating;
  }
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
    entry.rating = entry.rating ?? player.rating ?? null;
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

function applyEventStats(
  map: Map<string, PlayerAccumulator>,
  events: readonly MatchEventItem[],
  homeTeamName: string,
  awayTeamName: string,
  lineupHomeName: string | null,
  lineupAwayName: string | null,
  hasApiStats: boolean,
): void {
  const eventGoals = new Map<string, number>();
  const eventAssists = new Map<string, number>();
  const eventFouls = new Map<string, number>();
  const eventYellow = new Map<string, number>();
  const eventRed = new Map<string, number>();

  for (const event of events) {
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
      const key = playerKey(display.playerName, event.teamName);
      eventGoals.set(key, (eventGoals.get(key) ?? 0) + 1);
      ensurePlayer(map, display.playerName, event.teamName, teamSide);

      const assistName = event.assistName?.trim();
      if (assistName) {
        const assistKey = playerKey(assistName, event.teamName);
        eventAssists.set(assistKey, (eventAssists.get(assistKey) ?? 0) + 1);
        ensurePlayer(map, assistName, event.teamName, teamSide);
      }
      continue;
    }

    if (type === "card" && display.playerName) {
      const key = playerKey(display.playerName, event.teamName);
      ensurePlayer(map, display.playerName, event.teamName, teamSide);
      if (isCardRed(detail)) {
        eventRed.set(key, (eventRed.get(key) ?? 0) + 1);
      } else if (isCardYellow(detail)) {
        eventYellow.set(key, (eventYellow.get(key) ?? 0) + 1);
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
      const key = playerKey(display.playerName, event.teamName);
      eventFouls.set(key, (eventFouls.get(key) ?? 0) + 1);
      ensurePlayer(map, display.playerName, event.teamName, teamSide);
    }
  }

  for (const [key, entry] of map.entries()) {
    const goalsFromEvents = eventGoals.get(key) ?? 0;
    const assistsFromEvents = eventAssists.get(key) ?? 0;

    if (hasApiStats) {
      entry.goals = Math.max(entry.goals, goalsFromEvents);
      entry.assists = Math.max(entry.assists, assistsFromEvents);
      entry.yellowCards = Math.max(entry.yellowCards, eventYellow.get(key) ?? 0);
      entry.redCards = Math.max(entry.redCards, eventRed.get(key) ?? 0);
      const foulCount = eventFouls.get(key);
      if (foulCount != null) {
        entry.fouls = Math.max(entry.fouls ?? 0, foulCount);
      }
    } else {
      entry.goals = goalsFromEvents;
      entry.assists = assistsFromEvents;
      entry.yellowCards = eventYellow.get(key) ?? 0;
      entry.redCards = eventRed.get(key) ?? 0;
      const foulCount = eventFouls.get(key) ?? 0;
      entry.fouls = foulCount > 0 ? foulCount : null;
    }
  }
}

function hasTrackedActivity(row: MatchPlayerStatRow): boolean {
  return (
    row.goals > 0 ||
    row.assists > 0 ||
    (row.fouls ?? 0) > 0 ||
    row.yellowCards > 0 ||
    row.redCards > 0 ||
    row.substitutedOn ||
    row.substitutedOff ||
    (row.minutes ?? 0) > 0 ||
    row.shots != null ||
    row.shotsOnTarget != null ||
    row.passAccuracy != null ||
    row.rating != null
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
  if ((right.rating ?? 0) !== (left.rating ?? 0)) {
    return (right.rating ?? 0) - (left.rating ?? 0);
  }
  if (right.teamSide !== left.teamSide) {
    if (left.teamSide === "home") return -1;
    if (right.teamSide === "home") return 1;
  }
  return left.playerName.localeCompare(right.playerName, undefined, {
    sensitivity: "base",
  });
}

function toRow(entry: PlayerAccumulator): MatchPlayerStatRow {
  return {
    playerName: entry.playerName,
    teamName: entry.teamName,
    teamSide: entry.teamSide,
    number: entry.number,
    position: entry.position,
    minutes: entry.minutes,
    goals: entry.goals,
    assists: entry.assists,
    shots: entry.shots,
    shotsOnTarget: entry.shotsOnTarget,
    passAccuracy: entry.passAccuracy,
    fouls: entry.fouls,
    yellowCards: entry.yellowCards,
    redCards: entry.redCards,
    substitutedOn: entry.substitutedOn,
    substitutedOff: entry.substitutedOff,
    rating: entry.rating,
  };
}

/** Merge API player stats with timeline events and lineups. */
export function aggregateMatchPlayerStats(
  input: MatchPlayerStatsInput,
  homeTeamName: string,
  awayTeamName: string,
): MatchPlayerStatRow[] {
  const map = new Map<string, PlayerAccumulator>();
  const lineupHomeName = input.lineups.home?.teamName ?? null;
  const lineupAwayName = input.lineups.away?.teamName ?? null;
  const hasApiStats = (input.playerStats?.length ?? 0) > 0;

  if (hasApiStats && input.playerStats) {
    seedApiPlayerStats(
      map,
      input.playerStats,
      homeTeamName,
      awayTeamName,
      lineupHomeName,
      lineupAwayName,
    );
  }

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

  applyEventStats(
    map,
    input.events,
    homeTeamName,
    awayTeamName,
    lineupHomeName,
    lineupAwayName,
    hasApiStats,
  );

  dedupePlayerMap(map);

  const rows = Array.from(map.values()).map(toRow);

  if (hasApiStats) {
    return rows.filter(hasTrackedActivity).sort(comparePlayerRows);
  }

  return rows
    .filter(
      (row) =>
        row.goals > 0 ||
        row.assists > 0 ||
        (row.fouls ?? 0) > 0 ||
        row.yellowCards > 0 ||
        row.redCards > 0 ||
        row.substitutedOn ||
        row.substitutedOff,
    )
    .sort(comparePlayerRows);
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
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }
  return String(value);
}
