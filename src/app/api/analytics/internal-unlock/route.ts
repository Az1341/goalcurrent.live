import { NextResponse } from "next/server";
import { respondError, respondOk } from "@/lib/api/response";
import { timingSafeEqualStr } from "@/lib/security/compare";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const INTERNAL_UNLOCK_COOKIE = "gc_internal_v1";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/**
 * Server-side GA4 internal-traffic unlock.
 *
 * The unlock secret lives ONLY in the server env (GA_INTERNAL_UNLOCK_SECRET).
 * The previous NEXT_PUBLIC_GA_INTERNAL_UNLOCK shipped the "secret" inside the
 * client JS bundle, so anyone could read it from the page source and mark
 * themselves internal. The cookie set here is intentionally NOT httpOnly so
 * the client analytics transport can read it; it only tags GA4 hits with
 * traffic_type=internal — it grants no privileges.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const secret = process.env.GA_INTERNAL_UNLOCK_SECRET?.trim();
  if (!secret) {
    return respondError(
      "not_configured",
      "Internal traffic unlock is not configured.",
      503,
    );
  }

  let key = "";
  try {
    const body: unknown = await request.json();
    if (typeof body === "object" && body !== null && "key" in body) {
      key = String((body as Record<string, unknown>).key ?? "");
    }
  } catch {
    /* fall through to invalid key */
  }

  if (!key || !timingSafeEqualStr(key, secret)) {
    return respondError("invalid_key", "Invalid unlock key.", 401);
  }

  const response = respondOk({ unlocked: true });
  response.cookies.set(INTERNAL_UNLOCK_COOKIE, "1", {
    httpOnly: false,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  return response;
}

export async function DELETE(): Promise<NextResponse> {
  const response = respondOk({ unlocked: false });
  response.cookies.set(INTERNAL_UNLOCK_COOKIE, "", {
    httpOnly: false,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
