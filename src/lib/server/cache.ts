/** In-memory per-instance cache — cleared on deploy / cold start. */
type CacheEntry = {
  value: unknown;
  expiry: number;
};

export const apiCache = new Map<string, CacheEntry>();

const DEFAULT_TTL_MS = 300_000;

export function getCached(key: string): unknown | null {
  const entry = apiCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    apiCache.delete(key);
    return null;
  }
  return entry.value;
}

export function setCached(
  key: string,
  value: unknown,
  ttlMs = DEFAULT_TTL_MS,
): void {
  apiCache.set(key, {
    value,
    expiry: Date.now() + ttlMs,
  });
}
