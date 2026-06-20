import {
  API_FOOTBALL_BASE_URL,
  PL_LEAGUE_ID,
  PL_LEAGUE_NAME,
  PL_SEASON,
} from "@/lib/pl/constants";
import type { PlStandingsSource } from "@/lib/pl/types";

export function getApiKey(): string | undefined {
  return process.env.API_FOOTBALL_KEY?.trim() || undefined;
}

export function isPlApiConfigured(): boolean {
  return Boolean(getApiKey());
}

export function isAuthError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("token") ||
    lower.includes("key") ||
    lower.includes("missing application key") ||
    lower.includes("application key missing")
  );
}

export function isQuotaError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("ratelimit") ||
    lower.includes("too many requests") ||
    lower.includes("request limit") ||
    lower.includes("429")
  );
}

export type PlApiEnvelope<TData> = {
  configured: boolean;
  league: typeof PL_LEAGUE_NAME;
  leagueId: typeof PL_LEAGUE_ID;
  season: typeof PL_SEASON;
  source: PlStandingsSource;
  fetchedAt: string;
  error?: string;
} & TData;

export function plBaseEnvelope<TData>(
  source: PlStandingsSource,
  data: TData,
  overrides: Partial<PlApiEnvelope<TData>> = {},
): PlApiEnvelope<TData> {
  return {
    configured: isPlApiConfigured(),
    league: PL_LEAGUE_NAME,
    leagueId: PL_LEAGUE_ID,
    season: PL_SEASON,
    source,
    fetchedAt: new Date().toISOString(),
    ...data,
    ...overrides,
  };
}

export function plGenericCacheControl(
  configured: boolean,
  hasData: boolean,
  source: PlStandingsSource,
): string {
  if (!configured) return "no-store";
  if (hasData && source === "api-football") {
    return "s-maxage=300, stale-while-revalidate=60";
  }
  return "s-maxage=3600, stale-while-revalidate=300";
}

type ApiFootballPayload<T> = {
  errors?: Record<string, string>;
  results?: number;
  paging?: { current: number; total: number };
  response?: T;
};

export type ApiFootballFetchResult<T> =
  | { ok: true; data: T; results: number }
  | { ok: false; kind: "unconfigured" }
  | { ok: false; kind: "auth" | "quota" | "api"; message: string };

export async function apiFootballFetch<T>(
  path: string,
): Promise<ApiFootballFetchResult<T>> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, kind: "unconfigured" };
  }

  const res = await fetch(`${API_FOOTBALL_BASE_URL}${path}`, {
    headers: { "x-apisports-key": apiKey },
    next: { revalidate: 0 },
  });

  if (res.status === 429) {
    return { ok: false, kind: "quota", message: "API rate limit reached." };
  }

  if (res.status === 401 || res.status === 403) {
    return {
      ok: false,
      kind: "auth",
      message: "API key rejected. Check API_FOOTBALL_KEY.",
    };
  }

  if (!res.ok) {
    const text = await res.text();
    return {
      ok: false,
      kind: "api",
      message: `api-sports ${res.status}: ${text.slice(0, 200)}`,
    };
  }

  const payload = (await res.json()) as ApiFootballPayload<T>;

  if (payload.errors && Object.keys(payload.errors).length > 0) {
    const errorText = JSON.stringify(payload.errors);
    if (isAuthError(errorText)) {
      return {
        ok: false,
        kind: "auth",
        message: "API key invalid or missing permissions.",
      };
    }
    return { ok: false, kind: "api", message: errorText };
  }

  return {
    ok: true,
    data: (payload.response ?? []) as T,
    results: payload.results ?? 0,
  };
}

export async function apiFootballFetchAllPages<TItem>(
  buildPath: (page: number) => string,
): Promise<ApiFootballFetchResult<TItem[]>> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, kind: "unconfigured" };
  }

  const items: TItem[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const res = await fetch(`${API_FOOTBALL_BASE_URL}${buildPath(page)}`, {
      headers: { "x-apisports-key": apiKey },
      next: { revalidate: 0 },
    });

    if (res.status === 429) {
      return { ok: false, kind: "quota", message: "API rate limit reached." };
    }

    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        kind: "auth",
        message: "API key rejected. Check API_FOOTBALL_KEY.",
      };
    }

    if (!res.ok) {
      const text = await res.text();
      return {
        ok: false,
        kind: "api",
        message: `api-sports ${res.status}: ${text.slice(0, 200)}`,
      };
    }

    const payload = (await res.json()) as ApiFootballPayload<TItem[]>;

    if (payload.errors && Object.keys(payload.errors).length > 0) {
      const errorText = JSON.stringify(payload.errors);
      if (isAuthError(errorText)) {
        return {
          ok: false,
          kind: "auth",
          message: "API key invalid or missing permissions.",
        };
      }
      return { ok: false, kind: "api", message: errorText };
    }

    items.push(...(payload.response ?? []));
    totalPages = payload.paging?.total ?? 1;
    page += 1;
  }

  return { ok: true, data: items, results: items.length };
}
