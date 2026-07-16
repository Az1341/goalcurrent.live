import { NextResponse } from "next/server";
import {
  getFirebaseAdminAuth,
  getFirebaseAdminMessaging,
  isFirebaseAdminConfigured,
} from "@/lib/firebase/admin";
import { parseJsonBody, respondError, respondOk } from "@/lib/api/response";
import { fcmTokenBodySchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) {
    return respondError(
      "firebase_admin_not_configured",
      "Push notifications are not configured.",
      503,
    );
  }

  const parsed = await parseJsonBody(request, fcmTokenBodySchema);
  if ("error" in parsed) {
    return parsed.error;
  }

  const { token, locale, idToken } = parsed.data;

  const auth = getFirebaseAdminAuth();
  const messaging = getFirebaseAdminMessaging();
  if (!auth || !messaging) {
    return respondError(
      "firebase_admin_unavailable",
      "Firebase admin is unavailable.",
      503,
    );
  }

  let uid: string | null = null;
  if (idToken) {
    try {
      const decoded = await auth.verifyIdToken(idToken);
      uid = decoded.uid;
    } catch {
      return respondError("invalid_id_token", "Invalid Firebase ID token.", 401);
    }
  }

  const topics = ["goalcurrent-live"];
  if (locale) {
    topics.push(`lang-${locale}`);
  }
  if (uid) {
    topics.push(`user-${uid}`);
  }

  try {
    await Promise.all(
      topics.map((topic) => messaging.subscribeToTopic(token, topic)),
    );
  } catch (error) {
    console.error("[firebase/fcm-token] subscribe failed", error);
    return respondError("subscribe_failed", "Failed to subscribe device to topics.", 502);
  }

  return respondOk({
    topics,
    authenticated: Boolean(uid),
  });
}
