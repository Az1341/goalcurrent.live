/**
 * GoalCurrent.live — fixture calendar helpers (no Google Calendar API).
 */

export interface CalendarEventInput {
  homeTeam: string;
  awayTeam: string;
  kickoffUtc: string;
  venue?: string;
  competition: string;
  matchPageUrl: string;
  broadcaster?: string;
  durationMinutes?: number;
}

const DEFAULT_DURATION_MINUTES = 105;
const GOOGLE_CALENDAR_RENDER = "https://calendar.google.com/calendar/render";

function parseKickoffUtc(kickoffUtc: string): Date {
  const d = new Date(kickoffUtc);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid kickoffUtc: ${kickoffUtc}`);
  }
  return d;
}

export function formatUtcCalendarStamp(date: Date): string {
  const y = date.getUTCFullYear();
  const mo = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const h = String(date.getUTCHours()).padStart(2, "0");
  const mi = String(date.getUTCMinutes()).padStart(2, "0");
  const s = String(date.getUTCSeconds()).padStart(2, "0");
  return `${y}${mo}${day}T${h}${mi}${s}Z`;
}

export function buildEventTitle(input: CalendarEventInput): string {
  return `${input.homeTeam} vs ${input.awayTeam} - GoalCurrent.live`;
}

export function buildEventDetails(input: CalendarEventInput): string {
  const lines = [input.matchPageUrl, "GoalCurrent.live", input.competition];
  if (input.venue) lines.push(input.venue);
  if (input.broadcaster) lines.push(`Broadcaster: ${input.broadcaster}`);
  return lines.join("\n");
}

function eventEndUtc(start: Date, durationMinutes: number): Date {
  return new Date(start.getTime() + durationMinutes * 60_000);
}

export function buildGoogleCalendarDates(input: CalendarEventInput): string {
  const start = parseKickoffUtc(input.kickoffUtc);
  const end = eventEndUtc(
    start,
    input.durationMinutes ?? DEFAULT_DURATION_MINUTES,
  );
  return `${formatUtcCalendarStamp(start)}/${formatUtcCalendarStamp(end)}`;
}

export function buildGoogleCalendarUrl(input: CalendarEventInput): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: buildEventTitle(input),
    dates: buildGoogleCalendarDates(input),
    details: buildEventDetails(input),
  });
  if (input.venue) params.set("location", input.venue);
  return `${GOOGLE_CALENDAR_RENDER}?${params.toString()}`;
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function slugPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildIcsUid(input: CalendarEventInput): string {
  const stamp = formatUtcCalendarStamp(parseKickoffUtc(input.kickoffUtc));
  return [
    "goalcurrent",
    slugPart(input.competition),
    slugPart(input.homeTeam),
    slugPart(input.awayTeam),
    stamp,
    "@goalcurrent.live",
  ].join("-");
}

export function buildIcsContent(input: CalendarEventInput): string {
  const start = parseKickoffUtc(input.kickoffUtc);
  const end = eventEndUtc(
    start,
    input.durationMinutes ?? DEFAULT_DURATION_MINUTES,
  );
  const now = formatUtcCalendarStamp(new Date());
  const uid = buildIcsUid(input);
  const summary = escapeIcsText(buildEventTitle(input));
  const description = escapeIcsText(buildEventDetails(input));
  const location = input.venue ? escapeIcsText(input.venue) : "";
  const url = escapeIcsText(input.matchPageUrl);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GoalCurrent.live//Fixtures//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatUtcCalendarStamp(start)}`,
    `DTEND:${formatUtcCalendarStamp(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `URL:${url}`,
  ];
  if (location) lines.push(`LOCATION:${location}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

export function buildIcsFilename(input: CalendarEventInput): string {
  const date = formatUtcCalendarStamp(parseKickoffUtc(input.kickoffUtc)).slice(
    0,
    8,
  );
  return `${slugPart(input.homeTeam)}-vs-${slugPart(input.awayTeam)}-${date}.ics`;
}

export function downloadIcsFile(input: CalendarEventInput): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }
  const blob = new Blob([buildIcsContent(input)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = buildIcsFilename(input);
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
