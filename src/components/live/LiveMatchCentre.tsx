"use client";

import Link from "next/link";
import { useMemo } from "react";
import LiveMatchCard from "@/components/live/LiveMatchCard";
import { groupLabel } from "@/data/wc26";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { formatStageLabel } from "@/lib/wc26-fixtures-page";
import { partitionFixturesForLiveCentre } from "@/lib/wc26-live";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { useWc26SyncStatus } from "@/lib/use-wc26-sync-status";
import { ContentAdSlot } from "@/components/ads/ContentAdSlot";
import { ADSENSE_SLOTS } from "@/lib/adsense-slots";
import styles from "./live.module.css";

type LiveSectionProps = {
  id: string;
  title: string;
  fixtures: readonly EffectiveFixture[];
  emptyMessage?: string;
  showLiveIndicator?: boolean;
  tone?: "live" | "today" | "upcoming" | "completed";
};

function competitionLabel(fixture: EffectiveFixture): string {
  return fixture.groupId ? groupLabel(fixture.groupId) : formatStageLabel(fixture.stage);
}

function groupFixturesByCompetition(
  fixtures: readonly EffectiveFixture[],
): { label: string; fixtures: EffectiveFixture[] }[] {
  const map = new Map<string, EffectiveFixture[]>();
  for (const fixture of fixtures) {
    const label = competitionLabel(fixture);
    const bucket = map.get(label) ?? [];
    bucket.push(fixture);
    map.set(label, bucket);
  }
  return [...map.entries()].map(([label, items]) => ({ label, fixtures: items }));
}

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
  emptyMessage,
  showLiveIndicator,
  tone,
}: LiveSectionProps) {
  const groups = useMemo(
    () => groupFixturesByCompetition(fixtures),
    [fixtures],
  );

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
        <div className={styles.matchPanel}>
          {groups.map((group) => (
            <div key={group.label} className={styles.competitionBlock}>
              <div className={styles.competitionHeader}>{group.label}</div>
              <ul className={styles.fixtureList}>
                {group.fixtures.map((fixture) => (
                  <LiveMatchCard key={fixture.id} fixture={fixture} />
                ))}
              </ul>
            </div>
          ))}
        </div>
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

      {syncStatus === "pending" || syncStatus === "degraded" ? (
        <div className={styles.syncStatusSlot}>
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
      ) : null}

      <LiveSection
        id="live-now-heading"
        title="Live now"
        fixtures={buckets.live}
        emptyMessage="No live matches right now. Live scores appear here when the tournament is underway and API sync is active."
        showLiveIndicator
        tone="live"
      />

      <div className={styles.liveAdWrap}>
        <ContentAdSlot slot={ADSENSE_SLOTS.liveMid} minHeight={120} />
      </div>
      <LiveSection
        id="today-heading"
        title="Today"
        fixtures={buckets.today}
        emptyMessage="No World Cup matches scheduled for today in the local schedule."
        tone="today"
      />

      <LiveSection
        id="upcoming-heading"
        title="Upcoming World Cup fixtures"
        fixtures={buckets.upcoming}
        tone="upcoming"
      />

      <LiveSection
        id="completed-heading"
        title="Completed"
        fixtures={buckets.completed}
        emptyMessage="No completed matches yet. Full-time results appear when API sync returns finished fixtures."
        tone="completed"
      />

      <p className={styles.hubBack}>
        <Link href="/worldcup2026">← Back to World Cup 2026 hub</Link>
      </p>
    </main>
  );
}
