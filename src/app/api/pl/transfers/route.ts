import { NextResponse } from "next/server";
import { validateGetQuery } from "@/lib/api/response";
import { emptyQuerySchema } from "@/lib/validation/schemas";
import { captureRouteError } from "@/lib/log";
import {
  fetchPlTransfers,
  plTransfersCacheControl,
} from "@/lib/pl/endpoints";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const validated = validateGetQuery(request, emptyQuerySchema);
  if ("error" in validated) return validated.error;

  try {
    const body = await fetchPlTransfers();
    return NextResponse.json(body, {
      headers: { "Cache-Control": plTransfersCacheControl(body) },
    });
  } catch (error) {
    captureRouteError("api/pl/transfers", error);
    return NextResponse.json(
      {
        configured: Boolean(process.env.API_FOOTBALL_KEY?.trim()),
        league: "Premier League",
        leagueId: 39,
        season: 2026,
        transfers: [],
        supported: false,
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        error: "Failed to fetch Premier League transfers.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
