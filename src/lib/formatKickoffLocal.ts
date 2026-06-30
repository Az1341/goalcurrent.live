export type DeviceKickoffFormatOptions = {
  /** Override for tests; omit to use the visitor device timezone. */
  readonly timeZone?: string;
};

function formatWithOptions(
  utcDateString: string,
  options: Intl.DateTimeFormatOptions,
  formatOptions?: DeviceKickoffFormatOptions,
): string {
  if (!utcDateString) {
    return "";
  }
  try {
    const { timeZone } = formatOptions ?? {};
    return new Intl.DateTimeFormat(undefined, {
      ...options,
      ...(timeZone ? { timeZone } : {}),
    }).format(new Date(utcDateString));
  } catch {
    return utcDateString;
  }
}

/** Full device-local kickoff label (date + time + short TZ). */
export function formatKickoffLocal(
  utcDateString: string,
  formatOptions?: DeviceKickoffFormatOptions,
): string {
  return formatWithOptions(
    utcDateString,
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZoneName: "short",
    },
    formatOptions,
  );
}

/** Device-local kickoff time only (HH:MM, 24h). */
export function formatKickoffLocalTime(
  utcDateString: string,
  formatOptions?: DeviceKickoffFormatOptions,
): string {
  return formatWithOptions(
    utcDateString,
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
    formatOptions,
  );
}

/** Device-local short date for fixture meta rows. */
export function formatKickoffLocalDate(
  utcDateString: string,
  formatOptions?: DeviceKickoffFormatOptions,
): string {
  return formatWithOptions(
    utcDateString,
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    },
    formatOptions,
  );
}

/** Short timezone label for the visitor device (e.g. BST, CET). */
export function formatDeviceTimezoneShort(
  formatOptions?: DeviceKickoffFormatOptions,
): string {
  try {
    const { timeZone } = formatOptions ?? {};
    const parts = new Intl.DateTimeFormat(undefined, {
      timeZoneName: "short",
      ...(timeZone ? { timeZone } : {}),
    }).formatToParts(new Date());
    return parts.find((part) => part.type === "timeZoneName")?.value ?? "local";
  } catch {
    return "local";
  }
}

/** Canonical aliases used across WC26 UI. */
export const formatDeviceKickoffLabel = formatKickoffLocal;
export const formatDeviceKickoffTime = formatKickoffLocalTime;
export const formatDeviceKickoffDate = formatKickoffLocalDate;
