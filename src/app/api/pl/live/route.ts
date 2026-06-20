import { NextRequest, NextResponse } from "next/server";
import { fetchPlLive, plLiveCacheControl } from "@/lib/pl/endpoints";

export const dynamic = "force-dynamic";

function resolveRequestLocale(request: NextRequest): string {
  return (
    request.headers.get("accept-language")?.split(",")[0]?.trim() ?? "en-GB"
  );
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await fetchPlLive(resolveRequestLocale(request));
    return NextResponse.json(body, {
      headers: { "Cache-Control": plLiveCacheControl(body) },
    });
  } catch (error) {
    console.error("[api/pl/live]", error);
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
