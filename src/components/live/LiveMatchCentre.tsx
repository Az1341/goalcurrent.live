"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MatchDetailLink from "@/components/match/MatchDetailLink";
import MatchTvBroadcast from "@/components/wc26/MatchTvBroadcast";
import TeamFlag from "@/components/TeamFlag";
import { FavouriteMatchButton } from "@/components/FavouriteButton";
import { getTeamById, getVenueById, groupLabel } from "@/data/wc26";
import { useWc26TvRegion } from "@/lib/use-wc26-tv-region";
import {
  getFixtureScore,
  isEffectiveFixtureCompleted,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import { formatVisitorKickoff } from "@/lib/wc26-format";
import {
  formatFixtureStatusLabel,
  isLiveMatchStatus,
  partitionFixturesForLiveCentre,
} from "@/lib/wc26-live";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import {
  getWc26SyncStatus,
  subscribeWc26SyncStatus,
  type Wc26SyncStatus,
} from "@/lib/wc26-results-sync";
import type { Wc26TvRegionCode } from "@/lib/wc26-fixtures-page";
import styles from "./live.module.css";

type LiveSectionProps = {
  id: string;
  title: string;
  fixtures: readonly EffectiveFixture[];
  tvRegion: Wc26TvRegionCode;
  emptyMessage?: string;
  showLiveIndicator?: boolean;
};

function LiveFixtureRow({
  fixture,
  tvRegion,
}: {
  fixture: EffectiveFixture;
  tvRegion: Wc26TvRegionCode;
}) {
  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  const venue = getVenueById(fixture.venueId);
  const label = `${home?.name ?? fixture.homeTeamId} vs ${away?.name ?? fixture.awayTeamId}`;
  const groupText = fixture.groupId ? groupLabel(fixture.groupId) : null;
  const isLive = isLiveMatchStatus(fixture.status);
  const isCompleted = isEffectiveFixtureCompleted(fixture);
  const statusLabel = isCompleted
    ? formatFixtureStatusLabel(fixture.status === "scheduled" ? "ft" : fixture.status)
    : formatFixtureStatusLabel(fixture.status);
  const score = getFixtureScore(fixture);

  return (
    <li className={styles.fixtureRow}>
      <div className={styles.fixtureMeta}>
        {groupText ? (
          <span className={styles.fixtureGroup}>{groupText}</span>
        ) : (
          <span className={styles.fixtureGroup}>
            {fixture.stage.replace(/-/g, " ")}
          </span>
        )}
        <span className={styles.fixtureKickoff}>
          {formatVisitorKickoff(fixture.kickoffUtc)}
        </span>
        <span
          className={`${styles.fixtureStatus} ${isLive ? styles.fixtureStatusLive : ""}`}
        >
          {isLive ? "● " : ""}
          {statusLabel}
          {fixture.elapsed != null && isLive ? ` ${fixture.elapsed}'` : ""}
        </span>
        <FavouriteMatchButton matchId={fixture.id} label={label} />
        <MatchDetailLink fixtureId={fixture.id} />
      </div>
      <div className={styles.fixtureMatchup}>
        <span className={styles.fixtureTeam}>
          {home ? <TeamFlag teamId={home.id} size={24} /> : null}
          {home?.name ?? fixture.homeTeamId}
        </span>
        <span className={styles.fixtureVs}>
          {score ? `${score.home}–${score.away}` : "vs"}
        </span>
        <span className={styles.fixtureTeam}>
          {away ? <TeamFlag teamId={away.id} size={24} /> : null}
          {away?.name ?? fixture.awayTeamId}
        </span>
      </div>
      {venue ? (
        <div className={styles.fixtureVenue}>
          {venue.name}, {venue.city}
        </div>
      ) : null}
      <div className={styles.fixtureTvRow}>
        <MatchTvBroadcast tvRegion={tvRegion} matchNumber={fixture.matchNumber} variant="chips" />
      </div>
    </li>
  );
}

function LiveSection({
  id,
  title,
  fixtures,
  tvRegion,
  emptyMessage,
  showLiveIndicator,
}: LiveSectionProps) {
  return (
    <section className={styles.section} aria-labelledby={id}>
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
            <LiveFixtureRow key={fixture.id} fixture={fixture} tvRegion={tvRegion} />
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default function LiveMatchCentre() {
  const fixtures = useEffectiveFixtures();
  const [syncStatus, setSyncStatus] = useState<Wc26SyncStatus>(() =>
    getWc26SyncStatus(),
  );
  const buckets = useMemo(
    () => partitionFixturesForLiveCentre(fixtures),
    [fixtures],
  );
  const { tvRegion } = useWc26TvRegion();

  useEffect(() => {
    setSyncStatus(getWc26SyncStatus());
    return subscribeWc26SyncStatus(() => setSyncStatus(getWc26SyncStatus()));
  }, []);

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

      <div className={styles.syncStatusSlot} aria-hidden={syncStatus !== "pending"}>
        {syncStatus === "pending" ? (
          <p className={styles.syncStatus} role="status" aria-live="polite">
            <span className={styles.syncStatusDot} aria-hidden="true" />
            Syncing live data…
          </p>
        ) : null}
      </div>

      <LiveSection
        id="live-now-heading"
        title="Live now"
        fixtures={buckets.live}
        tvRegion={tvRegion}
        emptyMessage="No live matches right now. Live scores appear here when the tournament is underway and API sync is active."
        showLiveIndicator
      />

      <LiveSection
        id="today-heading"
        title="Today"
        fixtures={buckets.today}
        tvRegion={tvRegion}
        emptyMessage="No World Cup matches scheduled for today in the local schedule."
      />

      <LiveSection
        id="upcoming-heading"
        title="Upcoming World Cup fixtures"
        fixtures={buckets.upcoming}
        tvRegion={tvRegion}
      />

      <LiveSection
        id="completed-heading"
        title="Completed"
        fixtures={buckets.completed}
        tvRegion={tvRegion}
        emptyMessage="No completed matches yet. Full-time results appear when API sync returns finished fixtures."
      />

      <p className={styles.hubBack}>
        <Link href="/worldcup2026">← Back to World Cup 2026 hub</Link>
      </p>
    </main>
  );
}
