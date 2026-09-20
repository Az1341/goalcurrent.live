"use client";

import { useMemo } from "react";
import { useLiveFacupFixtures } from "@/lib/client/useLiveFacupFixtures";
import { useLiveFixtures } from "@/lib/client/useLiveFixtures";
import { useLiveUclFixtures } from "@/lib/client/useLiveUclFixtures";
import { useLiveUnlFixtures } from "@/lib/client/useLiveUnlFixtures";
import {
  mergeMatchdayFeeds,
  normalizeFacupFixtures,
  normalizePlFixtures,
  normalizeUclFixtures,
  normalizeUnlFixtures,
  type CompetitionFeedState,
  type MatchdayCard,
} from "@/lib/home/matchday";
import type { PlFixtureRow } from "@/lib/pl/types";

export type HomeMatchdayFixturesResult = {
  cards: MatchdayCard[];
  plFixtures: readonly PlFixtureRow[];
  anyLoading: boolean;
  anyError: boolean;
  anyStale: boolean;
  allLoadingEmpty: boolean;
  hasAnyData: boolean;
  earliestFetchedAt: string | null;
  feeds: {
    pl: CompetitionFeedState;
    ucl: CompetitionFeedState;
    facup: CompetitionFeedState;
    unl: CompetitionFeedState;
  };
};

/** Single parent-level subscription for homepage matchday across wired competitions. */
export function useHomeMatchdayFixtures(): HomeMatchdayFixturesResult {
  const pl = useLiveFixtures();
  const ucl = useLiveUclFixtures();
  const facup = useLiveFacupFixtures();
  const unl = useLiveUnlFixtures();

  const feeds = useMemo(() => {
    const plFeed: CompetitionFeedState = {
      cards: normalizePlFixtures(pl.data?.fixtures ?? []),
      isLoading: Boolean(pl.isLoading && !pl.data),
      error: Boolean(pl.error) || Boolean(pl.data?.error),
      stale: Boolean(pl.data?.stale),
      fetchedAt: pl.data?.fetchedAt ?? null,
      configured: pl.data?.configured ?? true,
    };
    const uclFeed: CompetitionFeedState = {
      cards: normalizeUclFixtures(ucl.data?.fixtures ?? []),
      isLoading: Boolean(ucl.isLoading && !ucl.data),
      error: Boolean(ucl.error) || Boolean(ucl.data?.error),
      stale: Boolean(ucl.data?.stale),
      fetchedAt: ucl.data?.fetchedAt ?? null,
      configured: ucl.data?.configured ?? true,
    };
    const facupFeed: CompetitionFeedState = {
      cards: normalizeFacupFixtures(facup.data?.fixtures ?? []),
      isLoading: Boolean(facup.isLoading && !facup.data),
      error: Boolean(facup.error) || Boolean(facup.data?.error),
      stale: Boolean(facup.data?.stale),
      fetchedAt: facup.data?.fetchedAt ?? null,
      configured: facup.data?.configured ?? true,
    };
    const unlFeed: CompetitionFeedState = {
      cards: normalizeUnlFixtures(unl.data?.fixtures ?? []),
      isLoading: Boolean(unl.isLoading && !unl.data),
      error: Boolean(unl.error) || Boolean(unl.data?.error),
      stale: Boolean(unl.data?.stale),
      fetchedAt: unl.data?.fetchedAt ?? null,
      configured: unl.data?.configured ?? true,
    };
    return { pl: plFeed, ucl: uclFeed, facup: facupFeed, unl: unlFeed };
  }, [pl.data, pl.isLoading, pl.error, ucl.data, ucl.isLoading, ucl.error, facup.data, facup.isLoading, facup.error, unl.data, unl.isLoading, unl.error]);

  const merged = useMemo(
    () => mergeMatchdayFeeds([feeds.pl, feeds.ucl, feeds.facup, feeds.unl]),
    [feeds],
  );

  return {
    cards: merged.cards,
    plFixtures: pl.data?.fixtures ?? [],
    anyLoading: merged.anyLoading,
    anyError: merged.anyError,
    anyStale: merged.anyStale,
    allLoadingEmpty: merged.allLoadingEmpty,
    hasAnyData: merged.hasAnyData,
    earliestFetchedAt: merged.earliestFetchedAt,
    feeds,
  };
}
