import { NextResponse } from "next/server";
import { captureRouteError } from "@/lib/log";
import {
  fetchPlCleanSheets,
  plLeaderboardCacheControl,
} from "@/lib/pl/endpoints";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const body = await fetchPlCleanSheets();
    return NextResponse.json(body, {
      headers: { "Cache-Control": plLeaderboardCacheControl(body) },
    });
  } catch (error) {
    captureRouteError("api/pl/clean-sheets", error);
    return NextResponse.json(
      {
        configured: Boolean(process.env.API_FOOTBALL_KEY?.trim()),
        league: "Premier League",
        leagueId: 39,
        season: 2026,
        leaders: [],
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        error: "Failed to fetch clean sheet leaders.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
