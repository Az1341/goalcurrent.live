"use client";

import { useSyncExternalStore } from "react";
import {
  formatDeviceKickoffDate as formatDeviceKickoffDateCanonical,
  formatDeviceKickoffLabel as formatDeviceKickoffLabelCanonical,
  formatDeviceKickoffTime as formatDeviceKickoffTimeCanonical,
  formatDeviceTimezoneShort,
  formatKickoffLocal,
  formatKickoffLocalTime,
} from "@/lib/formatKickoffLocal";
import { formatVisitorKickoffDate } from "@/lib/wc26-format";

export {
  formatKickoffLocal,
  formatKickoffLocalTime,
  formatDeviceKickoffDateCanonical as formatDeviceKickoffDate,
  formatDeviceKickoffLabelCanonical as formatDeviceKickoffLabel,
  formatDeviceKickoffTimeCanonical as formatDeviceKickoffTime,
};

const noopSubscribe = () => () => {};

/** Hydration-safe kickoff time: SSR uses empty snapshot, client uses device locale. */
export function useLocalizedKickoffTime(iso: string): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => formatKickoffLocalTime(iso),
    () => "",
  );
}

/** Same pattern for full kickoff labels (date + time + TZ). */
export function useLocalizedKickoffLabel(iso: string): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => formatKickoffLocal(iso),
    () => "",
  );
}

/** Hydration-safe short date for fixture meta rows. */
export function useLocalizedKickoffDate(iso: string): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => formatDeviceKickoffDateCanonical(iso),
    () => formatVisitorKickoffDate(iso),
  );
}

/** Short timezone label for fixture cards (e.g. BST, CET). */
export function useDeviceTimezoneLabel(): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => formatDeviceTimezoneShort(),
    () => "",
  );
}

/** Explicit mount flag when components need to branch layout before/after hydration. */
export function useIsClientMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
