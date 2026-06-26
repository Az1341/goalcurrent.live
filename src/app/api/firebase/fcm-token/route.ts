import { NextResponse } from "next/server";
import {
  getFirebaseAdminAuth,
  getFirebaseAdminMessaging,
  isFirebaseAdminConfigured,
} from "@/lib/firebase/admin";

type FcmTokenBody = {
  token?: string;
  locale?: string;
  idToken?: string;
};

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "firebase_admin_not_configured" },
      { status: 503 },
    );
  }

  let body: FcmTokenBody;
  try {
    body = (await request.json()) as FcmTokenBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const token = body.token?.trim();
  if (!token) {
    return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
  }

  const auth = getFirebaseAdminAuth();
  const messaging = getFirebaseAdminMessaging();
  if (!auth || !messaging) {
    return NextResponse.json(
      { ok: false, error: "firebase_admin_unavailable" },
      { status: 503 },
    );
  }

  let uid: string | null = null;
  const idToken = body.idToken?.trim();
  if (idToken) {
    try {
      const decoded = await auth.verifyIdToken(idToken);
      uid = decoded.uid;
    } catch {
      return NextResponse.json({ ok: false, error: "invalid_id_token" }, { status: 401 });
    }
  }

  const topics = ["goalcurrent-live"];
  const locale = body.locale?.trim();
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
    return NextResponse.json(
      { ok: false, error: "subscribe_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    topics,
    authenticated: Boolean(uid),
  });
}
