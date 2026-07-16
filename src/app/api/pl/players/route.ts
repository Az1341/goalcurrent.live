import { NextResponse } from "next/server";
import { validateGetQuery } from "@/lib/api/response";
import { emptyQuerySchema } from "@/lib/validation/schemas";
import { captureRouteError } from "@/lib/log";
import { fetchPlPlayers, plPlayersCacheControl } from "@/lib/pl/endpoints";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const validated = validateGetQuery(request, emptyQuerySchema);
  if ("error" in validated) return validated.error;

  try {
    const body = await fetchPlPlayers();
    return NextResponse.json(body, {
      headers: { "Cache-Control": plPlayersCacheControl(body) },
    });
  } catch (error) {
    captureRouteError("api/pl/players", error);
    return NextResponse.json(
      {
        configured: Boolean(process.env.API_FOOTBALL_KEY?.trim()),
        league: "Premier League",
        leagueId: 39,
        season: 2026,
        players: [],
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        error: "Failed to fetch Premier League players.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
