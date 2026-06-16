import { NextRequest, NextResponse } from "next/server";
import {
  fetchFinishedWc26Matches,
  fetchLiveWc26Matches,
  isTournamentLive,
  isWc26ApiConfigured,
} from "@/lib/server/wc26-api-football";
import type { Wc26ScoresApiResponse } from "@/types/fixture-overlay";

export const dynamic = "force-dynamic";

function emptyResponse(phase?: string): Wc26ScoresApiResponse {
  return {
    matches: [],
    fetchedAt: new Date().toISOString(),
    configured: isWc26ApiConfigured(),
    phase,
  };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const live = searchParams.get("live");
  const results = searchParams.get("results");

  if (!isWc26ApiConfigured()) {
    return NextResponse.json(emptyResponse("unconfigured"), {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    if (live === "true") {
      if (!isTournamentLive()) {
        return NextResponse.json(emptyResponse("pre-tournament"), {
          headers: {
            "Cache-Control": "s-maxage=30, stale-while-revalidate=30",
          },
        });
      }

      const matches = await fetchLiveWc26Matches();
      const body: Wc26ScoresApiResponse = {
        matches,
        fetchedAt: new Date().toISOString(),
        configured: true,
        phase: "live",
      };

      return NextResponse.json(body, {
        headers: {
          "Cache-Control": "s-maxage=30, stale-while-revalidate=30",
        },
      });
    }

    if (results === "wc") {
      const matches = await fetchFinishedWc26Matches();
      const body: Wc26ScoresApiResponse = {
        matches,
        fetchedAt: new Date().toISOString(),
        configured: true,
        phase: "results",
      };

      return NextResponse.json(body, {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
        },
      });
    }

    return NextResponse.json(
      { error: "Unsupported query. Use ?results=wc or ?live=true" },
      { status: 400 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/wc26/scores]", message);
    return NextResponse.json(
      { error: "Failed to fetch WC26 match data", detail: message },
      { status: 500 },
    );
  }
}
