import { WC26_GROUPS, type Wc26GroupId } from "@/data/wc26";
import {
  getFixtureScore,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import { isLiveMatchStatus } from "@/lib/wc26-live";

/** Last two group fixtures when they share the same kickoff (FIFA final matchday). */
export function getFinalMatchdayPair(
  groupId: Wc26GroupId,
  fixtures: readonly EffectiveFixture[],
): readonly [EffectiveFixture, EffectiveFixture] | null {
  const groupFixtures = fixtures.filter(
    (fixture) => fixture.stage === "group" && fixture.groupId === groupId,
  );
  if (groupFixtures.length === 0) {
    return null;
  }

  const finalMatchday = Math.max(
    ...groupFixtures.map((fixture) => fixture.matchday ?? 0),
  );
  const matchdayFixtures = groupFixtures
    .filter((fixture) => fixture.matchday === finalMatchday)
    .sort((left, right) => left.matchNumber - right.matchNumber);

  if (matchdayFixtures.length !== 2) {
    return null;
  }

  const [first, second] = matchdayFixtures;
  if (first.kickoffUtc !== second.kickoffUtc) {
    return null;
  }

  return [first, second];
}

export function isSimultaneousFinalMatchdayFixture(
  fixture: EffectiveFixture,
  fixtures: readonly EffectiveFixture[] = [],
): boolean {
  if (fixture.stage !== "group" || !fixture.groupId) {
    return false;
  }
  const pair = getFinalMatchdayPair(fixture.groupId, fixtures);
  if (!pair) {
    return false;
  }
  return pair[0].id === fixture.id || pair[1].id === fixture.id;
}

export type SimultaneousFinalRoundGroup = {
  readonly groupId: Wc26GroupId;
  readonly fixtures: readonly [EffectiveFixture, EffectiveFixture];
};

export function listSimultaneousFinalRoundGroups(
  fixtures: readonly EffectiveFixture[],
): readonly SimultaneousFinalRoundGroup[] {
  const groups: SimultaneousFinalRoundGroup[] = [];
  for (const group of WC26_GROUPS) {
    const pair = getFinalMatchdayPair(group.id, fixtures);
    if (pair) {
      groups.push({ groupId: group.id, fixtures: pair });
    }
  }
  return groups;
}

export function findLiveSimultaneousFinalRoundGroup(
  fixtures: readonly EffectiveFixture[],
): SimultaneousFinalRoundGroup | null {
  for (const group of WC26_GROUPS) {
    const pair = getFinalMatchdayPair(group.id, fixtures);
    if (!pair) {
      continue;
    }
    const anyLive = pair.some((fixture) => isLiveMatchStatus(fixture.status));
    const anyScoredLive = pair.some(
      (fixture) =>
        isLiveMatchStatus(fixture.status) && getFixtureScore(fixture) !== null,
    );
    if (anyLive || anyScoredLive) {
      return { groupId: group.id, fixtures: pair };
    }
  }
  return null;
}