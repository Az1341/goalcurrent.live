import { NextRequest, NextResponse } from "next/server";
import { captureRouteError } from "@/lib/log";
import {
  apiFootballErrorMessage,
  classifyApiFootballError,
} from "@/lib/api-football/errors";
import { getFixtureById, getTeamById } from "@/data/wc26";
import {
  fetchLiveWc26Matches,
  isMissingApiKeyError,
  isTournamentLive,
  isWc26ApiConfigured,
  MissingApiKeyError,
} from "@/lib/server/wc26-api-football";
import type { Wc26ApiMatch, Wc26LiveFixturePayload } from "@/types/fixture-overlay";

export const dynamic = "force-dynamic";

function mapLiveMatch(match: Wc26ApiMatch): Wc26LiveFixturePayload | null {
  const fixture = getFixtureById(match.fixtureId);
  if (!fixture) {
    return null;
  }

  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);

  return {
    fixtureId: match.fixtureId,
    homeTeamId: fixture.homeTeamId,
    awayTeamId: fixture.awayTeamId,
    home: {
      name: home?.name ?? fixture.homeTeamId,
      goals: match.homeScore ?? 0,
    },
    away: {
      name: away?.name ?? fixture.awayTeamId,
      goals: match.awayScore ?? 0,
    },
    fixture: {
      status: { elapsed: match.elapsed },
    },
  };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const status = request.nextUrl.searchParams.get("status");

  if (status !== "LIVE") {
    return NextResponse.json([], {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=30" },
    });
  }

  if (!isWc26ApiConfigured() || !isTournamentLive()) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=30" },
    });
  }

  try {
    const matches = await fetchLiveWc26Matches();
    const fixtures = matches
      .map(mapLiveMatch)
      .filter((row): row is Wc26LiveFixturePayload => row != null);

    return NextResponse.json(fixtures, {
      headers: {
        "Cache-Control": "s-maxage=30, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    if (
      error instanceof MissingApiKeyError ||
      isMissingApiKeyError(
        error instanceof Error ? error.message : "Unknown error",
      )
    ) {
      return NextResponse.json([], {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const code = classifyApiFootballError(error);
    captureRouteError("api/wc26/fixtures", error);

    return NextResponse.json(
      {
        error: code,
        message: apiFootballErrorMessage(code),
        fixtures: [],
      },
      {
        status: code === "unknown_error" ? 500 : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
