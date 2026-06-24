import { NextRequest, NextResponse } from "next/server";
import { captureRouteError } from "@/lib/log";
import {
  fetchPlMatchDetail,
  plMatchCacheControl,
} from "@/lib/pl/match-detail";

export const dynamic = "force-dynamic";

type RouteParams = {
  params: Promise<{ fixtureId: string }>;
};

function resolveRequestLocale(request: NextRequest): string {
  return (
    request.headers.get("accept-language")?.split(",")[0]?.trim() ?? "en-GB"
  );
}

function parseFixtureId(raw: string): number | null {
  const id = Number.parseInt(raw, 10);
  if (!Number.isFinite(id) || id <= 0) return null;
  return id;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { fixtureId: rawId } = await params;
  const fixtureId = parseFixtureId(decodeURIComponent(rawId));

  if (fixtureId === null) {
    return NextResponse.json(
      { error: "Invalid fixture id." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const body = await fetchPlMatchDetail(
      fixtureId,
      resolveRequestLocale(request),
    );

    if (!body.fixture) {
      return NextResponse.json(body, {
        status: body.error?.includes("not found") ? 404 : 200,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.json(body, {
      headers: { "Cache-Control": plMatchCacheControl(body) },
    });
  } catch (error) {
    captureRouteError("api/pl/match", error);
    return NextResponse.json(
      {
        configured: Boolean(process.env.API_FOOTBALL_KEY?.trim()),
        league: "Premier League",
        leagueId: 39,
        season: 2026,
        fixtureId,
        fixture: null,
        apiAvailable: false,
        events: [],
        lineups: { home: null, away: null },
        statistics: [],
        h2h: [],
        standingsSnapshot: [],
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        error: "Failed to fetch match detail.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
