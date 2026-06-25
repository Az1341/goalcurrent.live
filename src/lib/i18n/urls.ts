import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site-url";

/** Path without locale prefix (leading slash). */
export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && routing.locales.includes(first as (typeof routing.locales)[number])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}

/** Localized path respecting as-needed prefix for default locale. */
export function localizedPath(path: string, locale: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) {
    return normalized;
  }
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function localizedUrl(path: string, locale: string): string {
  return absoluteUrl(localizedPath(path, locale));
}

/** hreflang alternates for all locales + x-default (English). */
export function buildHreflangAlternates(
  path: string,
): Record<string, string> {
  const alternates: Record<string, string> = {};

  for (const locale of routing.locales) {
    alternates[locale] = localizedUrl(path, locale);
  }

  alternates["x-default"] = localizedUrl(path, routing.defaultLocale);
  return alternates;
}
