"use client";

import { useEffect } from "react";
import { FirebaseAuthProvider } from "@/contexts/FirebaseAuthContext";
import { FcmRegistration } from "@/components/firebase/FcmRegistration";
import {
  isFirebaseConfigured,
  isFirebaseMessagingConfigured,
} from "@/lib/firebase/config";
import { listenForForegroundMessages } from "@/lib/firebase/client";

function FirebaseForegroundMessages() {
  useEffect(() => {
    if (!isFirebaseMessagingConfigured()) {
      return;
    }

    const unsubscribe = listenForForegroundMessages((payload) => {
      const title =
        payload.notification?.title || payload.data?.title || "GoalCurrent";
      const body = payload.notification?.body || payload.data?.body;
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(title, {
            body,
            icon: "/icons/icon-192.png",
            tag: "goalcurrent-live-foreground",
          });
        }
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  return null;
}

export function FirebaseRoot() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  return (
    <FirebaseAuthProvider>
      <FcmRegistration />
      <FirebaseForegroundMessages />
    </FirebaseAuthProvider>
  );
}