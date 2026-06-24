import { getCached, setCached } from "@/lib/server/cache";

const STALE_TTL_MS = 900_000;

export function getStaleApiCache<T>(key: string): T | null {
  const value = getCached(`stale:${key}`);
  return value ? (value as T) : null;
}

export function setSuccessApiCache(
  key: string,
  value: unknown,
  ttlMs = 300_000,
): void {
  setCached(key, value, ttlMs);
  setCached(`stale:${key}`, value, STALE_TTL_MS);
}