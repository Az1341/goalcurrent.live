import { NextRequest, NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/server/cache";
import { fetchWc26TopScorers } from "@/lib/server/wc26-top-scorers";

export const dynamic = "force-dynamic";

const ROUTE = "/api/wc26/top-scorers";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const cacheKey = request.url;
  const cached = getCached(cacheKey);
  if (cached) {
    console.info(`CACHE HIT: ${ROUTE}`);
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
      },
    });
  }

  console.info(`CACHE MISS: ${ROUTE}`);

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
    console.error("[api/wc26/top-scorers]", message);
    return NextResponse.json(
      { error: "Failed to fetch WC26 top scorers", detail: message },
      { status: 500 },
    );
  }
}
