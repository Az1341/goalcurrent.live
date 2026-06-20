const PL_BROADCASTERS: Record<string, string> = {
  GB: "UK: Sky Sports / TNT Sports",
  US: "USA: Peacock",
  CA: "Canada: Fubo",
  AU: "Australia: Optus Sport",
};

/** IANA timezone → country for visitor region (overrides misleading language order). */
const TZ_TO_COUNTRY: Record<string, string> = {
  "Europe/London": "GB",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "America/Winnipeg": "CA",
  "America/Halifax": "CA",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Australia/Brisbane": "AU",
  "Australia/Perth": "AU",
};

export const PL_BROADCASTER_UNAVAILABLE =
  "Local broadcaster information unavailable";

function countryFromTimezone(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return null;
    if (TZ_TO_COUNTRY[tz]) return TZ_TO_COUNTRY[tz];
    if (tz.startsWith("America/")) return "US";
    if (tz.startsWith("Australia/")) return "AU";
  } catch {
    /* ignore */
  }
  return null;
}

function countryCodeFromLocale(locale: string): string | null {
  const normalized = locale.trim().replace(/_/g, "-");
  if (!normalized) return null;

  try {
    const parsed = new Intl.Locale(normalized);
    if (parsed.region) {
      return parsed.region.toUpperCase();
    }
  } catch {
    /* fall through */
  }

  const parts = normalized.split("-");
  if (parts.length >= 2 && parts[1].length === 2) {
    return parts[1].toUpperCase();
  }

  if (/^en-?(gb|uk)$/i.test(normalized)) return "GB";
  if (/^en-us$/i.test(normalized) || /^es-us$/i.test(normalized)) return "US";
  if (/^en-ca$/i.test(normalized) || /^fr-ca$/i.test(normalized)) return "CA";
  if (/^en-au$/i.test(normalized)) return "AU";

  return null;
}

export function getPlBroadcasterForCountry(countryCode: string): string {
  const code = countryCode.trim().toUpperCase();
  if (code === "UK") {
    return PL_BROADCASTERS.GB;
  }
  return PL_BROADCASTERS[code] ?? PL_BROADCASTER_UNAVAILABLE;
}

export function resolvePlBroadcasterFromLocale(locale: string): string {
  const countryCode = countryCodeFromLocale(locale);
  if (!countryCode) {
    return PL_BROADCASTER_UNAVAILABLE;
  }
  return getPlBroadcasterForCountry(countryCode);
}

/** Client-side region resolution — timezone first, then explicit locale regions. */
export function resolvePlBroadcasterForVisitor(): string {
  if (typeof navigator === "undefined") {
    return PL_BROADCASTER_UNAVAILABLE;
  }

  const tzCountry = countryFromTimezone();
  if (tzCountry) {
    const tzLabel = getPlBroadcasterForCountry(tzCountry);
    if (tzLabel !== PL_BROADCASTER_UNAVAILABLE) {
      return tzLabel;
    }
  }

  const candidates = [
    ...(navigator.languages ?? []),
    navigator.language,
  ].filter(Boolean);

  for (const locale of candidates) {
    const code = countryCodeFromLocale(locale);
    if (!code) continue;
    const label = getPlBroadcasterForCountry(code);
    if (label !== PL_BROADCASTER_UNAVAILABLE) {
      return label;
    }
  }

  return PL_BROADCASTER_UNAVAILABLE;
}

export function isPlBroadcasterAvailable(label: string): boolean {
  return label.trim() !== "" && label !== PL_BROADCASTER_UNAVAILABLE;
}
