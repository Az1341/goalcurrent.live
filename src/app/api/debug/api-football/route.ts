import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = "https://v3.football.api-sports.io";
const WC_LEAGUE = 1;
const WC_SEASON = 2026;

const ENDPOINT_PATHS = {
  topscorers: `/players/topscorers?league=${WC_LEAGUE}&season=${WC_SEASON}`,
  events: `/fixtures/events?league=${WC_LEAGUE}&season=${WC_SEASON}`,
  fixtures: `/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}`,
} as const;

type DebugEndpoint = keyof typeof ENDPOINT_PATHS;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

function isDebugEndpoint(value: string | null): value is DebugEndpoint {
  return value === "topscorers" || value === "events" || value === "fixtures";
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const endpointParam = request.nextUrl.searchParams.get("endpoint");

  if (!isDebugEndpoint(endpointParam)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Invalid or missing endpoint. Use ?endpoint=topscorers|events|fixtures",
      },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const apiKey = process.env.API_FOOTBALL_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "API_FOOTBALL_KEY is not configured" },
      { status: 500, headers: NO_STORE_HEADERS },
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
      return NextResponse.json(
        { ok: false, error: `api-sports ${res.status}` },
        { status: res.status, headers: NO_STORE_HEADERS },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        endpoint: endpointParam,
        url,
        data,
      },
      { headers: NO_STORE_HEADERS },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
