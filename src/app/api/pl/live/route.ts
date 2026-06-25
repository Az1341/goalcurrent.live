import { NextRequest, NextResponse } from "next/server";
import { captureRouteError, logInfo } from "@/lib/log";
import { fetchPlLive, plLiveCacheControl } from "@/lib/pl/endpoints";
import { getCached, setCached } from "@/lib/server/cache";

export const dynamic = "force-dynamic";

const ROUTE = "/api/pl/live";
const CACHE_KEY = "pl-live-scores";

export async function GET(_request: NextRequest): Promise<NextResponse> {
  const cached = getCached(CACHE_KEY);
  if (cached) {
    logInfo(ROUTE, "CACHE HIT");
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": plLiveCacheControl(
          cached as Parameters<typeof plLiveCacheControl>[0],
        ),
      },
    });
  }

  logInfo(ROUTE, "CACHE MISS");

  try {
    const body = await fetchPlLive("en-GB");
    setCached(CACHE_KEY, body);
    return NextResponse.json(body, {
      headers: { "Cache-Control": plLiveCacheControl(body) },
    });
  } catch (error) {
    captureRouteError("api/pl/live", error);
    return NextResponse.json(
      {
        configured: Boolean(process.env.API_FOOTBALL_KEY?.trim()),
        league: "Premier League",
        leagueId: 39,
        season: 2026,
        fixtures: [],
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        error: "Failed to fetch live Premier League matches.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
