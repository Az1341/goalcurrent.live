const PL_BROADCASTERS: Record<string, string> = {
  GB: "UK: Sky Sports / TNT Sports",
  US: "USA: Peacock",
  CA: "Canada: Fubo",
  AU: "Australia: Optus Sport",
};

export const PL_BROADCASTER_UNAVAILABLE =
  "Local broadcaster information unavailable";

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

/** Client-side locale resolution when navigator is available. */
export function resolvePlBroadcasterForVisitor(): string {
  if (typeof navigator === "undefined") {
    return PL_BROADCASTER_UNAVAILABLE;
  }

  const candidates = [
    ...(navigator.languages ?? []),
    navigator.language,
  ].filter(Boolean);

  for (const locale of candidates) {
    const label = resolvePlBroadcasterFromLocale(locale);
    if (label !== PL_BROADCASTER_UNAVAILABLE) {
      return label;
    }
  }

  return PL_BROADCASTER_UNAVAILABLE;
}
