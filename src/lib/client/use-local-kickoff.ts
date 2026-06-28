"use client";

import { useSyncExternalStore } from "react";
import {
  formatVisitorKickoff,
  formatVisitorKickoffDate,
  formatVisitorKickoffTime,
} from "@/lib/wc26-format";

/** Device-local HH:MM (24h) using the visitor timezone. */
export function formatDeviceKickoffTime(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

/** Device-local kickoff label for featured meta rows. */
export function formatDeviceKickoffLabel(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

function deviceTimezoneLabel(): string {
  try {
    const parts = new Intl.DateTimeFormat(undefined, {
      timeZoneName: "short",
    }).formatToParts(new Date());
    return parts.find((part) => part.type === "timeZoneName")?.value ?? "local";
  } catch {
    return "local";
  }
}

const noopSubscribe = () => () => {};

/**
 * Hydration-safe kickoff time: SSR uses fixed UTC, first client render uses device locale.
 */
export function useLocalizedKickoffTime(iso: string): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => formatDeviceKickoffTime(iso),
    () => formatVisitorKickoffTime(iso),
  );
}

/** Device-local short date for fixture meta rows. */
export function formatDeviceKickoffDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/** Same pattern for full kickoff labels (date + time). */
export function useLocalizedKickoffLabel(iso: string): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => formatDeviceKickoffLabel(iso),
    () => formatVisitorKickoff(iso),
  );
}

/** Hydration-safe short date for fixture meta rows. */
export function useLocalizedKickoffDate(iso: string): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => formatDeviceKickoffDate(iso),
    () => formatVisitorKickoffDate(iso),
  );
}

/** Short timezone label for fixture cards (e.g. BST, PDT). */
export function useDeviceTimezoneLabel(): string {
  return useSyncExternalStore(
    noopSubscribe,
    deviceTimezoneLabel,
    () => "UTC",
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