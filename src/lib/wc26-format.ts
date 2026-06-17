/** Visitor-local timezone abbreviation for a given instant. */
export function formatVisitorTimezone(date: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat(undefined, {
      timeZoneName: "short",
    }).formatToParts(date);
    return parts.find((p) => p.type === "timeZoneName")?.value ?? "Local";
  } catch {
    return "Local";
  }
}

/** Local kickoff time only (HH:MM) — compact labels e.g. live ribbon. */
export function formatVisitorKickoffTime(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

/**
 * Full kickoff in the visitor's browser timezone:
 * local date, local time, and timezone abbreviation.
 */
export function formatVisitorKickoff(iso: string): string {
  const date = new Date(iso);
  const formatted = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${formatted} ${formatVisitorTimezone(date)}`;
}

/** @deprecated Visitor-facing UI should use formatVisitorKickoff — UTC display only. */
export function formatKickoffUtc(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(iso));
}
