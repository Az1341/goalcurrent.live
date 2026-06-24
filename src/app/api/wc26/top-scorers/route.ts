import { NextRequest, NextResponse } from "next/server";
import { captureRouteError, logInfo } from "@/lib/log";
import { getCached, setCached } from "@/lib/server/cache";
import { fetchWc26TopScorers } from "@/lib/server/wc26-top-scorers";

export const dynamic = "force-dynamic";

const ROUTE = "/api/wc26/top-scorers";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const cacheKey = request.url;
  const cached = getCached(cacheKey);
  if (cached) {
    logInfo(ROUTE, "CACHE HIT");
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
      },
    });
  }

  logInfo(ROUTE, "CACHE MISS");

  try {
    const body = await fetchWc26TopScorers();
    setCached(cacheKey, body);

    return NextResponse.json(body, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    captureRouteError("api/wc26/top-scorers", error);
    return NextResponse.json(
      { error: "Failed to fetch WC26 top scorers", detail: message },
      { status: 500 },
    );
  }
}
