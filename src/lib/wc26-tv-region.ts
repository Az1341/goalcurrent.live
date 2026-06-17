import {
  isWc26TvRegionCode,
  type Wc26TvRegionCode,
} from "@/lib/wc26-fixtures-page";
import { TV_REGION_KEY } from "@/lib/site-keys";

const LOCALE_REGION_MAP: Record<string, Wc26TvRegionCode> = {
  GB: "GB",
  UK: "GB",
  US: "US",
  CA: "CA",
  AU: "AU",
  DE: "DE",
  FR: "FR",
};

/** Map a BCP 47 locale tag to a supported TV region (GB fallback). */
export function detectTvRegionFromLocale(locale: string): Wc26TvRegionCode {
  const normalized = locale.trim().replace(/_/g, "-");
  if (!normalized) {
    return "GB";
  }

  try {
    const parsed = new Intl.Locale(normalized);
    const region = parsed.region?.toUpperCase();
    if (region && LOCALE_REGION_MAP[region]) {
      return LOCALE_REGION_MAP[region];
    }
    const language = parsed.language?.toLowerCase();
    if (language === "de") {
      return "DE";
    }
    if (language === "fr") {
      return "FR";
    }
  } catch {
    /* fall through to string parsing */
  }

  const lower = normalized.toLowerCase();
  if (lower.startsWith("en-us") || lower === "es-us") {
    return "US";
  }
  if (lower.startsWith("en-ca") || lower.startsWith("fr-ca")) {
    return "CA";
  }
  if (lower.startsWith("en-au")) {
    return "AU";
  }
  if (lower.startsWith("de")) {
    return "DE";
  }
  if (lower.startsWith("fr")) {
    return "FR";
  }
  if (lower.startsWith("en-gb") || lower.startsWith("en-uk")) {
    return "GB";
  }

  return "GB";
}

/** Detect TV region from navigator.language / navigator.languages. */
export function detectVisitorTvRegion(): Wc26TvRegionCode {
  if (typeof navigator === "undefined") {
    return "GB";
  }

  const candidates = [
    ...(navigator.languages ?? []),
    navigator.language,
  ].filter(Boolean);

  for (const locale of candidates) {
    const region = detectTvRegionFromLocale(locale);
    if (region !== "GB") {
      return region;
    }
    if (/^(en-?(gb|uk)|en-gb)/i.test(locale.replace(/_/g, "-"))) {
      return "GB";
    }
  }

  return detectTvRegionFromLocale(navigator.language || "en-GB");
}

export function readStoredTvRegion(): Wc26TvRegionCode | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(TV_REGION_KEY);
    if (raw && isWc26TvRegionCode(raw)) {
      return raw;
    }
  } catch {
    /* private mode */
  }
  return null;
}

export function persistTvRegion(region: Wc26TvRegionCode): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(TV_REGION_KEY, region);
  } catch {
    /* ignore */
  }
}

/** Stored manual choice, else auto-detected from browser locale. */
export function resolveTvRegion(): Wc26TvRegionCode {
  return readStoredTvRegion() ?? detectVisitorTvRegion();
}
