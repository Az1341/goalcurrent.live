import { getTeamById, getTeamsByGroup, groupLabel } from "@/data/wc26";
import {
  getFixtureScore,
  isEffectiveFixtureCompleted,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import { getFinalMatchdayPair } from "@/lib/wc26-final-matchday";
import { buildHomepageMatchView, isLiveMatchStatus } from "@/lib/wc26-live";
import { isCompletedMatchStatus } from "@/lib/wc26-tournament-stats";
import { resolveTeamId } from "@/lib/teamIdentity";
import { filterTopScorersForTeams } from "@/lib/wc26-top-scorers-group";
import { SITE_NAME } from "@/lib/site-url";
import type { Wc26GroupId } from "@/types/group";
import type { NewsArticle } from "@/types/news";
import type { Team, TeamId } from "@/types/team";
import type { TopScorerRow } from "@/lib/wc26-top-scorers";

export type GroupFormResult = "W" | "D" | "L";

export type GroupHeaderStats = {
  readonly gamesPlayed: number;
  readonly gamesLeft: number;
  readonly goalsScored: number;
  readonly totalFixtures: number;
};

export type GroupMatchStats = {
  readonly totalGoals: number;
  readonly averageGoalsPerGame: number | null;
  readonly cleanSheets: number;
  readonly highestScoringMatch: {
    readonly fixtureId: string;
    readonly label: string;
    readonly totalGoals: number;
  } | null;
  readonly completedMatches: number;
};

function groupFixtures(
  groupId: Wc26GroupId,
  fixtures: readonly EffectiveFixture[],
): EffectiveFixture[] {
  return fixtures.filter(
    (fixture) => fixture.groupId === groupId && fixture.stage === "group",
  );
}

export function computeGroupHeaderStats(
  groupId: Wc26GroupId,
  fixtures: readonly EffectiveFixture[],
): GroupHeaderStats {
  const groupMatches = groupFixtures(groupId, fixtures);
  let gamesPlayed = 0;
  let goalsScored = 0;

  for (const fixture of groupMatches) {
    if (!isCompletedMatchStatus(fixture.status)) {
      continue;
    }

    const score = getFixtureScore(fixture);
    if (!score) {
      continue;
    }

    gamesPlayed += 1;
    goalsScored += score.home + score.away;
  }

  return {
    gamesPlayed,
    gamesLeft: Math.max(groupMatches.length - gamesPlayed, 0),
    goalsScored,
    totalFixtures: groupMatches.length,
  };
}

export function partitionGroupFixtures(
  groupId: Wc26GroupId,
  fixtures: readonly EffectiveFixture[],
  now: Date = new Date(),
): {
  readonly upcoming: readonly EffectiveFixture[];
  readonly completed: readonly EffectiveFixture[];
} {
  const groupMatches = groupFixtures(groupId, fixtures);
  const upcoming: EffectiveFixture[] = [];
  const completed: EffectiveFixture[] = [];

  for (const fixture of groupMatches) {
    if (isEffectiveFixtureCompleted(fixture, now)) {
      completed.push(fixture);
    } else {
      upcoming.push(fixture);
    }
  }

  upcoming.sort(
    (left, right) =>
      new Date(left.kickoffUtc).getTime() - new Date(right.kickoffUtc).getTime(),
  );
  completed.sort(
    (left, right) =>
      new Date(right.kickoffUtc).getTime() - new Date(left.kickoffUtc).getTime(),
  );

  return { upcoming, completed };
}

/** Final matchday pair when at least one fixture is live or has a score. */
export function getActiveFinalMatchdayPair(
  groupId: Wc26GroupId,
  fixtures: readonly EffectiveFixture[],
): readonly [EffectiveFixture, EffectiveFixture] | null {
  const pair = getFinalMatchdayPair(groupId, fixtures);
  if (!pair) {
    return null;
  }

  const active = pair.some(
    (fixture) =>
      isLiveMatchStatus(fixture.status) || getFixtureScore(fixture) !== null,
  );
  return active ? pair : null;
}

export function selectNextGroupMatch(
  groupId: Wc26GroupId,
  fixtures: readonly EffectiveFixture[],
  now: Date = new Date(),
): EffectiveFixture | null {
  const { upcoming } = partitionGroupFixtures(groupId, fixtures, now);
  return upcoming[0] ?? null;
}

export function computeTeamFormMap(
  groupId: Wc26GroupId,
  fixtures: readonly EffectiveFixture[],
  limit = 5,
): ReadonlyMap<TeamId, readonly GroupFormResult[]> {
  const teams = getTeamsByGroup(groupId);
  const form = new Map<TeamId, GroupFormResult[]>();

  for (const team of teams) {
    const results: GroupFormResult[] = [];
    const teamMatches = groupFixtures(groupId, fixtures)
      .filter(
        (fixture) =>
          isCompletedMatchStatus(fixture.status) &&
          (fixture.homeTeamId === team.id || fixture.awayTeamId === team.id),
      )
      .sort(
        (left, right) =>
          new Date(right.kickoffUtc).getTime() -
          new Date(left.kickoffUtc).getTime(),
      );

    for (const fixture of teamMatches) {
      if (results.length >= limit) {
        break;
      }

      const score = getFixtureScore(fixture);
      if (!score) {
        continue;
      }

      const isHome = fixture.homeTeamId === team.id;
      const goalsFor = isHome ? score.home : score.away;
      const goalsAgainst = isHome ? score.away : score.home;

      if (goalsFor > goalsAgainst) {
        results.push("W");
      } else if (goalsFor < goalsAgainst) {
        results.push("L");
      } else {
        results.push("D");
      }
    }

    form.set(team.id, results);
  }

  return form;
}

export function computeGroupMatchStats(
  groupId: Wc26GroupId,
  fixtures: readonly EffectiveFixture[],
): GroupMatchStats {
  const completed = groupFixtures(groupId, fixtures).filter((fixture) => {
    if (!isCompletedMatchStatus(fixture.status)) {
      return false;
    }
    return getFixtureScore(fixture) != null;
  });

  let totalGoals = 0;
  let cleanSheets = 0;
  let highest: GroupMatchStats["highestScoringMatch"] = null;

  for (const fixture of completed) {
    const score = getFixtureScore(fixture);
    if (!score) {
      continue;
    }

    const matchTotal = score.home + score.away;
    totalGoals += matchTotal;

    if (score.home === 0) {
      cleanSheets += 1;
    }
    if (score.away === 0) {
      cleanSheets += 1;
    }

    const home = getTeamById(fixture.homeTeamId);
    const away = getTeamById(fixture.awayTeamId);
    const label = `${home?.name ?? fixture.homeTeamId} ${score.home}–${score.away} ${away?.name ?? fixture.awayTeamId}`;

    if (!highest || matchTotal > highest.totalGoals) {
      highest = {
        fixtureId: fixture.id,
        label,
        totalGoals: matchTotal,
      };
    }
  }

  return {
    totalGoals,
    averageGoalsPerGame:
      completed.length > 0 ? totalGoals / completed.length : null,
    cleanSheets,
    highestScoringMatch: highest,
    completedMatches: completed.length,
  };
}

function articleText(article: NewsArticle): string {
  return `${article.title} ${article.excerpt}`.toLowerCase();
}

function teamMentionKeys(team: Team): string[] {
  return [
    team.name,
    team.code,
    team.id,
    ...team.aliases,
  ]
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function filterNewsForGroup(
  articles: readonly NewsArticle[],
  groupId: Wc26GroupId,
  limit = 6,
): NewsArticle[] {
  const teams = getTeamsByGroup(groupId);
  const matches: NewsArticle[] = [];

  for (const article of articles) {
    const haystack = articleText(article);
    const mentioned = teams.some((team) =>
      teamMentionKeys(team).some(
        (key) => key.length >= 3 && haystack.includes(key),
      ),
    );

    if (mentioned) {
      matches.push(article);
    }

    if (matches.length >= limit) {
      break;
    }
  }

  return matches;
}

export function filterTopScorersForGroup(
  scorers: readonly TopScorerRow[],
  groupId: Wc26GroupId,
  limit = 5,
): TopScorerRow[] {
  const teamIds = new Set(getTeamsByGroup(groupId).map((team) => team.id));
  return filterTopScorersForTeams(scorers, teamIds, limit);
}

export function buildGroupTeamNamesList(groupId: Wc26GroupId): string {
  return getTeamsByGroup(groupId)
    .map((team) => team.name)
    .join(", ");
}

export function groupHubTitle(groupId: Wc26GroupId): string {
  return `${groupLabel(groupId)} Standings, Fixtures, Results and News — FIFA World Cup 2026`;
}

export function groupHubDescription(groupId: Wc26GroupId): string {
  const teams = buildGroupTeamNamesList(groupId);
  return `${groupLabel(groupId)} at FIFA World Cup 2026 — final standings, fixtures, results, top scorers and news for ${teams} on ${SITE_NAME}.`;
}

export { buildHomepageMatchView };
