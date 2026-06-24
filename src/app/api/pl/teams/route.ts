import { NextResponse } from "next/server";
import { captureRouteError } from "@/lib/log";
import { fetchPlTeams, plTeamsCacheControl } from "@/lib/pl/endpoints";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const body = await fetchPlTeams();
    return NextResponse.json(body, {
      headers: { "Cache-Control": plTeamsCacheControl(body) },
    });
  } catch (error) {
    captureRouteError("api/pl/teams", error);
    return NextResponse.json(
      {
        configured: Boolean(process.env.API_FOOTBALL_KEY?.trim()),
        league: "Premier League",
        leagueId: 39,
        season: 2026,
        teams: [],
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        error: "Failed to fetch Premier League teams.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
