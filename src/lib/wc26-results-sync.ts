import { mergeFixtureOverlay } from "@/lib/wc26-fixture-overlay";
import type {
  FixtureOverlayEntry,
  Wc26ApiMatch,
  Wc26ScoresApiResponse,
} from "@/types/fixture-overlay";

const RESULTS_URL = "/api/wc26/scores?results=wc";
const LIVE_URL = "/api/wc26/scores?live=true";
const RESULTS_INTERVAL_MS = 300_000;
const LIVE_INTERVAL_MS = 30_000;

export const WC26_SYNC_STATUS_EVENT = "wc26:sync-status";

export type Wc26SyncStatus = "pending" | "synced" | "unconfigured";

let syncStatus: Wc26SyncStatus = "pending";

function notifySyncStatus(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(WC26_SYNC_STATUS_EVENT));
}

function setSyncStatus(next: Wc26SyncStatus): void {
  if (syncStatus === next) {
    return;
  }
  syncStatus = next;
  notifySyncStatus();
}

/** Current WC26 overlay sync state for UI indicators. */
export function getWc26SyncStatus(): Wc26SyncStatus {
  return syncStatus;
}

/** Subscribe to WC26 overlay sync state changes (client only). */
export function subscribeWc26SyncStatus(onChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }
  const handler = () => onChange();
  window.addEventListener(WC26_SYNC_STATUS_EVENT, handler);
  return () => window.removeEventListener(WC26_SYNC_STATUS_EVENT, handler);
}

const LIVE_OVERLAY_STATUSES = new Set([
  "live",
  "1h",
  "2h",
  "ht",
  "et",
  "penalties",
]);

type FetchScoresOutcome =
  | { status: "ok"; data: Wc26ScoresApiResponse }
  | { status: "unconfigured" };

function overlayEntryFromApiMatch(match: Wc26ApiMatch): FixtureOverlayEntry {
  const entry: FixtureOverlayEntry = {
    status: match.status,
    elapsed: match.elapsed,
  };

  if (match.homeScore !== null && match.awayScore !== null) {
    return {
      ...entry,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
    };
  }

  return entry;
}

function overlayFromMatches(
  matches: readonly Wc26ApiMatch[],
): Record<string, FixtureOverlayEntry> {
  const partial: Record<string, FixtureOverlayEntry> = {};
  for (const match of matches) {
    partial[match.fixtureId] = overlayEntryFromApiMatch(match);
  }
  return partial;
}

function isMissingKeyPayload(body: unknown): boolean {
  if (!body || typeof body !== "object") {
    return false;
  }
  const text = JSON.stringify(body).toLowerCase();
  return (
    text.includes("missing application key") ||
    text.includes("application key missing")
  );
}

function isUnconfiguredScoresResponse(data: Wc26ScoresApiResponse): boolean {
  return data.configured === false || data.phase === "unconfigured";
}

async function fetchScores(url: string): Promise<FetchScoresOutcome> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }

    if (!res.ok) {
      if (isMissingKeyPayload(body)) {
        return { status: "unconfigured" };
      }
      return { status: "unconfigured" };
    }

    const data = body as Wc26ScoresApiResponse;
    if (isUnconfiguredScoresResponse(data)) {
      return { status: "unconfigured" };
    }

    return { status: "ok", data };
  } catch {
    return { status: "unconfigured" };
  }
}

function applyScoresOutcome(outcome: FetchScoresOutcome): boolean {
  if (outcome.status === "unconfigured") {
    return false;
  }

  setSyncStatus("synced");

  if (outcome.data.matches.length === 0) {
    return true;
  }

  mergeFixtureOverlay(overlayFromMatches(outcome.data.matches));
  return true;
}

/** Merge finished WC26 results into the client overlay. */
export async function syncWc26Results(): Promise<boolean> {
  const outcome = await fetchScores(RESULTS_URL);
  if (outcome.status === "unconfigured") {
    setSyncStatus("unconfigured");
    return false;
  }
  return applyScoresOutcome(outcome);
}

/** Merge in-progress WC26 matches into the client overlay. */
export async function syncWc26Live(): Promise<boolean> {
  const outcome = await fetchScores(LIVE_URL);
  if (outcome.status === "unconfigured") {
    setSyncStatus("unconfigured");
    return false;
  }
  return applyScoresOutcome(outcome);
}

export type Wc26SyncController = {
  stop: () => void;
};

/** Start polling WC26 results + live endpoints into the overlay. */
export function startWc26ResultsSync(): Wc26SyncController {
  if (typeof window === "undefined") {
    return { stop: () => undefined };
  }

  setSyncStatus("pending");

  let resultsTimer: ReturnType<typeof setInterval> | undefined;
  let liveTimer: ReturnType<typeof setInterval> | undefined;
  let stopped = false;

  const stopPolling = () => {
    if (stopped) {
      return;
    }
    stopped = true;
    if (resultsTimer) {
      clearInterval(resultsTimer);
      resultsTimer = undefined;
    }
    if (liveTimer) {
      clearInterval(liveTimer);
      liveTimer = undefined;
    }
  };

  const pollScores = async (url: string): Promise<boolean> => {
    if (stopped) {
      return false;
    }

    const outcome = await fetchScores(url);
    if (outcome.status === "unconfigured") {
      setSyncStatus("unconfigured");
      stopPolling();
      return false;
    }

    applyScoresOutcome(outcome);
    return true;
  };

  const tickResults = () => {
    void pollScores(RESULTS_URL);
  };

  const tickLive = () => {
    void pollScores(LIVE_URL);
  };

  void (async () => {
    if (!(await pollScores(RESULTS_URL))) {
      return;
    }
    if (!(await pollScores(LIVE_URL))) {
      return;
    }
    if (!stopped) {
      resultsTimer = setInterval(tickResults, RESULTS_INTERVAL_MS);
      liveTimer = setInterval(tickLive, LIVE_INTERVAL_MS);
    }
  })();

  return {
    stop: stopPolling,
  };
}

export function isLiveOverlayStatus(status: string): boolean {
  return LIVE_OVERLAY_STATUSES.has(status.trim().toLowerCase());
}
