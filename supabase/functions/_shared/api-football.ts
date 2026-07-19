const DEFAULT_BASE_URL = "https://v3.football.api-sports.io";

export type ApiFootballResponse<T> = {
  errors?: Record<string, string> | string[];
  results?: number;
  response?: T;
};

export async function apiFootballFetch<T>(
  endpoint: string,
  params: Record<string, string>,
): Promise<T[]> {
  const apiKey = Deno.env.get("API_FOOTBALL_KEY");
  if (!apiKey) {
    throw new Error("API_FOOTBALL_KEY is not configured");
  }

  const baseUrl = Deno.env.get("API_FOOTBALL_BASE_URL")?.trim() || DEFAULT_BASE_URL;
  const url = new URL(`${baseUrl}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    headers: {
      "x-apisports-key": apiKey,
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": apiKey,
    },
  });

  if (response.status === 429) {
    throw new Error("API-Football rate limit exceeded");
  }
  if (!response.ok) {
    throw new Error(`API-Football error: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as ApiFootballResponse<T>;
  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    throw new Error(`API-Football errors: ${payload.errors.join(", ")}`);
  }
  if (payload.errors && typeof payload.errors === "object" && !Array.isArray(payload.errors)) {
    const messages = Object.values(payload.errors);
    if (messages.length > 0) {
      throw new Error(`API-Football errors: ${messages.join(", ")}`);
    }
  }

  return payload.response ?? [];
}
