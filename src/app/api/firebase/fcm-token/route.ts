import { NextResponse } from "next/server";
import {
  getFirebaseAdminAuth,
  getFirebaseAdminMessaging,
  isFirebaseAdminConfigured,
} from "@/lib/firebase/admin";
import { parseJsonBody, respondError, respondOk } from "@/lib/api/response";
import { fcmTokenBodySchema } from "@/lib/validation/schemas";

/** Require a non-empty Firebase ID token before any topic subscribe (BE-007). */
export function requireFcmIdToken(
  idToken: string | undefined,
):
  | { ok: true; idToken: string }
  | { ok: false; response: NextResponse } {
  const trimmed = idToken?.trim();
  if (!trimmed) {
    return {
      ok: false,
      response: respondError(
        "missing_id_token",
        "Firebase ID token is required.",
        401,
      ),
    };
  }
  return { ok: true, idToken: trimmed };
}

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, fcmTokenBodySchema);
  if ("error" in parsed) {
    return parsed.error;
  }

  const { token, locale, idToken: rawIdToken } = parsed.data;

  const required = requireFcmIdToken(rawIdToken);
  if (!required.ok) {
    return required.response;
  }

  if (!isFirebaseAdminConfigured()) {
    return respondError(
      "firebase_admin_not_configured",
      "Push notifications are not configured.",
      503,
    );
  }

  const auth = getFirebaseAdminAuth();
  const messaging = getFirebaseAdminMessaging();
  if (!auth || !messaging) {
    return respondError(
      "firebase_admin_unavailable",
      "Firebase admin is unavailable.",
      503,
    );
  }

  let uid: string;
  try {
    const decoded = await auth.verifyIdToken(required.idToken);
    uid = decoded.uid;
  } catch {
    return respondError("invalid_id_token", "Invalid Firebase ID token.", 401);
  }

  const topics = ["goalcurrent-live", `user-${uid}`];
  if (locale) {
    topics.push(`lang-${locale}`);
  }

  // BE-007 follow-up: a client-supplied FCM token is untrusted input. A
  // logged-in user could subscribe an arbitrary token to their user-${uid}
  // topic (e.g. spam someone with push). A dry-run send validates that the
  // token is a REAL registration in THIS Firebase project before we
  // subscribe it to any topic.
  try {
    await messaging.send({ token }, true);
  } catch {
    return respondError(
      "invalid_fcm_token",
      "The provided FCM token is not a valid registration for this project.",
      400,
    );
  }

  try {
    await Promise.all(
      topics.map((topic) => messaging.subscribeToTopic(token, topic)),
    );
  } catch (error) {
    console.error("[firebase/fcm-token] subscribe failed", error);
    return respondError(
      "subscribe_failed",
      "Failed to subscribe device to topics.",
      502,
    );
  }

  return respondOk({
    topics,
    authenticated: true,
  });
}