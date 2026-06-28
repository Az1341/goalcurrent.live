const kickoffDateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const kickoffTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

function formatUtcKickoffDate(date: Date): string {
  const parts = kickoffDateFormatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";

  return `${weekday} ${day} ${month}`.trim();
}

/** Deterministic timezone abbreviation for hydration-safe rendering. */
export function formatVisitorTimezone(): string {
  return "UTC";
}

/** Hydration-safe short kickoff date for fixture meta rows. */
export function formatVisitorKickoffDate(iso: string): string {
  return formatUtcKickoffDate(new Date(iso));
}

/** Hydration-safe kickoff time only (HH:MM) — compact labels e.g. live ribbon. */
export function formatVisitorKickoffTime(iso: string): string {
  return kickoffTimeFormatter.format(new Date(iso));
}

/**
 * Hydration-safe kickoff label.
 * Uses fixed locale and UTC so server and browser render identical text.
 */
export function formatVisitorKickoff(iso: string): string {
  const date = new Date(iso);

  return `${formatUtcKickoffDate(date)} · ${kickoffTimeFormatter.format(date)} UTC`;
}

/** UTC display only. */
export function formatKickoffUtc(iso: string): string {
  return formatVisitorKickoff(iso);
}