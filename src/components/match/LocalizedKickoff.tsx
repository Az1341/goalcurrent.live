"use client";

import {
  useLocalizedKickoffLabel,
  useLocalizedKickoffTime,
} from "@/lib/client/use-local-kickoff";

export function LocalizedKickoffLabel({ iso }: { iso: string }) {
  const label = useLocalizedKickoffLabel(iso);
  return <>{label}</>;
}

export function LocalizedKickoffTime({ iso }: { iso: string }) {
  const time = useLocalizedKickoffTime(iso);
  return <>{time}</>;
}