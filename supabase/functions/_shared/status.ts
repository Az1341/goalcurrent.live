export type MatchStatus =
  | "unknown"
  | "not_started"
  | "in_play"
  | "paused"
  | "finished"
  | "extra_time"
  | "penalties"
  | "postponed"
  | "cancelled"
  | "suspended"
  | "interrupted"
  | "abandoned"
  | "awarded"
  | "walkover";

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
  if (!shortCode) return "unknown";
  return STATUS_MAP[shortCode.trim().toUpperCase()] ?? "unknown";
}
