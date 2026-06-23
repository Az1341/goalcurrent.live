import { NextRequest, NextResponse } from "next/server";
import {
  fetchFinishedWc26Matches,
  fetchLiveWc26Matches,
  isMissingApiKeyError,
  isTournamentLive,
  isWc26ApiConfigured,
  MissingApiKeyError,
} from "@/lib/server/wc26-api-football";
import type { Wc26ScoresApiResponse } from "@/types/fixture-overlay";

export const dynamic = "force-dynamic";

function unconfiguredResponse(): Wc26ScoresApiResponse {
  return {
    matches: [],
    fetchedAt: new Date().toISOString(),
    configured: false,
    phase: "unconfigured",
  };
}

function emptyResponse(phase?: string): Wc26ScoresApiResponse {
  return {
    matches: [],
    fetchedAt: new Date().toISOString(),
    configured: phase === "unconfigured" ? false : isWc26ApiConfigured(),
    phase,
  };
}

function isUpstreamQuotaError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("ratelimit") ||
    lower.includes("too many requests") ||
    lower.includes("request limit")
  );
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const live = searchParams.get("live");
  const results = searchParams.get("results");

  // Default (no query params): finished World Cup results — same as ?results=wc.
  // Explicit ?live=true or ?results=wc still behave as before.
  const wantsLive = live === "true";
  const hasNoFilters =
    (live === null || live === "") && (results === null || results === "");
  const wantsResults = results === "wc" || hasNoFilters;

  if (!isWc26ApiConfigured()) {
    return NextResponse.json(unconfiguredResponse(), {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    if (wantsLive) {
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

    if (wantsResults) {
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

    if (
      error instanceof MissingApiKeyError ||
      isMissingApiKeyError(message)
    ) {
      return NextResponse.json(unconfiguredResponse(), {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      });
    }

    console.error("[api/wc26/scores]", message);

    if (isUpstreamQuotaError(message)) {
      return NextResponse.json(emptyResponse("rate-limited"), {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch WC26 match data", detail: message },
      { status: 500 },
    );
  }
}
