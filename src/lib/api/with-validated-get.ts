import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { validateGetQuery } from "@/lib/api/response";

export function withValidatedGet<T>(
  schema: ZodType<T>,
  handler: (request: Request, query: T) => Promise<NextResponse> | NextResponse,
) {
  return async function GET(request: Request): Promise<NextResponse> {
    const validated = validateGetQuery(request, schema);
    if ("error" in validated) {
      return validated.error;
    }
    return handler(request, validated.data);
  };
}