"use client";

import Link from "next/link";
import { useMemo } from "react";
import LiveMatchCard from "@/components/live/LiveMatchCard";
import { groupLabel } from "@/data/wc26";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { formatStageLabel } from "@/lib/wc26-fixtures-page";
import { partitionFixturesForLiveCentre, isLiveMatchStatus, resolveFixtureParticipant } from "@/lib/wc26-live";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { useWc26SyncStatus } from "@/lib/use-wc26-sync-status";
import { ContentAdSlot } from "@/components/ads/ContentAdSlot";
import MatchLineupPitchSection from "@/components/match/MatchLineupPitchSection";
import { ADSENSE_SLOTS } from "@/lib/adsense-slots";
import { matchHref } from "@/lib/wc26-match";
import FixturesCalendar from "@/components/wc26/FixturesCalendar";
import styles from "./live.module.css";

type LiveSectionProps = {
  id: string;
  title: string;
  fixtures: readonly EffectiveFixture[];
  emptyMessage?: string;
  showLiveIndicator?: boolean;
  tone?: "live" | "today" | "upcoming" | "completed";
  hideWhenEmpty?: boolean;
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
  hideWhenEmpty,
}: LiveSectionProps) {
  const groups = useMemo(
    () => groupFixturesByCompetition(fixtures),
    [fixtures],
  );

  if (hideWhenEmpty && fixtures.length === 0) {
    return null;
  }

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
  const spotlightFixtures = useMemo(() => {
    if (buckets.live.length > 0) {
      return buckets.live;
    }
    if (buckets.today.length > 0) {
      return buckets.today;
    }
    return buckets.upcoming.slice(0, 4);
  }, [buckets]);
  const spotlightTitle =
    buckets.live.length > 0
      ? "Today live"
      : buckets.today.length > 0
        ? "Today"
        : "Next up";

  return (
    <main className={styles.content}>
      <h1 className={styles.pageTitle}>
        Live Scores — <span>World Cup 2026</span>
      </h1>
      <p className={styles.pageIntro}>
        World Cup 2026 scores from confirmed results and live API sync. Finished
        group and knockout matches show full-time scores; live matches update
        every 15 seconds when the provider is active.
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

      {spotlightFixtures.length > 0 ? (
        <section className={styles.spotlightSection} aria-labelledby="live-spotlight-heading">
          <h2 id="live-spotlight-heading" className={styles.spotlightTitle}>
            {buckets.live.length > 0 ? (
              <span className={styles.liveDot} aria-hidden="true" />
            ) : null}
            {spotlightTitle}
          </h2>
          <div className={styles.spotlightPanel}>
            <ul className={styles.fixtureList}>
              {spotlightFixtures.map((fixture) => (
                <LiveMatchCard key={`spotlight-${fixture.id}`} fixture={fixture} />
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <div className={styles.calendarHub}>
        <FixturesCalendar variant="compact" />
      </div>

      {buckets.live.length > 0 ? (
        <div className={styles.livePitchStack}>
          {buckets.live.map((fixture) => {
            const home = resolveFixtureParticipant(fixture, "home", fixtures);
            const away = resolveFixtureParticipant(fixture, "away", fixtures);
            return (
            <div key={`pitch-${fixture.id}`} className={styles.livePitchCard}>
              <MatchLineupPitchSection
                fixtureId={fixture.id}
                matchNumber={fixture.matchNumber}
                homeTeamId={home.teamId}
                awayTeamId={away.teamId}
                poll={isLiveMatchStatus(fixture.status)}
                variant="embedded"
                matchHref={matchHref(fixture.id)}
              />
            </div>
            );
          })}
        </div>
      ) : null}

      <div className={styles.liveAdWrap}>
        <ContentAdSlot slot={ADSENSE_SLOTS.liveMid} minHeight={120} />
      </div>

      <LiveSection
        id="upcoming-heading"
        title="Upcoming World Cup fixtures"
        fixtures={buckets.upcoming}
        tone="upcoming"
        hideWhenEmpty
      />

      <LiveSection
        id="completed-heading"
        title="Completed"
        fixtures={buckets.completed}
        emptyMessage="No completed matches yet. Full-time results appear when matches finish."
        tone="completed"
      />

      <p className={styles.hubBack}>
        <Link href="/worldcup2026">← Back to World Cup 2026 hub</Link>
      </p>
    </main>
  );
}
