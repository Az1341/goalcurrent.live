import { NextRequest, NextResponse } from "next/server";
import { fetchPlFixtures, plFixturesCacheControl } from "@/lib/pl/api";

export const dynamic = "force-dynamic";

function resolveRequestLocale(request: NextRequest): string {
  return (
    request.headers.get("accept-language")?.split(",")[0]?.trim() ?? "en-GB"
  );
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await fetchPlFixtures(resolveRequestLocale(request));

    return NextResponse.json(body, {
      headers: {
        "Cache-Control": plFixturesCacheControl(body),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/pl/fixtures]", message);

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
