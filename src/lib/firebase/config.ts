/** Client-safe Firebase web config (NEXT_PUBLIC_* only). */

export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
};

function read(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export function getFirebaseWebConfig(): FirebaseWebConfig | null {
  const apiKey = read("NEXT_PUBLIC_FIREBASE_API_KEY");
  const authDomain = read("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  const projectId = read("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  const storageBucket = read("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  const messagingSenderId = read("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  const appId = read("NEXT_PUBLIC_FIREBASE_APP_ID");
  const vapidKey = read("NEXT_PUBLIC_FIREBASE_VAPID_KEY");

  if (!apiKey || !authDomain || !projectId || !messagingSenderId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    vapidKey,
  };
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseWebConfig() !== null;
}

/** SW + messaging need the VAPID key from Firebase Console → Cloud Messaging. */
export function isFirebaseMessagingConfigured(): boolean {
  const config = getFirebaseWebConfig();
  return Boolean(config?.vapidKey);
}
