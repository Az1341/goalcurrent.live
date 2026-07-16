import { NextResponse } from "next/server";
import { validateGetQuery } from "@/lib/api/response";
import { emptyQuerySchema } from "@/lib/validation/schemas";
import { captureRouteError } from "@/lib/log";
import {
  fetchPlStatistics,
  plStatisticsCacheControl,
} from "@/lib/pl/endpoints";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const validated = validateGetQuery(request, emptyQuerySchema);
  if ("error" in validated) return validated.error;

  try {
    const body = await fetchPlStatistics();
    return NextResponse.json(body, {
      headers: { "Cache-Control": plStatisticsCacheControl(body) },
    });
  } catch (error) {
    captureRouteError("api/pl/statistics", error);
    return NextResponse.json(
      {
        configured: Boolean(process.env.API_FOOTBALL_KEY?.trim()),
        league: "Premier League",
        leagueId: 39,
        season: 2026,
        statistics: {
          topScorers: [],
          topAssists: [],
          cleanSheets: [],
          discipline: [],
        },
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        error: "Failed to fetch Premier League statistics.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
