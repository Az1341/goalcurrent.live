import { NextResponse } from "next/server";
import { fetchPlStandings, plStandingsCacheControl } from "@/lib/pl/api";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const body = await fetchPlStandings();

    return NextResponse.json(body, {
      headers: {
        "Cache-Control": plStandingsCacheControl(body),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/pl/standings]", message);

    return NextResponse.json(
      {
        configured: Boolean(process.env.API_FOOTBALL_KEY?.trim()),
        league: "Premier League",
        leagueId: 39,
        season: 2026,
        standings: [],
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        error: "Failed to fetch Premier League standings.",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
