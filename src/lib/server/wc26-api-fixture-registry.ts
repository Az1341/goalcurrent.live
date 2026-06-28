import type { Wc26ApiMatch } from "@/types/fixture-overlay";

const registry = new Map<string, number>();

/** Remember api-sports fixture ids from live/results score sync. */
export function registerWc26ApiFixtureIds(
  matches: readonly Wc26ApiMatch[],
): void {
  for (const match of matches) {
    if (match.apiFixtureId != null && Number.isFinite(match.apiFixtureId)) {
      registry.set(match.fixtureId, match.apiFixtureId);
    }
  }
}

export function getRegisteredWc26ApiFixtureId(
  fixtureId: string,
): number | undefined {
  const value = registry.get(fixtureId);
  return value != null && Number.isFinite(value) ? value : undefined;
}
