/** Shared title helpers for SEO metadata and GA4 page_title consistency. */

const PLACEHOLDER_PATTERNS = [
  /^TBD$/i,
  /^Winner Match/i,
  /^Loser Match/i,
  /^Winner Group/i,
  /^Runner-up Group/i,
  /^Best 3rd/i,
] as const;

export function isUnresolvedMatchParticipantLabel(label: string): boolean {
  const trimmed = label.trim();
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(trimmed));
}

/** Fix common UTF-8 mojibake and normalize separators for titles. */
export function normalizePageTitleText(text: string): string {
  return text
    .replace(/\uFFFD/g, "")
    .replace(/â€[\u0093\u0094\u201c\u201d"]/g, " | ")
    .replace(/â€"/g, " | ")
    .replace(/â€“/g, "–")
    .replace(/\s*—\s*/g, " | ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function fixtureDisplayNumber(fixtureId: string): string {
  const decoded = decodeURIComponent(fixtureId).trim();
  const match = decoded.match(/(\d+)/);
  return match?.[1] ?? decoded.replace(/^fixture-/i, "");
}

/** Stable match listing title — no bracket placeholders or live scores. */
export function buildStableMatchTitle(
  homeLabel: string,
  awayLabel: string,
  fixtureId: string,
): string {
  const home = normalizePageTitleText(homeLabel);
  const away = normalizePageTitleText(awayLabel);
  const homeOk = home && !isUnresolvedMatchParticipantLabel(home);
  const awayOk = away && !isUnresolvedMatchParticipantLabel(away);

  if (homeOk && awayOk) {
    return `${home} vs ${away}`;
  }
  if (homeOk && !awayOk) {
    return `${home} | World Cup 2026 Match`;
  }
  if (!homeOk && awayOk) {
    return `${away} | World Cup 2026 Match`;
  }

  const num = fixtureDisplayNumber(fixtureId);
  return `World Cup 2026 Match ${num}`;
}

export function analyticsTeamLabel(label: string): string {
  if (isUnresolvedMatchParticipantLabel(label)) {
    return "Undetermined";
  }
  const normalized = normalizePageTitleText(label);
  return normalized.slice(0, 120) || "Unknown";
}

export function buildMatchCentreDescription(
  homeLabel: string,
  awayLabel: string,
  fixtureId: string,
  siteName: string,
): string {
  const title = buildStableMatchTitle(homeLabel, awayLabel, fixtureId);
  return `${title}. Live centre, timeline, statistics and lineups on ${siteName}.`;
}
