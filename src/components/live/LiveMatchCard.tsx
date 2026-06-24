"use client";

import MatchDetailLink from "@/components/match/MatchDetailLink";
import MatchTvBroadcast from "@/components/wc26/MatchTvBroadcast";
import TeamFlag from "@/components/TeamFlag";
import { FavouriteMatchButton } from "@/components/FavouriteButton";
import { getTeamById, getVenueById, groupLabel } from "@/data/wc26";
import {
  getFixtureScore,
  isEffectiveFixtureCompleted,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import type { Wc26TvRegionCode } from "@/lib/wc26-fixtures-page";
import { formatVisitorKickoffTime } from "@/lib/wc26-format";
import {
  formatFixtureStatusLabel,
  isLiveMatchStatus,
} from "@/lib/wc26-live";
import styles from "./live.module.css";

type LiveMatchCardProps = {
  fixture: EffectiveFixture;
  tvRegion: Wc26TvRegionCode;
};

function formatLiveCardDateTime(kickoffUtc: string): string {
  const date = new Date(kickoffUtc);
  const datePart = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
  const timePart = formatVisitorKickoffTime(kickoffUtc);
  return `${datePart} \u2022 ${timePart} UTC`;
}

function statusBadgeLabel(fixture: EffectiveFixture): string {
  if (isLiveMatchStatus(fixture.status)) {
    if (fixture.elapsed != null) {
      return `Live ${fixture.elapsed}'`;
    }
    return formatFixtureStatusLabel(fixture.status);
  }
  if (isEffectiveFixtureCompleted(fixture)) {
    return formatFixtureStatusLabel(
      fixture.status === "scheduled" ? "ft" : fixture.status,
    );
  }
  return "Upcoming";
}

export default function LiveMatchCard({ fixture, tvRegion }: LiveMatchCardProps) {
  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  const venue = getVenueById(fixture.venueId);
  const label = `${home?.name ?? fixture.homeTeamId} vs ${away?.name ?? fixture.awayTeamId}`;
  const groupText = fixture.groupId
    ? groupLabel(fixture.groupId)
    : fixture.stage.replace(/-/g, " ");
  const isLive = isLiveMatchStatus(fixture.status);
  const isCompleted = isEffectiveFixtureCompleted(fixture);
  const score = getFixtureScore(fixture);
  const badge = statusBadgeLabel(fixture);

  const centreLabel =
    isLive || isCompleted
      ? score
        ? `${score.home}\u2013${score.away}`
        : "\u2013"
      : "vs";

  return (
    <li className={styles.matchCardItem}>
      <article
        className={`${styles.matchCard} ${isLive ? styles.matchCardLive : ""}`}
        aria-label={`${label} - ${badge}`}
      >
        <header className={styles.matchCardHeader}>
          <div className={styles.matchCardMeta}>
            <span className={styles.matchCardGroup}>{groupText}</span>
            <span className={styles.matchCardDateTime}>
              {formatLiveCardDateTime(fixture.kickoffUtc)}
            </span>
          </div>
          <div className={styles.matchCardHeaderActions}>
            <span
              className={`${styles.matchCardBadge} ${
                isLive
                  ? styles.matchCardBadgeLive
                  : isCompleted
                    ? styles.matchCardBadgeFt
                    : styles.matchCardBadgeUpcoming
              }`}
            >
              {isLive ? <span className={styles.matchCardLiveDot} aria-hidden="true" /> : null}
              {badge}
            </span>
            <FavouriteMatchButton matchId={fixture.id} label={label} />
          </div>
        </header>

        <div className={styles.matchCardTeams}>
          <div className={styles.matchCardTeam}>
            {home ? <TeamFlag teamId={home.id} size={40} /> : null}
            <span className={styles.matchCardTeamName}>
              {home?.name ?? fixture.homeTeamId}
            </span>
          </div>
          <div
            className={`${styles.matchCardCentre} ${isLive ? styles.matchCardCentreLive : ""}`}
          >
            {centreLabel}
          </div>
          <div className={styles.matchCardTeam}>
            {away ? <TeamFlag teamId={away.id} size={40} /> : null}
            <span className={styles.matchCardTeamName}>
              {away?.name ?? fixture.awayTeamId}
            </span>
          </div>
        </div>

        {venue ? (
          <p className={styles.matchCardVenue}>
            {venue.name}
            {venue.city ? `, ${venue.city}` : ""}
          </p>
        ) : null}

        <footer className={styles.matchCardFooter}>
          <MatchTvBroadcast
            tvRegion={tvRegion}
            matchNumber={fixture.matchNumber}
            variant="detail"
            className={styles.matchCardBroadcast}
          />
          <MatchDetailLink
            fixtureId={fixture.id}
            label="Match details"
            className={styles.matchCardDetailsLink}
          />
        </footer>
      </article>
    </li>
  );
}