import { NextResponse } from "next/server";
import { validateGetQuery } from "@/lib/api/response";
import { emptyQuerySchema } from "@/lib/validation/schemas";
import { captureRouteError } from "@/lib/log";
import {
  fetchPlDisciplinary,
  plLeaderboardCacheControl,
} from "@/lib/pl/endpoints";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const validated = validateGetQuery(request, emptyQuerySchema);
  if ("error" in validated) return validated.error;

  try {
    const body = await fetchPlDisciplinary();
    return NextResponse.json(body, {
      headers: { "Cache-Control": plLeaderboardCacheControl(body) },
    });
  } catch (error) {
    captureRouteError("api/pl/disciplinary", error);
    return NextResponse.json(
      {
        configured: Boolean(process.env.API_FOOTBALL_KEY?.trim()),
        league: "Premier League",
        leagueId: 39,
        season: 2026,
        leaders: [],
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        error: "Failed to fetch disciplinary stats.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
