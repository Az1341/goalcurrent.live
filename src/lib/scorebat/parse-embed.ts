const SCOREBAT_HOSTS = new Set(["scorebat.com", "www.scorebat.com", "embed.scorebat.com"]);

/** Extract a safe ScoreBat iframe URL from API embed HTML. */
export function parseScoreBatEmbedUrl(embedHtml: string): string | null {
  const trimmed = embedHtml.trim();
  if (!trimmed) {
    return null;
  }

  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  const rawUrl = srcMatch?.[1]?.trim();
  if (!rawUrl) {
    return null;
  }

  try {
    const parsed = new URL(rawUrl, "https://www.scorebat.com");
    if (parsed.protocol !== "https:") {
      return null;
    }
    const host = parsed.hostname.toLowerCase();
    if (!SCOREBAT_HOSTS.has(host) && !host.endsWith(".scorebat.com")) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}