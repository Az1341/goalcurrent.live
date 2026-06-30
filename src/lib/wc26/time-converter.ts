import { getVenueById } from "@/data/wc26";
function formatUtcKickoffTime(kickoffUtc: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(kickoffUtc));
}

const BST_TIMEZONE = "Europe/London";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Resolve IANA timezone for a venue id (falls back to UTC). */
export function getVenueTimezone(venueId: string): string {
  return getVenueById(venueId)?.timezone ?? "UTC";
}

/**
 * Convert FIFA local stadium kick-off (wall clock at venue) to UTC ISO string.
 * Used when authoring knockout schedules from official local times.
 */
export function stadiumLocalTimeToUtcIso(
  venueId: string,
  dateYmd: string,
  hour: number,
  minute: number,
): string {
  const timeZone = getVenueTimezone(venueId);
  const [year, month, day] = dateYmd.split("-").map(Number);
  const guessMs = Date.UTC(year, month - 1, day, hour, minute);

  for (let offsetHours = -16; offsetHours <= 16; offsetHours += 1) {
    const candidate = new Date(guessMs + offsetHours * 3_600_000);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(candidate);

    const read = (type: Intl.DateTimeFormatPartTypes): number =>
      Number(parts.find((part) => part.type === type)?.value ?? "0");

    if (
      read("year") === year &&
      read("month") === month &&
      read("day") === day &&
      read("hour") === hour &&
      read("minute") === minute
    ) {
      return candidate.toISOString();
    }
  }

  return new Date(guessMs).toISOString();
}

/** Calendar date key (YYYY-MM-DD) in the venue's local timezone. */
export function venueLocalDateKey(kickoffUtc: string, venueId: string): string {
  const timeZone = getVenueTimezone(venueId);
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date(kickoffUtc));
    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;
    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
  } catch {
    // fall through
  }
  const d = new Date(kickoffUtc);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

/** Format kickoff in the host venue IANA timezone (e.g. America/Mexico_City). */
export function formatVenueKickoffTime(
  kickoffUtc: string,
  venueId: string,
): string {
  const timeZone = getVenueTimezone(venueId);

  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    }).format(new Date(kickoffUtc));
  } catch {
    return formatUtcKickoffTime(kickoffUtc);
  }
}

/** Kick-off in British Summer Time (Europe/London). */
export function formatBstKickoffTime(kickoffUtc: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: BST_TIMEZONE,
    }).format(new Date(kickoffUtc));
  } catch {
    return formatUtcKickoffTime(kickoffUtc);
  }
}

/** Venue-local date + time label for match cards. */
export function formatVenueKickoffLabel(
  kickoffUtc: string,
  venueId: string,
): string {
  const venue = getVenueById(venueId);
  const timeZone = getVenueTimezone(venueId);
  const stadium = venue?.name ?? "Stadium";

  try {
    const when = new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    }).format(new Date(kickoffUtc));

    return `${when} · ${stadium}`;
  } catch {
    return stadium;
  }
}

/** BST date + time label for UK visitors. */
export function formatBstKickoffLabel(kickoffUtc: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: BST_TIMEZONE,
      timeZoneName: "short",
    }).format(new Date(kickoffUtc));
  } catch {
    return formatBstKickoffTime(kickoffUtc);
  }
}

/** Short venue timezone abbreviation for display next to local time. */
export function formatVenueTimezoneAbbr(
  venueId: string,
  atUtc: string = new Date().toISOString(),
): string {
  const timeZone = getVenueTimezone(venueId);

  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      timeZoneName: "short",
    }).formatToParts(new Date(atUtc));
    return parts.find((part) => part.type === "timeZoneName")?.value ?? timeZone;
  } catch {
    return timeZone;
  }
}
