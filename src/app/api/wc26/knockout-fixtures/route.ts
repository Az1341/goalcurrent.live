import { NextRequest, NextResponse } from "next/server";
import { validateGetQuery } from "@/lib/api/response";
import { wc26KnockoutFixturesQuerySchema } from "@/lib/validation/schemas";
import { captureRouteError } from "@/lib/log";
import {
  apiFootballErrorMessage,
  classifyApiFootballError,
} from "@/lib/api-football/errors";
import {
  fetchWc26KnockoutFixtures,
  fetchWc26KnockoutRound,
  isWc26KnockoutApiRound,
  type Wc26KnockoutApiRound,
} from "@/lib/server/wc26-knockout-fixtures";
import {
  isMissingApiKeyError,
  isWc26ApiConfigured,
  MissingApiKeyError,
} from "@/lib/server/wc26-api-football";

export const dynamic = "force-dynamic";

function isKnockoutRound(value: string): value is Wc26KnockoutApiRound {
  return isWc26KnockoutApiRound(value);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const validated = validateGetQuery(request, wc26KnockoutFixturesQuerySchema);
  if ("error" in validated) return validated.error;

  const round = validated.data.round ?? "";

  if (!isWc26ApiConfigured()) {
    return NextResponse.json(
      {
        fixtures: [],
        logs: [],
        source: "static",
        message: "API key not configured — using local FIFA schedule",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    if (round && isKnockoutRound(round)) {
      const { fixtures, log } = await fetchWc26KnockoutRound(round);
      return NextResponse.json(
        { fixtures, logs: [log], source: "api-football" },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const { fixtures, logs } = await fetchWc26KnockoutFixtures();
    return NextResponse.json(
      { fixtures, logs, source: "api-football" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (
      error instanceof MissingApiKeyError ||
      isMissingApiKeyError(
        error instanceof Error ? error.message : "Unknown error",
      )
    ) {
      return NextResponse.json(
        { fixtures: [], logs: [], source: "static" },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const code = classifyApiFootballError(error);
    captureRouteError("api/wc26/knockout-fixtures", error);

    return NextResponse.json(
      {
        error: code,
        message: apiFootballErrorMessage(code),
        fixtures: [],
        logs: [],
      },
      {
        status: code === "unknown_error" ? 500 : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
