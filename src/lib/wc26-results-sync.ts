import {
  mergeFixtureOverlay,
  replaceLiveFixtureOverlay,
} from "@/lib/wc26-fixture-overlay";
import { getConfirmedKnockoutPairingByFixtureId } from "@/lib/wc26/knockout-confirmed-pairings";
import { normalizeWc26MatchStatus } from "@/lib/wc26-match-status";
import type {
  FixtureOverlayEntry,
  Wc26ApiMatch,
  Wc26ScoresApiResponse,
} from "@/types/fixture-overlay";

export const WC26_SYNC_STATUS_EVENT = "wc26:sync-status";

export type Wc26SyncStatus = "pending" | "synced" | "unconfigured" | "degraded";

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
  const confirmed = getConfirmedKnockoutPairingByFixtureId(match.fixtureId);
  const homeTeamId = match.homeTeamId ?? confirmed?.homeTeamId;
  const awayTeamId = match.awayTeamId ?? confirmed?.awayTeamId;
  const status = normalizeWc26MatchStatus(match.status, match.elapsed);

  const entry: FixtureOverlayEntry = {
    status,
    elapsed: match.elapsed,
    ...(match.apiFixtureId != null ? { apiFixtureId: match.apiFixtureId } : {}),
    ...(homeTeamId ? { homeTeamId } : {}),
    ...(awayTeamId ? { awayTeamId } : {}),
    ...(match.kickoffUtc ? { kickoffUtc: match.kickoffUtc } : {}),
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

function isUnconfiguredScoresResponse(data: Wc26ScoresApiResponse): boolean {
  return data.configured === false || data.phase === "unconfigured";
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

/** Merge a WC26 scores API payload into the client fixture overlay (SWR-driven). */
export function applyWc26ScoresToOverlay(data: Wc26ScoresApiResponse): void {
  if (isUnconfiguredScoresResponse(data)) {
    setSyncStatus("unconfigured");
    return;
  }

  if (data.error) {
    setSyncStatus("degraded");
    if (data.matches.length > 0) {
      const partial = overlayFromMatches(data.matches);
      if (data.phase === "live") {
        replaceLiveFixtureOverlay(partial);
      } else {
        mergeFixtureOverlay(partial);
      }
    }
    return;
  }

  if (data.phase === "live") {
    setSyncStatus("synced");
    replaceLiveFixtureOverlay(overlayFromMatches(data.matches));
    return;
  }

  applyScoresOutcome({ status: "ok", data });
}

export function isLiveOverlayStatus(status: string): boolean {
  return LIVE_OVERLAY_STATUSES.has(status.trim().toLowerCase());
}
