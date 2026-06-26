import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getMessaging, type Messaging } from "firebase-admin/messaging";

function parseServiceAccount():
  | {
      projectId: string;
      clientEmail: string;
      privateKey: string;
    }
  | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };

    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      return null;
    }

    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key,
    };
  } catch {
    return null;
  }
}

export function isFirebaseAdminConfigured(): boolean {
  return parseServiceAccount() !== null;
}

export function getFirebaseAdminApp(): App | null {
  const serviceAccount = parseServiceAccount();
  if (!serviceAccount) {
    return null;
  }

  if (getApps().length > 0) {
    return getApps()[0] ?? null;
  }

  return initializeApp({
    credential: cert({
      projectId: serviceAccount.projectId,
      clientEmail: serviceAccount.clientEmail,
      privateKey: serviceAccount.privateKey,
    }),
  });
}

export function getFirebaseAdminAuth(): Auth | null {
  const app = getFirebaseAdminApp();
  return app ? getAuth(app) : null;
}

export function getFirebaseAdminMessaging(): Messaging | null {
  const app = getFirebaseAdminApp();
  return app ? getMessaging(app) : null;
}
