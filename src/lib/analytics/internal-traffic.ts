const INTERNAL_STORAGE_KEY = "gc_analytics_internal_v1";
const INTERNAL_COOKIE_NAME = "gc_internal_v1";
const INTERNAL_QUERY_FLAG = "gc_internal";
const INTERNAL_QUERY_KEY = "gc_internal_key";

function readEnvInternalFlag(): boolean {
  return process.env.NEXT_PUBLIC_GA_INTERNAL_TRAFFIC === "true";
}

function hasInternalCookie(): boolean {
  if (typeof document === "undefined" || typeof document.cookie !== "string") {
    return false;
  }
  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(INTERNAL_COOKIE_NAME + "="));
}

/**
 * Handle the ?gc_internal=1&gc_internal_key=... unlock query.
 *
 * SECURITY: the secret is validated SERVER-SIDE by
 * /api/analytics/internal-unlock (GA_INTERNAL_UNLOCK_SECRET). The old flow
 * compared the key against NEXT_PUBLIC_GA_INTERNAL_UNLOCK, which ships in the
 * client bundle and is therefore not a secret. Kept synchronous (fire and
 * forget) so existing callers do not need to await it.
 */
export function persistInternalTrafficFromSearch(search: string): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(
    search.startsWith("?") ? search : "?" + search,
  );
  if (params.get(INTERNAL_QUERY_FLAG) !== "1") return;

  const key = params.get(INTERNAL_QUERY_KEY);
  if (!key) return;

  void fetch("/api/analytics/internal-unlock", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ key }),
  })
    .then((res) => {
      if (!res.ok) return;
      try {
        sessionStorage.setItem(INTERNAL_STORAGE_KEY, "1");
      } catch {
        /* private mode */
      }
    })
    .catch(() => {
      /* offline — cookie flow will apply on reload */
    });
}

export function clearInternalTrafficFlag(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(INTERNAL_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  void fetch("/api/analytics/internal-unlock", { method: "DELETE" }).catch(
    () => {},
  );
}

/** Whether hits should be tagged with traffic_type=internal (GA4 data filter). */
export function isInternalTraffic(): boolean {
  if (readEnvInternalFlag()) return true;
  if (typeof window === "undefined") return false;
  if (hasInternalCookie()) return true;
  try {
    return sessionStorage.getItem(INTERNAL_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export const GA4_INTERNAL_TRAFFIC_TYPE = "internal" as const;

export const INTERNAL_TRAFFIC_DOCS = {
  storageKey: INTERNAL_STORAGE_KEY,
  cookieName: INTERNAL_COOKIE_NAME,
  queryFlag: INTERNAL_QUERY_FLAG,
  queryKey: INTERNAL_QUERY_KEY,
  envFlag: "NEXT_PUBLIC_GA_INTERNAL_TRAFFIC",
  unlockEndpoint: "/api/analytics/internal-unlock",
  unlockEnv: "GA_INTERNAL_UNLOCK_SECRET",
} as const;
