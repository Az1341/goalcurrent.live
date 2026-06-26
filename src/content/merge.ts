import type { ContentItem } from "@/content/types";

const ITEM_LIMIT = 30;

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    return parsed.href.toLowerCase().replace(/\/$/, "");
  } catch {
    return url.toLowerCase().trim();
  }
}

export function contentIdFromUrl(url: string): string {
  const normalized = normalizeUrl(url);
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  return `c-${Math.abs(hash).toString(36)}`;
}

export function dedupeContentItems(items: ContentItem[]): ContentItem[] {
  const seenTitles = new Set<string>();
  const seenLinks = new Set<string>();

  return items.filter((item) => {
    const titleKey = item.title.toLowerCase().slice(0, 40);
    const linkKey = normalizeUrl(item.url);
    if (seenTitles.has(titleKey) || seenLinks.has(linkKey)) {
      return false;
    }
    seenTitles.add(titleKey);
    seenLinks.add(linkKey);
    return true;
  });
}

export function sortByPublishedDesc(items: ContentItem[]): ContentItem[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function mergeContentSources(
  primary: ContentItem[],
  secondary: ContentItem[],
  limit = ITEM_LIMIT,
): ContentItem[] {
  const merged = dedupeContentItems([...primary, ...secondary]);
  return sortByPublishedDesc(merged).slice(0, limit);
}

export function truncateDescription(text: string, max = 180): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max)}…`;
}
