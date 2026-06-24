import { NextRequest, NextResponse } from "next/server";
import {
  fetchPlTopScorers,
  plLeaderboardCacheControl,
} from "@/lib/pl/endpoints";
import { getCached, setCached } from "@/lib/server/cache";

export const dynamic = "force-dynamic";

const ROUTE = "/api/pl/top-scorers";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const cacheKey = request.url;
  const cached = getCached(cacheKey);
  if (cached) {
    console.info(`CACHE HIT: ${ROUTE}`);
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": plLeaderboardCacheControl(
          cached as Parameters<typeof plLeaderboardCacheControl>[0],
        ),
      },
    });
  }

  console.info(`CACHE MISS: ${ROUTE}`);

  try {
    const body = await fetchPlTopScorers();
    setCached(cacheKey, body);
    return NextResponse.json(body, {
      headers: { "Cache-Control": plLeaderboardCacheControl(body) },
    });
  } catch (error) {
    console.error("[api/pl/top-scorers]", error);
    return NextResponse.json(
      {
        configured: Boolean(process.env.API_FOOTBALL_KEY?.trim()),
        league: "Premier League",
        leagueId: 39,
        season: 2026,
        leaders: [],
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        error: "Failed to fetch top scorers.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
