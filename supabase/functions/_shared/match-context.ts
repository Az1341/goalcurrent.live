type MatchRow = {
  id: number;
  home_team_name: string;
  away_team_name: string;
  home_score: number | null;
  away_score: number | null;
  status: string;
};

type EventRow = {
  id: string;
  minute: number;
  minute_extra: number;
  team_name: string | null;
  event_type: string;
  player_name: string | null;
  detail: string | null;
};

type StatRow = {
  id: string;
  team_id: number;
  provider_stat_name: string;
  stat_key: string;
  stat_value_raw: string;
};

type LineupRow = {
  id: string;
  team_id: number;
  player_name: string;
  position: string | null;
  formation: string | null;
};

export type MatchContextBundle = {
  match: MatchRow;
  events: EventRow[];
  statistics: StatRow[];
  lineups: LineupRow[];
  sourceIndex: string;
};

export function buildMatchContext(data: MatchContextBundle): string {
  const { match, events, statistics, lineups } = data;
  let context = `MATCH: ${match.home_team_name} ${match.home_score ?? "-"} - ${match.away_score ?? "-"} ${match.away_team_name}\n`;
  context += `STATUS: ${match.status}\n`;
  context += `SOURCE INDEX: ${data.sourceIndex}\n\n`;

  context += "--- EVENTS ---\n";
  for (const event of events) {
    const extra = event.minute_extra > 0 ? `+${event.minute_extra}` : "";
    context += `[${event.id}] ${event.minute}${extra}' [${event.team_name ?? "?"}] ${event.event_type.toUpperCase()} - ${event.player_name ?? "?"} (${event.detail ?? ""})\n`;
  }

  context += "\n--- STATISTICS ---\n";
  for (const stat of statistics) {
    context += `[${stat.id}] team=${stat.team_id} ${stat.provider_stat_name}=${stat.stat_value_raw} (key=${stat.stat_key})\n`;
  }

  context += "\n--- LINEUPS ---\n";
  for (const player of lineups) {
    context += `[${player.id}] team=${player.team_id} ${player.player_name} (${player.position ?? "?"}) formation=${player.formation ?? "?"}\n`;
  }

  context += `\n--- MATCH REF ---\n[${match.id}] matches:${match.id}\n`;
  return context;
}

export function buildSourceIndex(
  matchId: number,
  events: EventRow[],
  statistics: StatRow[],
  lineups: LineupRow[],
): string {
  const parts = [`matches:${matchId}`];
  for (const event of events) parts.push(`match_events:${event.id}`);
  for (const stat of statistics) parts.push(`match_statistics:${stat.id}`);
  for (const player of lineups) parts.push(`match_lineups:${player.id}`);
  return parts.join(", ");
}
