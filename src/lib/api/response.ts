import { NextResponse } from "next/server";
import type { ZodError, ZodType } from "zod";

export type ApiErrorBody = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function respondError(
  code: string,
  message: string,
  status: number,
  details?: unknown,
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status },
  );
}

export function respondOk<T extends Record<string, unknown>>(
  data: T,
  init?: ResponseInit,
): NextResponse<{ ok: true } & T> {
  return NextResponse.json({ ok: true, ...data }, init);
}

export function respondZodError(error: ZodError): NextResponse<ApiErrorBody> {
  return respondError("validation_error", "Invalid request.", 400, error.flatten());
}

export function parseSearchParams<T>(
  searchParams: URLSearchParams,
  schema: ZodType<T>,
): { data: T } | { error: NextResponse<ApiErrorBody> } {
  const raw = Object.fromEntries(searchParams.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: respondZodError(parsed.error) };
  }
  return { data: parsed.data };
}

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<{ data: T } | { error: NextResponse<ApiErrorBody> }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { error: respondError("invalid_json", "Request body must be valid JSON.", 400) };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: respondZodError(parsed.error) };
  }

  return { data: parsed.data };
}