import {
  mergeFixtureOverlay,
  replaceLiveFixtureOverlay,
} from "@/lib/wc26-fixture-overlay";
import { getConfirmedKnockoutPairingByFixtureId } from "@/lib/wc26/knockout-confirmed-pairings";
import { getConfirmedKnockoutResult } from "@/lib/wc26/knockout-confirmed-results";
import { normalizeWc26MatchStatus } from "@/lib/wc26-match-status";
import { resolveOverlayKickoffUtc } from "@/lib/wc26/overlay-kickoff";
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
  const confirmedResult = getConfirmedKnockoutResult(match.matchNumber);
  const status = normalizeWc26MatchStatus(match.status, match.elapsed);
  const kickoffUtc = resolveOverlayKickoffUtc(match.fixtureId, match.kickoffUtc);

  if (confirmed && confirmedResult) {
    const resolvedStatus = confirmedResult.matchStatus ?? status;
    const entry: FixtureOverlayEntry = {
      status: resolvedStatus,
      elapsed:
        resolvedStatus === "aet" || resolvedStatus === "pen" ? 120 : 90,
      homeTeamId: confirmed.homeTeamId,
      awayTeamId: confirmed.awayTeamId,
      homeScore: confirmedResult.homeScore,
      awayScore: confirmedResult.awayScore,
      ...(match.apiFixtureId != null ? { apiFixtureId: match.apiFixtureId } : {}),
      ...(kickoffUtc ? { kickoffUtc } : {}),
      ...(confirmedResult.penaltiesHome != null
        ? { penaltiesHome: confirmedResult.penaltiesHome }
        : {}),
      ...(confirmedResult.penaltiesAway != null
        ? { penaltiesAway: confirmedResult.penaltiesAway }
        : {}),
    };
    return entry;
  }

  const homeTeamId = confirmed?.homeTeamId ?? match.homeTeamId;
  const awayTeamId = confirmed?.awayTeamId ?? match.awayTeamId;

  const entry: FixtureOverlayEntry = {
    status,
    elapsed: match.elapsed,
    ...(match.apiFixtureId != null ? { apiFixtureId: match.apiFixtureId } : {}),
    ...(homeTeamId ? { homeTeamId } : {}),
    ...(awayTeamId ? { awayTeamId } : {}),
    ...(kickoffUtc ? { kickoffUtc } : {}),
  };

  if (match.homeScore !== null && match.awayScore !== null) {
    return {
      ...entry,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      ...(match.penaltiesHome != null ? { penaltiesHome: match.penaltiesHome } : {}),
      ...(match.penaltiesAway != null ? { penaltiesAway: match.penaltiesAway } : {}),
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
  return (
    (data.configured === false && data.phase !== "confirmed-static") ||
    data.phase === "unconfigured"
  );
}

function applyScoresOutcome(outcome: FetchScoresOutcome): boolean {
  if (outcome.status === "unconfigured") {
    return false;
  }

  setSyncStatus("synced");

  const matches = Array.isArray(outcome.data.matches) ? outcome.data.matches : [];
  if (matches.length === 0) {
    return true;
  }

  mergeFixtureOverlay(overlayFromMatches(matches));
  return true;
}

/** Merge a WC26 scores API payload into the client fixture overlay (SWR-driven). */
export function applyWc26ScoresToOverlay(data: Wc26ScoresApiResponse): void {
  if (isUnconfiguredScoresResponse(data)) {
    setSyncStatus("unconfigured");
    return;
  }

  const matches = Array.isArray(data.matches) ? data.matches : [];
  const normalized: Wc26ScoresApiResponse = { ...data, matches };

  if (normalized.error) {
    setSyncStatus("degraded");
    if (matches.length > 0) {
      const partial = overlayFromMatches(matches);
      if (normalized.phase === "live") {
        replaceLiveFixtureOverlay(partial);
      } else {
        mergeFixtureOverlay(partial);
      }
    }
    return;
  }

  if (normalized.phase === "live") {
    setSyncStatus("synced");
    replaceLiveFixtureOverlay(overlayFromMatches(matches));
    return;
  }

  applyScoresOutcome({ status: "ok", data: normalized });
}

export function isLiveOverlayStatus(status: string): boolean {
  return LIVE_OVERLAY_STATUSES.has(status.trim().toLowerCase());
}
