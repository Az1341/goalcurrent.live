/** Lineups are revealed this many milliseconds before scheduled kick-off. */
export const LINEUP_PREVIEW_MS = 30 * 60 * 1_000;

export function kickoffMs(kickoffUtc: string): number | null {
  const ms = new Date(kickoffUtc).getTime();
  return Number.isFinite(ms) ? ms : null;
}

/** True when the visitor is within 30 minutes of kick-off (or the match has started). */
export function isLineupRevealWindow(
  kickoffUtc: string,
  nowMs: number = Date.now(),
): boolean {
  const start = kickoffMs(kickoffUtc);
  if (start == null) return false;
  return nowMs >= start - LINEUP_PREVIEW_MS;
}

/** Milliseconds until the lineup preview window opens; 0 when already open. */
export function msUntilLineupReveal(
  kickoffUtc: string,
  nowMs: number = Date.now(),
): number {
  const start = kickoffMs(kickoffUtc);
  if (start == null) return Infinity;
  return Math.max(0, start - LINEUP_PREVIEW_MS - nowMs);
}