const INTERNAL_STORAGE_KEY = "gc_analytics_internal_v1";
const INTERNAL_QUERY_FLAG = "gc_internal";
const INTERNAL_QUERY_KEY = "gc_internal_key";

function readEnvInternalFlag(): boolean {
  return process.env.NEXT_PUBLIC_GA_INTERNAL_TRAFFIC === "true";
}

function readUnlockSecret(): string | undefined {
  const value = process.env.NEXT_PUBLIC_GA_INTERNAL_UNLOCK?.trim();
  return value || undefined;
}

/** Persist internal flag when unlock query matches the configured secret. */
export function persistInternalTrafficFromSearch(search: string): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  if (params.get(INTERNAL_QUERY_FLAG) !== "1") return;

  const secret = readUnlockSecret();
  if (!secret) return;
  if (params.get(INTERNAL_QUERY_KEY) !== secret) return;

  try {
    sessionStorage.setItem(INTERNAL_STORAGE_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function clearInternalTrafficFlag(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(INTERNAL_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Whether hits should be tagged with traffic_type=internal (GA4 data filter). */
export function isInternalTraffic(): boolean {
  if (readEnvInternalFlag()) return true;
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(INTERNAL_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export const GA4_INTERNAL_TRAFFIC_TYPE = "internal" as const;

export const INTERNAL_TRAFFIC_DOCS = {
  storageKey: INTERNAL_STORAGE_KEY,
  queryFlag: INTERNAL_QUERY_FLAG,
  queryKey: INTERNAL_QUERY_KEY,
  envFlag: "NEXT_PUBLIC_GA_INTERNAL_TRAFFIC",
  unlockEnv: "NEXT_PUBLIC_GA_INTERNAL_UNLOCK",
} as const;
