import { NextRequest, NextResponse } from "next/server";
import { validateGetQuery } from "@/lib/api/response";
import { emptyQuerySchema } from "@/lib/validation/schemas";
import { captureRouteError, logInfo } from "@/lib/log";
import {
  fetchPlTopScorers,
  plLeaderboardCacheControl,
} from "@/lib/pl/endpoints";
import { getCached, setCached } from "@/lib/server/cache";

export const dynamic = "force-dynamic";

const ROUTE = "/api/pl/top-scorers";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const validated = validateGetQuery(request, emptyQuerySchema);
  if ("error" in validated) return validated.error;

  const cacheKey = request.url;
  const cached = getCached(cacheKey);
  if (cached) {
    logInfo(ROUTE, "CACHE HIT");
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": plLeaderboardCacheControl(
          cached as Parameters<typeof plLeaderboardCacheControl>[0],
        ),
      },
    });
  }

  logInfo(ROUTE, "CACHE MISS");

  try {
    const body = await fetchPlTopScorers();
    setCached(cacheKey, body);
    return NextResponse.json(body, {
      headers: { "Cache-Control": plLeaderboardCacheControl(body) },
    });
  } catch (error) {
    captureRouteError("api/pl/top-scorers", error);
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
