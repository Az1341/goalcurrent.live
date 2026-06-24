import { NextResponse } from "next/server";
import {
  ApiFootballAuthError,
  apiFootballErrorMessage,
  classifyApiFootballError,
  type ApiFootballErrorCode,
} from "@/lib/api-football/errors";
import { captureRouteError } from "@/lib/log";

type RespondOptions<T> = {
  route: string;
  error: unknown;
  staleBody?: T | null;
  buildBody: (code: ApiFootballErrorCode, message: string, stale: boolean) => T;
  cacheControl?: string;
};

export function respondApiFootballFailure<T extends Record<string, unknown>>({
  route,
  error,
  staleBody,
  buildBody,
  cacheControl = "no-store",
}: RespondOptions<T>): NextResponse {
  if (error instanceof ApiFootballAuthError) {
    captureRouteError(route, error);
    return NextResponse.json(
      buildBody("unknown_error", error.message, false),
      { status: 503, headers: { "Cache-Control": cacheControl } },
    );
  }

  const code = classifyApiFootballError(error);
  captureRouteError(route, error);

  const message = apiFootballErrorMessage(code);
  const body = staleBody
    ? buildBody(code, message, true)
    : buildBody(code, message, false);

  const status = code === "unknown_error" ? 500 : 503;
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": cacheControl },
  });
}