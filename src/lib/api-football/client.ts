import { API_FOOTBALL_BASE_URL } from "@/lib/pl/constants";
import {
  ApiFootballAuthError,
  ApiFootballNetworkError,
  ApiFootballRateLimitError,
  isAuthErrorMessage,
  isQuotaErrorMessage,
} from "./errors";

const DEFAULT_TIMEOUT_MS = 12_000;

export type ApiFootballPayload<T> = {
  errors?: Record<string, string>;
  results?: number;
  paging?: { current: number; total: number };
  response?: T;
};

export type ApiFootballFetchResult<T> = {
  data: T;
  results: number;
  paging?: { current: number; total: number };
};

export function isApiFootballConfigured(): boolean {
  return Boolean(process.env.API_FOOTBALL_KEY?.trim());
}

export function getApiFootballKey(): string | undefined {
  return process.env.API_FOOTBALL_KEY?.trim() || undefined;
}

export async function apiFootballFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiFootballFetchResult<T>> {
  const apiKey = getApiFootballKey();
  if (!apiKey) {
    throw new ApiFootballAuthError("API_FOOTBALL_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_FOOTBALL_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "x-apisports-key": apiKey,
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });

    if (res.status === 429) {
      throw new ApiFootballRateLimitError();
    }

    if (res.status === 401 || res.status === 403) {
      throw new ApiFootballAuthError(`Status ${res.status}`);
    }

    if (!res.ok) {
      const text = await res.text();
      throw new ApiFootballNetworkError(`Status ${res.status}: ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as ApiFootballPayload<T>;

    if (json.errors && Object.keys(json.errors).length > 0) {
      const errorText = JSON.stringify(json.errors);
      if (isAuthErrorMessage(errorText)) {
        throw new ApiFootballAuthError(errorText);
      }
      if (isQuotaErrorMessage(errorText)) {
        throw new ApiFootballRateLimitError(errorText);
      }
      throw new ApiFootballNetworkError(errorText);
    }

    return {
      data: (json.response ?? []) as T,
      results: json.results ?? 0,
      paging: json.paging,
    };
  } catch (error) {
    if (
      error instanceof ApiFootballRateLimitError ||
      error instanceof ApiFootballNetworkError ||
      error instanceof ApiFootballAuthError
    ) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiFootballNetworkError("API-Football request timed out");
    }

    throw new ApiFootballNetworkError("Unexpected API-Football error");
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiFootballFetchAllPages<TItem>(
  buildPath: (page: number) => string,
): Promise<ApiFootballFetchResult<TItem[]>> {
  const items: TItem[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const result = await apiFootballFetch<TItem[]>(buildPath(page));
    items.push(...result.data);
    totalPages = result.paging?.total ?? 1;
    page += 1;
  }

  return { data: items, results: items.length };
}