import { NextRequest, NextResponse } from "next/server";
import { captureRouteError, logInfo } from "@/lib/log";
import { fetchPlFixtures, plFixturesCacheControl } from "@/lib/pl/api";
import { getCached, setCached } from "@/lib/server/cache";

export const dynamic = "force-dynamic";

const ROUTE = "/api/pl/fixtures";

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
        "Cache-Control": plFixturesCacheControl(
          cached as Parameters<typeof plFixturesCacheControl>[0],
        ),
      },
    });
  }

  logInfo(ROUTE, "CACHE MISS");

  try {
    const body = await fetchPlFixtures(locale);
    setCached(cacheKey, body);

    return NextResponse.json(body, {
      headers: {
        "Cache-Control": plFixturesCacheControl(body),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    captureRouteError("api/pl/fixtures", error);

    return NextResponse.json(
      {
        configured: Boolean(process.env.API_FOOTBALL_KEY?.trim()),
        league: "Premier League",
        leagueId: 39,
        season: 2026,
        fixtures: [],
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        error: "Failed to fetch Premier League fixtures.",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
