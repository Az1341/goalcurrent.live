import { NextRequest, NextResponse } from "next/server";
import { respondError, respondOk, validateGetQuery } from "@/lib/api/response";
import { debugEndpointQuerySchema } from "@/lib/validation/schemas";
import { isDebugAuthorized } from "@/lib/server/cache";

export const dynamic = "force-dynamic";

const BASE_URL = "https://v3.football.api-sports.io";
const WC_LEAGUE = 1;
const WC_SEASON = 2026;

const ENDPOINT_PATHS = {
  topscorers: `/players/topscorers?league=${WC_LEAGUE}&season=${WC_SEASON}`,
  events: `/fixtures/events?league=${WC_LEAGUE}&season=${WC_SEASON}`,
  fixtures: `/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}`,
} as const;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isDebugAuthorized(request)) {
    return respondError("unauthorized", "Unauthorized.", 401);
  }

  const query = validateGetQuery(request, debugEndpointQuerySchema);
  if ("error" in query) {
    return query.error;
  }
  const endpointParam = query.data.endpoint;

  const apiKey = process.env.API_FOOTBALL_KEY?.trim();
  if (!apiKey) {
    return respondError(
      "api_key_missing",
      "API_FOOTBALL_KEY is not configured.",
      500,
    );
  }

  const path = ENDPOINT_PATHS[endpointParam];
  const url = `${BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      headers: { "x-apisports-key": apiKey },
      cache: "no-store",
    });

    const data: unknown = await res.json();

    if (!res.ok) {
      return respondError(
        "upstream_error",
        `api-sports ${res.status}`,
        res.status,
      );
    }

    return respondOk(
      {
        endpoint: endpointParam,
        url,
        data,
      },
      { headers: NO_STORE_HEADERS },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return respondError("debug_fetch_failed", message, 500);
  }
}
