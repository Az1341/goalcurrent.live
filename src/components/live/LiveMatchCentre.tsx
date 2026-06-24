"use client";

import Link from "next/link";
import { useMemo } from "react";
import LiveMatchCard from "@/components/live/LiveMatchCard";
import { useWc26TvRegion } from "@/lib/use-wc26-tv-region";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { partitionFixturesForLiveCentre } from "@/lib/wc26-live";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { useWc26SyncStatus } from "@/lib/use-wc26-sync-status";
import type { Wc26TvRegionCode } from "@/lib/wc26-fixtures-page";
import { ContentAdSlot } from "@/components/ads/ContentAdSlot";
import { ADSENSE_SLOTS } from "@/lib/adsense-slots";
import styles from "./live.module.css";

type LiveSectionProps = {
  id: string;
  title: string;
  fixtures: readonly EffectiveFixture[];
  tvRegion: Wc26TvRegionCode;
  emptyMessage?: string;
  showLiveIndicator?: boolean;
  tone?: "live" | "today" | "upcoming" | "completed";
};

function sectionToneClass(tone: LiveSectionProps["tone"]): string {
  switch (tone) {
    case "today":
      return styles.sectionToday;
    case "upcoming":
      return styles.sectionUpcoming;
    case "completed":
      return styles.sectionCompleted;
    case "live":
      return styles.sectionLiveNow;
    default:
      return "";
  }
}

function LiveSection({
  id,
  title,
  fixtures,
  tvRegion,
  emptyMessage,
  showLiveIndicator,
  tone,
}: LiveSectionProps) {
  return (
    <section
      className={`${styles.section} ${sectionToneClass(tone)}`}
      aria-labelledby={id}
    >
      <div className={styles.sectionHeader}>
        {showLiveIndicator && fixtures.length > 0 ? (
          <span className={styles.liveDot} aria-hidden="true" />
        ) : null}
        <h2 id={id} className={styles.sectionTitle}>
          {title}
        </h2>
        {fixtures.length > 0 ? (
          <span className={styles.sectionCount}>{fixtures.length}</span>
        ) : null}
      </div>
      {fixtures.length === 0 && emptyMessage ? (
        <p className={styles.emptyState}>{emptyMessage}</p>
      ) : null}
      {fixtures.length > 0 ? (
        <ul className={styles.fixtureList}>
          {fixtures.map((fixture) => (
            <LiveMatchCard key={fixture.id} fixture={fixture} tvRegion={tvRegion} />
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default function LiveMatchCentre() {
  const fixtures = useEffectiveFixtures();
  const syncStatus = useWc26SyncStatus();
  const buckets = useMemo(
    () => partitionFixturesForLiveCentre(fixtures),
    [fixtures],
  );
  const { tvRegion } = useWc26TvRegion();

  return (
    <main className={styles.content}>
      <h1 className={styles.pageTitle}>
        Live Scores — <span>World Cup 2026</span>
      </h1>
      <p className={styles.pageIntro}>
        World Cup 2026 fixtures from local schedule data. Status and scores update
        when server API sync is active; otherwise fixtures show as scheduled with
        honest empty states — no hardcoded results.
      </p>

      <div className={styles.syncStatusSlot} aria-hidden={syncStatus === "pending"}>
        {syncStatus === "pending" ? (
          <p className={styles.syncStatus} role="status" aria-live="polite">
            <span className={styles.syncStatusDot} aria-hidden="true" />
            Syncing live data…
          </p>
        ) : null}
        {syncStatus === "degraded" ? (
          <p className={styles.syncStatusDegraded} role="status" aria-live="polite">
            Showing last known scores — live provider is temporarily limited.
          </p>
        ) : null}
      </div>

      <ContentAdSlot slot={ADSENSE_SLOTS.liveMid} minHeight={120} />

      <LiveSection
        id="live-now-heading"
        title="Live now"
        fixtures={buckets.live}
        tvRegion={tvRegion}
        emptyMessage="No live matches right now. Live scores appear here when the tournament is underway and API sync is active."
        showLiveIndicator
        tone="live"
      />

      <LiveSection
        id="today-heading"
        title="Today"
        fixtures={buckets.today}
        tvRegion={tvRegion}
        emptyMessage="No World Cup matches scheduled for today in the local schedule."
        tone="today"
      />

      <LiveSection
        id="upcoming-heading"
        title="Upcoming World Cup fixtures"
        fixtures={buckets.upcoming}
        tvRegion={tvRegion}
        tone="upcoming"
      />

      <LiveSection
        id="completed-heading"
        title="Completed"
        fixtures={buckets.completed}
        tvRegion={tvRegion}
        emptyMessage="No completed matches yet. Full-time results appear when API sync returns finished fixtures."
        tone="completed"
      />

      <p className={styles.hubBack}>
        <Link href="/worldcup2026">← Back to World Cup 2026 hub</Link>
      </p>
    </main>
  );
}
