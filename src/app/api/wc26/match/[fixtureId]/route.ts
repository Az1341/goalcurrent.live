import { NextRequest, NextResponse } from "next/server";
import { getFixtureById } from "@/data/wc26";
import { getStaleApiCache, setSuccessApiCache } from "@/lib/api-football/cache";
import { apiFootballErrorMessage } from "@/lib/api-football/errors";
import { respondApiFootballFailure } from "@/lib/api-football/route-errors";
import { fetchWc26MatchDetail } from "@/lib/server/wc26-match-detail";
import { getCached } from "@/lib/server/cache";
import type { MatchDetailPayload } from "@/types/match-detail";

export const dynamic = "force-dynamic";

const MATCH_CACHE_CONTROL = "s-maxage=45, stale-while-revalidate=45";

type RouteParams = {
  params: Promise<{ fixtureId: string }>;
};

function emptyPayload(fixtureId: string): MatchDetailPayload {
  return {
    fixtureId,
    configured: Boolean(process.env.API_FOOTBALL_KEY?.trim()),
    apiAvailable: false,
    fetchedAt: new Date().toISOString(),
    events: [],
    lineups: { home: null, away: null },
    statistics: [],
  };
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { fixtureId: rawId } = await params;
  const fixtureId = decodeURIComponent(rawId);

  if (!getFixtureById(fixtureId)) {
    return NextResponse.json({ error: "Fixture not found" }, { status: 404 });
  }

  const cacheKey = `wc26-match:${fixtureId}`;

  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached as MatchDetailPayload, {
      headers: { "Cache-Control": MATCH_CACHE_CONTROL },
    });
  }

  try {
    const detail = await fetchWc26MatchDetail(fixtureId);
    setSuccessApiCache(cacheKey, detail, 30_000);

    return NextResponse.json(detail, {
      headers: { "Cache-Control": MATCH_CACHE_CONTROL },
    });
  } catch (error) {
    const staleBody = getStaleApiCache<MatchDetailPayload>(cacheKey);

    return respondApiFootballFailure({
      route: "api/wc26/match",
      error,
      staleBody,
      buildBody: (code, message, stale) => ({
        ...(stale && staleBody ? staleBody : emptyPayload(fixtureId)),
        error: code,
        message: message || apiFootballErrorMessage(code),
        stale,
        apiAvailable: false,
      }),
      cacheControl: "no-store",
    });
  }
}
