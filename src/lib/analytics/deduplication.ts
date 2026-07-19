const STORAGE_PREFIX = "gc_analytics_dedupe:";

type DedupeOptions = {
  /** Time window in ms; default 24h for subscription-style events, 30s for clicks. */
  ttlMs?: number;
};

function storageKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

/** Returns true if this key was already recorded within ttlMs (and records it when false). */
export function shouldSkipDuplicateEvent(
  key: string,
  { ttlMs = 30_000 }: DedupeOptions = {},
): boolean {
  const storage =
    typeof globalThis.sessionStorage !== "undefined"
      ? globalThis.sessionStorage
      : typeof window !== "undefined"
        ? window.sessionStorage
        : null;
  if (!storage) return false;
  const fullKey = storageKey(key);
  const now = Date.now();
  try {
    const raw = storage.getItem(fullKey);
    if (raw) {
      const ts = Number.parseInt(raw, 10);
      if (!Number.isNaN(ts) && now - ts < ttlMs) {
        return true;
      }
    }
    storage.setItem(fullKey, String(now));
  } catch {
    return false;
  }
  return false;
}

export function resetDedupeKey(key: string): void {
  const storage =
    typeof globalThis.sessionStorage !== "undefined"
      ? globalThis.sessionStorage
      : typeof window !== "undefined"
        ? window.sessionStorage
        : null;
  if (!storage) return;
  try {
    storage.removeItem(storageKey(key));
  } catch {
    /* ignore */
  }
}
