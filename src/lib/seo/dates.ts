/** Normalize article date strings to ISO 8601 for schema and news sitemaps. */
export function toIsoDate(date: string): string {
  const trimmed = date.trim();
  if (!trimmed) {
    return new Date().toISOString();
  }

  const parsed = Date.parse(trimmed);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString();
  }

  const fallback = new Date(trimmed);
  if (!Number.isNaN(fallback.getTime())) {
    return fallback.toISOString();
  }

  return new Date().toISOString();
}

/** Google News sitemap expects W3C datetime (ISO). */
export function toNewsPublicationDate(date: string): string {
  return toIsoDate(date);
}
