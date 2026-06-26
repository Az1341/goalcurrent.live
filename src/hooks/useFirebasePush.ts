"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getNotificationPermission,
  requestFirebasePushPermission,
} from "@/components/firebase/FcmRegistration";
import { isFirebaseMessagingConfigured } from "@/lib/firebase/config";

export function useFirebasePush() {
  const enabled = isFirebaseMessagingConfigured();
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }
    setPermission(getNotificationPermission());
  }, [enabled]);

  const enablePush = useCallback(() => {
    requestFirebasePushPermission();
    setPermission(getNotificationPermission());
  }, []);

  return {
    enabled,
    permission,
    isGranted: permission === "granted",
    isBlocked: permission === "denied",
    enablePush,
  };
}
