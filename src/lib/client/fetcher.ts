import { mutate } from "swr";

export const fetcher = (url: string) =>
  fetch(url).then((res) => res.json());

/** Active live match centre / match detail polling. */
export const LIVE_POLL_MATCH_MS = 30_000;

/** Hub, home, and general scoreboard polling (60–90s window). */
export const LIVE_POLL_HUB_MS = 75_000;

/** Returns 0 when the tab is hidden so SWR skips background polling. */
export function visibilityAwareRefreshInterval(intervalMs: number): number {
  if (intervalMs <= 0) {
    return 0;
  }
  if (typeof document === "undefined") {
    return intervalMs;
  }
  return document.hidden ? 0 : intervalMs;
}

function buildLiveSwrOptions(pollMs: number) {
  return {
    refreshInterval: () => visibilityAwareRefreshInterval(pollMs),
    dedupingInterval: pollMs,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  };
}

/** Default for hub/home components — slower cadence, visibility-aware. */
export const LIVE_SWR_OPTIONS = buildLiveSwrOptions(LIVE_POLL_HUB_MS);

/** Live match pages — 30s cadence, visibility-aware. */
export const LIVE_MATCH_SWR_OPTIONS = buildLiveSwrOptions(LIVE_POLL_MATCH_MS);

function registerVisibilityPollingControl(): void {
  if (typeof document === "undefined") {
    return;
  }
  document.addEventListener("visibilitychange", () => {
    void mutate(() => true, undefined, { revalidate: false });
  });
}

registerVisibilityPollingControl();
