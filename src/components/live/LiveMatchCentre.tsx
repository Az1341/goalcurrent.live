"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import MatchDetailLink from "@/components/match/MatchDetailLink";
import TeamFlag from "@/components/TeamFlag";
import { FavouriteMatchButton } from "@/components/FavouriteButton";
import { getTeamById, getVenueById, groupLabel } from "@/data/wc26";
import {
  getEffectiveFixtures,
  getFixtureScore,
  WC26_FIXTURES_UPDATED_EVENT,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import { formatKickoffUtc } from "@/lib/wc26-format";
import {
  formatFixtureStatusLabel,
  isLiveMatchStatus,
  partitionFixturesForLiveCentre,
  type LiveFixtureBuckets,
} from "@/lib/wc26-live";
import styles from "./live.module.css";

function computeBuckets(): LiveFixtureBuckets {
  return partitionFixturesForLiveCentre(getEffectiveFixtures());
}

type LiveSectionProps = {
  id: string;
  title: string;
  fixtures: readonly EffectiveFixture[];
  emptyMessage?: string;
  showLiveIndicator?: boolean;
};

function LiveFixtureRow({ fixture }: { fixture: EffectiveFixture }) {
  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  const venue = getVenueById(fixture.venueId);
  const label = `${home?.name ?? fixture.homeTeamId} vs ${away?.name ?? fixture.awayTeamId}`;
  const groupText = fixture.groupId ? groupLabel(fixture.groupId) : null;
  const statusLabel = formatFixtureStatusLabel(fixture.status);
  const isLive = isLiveMatchStatus(fixture.status);
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
          {formatKickoffUtc(fixture.kickoffUtc)} UTC
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
    </li>
  );
}

function LiveSection({
  id,
  title,
  fixtures,
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
            <LiveFixtureRow key={fixture.id} fixture={fixture} />
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default function LiveMatchCentre() {
  const [buckets, setBuckets] = useState<LiveFixtureBuckets>(() => computeBuckets());

  const refresh = useCallback(() => {
    setBuckets(computeBuckets());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(WC26_FIXTURES_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(WC26_FIXTURES_UPDATED_EVENT, refresh);
  }, [refresh]);

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

      <LiveSection
        id="live-now-heading"
        title="Live now"
        fixtures={buckets.live}
        emptyMessage="No live matches right now. Live scores appear here when the tournament is underway and API sync is active."
        showLiveIndicator
      />

      <LiveSection
        id="today-heading"
        title="Today"
        fixtures={buckets.today}
        emptyMessage="No World Cup matches scheduled for today in the local schedule."
      />

      <LiveSection
        id="upcoming-heading"
        title="Upcoming World Cup fixtures"
        fixtures={buckets.upcoming}
      />

      <LiveSection
        id="completed-heading"
        title="Completed"
        fixtures={buckets.completed}
        emptyMessage="No completed matches yet. Full-time results appear when API sync returns finished fixtures."
      />

      <p className={styles.hubBack}>
        <Link href="/worldcup2026">← Back to World Cup 2026 hub</Link>
      </p>
    </main>
  );
}
