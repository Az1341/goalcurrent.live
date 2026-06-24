import { NextResponse } from "next/server";
import { getStaleApiCache, setSuccessApiCache } from "@/lib/api-football/cache";
import { apiFootballErrorMessage } from "@/lib/api-football/errors";
import { respondApiFootballFailure } from "@/lib/api-football/route-errors";
import { fetchPlStandings, plStandingsCacheControl } from "@/lib/pl/api";
import { PL_LEAGUE_ID, PL_LEAGUE_NAME, PL_SEASON } from "@/lib/pl/constants";
import type { PlStandingsApiResponse } from "@/lib/pl/types";

export const dynamic = "force-dynamic";

const ROUTE = "api/pl/standings";

export async function GET(): Promise<NextResponse> {
  const cacheKey = ROUTE;

  try {
    const body = await fetchPlStandings();
    setSuccessApiCache(cacheKey, body);

    return NextResponse.json(body, {
      headers: {
        "Cache-Control": plStandingsCacheControl(body),
      },
    });
  } catch (error) {
    const staleBody = getStaleApiCache<PlStandingsApiResponse>(cacheKey);

    return respondApiFootballFailure({
      route: ROUTE,
      error,
      staleBody,
      buildBody: (code, message, stale): PlStandingsApiResponse => ({
        configured: Boolean(process.env.API_FOOTBALL_KEY?.trim()),
        league: PL_LEAGUE_NAME,
        leagueId: PL_LEAGUE_ID,
        season: PL_SEASON,
        standings: stale && staleBody ? staleBody.standings : [],
        source: "fallback",
        fetchedAt: stale && staleBody ? staleBody.fetchedAt : new Date().toISOString(),
        error: message || apiFootballErrorMessage(code),
        errorCode: code,
        stale,
      }),
    });
  }
}
