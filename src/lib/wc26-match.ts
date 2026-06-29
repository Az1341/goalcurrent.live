import {
  getFixtureById,
  getFixturesByGroup,
  getTeamById,
  WC26_FIXTURES,
} from "@/data/wc26";
import type { Fixture } from "@/types/fixture";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import {
  buildHomepageMatchView,
  type HomepageMatchView,
} from "@/lib/wc26-live";

/** Canonical match detail route for a WC26 fixture id. */
export function matchHref(fixtureId: string): string {
  return `/match/${encodeURIComponent(fixtureId)}`;
}

export function isKnownFixtureId(fixtureId: string): boolean {
  return Boolean(getFixtureById(fixtureId));
}

/** Header view for match detail — merges overlay fields when present. */
export function buildMatchDetailHeader(
  fixture: EffectiveFixture,
  allFixtures?: readonly EffectiveFixture[],
): HomepageMatchView {
  return buildHomepageMatchView(fixture, allFixtures);
}

export const MATCH_STAT_LABELS: Record<string, string> = {
  ball_possession: "Possession",
  total_shots: "Shots",
  shots_on_goal: "Shots on target",
  shots_off_goal: "Shots off target",
  corner_kicks: "Corners",
  fouls: "Fouls",
  offsides: "Offsides",
  yellow_cards: "Yellow cards",
  red_cards: "Red cards",
  goalkeeper_saves: "Saves",
  total_passes: "Passes",
  passes_accurate: "Accurate passes",
  expected_goals: "Expected goals",
};

export function formatEventSummary(event: {
  type: string;
  detail: string;
  playerName: string;
  assistName: string | null;
}): string {
  const type = event.type.toLowerCase();
  const detail = event.detail.toLowerCase();

  if (type === "goal") {
    const assist = event.assistName ? ` (assist: ${event.assistName})` : "";
    if (detail.includes("penalty")) {
      return `Penalty goal — ${event.playerName}${assist}`;
    }
    if (detail.includes("own")) {
      return `Own goal — ${event.playerName}`;
    }
    return `Goal — ${event.playerName}${assist}`;
  }

  if (type === "card") {
    if (detail.includes("red")) {
      return `Red card — ${event.playerName}`;
    }
    return `Yellow card — ${event.playerName}`;
  }

  if (type === "subst") {
    return `Substitution — ${event.playerName}`;
  }

  if (type === "var") {
    return `VAR — ${event.detail}: ${event.playerName}`;
  }

  return `${event.type} — ${event.playerName}`;
}

export function formatEventMinute(
  minute: number | null,
  extra: number | null,
): string {
  if (minute == null) {
    return "–";
  }
  if (extra != null && extra > 0) {
    return `${minute}+${extra}'`;
  }
  return `${minute}'`;
}

const KICKOFF_ORDERED_FIXTURES: readonly Fixture[] = [...WC26_FIXTURES].sort(
  (left, right) => left.kickoffUtc.localeCompare(right.kickoffUtc),
);

export function getAdjacentFixtures(fixtureId: string): {
  previous: Fixture | null;
  next: Fixture | null;
} {
  const index = KICKOFF_ORDERED_FIXTURES.findIndex(
    (fixture) => fixture.id === fixtureId,
  );
  if (index < 0) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? KICKOFF_ORDERED_FIXTURES[index - 1]! : null,
    next:
      index < KICKOFF_ORDERED_FIXTURES.length - 1
        ? KICKOFF_ORDERED_FIXTURES[index + 1]!
        : null,
  };
}

export function getSameGroupFixtures(fixtureId: string): readonly Fixture[] {
  const fixture = getFixtureById(fixtureId);
  if (!fixture?.groupId) {
    return [];
  }

  return getFixturesByGroup(fixture.groupId).filter(
    (entry) => entry.id !== fixtureId,
  );
}

export function formatFixtureNavLabel(fixture: EffectiveFixture | Fixture): string {
  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  return `${home?.name ?? fixture.homeTeamId} vs ${away?.name ?? fixture.awayTeamId}`;
}
