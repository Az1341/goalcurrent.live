"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import {
  isFirebaseMessagingConfigured,
} from "@/lib/firebase/config";
import {
  getFirebaseAuth,
  registerFcmServiceWorker,
  requestFcmToken,
} from "@/lib/firebase/client";

const STORAGE_KEY = "gc:fcm-token-registered";

async function syncFcmToken(token: string, locale: string, idToken?: string) {
  try {
    const response = await fetch("/api/firebase/fcm-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, locale, idToken }),
    });
    if (!response.ok) {
      console.warn("[FCM] token sync skipped:", response.status);
    }
  } catch (error) {
    console.warn("[FCM] token sync failed", error);
  }
}

export function FcmRegistration() {
  const locale = useLocale();
  const { user } = useFirebaseAuth();
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (!isFirebaseMessagingConfigured() || typeof window === "undefined") {
      return;
    }
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const register = useCallback(async () => {
    if (!isFirebaseMessagingConfigured() || typeof window === "undefined") {
      return;
    }

    if (!("Notification" in window)) {
      return;
    }

    const nextPermission = await Notification.requestPermission();
    setPermission(nextPermission);
    if (nextPermission !== "granted") {
      return;
    }

    const registration = await registerFcmServiceWorker();
    if (!registration) {
      return;
    }

    const token = await requestFcmToken(registration);
    if (!token) {
      return;
    }

    const auth = getFirebaseAuth();
    const idToken = auth?.currentUser
      ? await auth.currentUser.getIdToken()
      : undefined;

    await syncFcmToken(token, locale, idToken);
    window.localStorage.setItem(STORAGE_KEY, token);
    window.AndroidBridge?.onFcmToken?.(token);
  }, [locale]);

  useEffect(() => {
    if (!isFirebaseMessagingConfigured()) {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (permission === "granted" && stored) {
      void register();
      return;
    }

    if (permission === "granted") {
      void register();
    }
  }, [permission, user, register]);

  useEffect(() => {
    const handler = () => {
      void register();
    };
    window.addEventListener("gc:firebase-enable-push", handler);
    return () => window.removeEventListener("gc:firebase-enable-push", handler);
  }, [register]);

  return null;
}

export function requestFirebasePushPermission() {
  window.dispatchEvent(new CustomEvent("gc:firebase-enable-push"));
}

export function getNotificationPermission(): NotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}
