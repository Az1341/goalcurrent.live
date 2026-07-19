import { apiFootballFetch } from "../_shared/api-football.ts";
import { authorizeIngestion } from "../_shared/auth.ts";
import { buildEventFingerprint } from "../_shared/event-fingerprint.ts";
import { jsonResponse } from "../_shared/json-response.ts";
import { mapApiFootballStatus } from "../_shared/status.ts";
import { normaliseStatKey, parseStatNumeric } from "../_shared/stat-key.ts";
import { createAdminClient } from "../_shared/supabase-admin.ts";

type ApiFixture = {
  fixture: {
    id: number;
    referee: string | null;
    date: string;
    venue: { id: number | null; name: string | null; city: string | null };
    status: { long: string; short: string; elapsed: number | null };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string | null;
  };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
};

type ApiEvent = {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string };
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: string;
  detail: string;
  comments: string | null;
};

type ApiStatistic = {
  team: { id: number; name: string };
  statistics: { type: string; value: string | null }[];
};

type ApiLineup = {
  team: { id: number; name: string };
  coach: { id: number | null; name: string | null };
  formation: string | null;
  startXI: { player: { id: number; name: string; number: number | null; pos: string | null; grid: string | null } }[];
  substitutes: { player: { id: number; name: string; number: number | null; pos: string | null; grid: string | null } }[];
};

function normaliseEventType(type: string): string {
  return type.trim().toLowerCase().replace(/\s+/g, "_");
}

async function upsertReferenceData(fixture: ApiFixture) {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  await supabase.from("competitions").upsert(
    {
      id: fixture.league.id,
      name: fixture.league.name,
      country: fixture.league.country,
      logo_url: fixture.league.logo,
      flag_url: fixture.league.flag,
      updated_at: now,
    },
    { onConflict: "id" },
  );

  for (const team of [fixture.teams.home, fixture.teams.away]) {
    await supabase.from("teams").upsert(
      {
        id: team.id,
        name: team.name,
        logo_url: team.logo,
        updated_at: now,
      },
      { onConflict: "id" },
    );
  }

  const venue = fixture.fixture.venue;
  if (venue?.id) {
    await supabase.from("venues").upsert(
      {
        id: venue.id,
        name: venue.name ?? "Unknown venue",
        city: venue.city,
        updated_at: now,
      },
      { onConflict: "id" },
    );
  }
}

async function upsertMatch(fixture: ApiFixture) {
  const supabase = createAdminClient();
  const winnerTeamId =
    fixture.teams.home.winner === true
      ? fixture.teams.home.id
      : fixture.teams.away.winner === true
        ? fixture.teams.away.id
        : null;

  const { error } = await supabase.from("matches").upsert(
    {
      id: fixture.fixture.id,
      competition_id: fixture.league.id,
      season: fixture.league.season,
      round: fixture.league.round,
      home_team_id: fixture.teams.home.id,
      away_team_id: fixture.teams.away.id,
      home_team_name: fixture.teams.home.name,
      away_team_name: fixture.teams.away.name,
      home_team_logo: fixture.teams.home.logo,
      away_team_logo: fixture.teams.away.logo,
      venue_id: fixture.fixture.venue?.id ?? null,
      venue_name: fixture.fixture.venue?.name ?? null,
      venue_city: fixture.fixture.venue?.city ?? null,
      referee: fixture.fixture.referee ?? null,
      kickoff_time: fixture.fixture.date,
      api_status_short: fixture.fixture.status.short,
      api_status_long: fixture.fixture.status.long,
      status: mapApiFootballStatus(fixture.fixture.status.short),
      elapsed_minute: fixture.fixture.status.elapsed,
      extra_minute: null,
      home_score: fixture.goals.home,
      away_score: fixture.goals.away,
      halftime_home_score: fixture.score.halftime.home,
      halftime_away_score: fixture.score.halftime.away,
      fulltime_home_score: fixture.score.fulltime.home,
      fulltime_away_score: fixture.score.fulltime.away,
      extratime_home_score: fixture.score.extratime.home,
      extratime_away_score: fixture.score.extratime.away,
      penalty_home_score: fixture.score.penalty.home,
      penalty_away_score: fixture.score.penalty.away,
      winner_team_id: winnerTeamId,
      provider_updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(`Failed to upsert match ${fixture.fixture.id}: ${error.message}`);
  }
}

async function upsertEvents(matchId: number, events: ApiEvent[]) {
  if (events.length === 0) return;
  const supabase = createAdminClient();
  const activeFingerprints: string[] = [];
  const rows = [];

  for (const event of events) {
    const eventType = normaliseEventType(event.type);
    const minuteExtra = event.time.extra ?? 0;
    const fingerprint = await buildEventFingerprint({
      fixtureId: matchId,
      teamId: event.team.id,
      minute: event.time.elapsed,
      extraMinute: minuteExtra,
      eventType,
      detail: event.detail ?? null,
      playerId: event.player.id,
      assistId: event.assist?.id ?? null,
    });
    activeFingerprints.push(fingerprint);
    rows.push({
      match_id: matchId,
      event_fingerprint: fingerprint,
      team_id: event.team.id,
      team_name: event.team.name,
      event_type: eventType,
      minute: event.time.elapsed,
      minute_extra: minuteExtra,
      player_name: event.player.name,
      player_id: event.player.id,
      assist_name: event.assist?.name ?? null,
      assist_id: event.assist?.id ?? null,
      detail: event.detail ?? null,
      comments: event.comments,
      is_active: true,
      provider_payload: event,
    });
  }

  const { error } = await supabase.from("match_events").upsert(rows, {
    onConflict: "match_id,event_fingerprint",
  });
  if (error) {
    throw new Error(`Failed to upsert events for match ${matchId}: ${error.message}`);
  }

  const { data: existing } = await supabase
    .from("match_events")
    .select("id, event_fingerprint")
    .eq("match_id", matchId)
    .eq("is_active", true);

  const staleIds = (existing ?? [])
    .filter((row) => !activeFingerprints.includes(row.event_fingerprint))
    .map((row) => row.id);

  if (staleIds.length > 0) {
    await supabase.from("match_events").update({ is_active: false }).in("id", staleIds);
  }
}

async function upsertStatistics(matchId: number, statistics: ApiStatistic[]) {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const rows = [];

  for (const statGroup of statistics) {
    for (const stat of statGroup.statistics) {
      if (stat.value == null) continue;
      const providerStatName = stat.type.trim();
      rows.push({
        match_id: matchId,
        team_id: statGroup.team.id,
        provider_stat_name: providerStatName,
        stat_key: normaliseStatKey(providerStatName),
        stat_value_raw: stat.value,
        stat_value_numeric: parseStatNumeric(stat.value),
        provider_updated_at: now,
      });
    }
  }

  if (rows.length === 0) return;

  const { error } = await supabase.from("match_statistics").upsert(rows, {
    onConflict: "match_id,team_id,provider_stat_name",
  });
  if (error) {
    throw new Error(`Failed to upsert statistics for match ${matchId}: ${error.message}`);
  }
}

async function upsertLineups(matchId: number, lineups: ApiLineup[]) {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const rows = [];

  for (const lineup of lineups) {
    const formation = lineup.formation ?? null;
    const coachName = lineup.coach?.name ?? null;
    for (const entry of lineup.startXI) {
      rows.push({
        match_id: matchId,
        team_id: lineup.team.id,
        player_id: entry.player.id,
        player_name: entry.player.name,
        shirt_number: entry.player.number,
        position: entry.player.pos,
        grid_position: entry.player.grid,
        formation,
        coach_name: coachName,
        is_starter: true,
        is_active: true,
        provider_updated_at: now,
      });
    }
    for (const entry of lineup.substitutes) {
      rows.push({
        match_id: matchId,
        team_id: lineup.team.id,
        player_id: entry.player.id,
        player_name: entry.player.name,
        shirt_number: entry.player.number,
        position: entry.player.pos,
        grid_position: entry.player.grid,
        formation,
        coach_name: coachName,
        is_starter: false,
        is_active: true,
        provider_updated_at: now,
      });
    }
  }

  if (rows.length === 0) return;

  const { error } = await supabase.from("match_lineups").upsert(rows, {
    onConflict: "match_id,team_id,player_id,is_starter",
  });
  if (error) {
    throw new Error(`Failed to upsert lineups for match ${matchId}: ${error.message}`);
  }
}

export async function fetchAndStoreMatchData(matchId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const [fixtures, events, statistics, lineups] = await Promise.all([
      apiFootballFetch<ApiFixture>("/fixtures", { id: String(matchId) }),
      apiFootballFetch<ApiEvent>("/fixtures/events", { fixture: String(matchId) }),
      apiFootballFetch<ApiStatistic>("/fixtures/statistics", { fixture: String(matchId) }),
      apiFootballFetch<ApiLineup>("/fixtures/lineups", { fixture: String(matchId) }),
    ]);

    if (fixtures.length === 0) {
      return { success: false, error: `Match ${matchId} not found` };
    }

    const fixture = fixtures[0];
    await upsertReferenceData(fixture);
    await upsertMatch(fixture);
    await upsertEvents(matchId, events);
    await upsertStatistics(matchId, statistics);
    await upsertLineups(matchId, lineups);

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`fetch-match-data error for match ${matchId}:`, message);
    return { success: false, error: message };
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const auth = await authorizeIngestion(req);
  if (!auth.ok) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const body = await req.json();
    const matchId = body?.match_id;
    if (typeof matchId !== "number" || !Number.isFinite(matchId)) {
      return jsonResponse({ error: "match_id (number) is required" }, 400);
    }

    const result = await fetchAndStoreMatchData(matchId);
    return jsonResponse(result, result.success ? 200 : 500);
  } catch {
    return jsonResponse({ error: "Invalid request body" }, 400);
  }
});
