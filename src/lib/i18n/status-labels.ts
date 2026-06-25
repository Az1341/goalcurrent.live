const STATUS_KEY_MAP: Record<string, string> = {
  scheduled: "scheduled",
  postponed: "postponed",
  cancelled: "cancelled",
  live: "live",
  ht: "ht",
  halftime: "ht",
  "half-time": "ht",
  "1h": "1h",
  "2h": "2h",
  ft: "ft",
  finished: "ft",
  "full-time": "ft",
  completed: "ft",
  aet: "aet",
  pen: "pen",
  et: "et",
  "extra time": "et",
  penalties: "pen",
};

export function fixtureStatusMessageKey(status: string): string | null {
  const normalized = status.trim().toLowerCase();
  return STATUS_KEY_MAP[normalized] ?? null;
}

type TranslateFn = (key: string) => string;

export function translateFixtureStatusLabel(
  status: string,
  t: TranslateFn,
): string {
  const key = fixtureStatusMessageKey(status);
  if (key) {
    return t(`status.${key}`);
  }
  return status.toUpperCase();
}
