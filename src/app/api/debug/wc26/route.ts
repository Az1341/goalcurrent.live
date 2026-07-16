import { NextRequest, NextResponse } from "next/server";
import { respondError, respondOk, validateGetQuery } from "@/lib/api/response";
import { emptyQuerySchema } from "@/lib/validation/schemas";
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
  const validated = validateGetQuery(request, emptyQuerySchema);
  if ("error" in validated) return validated.error;

  if (!isDebugAuthorized(request)) {
    return respondError("unauthorized", "Unauthorized.", 401);
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

    return respondOk(
      {
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
    return respondError("debug_fetch_failed", message, 500);
  }
}
