import type { MatchStatus } from "@/types/database";

const STATUS_MAP: Record<string, MatchStatus> = {
  NS: "not_started",
  TBD: "not_started",
  "1H": "in_play",
  HT: "paused",
  "2H": "in_play",
  ET: "extra_time",
  BT: "paused",
  P: "penalties",
  SUSP: "suspended",
  INT: "interrupted",
  LIVE: "in_play",
  FT: "finished",
  AET: "finished",
  PEN: "finished",
  PST: "postponed",
  CANC: "cancelled",
  ABD: "abandoned",
  AWD: "awarded",
  WO: "walkover",
};

export function mapApiFootballStatus(shortCode: string | null | undefined): MatchStatus {
  if (!shortCode) {
    return "unknown";
  }
  const normalised = shortCode.trim().toUpperCase();
  return STATUS_MAP[normalised] ?? "unknown";
}

export function parseApiScore(value: number | string | null | undefined): number | null {
  if (value == null || value === "") {
    return null;
  }
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}