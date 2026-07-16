import { NextRequest, NextResponse } from "next/server";
import { validateGetQuery } from "@/lib/api/response";
import { wc26ScoresQuerySchema } from "@/lib/validation/schemas";
import {
  ApiFootballRateLimitError,
  apiFootballErrorMessage,
  classifyApiFootballError,
} from "@/lib/api-football/errors";
import { getStaleApiCache, setSuccessApiCache } from "@/lib/api-football/cache";
import { respondApiFootballFailure } from "@/lib/api-football/route-errors";
import { logInfo } from "@/lib/log";
import { getCached, setCached } from "@/lib/server/cache";
import { registerWc26ApiFixtureIds } from "@/lib/server/wc26-api-fixture-registry";
import {
  fetchFinishedWc26Matches,
  fetchLiveWc26Matches,
  isMissingApiKeyError,
  isTournamentLive,
  isWc26ApiConfigured,
  MissingApiKeyError,
} from "@/lib/server/wc26-api-football";
import {
  applyAllConfirmedResultsToApiMatches,
  buildConfirmedStaticApiMatches,
} from "@/lib/wc26/confirmed-results";
import type { Wc26ScoresApiResponse } from "@/types/fixture-overlay";

export const dynamic = "force-dynamic";

const ROUTE = "/api/wc26/scores";

/** In-memory TTL for live score responses — must stay below client poll interval. */
const LIVE_SCORES_CACHE_TTL_MS = 15_000;

/** Stable cache key — /api/scores re-exports this handler but must share cache. */
function scoresCacheKey(request: NextRequest): string {
  return `${ROUTE}${request.nextUrl.search}`;
}

function unconfiguredResponse(): Wc26ScoresApiResponse {
  return {
    matches: buildConfirmedStaticApiMatches(),
    fetchedAt: new Date().toISOString(),
    configured: false,
    phase: "confirmed-static",
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

function scoresCacheControl(phase?: string): string {
  if (phase === "live") {
    return "s-maxage=10, stale-while-revalidate=5";
  }
  if (phase === "unconfigured" || phase === "rate-limited") {
    return "no-store";
  }
  return "s-maxage=300, stale-while-revalidate=60";
}

function scoresCacheTtlMs(phase?: string): number {
  if (phase === "live") {
    return LIVE_SCORES_CACHE_TTL_MS;
  }
  return 300_000;
}

function registerScoresApiFixtureIds(
  matches: Wc26ScoresApiResponse["matches"],
): void {
  registerWc26ApiFixtureIds(matches);
  for (const match of matches) {
    if (match.apiFixtureId != null && Number.isFinite(match.apiFixtureId)) {
      setCached(
        `wc26:api-fixture:${match.fixtureId}`,
        match.apiFixtureId,
        86_400_000,
      );
    }
  }
}

function jsonScores(
  body: Wc26ScoresApiResponse,
  cacheKey: string,
): NextResponse {
  registerScoresApiFixtureIds(body.matches);
  const ttlMs = scoresCacheTtlMs(body.phase);
  setSuccessApiCache(cacheKey, body, ttlMs);
  setCached(cacheKey, body, ttlMs);
  return NextResponse.json(body, {
    headers: { "Cache-Control": scoresCacheControl(body.phase) },
  });
}

function failureScoresBody(
  code: ReturnType<typeof classifyApiFootballError>,
  message: string,
  stale: boolean,
  staleBody?: Wc26ScoresApiResponse | null,
): Wc26ScoresApiResponse {
  if (stale && staleBody) {
    return {
      ...staleBody,
      error: code,
      message,
      stale: true,
      fetchedAt: staleBody.fetchedAt,
    };
  }

  return {
    ...emptyResponse("rate-limited"),
    error: code,
    message,
    stale: false,
  };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const validated = validateGetQuery(request, wc26ScoresQuerySchema);
  if ("error" in validated) return validated.error;

  const cacheKey = scoresCacheKey(request);
  const cached = getCached(cacheKey);
  if (cached) {
    logInfo(ROUTE, "CACHE HIT");
    const body = cached as Wc26ScoresApiResponse;
    registerScoresApiFixtureIds(body.matches);
    return NextResponse.json(body, {
      headers: { "Cache-Control": scoresCacheControl(body.phase) },
    });
  }

  logInfo(ROUTE, "CACHE MISS");

  const { live, results } = validated.data;

  const wantsLive = live === "true";
  const hasNoFilters =
    (live === undefined || live === "") && (results === undefined || results === "");
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
      const matches = applyAllConfirmedResultsToApiMatches(
        await fetchFinishedWc26Matches(),
      );
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

    if (error instanceof ApiFootballRateLimitError) {
      const staleBody = getStaleApiCache<Wc26ScoresApiResponse>(cacheKey);
      return respondApiFootballFailure({
        route: "api/wc26/scores",
        error,
        staleBody,
        buildBody: (code, msg, stale) =>
          failureScoresBody(code, msg, stale, staleBody),
        cacheControl: scoresCacheControl("rate-limited"),
      });
    }

    const staleBody = getStaleApiCache<Wc26ScoresApiResponse>(cacheKey);
    return respondApiFootballFailure({
      route: "api/wc26/scores",
      error,
      staleBody,
      buildBody: (code, msg, stale) =>
        failureScoresBody(
          code,
          msg || apiFootballErrorMessage(code),
          stale,
          staleBody,
        ),
      cacheControl: "no-store",
    });
  }
}
