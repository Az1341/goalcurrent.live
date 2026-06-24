import type { PlFixtureRow } from "@/lib/pl/types";
import { isCompletedMatchStatus } from "@/lib/wc26-tournament-stats";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";

export type FormResult = "W" | "D" | "L";

function parseKickoff(kickoffUtc: string): number {
  const ms = new Date(kickoffUtc).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

export function teamNameMatches(
  fixtureName: string,
  teamName: string,
  aliases: string[] = [],
): boolean {
  const target = fixtureName.trim().toLowerCase();
  const names = [teamName, ...aliases].map((name) => name.trim().toLowerCase());
  return names.some(
    (name) => name === target || target.includes(name) || name.includes(target),
  );
}

export function filterPlTeamFixtures(
  fixtures: PlFixtureRow[],
  teamName: string,
  aliases: string[] = [],
): PlFixtureRow[] {
  return fixtures.filter(
    (fixture) =>
      teamNameMatches(fixture.homeTeamName, teamName, aliases) ||
      teamNameMatches(fixture.awayTeamName, teamName, aliases),
  );
}

export function getLatestPlResult(
  fixtures: PlFixtureRow[],
  teamName: string,
  aliases: string[] = [],
): PlFixtureRow | null {
  const completed = filterPlTeamFixtures(fixtures, teamName, aliases)
    .filter((fixture) => fixture.status === "FT")
    .sort((a, b) => parseKickoff(b.kickoffUtc) - parseKickoff(a.kickoffUtc));
  return completed[0] ?? null;
}

export function getNextPlFixture(
  fixtures: PlFixtureRow[],
  teamName: string,
  aliases: string[] = [],
): PlFixtureRow | null {
  const now = Date.now();
  const upcoming = filterPlTeamFixtures(fixtures, teamName, aliases)
    .filter(
      (fixture) =>
        fixture.status === "UPCOMING" ||
        fixture.status === "LIVE" ||
        parseKickoff(fixture.kickoffUtc) >= now,
    )
    .sort((a, b) => parseKickoff(a.kickoffUtc) - parseKickoff(b.kickoffUtc));
  return upcoming[0] ?? null;
}

export function computePlFormFromFixtures(
  fixtures: PlFixtureRow[],
  teamName: string,
  aliases: string[] = [],
  limit = 5,
): FormResult[] {
  const completed = filterPlTeamFixtures(fixtures, teamName, aliases)
    .filter(
      (fixture) =>
        fixture.status === "FT" &&
        fixture.homeScore !== null &&
        fixture.awayScore !== null,
    )
    .sort((a, b) => parseKickoff(b.kickoffUtc) - parseKickoff(a.kickoffUtc));

  return completed.slice(0, limit).map((fixture) => {
    const isHome = teamNameMatches(fixture.homeTeamName, teamName, aliases);
    const scored = isHome ? fixture.homeScore! : fixture.awayScore!;
    const conceded = isHome ? fixture.awayScore! : fixture.homeScore!;
    if (scored > conceded) return "W";
    if (scored < conceded) return "L";
    return "D";
  });
}

export function parseStandingForm(form: string | null | undefined): FormResult[] {
  if (!form) return [];
  return form
    .split("")
    .map((char) => char.toUpperCase())
    .filter((char): char is FormResult => char === "W" || char === "D" || char === "L");
}

export function getPlH2H(
  fixtures: PlFixtureRow[],
  teamName: string,
  opponentName: string,
  aliases: string[] = [],
): PlFixtureRow[] {
  return fixtures
    .filter(
      (fixture) =>
        fixture.status === "FT" &&
        ((teamNameMatches(fixture.homeTeamName, teamName, aliases) &&
          teamNameMatches(fixture.awayTeamName, opponentName)) ||
          (teamNameMatches(fixture.awayTeamName, teamName, aliases) &&
            teamNameMatches(fixture.homeTeamName, opponentName))),
    )
    .sort((a, b) => parseKickoff(b.kickoffUtc) - parseKickoff(a.kickoffUtc));
}

export function filterWc26TeamFixtures(
  fixtures: readonly EffectiveFixture[],
  teamId: string,
): EffectiveFixture[] {
  return fixtures.filter(
    (fixture) =>
      fixture.homeTeamId === teamId || fixture.awayTeamId === teamId,
  );
}

export function isWc26FixtureComplete(fixture: EffectiveFixture): boolean {
  return (
    isCompletedMatchStatus(fixture.status) &&
    fixture.homeScore !== undefined &&
    fixture.awayScore !== undefined
  );
}

export function getLatestWc26Result(
  fixtures: readonly EffectiveFixture[],
  teamId: string,
): EffectiveFixture | null {
  const completed = filterWc26TeamFixtures(fixtures, teamId)
    .filter(isWc26FixtureComplete)
    .sort((a, b) => parseKickoff(b.kickoffUtc) - parseKickoff(a.kickoffUtc));
  return completed[0] ?? null;
}

export function getNextWc26Fixture(
  fixtures: readonly EffectiveFixture[],
  teamId: string,
): EffectiveFixture | null {
  const now = Date.now();
  const upcoming = filterWc26TeamFixtures(fixtures, teamId)
    .filter(
      (fixture) =>
        !isWc26FixtureComplete(fixture) &&
        parseKickoff(fixture.kickoffUtc) >= now,
    )
    .sort((a, b) => parseKickoff(a.kickoffUtc) - parseKickoff(b.kickoffUtc));
  return upcoming[0] ?? null;
}

export function computeWc26Form(
  fixtures: readonly EffectiveFixture[],
  teamId: string,
  limit = 5,
): FormResult[] {
  const completed = filterWc26TeamFixtures(fixtures, teamId)
    .filter(isWc26FixtureComplete)
    .sort((a, b) => parseKickoff(b.kickoffUtc) - parseKickoff(a.kickoffUtc));

  return completed.slice(0, limit).map((fixture) => {
    const isHome = fixture.homeTeamId === teamId;
    const scored = isHome ? fixture.homeScore! : fixture.awayScore!;
    const conceded = isHome ? fixture.awayScore! : fixture.homeScore!;
    if (scored > conceded) return "W";
    if (scored < conceded) return "L";
    return "D";
  });
}

export function getWc26H2H(
  fixtures: readonly EffectiveFixture[],
  teamId: string,
  opponentId: string,
): EffectiveFixture[] {
  return fixtures
    .filter(
      (fixture) =>
        isWc26FixtureComplete(fixture) &&
        ((fixture.homeTeamId === teamId && fixture.awayTeamId === opponentId) ||
          (fixture.awayTeamId === teamId && fixture.homeTeamId === opponentId)),
    )
    .sort((a, b) => parseKickoff(b.kickoffUtc) - parseKickoff(a.kickoffUtc));
}

export function filterNewsByKeywords<T extends { title: string; excerpt: string }>(
  articles: readonly T[],
  keywords: string[],
): T[] {
  const normalized = keywords
    .map((keyword) => keyword.trim().toLowerCase())
    .filter(Boolean);
  if (!normalized.length) return [] as T[];

  return articles.filter((article) => {
    const haystack = `${article.title} ${article.excerpt}`.toLowerCase();
    return normalized.some((keyword) => haystack.includes(keyword));
  });
}