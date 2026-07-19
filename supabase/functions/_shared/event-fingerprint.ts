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
  if (value == null) return "";
  return String(value).trim().toLowerCase();
}

export async function buildEventFingerprint(input: EventFingerprintInput): Promise<string> {
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

  const data = new TextEncoder().encode(tuple);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
