"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  initializeAuth,
  OAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type Auth,
  type User,
} from "firebase/auth";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type Messaging,
  type MessagePayload,
} from "firebase/messaging";
import {
  getFirebaseWebConfig,
  isFirebaseConfigured,
  isFirebaseMessagingConfigured,
} from "@/lib/firebase/config";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  const config = getFirebaseWebConfig();
  if (!config) {
    return null;
  }

  const { vapidKey: _vapidKey, ...appConfig } = config;
  return initializeApp(appConfig);
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  try {
    return getAuth(app);
  } catch {
    return initializeAuth(app, { persistence: browserLocalPersistence });
  }
}

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (!isFirebaseMessagingConfigured()) {
    return null;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const supported = await isSupported();
  if (!supported) {
    return null;
  }

  const app = getFirebaseApp();
  return app ? getMessaging(app) : null;
}

export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not configured");
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signInWithApple(): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not configured");
  }
  const result = await signInWithPopup(auth, appleProvider);
  return result.user;
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return;
  }
  await firebaseSignOut(auth);
}

export async function registerFcmServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const existing = registrations.find((registration) =>
      registration.active?.scriptURL.includes("firebase-messaging-sw.js"),
    );
    if (existing) {
      return existing;
    }

    return await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  } catch (error) {
    console.warn("[FCM] service worker registration failed", error);
    return null;
  }
}

export async function requestFcmToken(
  registration: ServiceWorkerRegistration,
): Promise<string | null> {
  const messaging = await getFirebaseMessaging();
  const config = getFirebaseWebConfig();
  if (!messaging || !config?.vapidKey) {
    return null;
  }

  return getToken(messaging, {
    vapidKey: config.vapidKey,
    serviceWorkerRegistration: registration,
  });
}

export function listenForForegroundMessages(
  handler: (payload: MessagePayload) => void,
): (() => void) | null {
  let unsubscribe: (() => void) | null = null;

  void getFirebaseMessaging().then((messaging) => {
    if (!messaging) {
      return;
    }
    unsubscribe = onMessage(messaging, handler);
  });

  return () => {
    unsubscribe?.();
  };
}
