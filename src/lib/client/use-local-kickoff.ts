"use client";

import { useEffect, useState } from "react";
import {
  formatVisitorKickoff,
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

/**
 * Hydration-safe kickoff time: SSR + first client paint use fixed UTC,
 * then swap to the visitor locale after mount (via useEffect).
 */
export function useLocalizedKickoffTime(iso: string): string {
  const [time, setTime] = useState(() => formatVisitorKickoffTime(iso));

  useEffect(() => {
    setTime(formatDeviceKickoffTime(iso));
  }, [iso]);

  return time;
}

/** Same mount guard pattern for full kickoff labels. */
export function useLocalizedKickoffLabel(iso: string): string {
  const [label, setLabel] = useState(() => formatVisitorKickoff(iso));

  useEffect(() => {
    setLabel(formatDeviceKickoffLabel(iso));
  }, [iso]);

  return label;
}

/** Explicit mount flag when components need to branch layout before/after hydration. */
export function useIsClientMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}