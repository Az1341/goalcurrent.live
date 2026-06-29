"use client";

import { KickoffTime } from "@/components/KickoffTime";

export function LocalizedKickoffLabel({ iso }: { iso: string }) {
  return <KickoffTime utcDate={iso} variant="full" />;
}

export function LocalizedKickoffTime({ iso }: { iso: string }) {
  return <KickoffTime utcDate={iso} variant="time" />;
}