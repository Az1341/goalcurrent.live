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

const LIVE_OVERLAY_STATUSES = new Set([
  "live",
  "1h",
  "2h",
  "ht",
  "et",
  "penalties",
]);

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

async function fetchScores(url: string): Promise<Wc26ScoresApiResponse | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as Wc26ScoresApiResponse;
  } catch {
    return null;
  }
}

/** Merge finished WC26 results into the client overlay. */
export async function syncWc26Results(): Promise<boolean> {
  const data = await fetchScores(RESULTS_URL);
  if (!data?.configured || data.matches.length === 0) {
    return false;
  }
  mergeFixtureOverlay(overlayFromMatches(data.matches));
  return true;
}

/** Merge in-progress WC26 matches into the client overlay. */
export async function syncWc26Live(): Promise<boolean> {
  const data = await fetchScores(LIVE_URL);
  if (!data?.configured) {
    return false;
  }

  if (data.matches.length === 0) {
    return false;
  }

  mergeFixtureOverlay(overlayFromMatches(data.matches));
  return true;
}

export type Wc26SyncController = {
  stop: () => void;
};

/** Start polling WC26 results + live endpoints into the overlay. */
export function startWc26ResultsSync(): Wc26SyncController {
  if (typeof window === "undefined") {
    return { stop: () => undefined };
  }

  let resultsTimer: ReturnType<typeof setInterval> | undefined;
  let liveTimer: ReturnType<typeof setInterval> | undefined;
  let stopped = false;

  const tickResults = () => {
    if (!stopped) {
      void syncWc26Results();
    }
  };

  const tickLive = () => {
    if (!stopped) {
      void syncWc26Live();
    }
  };

  void (async () => {
    await syncWc26Results();
    await syncWc26Live();
  })();

  resultsTimer = setInterval(tickResults, RESULTS_INTERVAL_MS);
  liveTimer = setInterval(tickLive, LIVE_INTERVAL_MS);

  return {
    stop: () => {
      stopped = true;
      if (resultsTimer) {
        clearInterval(resultsTimer);
      }
      if (liveTimer) {
        clearInterval(liveTimer);
      }
    },
  };
}

export function isLiveOverlayStatus(status: string): boolean {
  return LIVE_OVERLAY_STATUSES.has(status.trim().toLowerCase());
}
