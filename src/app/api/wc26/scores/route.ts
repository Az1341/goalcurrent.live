import { NextRequest, NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/server/cache";
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

const ROUTE = "/api/wc26/scores";

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

function scoresCacheControl(phase?: string): string {
  if (phase === "live") {
    return "s-maxage=30, stale-while-revalidate=30";
  }
  if (phase === "unconfigured" || phase === "rate-limited") {
    return "no-store";
  }
  return "s-maxage=300, stale-while-revalidate=60";
}

function jsonScores(
  body: Wc26ScoresApiResponse,
  cacheKey: string,
): NextResponse {
  setCached(cacheKey, body);
  return NextResponse.json(body, {
    headers: { "Cache-Control": scoresCacheControl(body.phase) },
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const cacheKey = request.url;
  const cached = getCached(cacheKey);
  if (cached) {
    console.info(`CACHE HIT: ${ROUTE}`);
    const body = cached as Wc26ScoresApiResponse;
    return NextResponse.json(body, {
      headers: { "Cache-Control": scoresCacheControl(body.phase) },
    });
  }

  console.info(`CACHE MISS: ${ROUTE}`);

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
    return jsonScores(unconfiguredResponse(), cacheKey);
  }

  try {
    if (wantsLive) {
      if (!isTournamentLive()) {
        return jsonScores(emptyResponse("pre-tournament"), cacheKey);
      }

      const matches = await fetchLiveWc26Matches();
      const body: Wc26ScoresApiResponse = {
        matches,
        fetchedAt: new Date().toISOString(),
        configured: true,
        phase: "live",
      };

      return jsonScores(body, cacheKey);
    }

    if (wantsResults) {
      const matches = await fetchFinishedWc26Matches();
      const body: Wc26ScoresApiResponse = {
        matches,
        fetchedAt: new Date().toISOString(),
        configured: true,
        phase: "results",
      };

      return jsonScores(body, cacheKey);
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
      return jsonScores(unconfiguredResponse(), cacheKey);
    }

    console.error("[api/wc26/scores]", message);

    if (isUpstreamQuotaError(message)) {
      return jsonScores(emptyResponse("rate-limited"), cacheKey);
    }

    return NextResponse.json(
      { error: "Failed to fetch WC26 match data", detail: message },
      { status: 500 },
    );
  }
}
