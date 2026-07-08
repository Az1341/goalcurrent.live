"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { fetcher, LIVE_SWR_OPTIONS } from "@/lib/client/fetcher";
import {
  buildHomepageMatchView,
  partitionFixturesForLiveCentre,
  type HomepageMatchView,
} from "@/lib/wc26-live";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import type { PlFixtureRow, PlFixturesApiResponse } from "@/lib/pl/types";
import { localDateKey } from "@/lib/wc26-fixtures-page";
import { Wc26MatchCard, PlMatchCard } from "./HomeLiveMatchCards";
import styles from "../home-v5.module.css";

function isLocalToday(iso: string, now = new Date()): boolean {
  return localDateKey(iso) === localDateKey(now.toISOString());
}

type HomeTodaysMatchesProps = {
  fixtures: readonly EffectiveFixture[];
};

export default function HomeTodaysMatches({ fixtures }: HomeTodaysMatchesProps) {
  const { data: plData } = useSWR<PlFixturesApiResponse>(
    "/api/pl/fixtures",
    fetcher,
    LIVE_SWR_OPTIONS,
  );

  const wc26Today = useMemo(() => {
    const buckets = partitionFixturesForLiveCentre(fixtures);
    const todayFixtures = [
      ...buckets.live.filter((f) => isLocalToday(f.kickoffUtc)),
      ...buckets.today,
    ];
    const seen = new Set<string>();
    const rows: HomepageMatchView[] = [];
    for (const fixture of todayFixtures) {
      if (seen.has(fixture.id)) continue;
      seen.add(fixture.id);
      rows.push(buildHomepageMatchView(fixture, fixtures));
      if (rows.length >= 6) break;
    }
    return rows;
  }, [fixtures]);

  const plToday = useMemo(() => {
    const all = plData?.fixtures ?? [];
    return all
      .filter((f) => isLocalToday(f.kickoffUtc))
      .sort(
        (a, b) =>
          new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
      )
      .slice(0, 6);
  }, [plData]);

  if (!wc26Today.length && !plToday.length) {
    return null;
  }

  return (
    <section
      className={styles.todaySection}
      aria-labelledby="home-today-heading"
    >
      <h2 id="home-today-heading" className={styles.sectionTitleLarge}>
        Today&apos;s Matches
      </h2>
      <div className={styles.todayLeagueGroups}>
        {plToday.length > 0 ? (
          <div className={styles.todayLeagueGroup}>
            <div className={styles.todayGroupTitle}>
              <span className={styles.todayGroupIcon} aria-hidden="true">
                ⚽
              </span>
              Premier League 26/27
            </div>
            <div className={styles.todayCardGrid}>
              {plToday.map((fixture: PlFixtureRow) => (
                <PlMatchCard
                  key={fixture.fixtureId}
                  fixture={fixture}
                  compact
                />
              ))}
            </div>
          </div>
        ) : null}

        {wc26Today.length > 0 ? (
          <div className={styles.todayLeagueGroup}>
            <div className={styles.todayGroupTitle}>
              <span className={styles.todayGroupIcon} aria-hidden="true">
                🏆
              </span>
              World Cup 2026
            </div>
            <div className={styles.todayCardGrid}>
              {wc26Today.map((match) => (
                <Wc26MatchCard key={match.fixtureId} match={match} compact />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
