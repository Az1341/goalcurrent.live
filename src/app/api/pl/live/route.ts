import { NextRequest, NextResponse } from "next/server";
import { captureRouteError, logInfo } from "@/lib/log";
import { fetchPlLive, plLiveCacheControl } from "@/lib/pl/endpoints";
import { getCached, setCached } from "@/lib/server/cache";

export const dynamic = "force-dynamic";

const ROUTE = "/api/pl/live";

function resolveRequestLocale(request: NextRequest): string {
  return (
    request.headers.get("accept-language")?.split(",")[0]?.trim() ?? "en-GB"
  );
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const locale = resolveRequestLocale(request);
  const cacheKey = `${request.url}|lang:${locale}`;
  const cached = getCached(cacheKey);
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
    const body = await fetchPlLive(locale);
    setCached(cacheKey, body);
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
