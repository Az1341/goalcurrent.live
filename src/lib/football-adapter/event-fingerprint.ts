import { createHash } from "node:crypto";

export type EventFingerprintInput = {
  fixtureId: number;
  teamId: number | null;
  minute: number;
  extraMinute: number | null;
  eventType: string;
  detail: string | null;
  playerId: number | null;
  assistId: number | null;
};

function normalisePart(value: string | number | null | undefined): string {
  if (value == null) {
    return "";
  }
  return String(value).trim().toLowerCase();
}

export function buildEventFingerprint(input: EventFingerprintInput): string {
  const tuple = [
    input.fixtureId,
    normalisePart(input.teamId),
    input.minute,
    normalisePart(input.extraMinute ?? 0),
    normalisePart(input.eventType),
    normalisePart(input.detail),
    normalisePart(input.playerId),
    normalisePart(input.assistId),
  ].join("|");

  return createHash("sha256").update(tuple).digest("hex");
}