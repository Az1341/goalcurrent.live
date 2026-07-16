import { NextRequest, NextResponse } from "next/server";
import { isDebugAuthorized } from "@/lib/server/cache";
import { fetchWc26EventsRaw } from "@/lib/server/wc26-events";
import { fetchWc26FixturesRaw } from "@/lib/server/wc26-fixtures";
import { fetchWc26TopScorers } from "@/lib/server/wc26-top-scorers";
import {
  fetchWc26TopScorersRaw,
  fetchWc26TopScorersSourceBreakdown,
} from "@/lib/server/wc26-top-scorers-sources";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isDebugAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  try {
    const [rawTopScorers, rawFixtures, rawEvents, merged] = await Promise.all([
      fetchWc26TopScorersRaw(),
      fetchWc26FixturesRaw(),
      fetchWc26EventsRaw(),
      fetchWc26TopScorers(),
    ]);

    const sourceBreakdown = await fetchWc26TopScorersSourceBreakdown(
      merged.scorers.length,
    );

    return NextResponse.json(
      {
        ok: true,
        rawTopScorers,
        rawFixtures,
        rawEvents,
        mergedScorers: merged.scorers,
        sourceBreakdown,
        timestamps: {
          fetchedAt: new Date().toISOString(),
        },
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
