"use client";

import TeamFlag from "@/components/TeamFlag";
import TeamLink from "@/components/wc26/TeamLink";
import { FavouriteMatchButton } from "@/components/FavouriteButton";
import { getTeamById } from "@/data/wc26";
import {
  formatEventMinute,
  formatEventSummary,
} from "@/lib/wc26-match";
import type { MatchDetailPayload } from "@/types/match-detail";
import styles from "./match.module.css";

import type { HomepageMatchView } from "@/lib/wc26-live";

const API_UNAVAILABLE_MESSAGE =
  "Unable to load match details from the API. Try refreshing the page.";

function detailEmptyMessage(
  detail: MatchDetailPayload,
  emptyConfigured: string,
  emptyUnconfigured: string,
): string {
  if (detail.configured && !detail.apiAvailable) {
    return API_UNAVAILABLE_MESSAGE;
  }
  if (detail.configured) {
    return emptyConfigured;
  }
  return emptyUnconfigured;
}

type MatchDetailHeaderProps = {
  header: HomepageMatchView;
};

export function MatchDetailHeader({ header }: MatchDetailHeaderProps) {
  const isLive = header.matchClass === "live";
  const scoreText = header.score
    ? `${header.score.home} – ${header.score.away}`
    : "vs";

  return (
    <section className={styles.headerCard} aria-labelledby="match-header-title">
      <div className={styles.headerTop}>
        <div>
          <div id="match-header-title" style={{ fontWeight: 600 }}>
            {isLive ? "Live match" : "Match centre"}
          </div>
          <div className={styles.headerMeta}>{header.roundLabel}</div>
        </div>
        <FavouriteMatchButton
          matchId={header.fixtureId}
          label={`${header.homeName} vs ${header.awayName}`}
        />
      </div>
      <div className={styles.headerBody}>
        <div className={styles.teamsRow}>
          <div className={styles.teamCol}>
            <TeamLink teamId={header.homeTeamId} className={styles.teamNameLink}>
              <TeamFlag teamId={header.homeTeamId} size={52} />
              <div className={styles.teamName}>{header.homeName}</div>
            </TeamLink>
          </div>
          <div className={styles.scoreCol}>
            <div className={styles.scoreMain}>{scoreText}</div>
            <div className={styles.scoreSub}>
              {header.statusLabel}
              {header.elapsed != null && isLive ? ` · ${header.elapsed}'` : ""}
            </div>
          </div>
          <div className={styles.teamCol}>
            <TeamLink teamId={header.awayTeamId} className={styles.teamNameLink}>
              <TeamFlag teamId={header.awayTeamId} size={52} />
              <div className={styles.teamName}>{header.awayName}</div>
            </TeamLink>
          </div>
        </div>
        <p className={styles.kickoffLine}>
          {header.kickoffLabel}
          {header.venueLabel ? ` · ${header.venueLabel}` : ""}
        </p>
      </div>
    </section>
  );
}

type MatchTimelineProps = {
  detail: MatchDetailPayload;
  loading: boolean;
};

export function MatchTimeline({ detail, loading }: MatchTimelineProps) {
  return (
    <section className={styles.section} aria-labelledby="match-timeline-heading">
      <h2 id="match-timeline-heading" className={styles.sectionTitle}>
        Match timeline
      </h2>
      <div className={styles.panel}>
        {loading ? (
          <p className={styles.emptyState}>Loading match events…</p>
        ) : detail.events.length === 0 ? (
          <p className={styles.emptyState}>
            {detailEmptyMessage(
              detail,
              "No events recorded yet. Goals, cards and substitutions will appear here when the live feed provides them.",
              "Match events will appear when server API sync is configured and the match is underway or finished.",
            )}
          </p>
        ) : (
          <ul className={styles.timelineList}>
            {detail.events.map((event, index) => (
              <li key={`${event.minute}-${event.playerName}-${index}`} className={styles.timelineItem}>
                <span className={styles.timelineMinute}>
                  {formatEventMinute(event.minute, event.extra)}
                </span>
                <div>
                  <span className={styles.timelineText}>
                    {formatEventSummary(event)}
                  </span>
                  <span className={styles.timelineTeam}>{event.teamName}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

type MatchStatisticsProps = {
  detail: MatchDetailPayload;
  loading: boolean;
};

export function MatchStatistics({ detail, loading }: MatchStatisticsProps) {
  return (
    <section className={styles.section} aria-labelledby="match-stats-heading">
      <h2 id="match-stats-heading" className={styles.sectionTitle}>
        Statistics
      </h2>
      <div className={styles.panel}>
        {loading ? (
          <p className={styles.emptyState}>Loading statistics…</p>
        ) : detail.statistics.length === 0 ? (
          <p className={styles.emptyState}>
            {detailEmptyMessage(
              detail,
              "Team statistics will appear when the match is in progress or completed and the API feed is available.",
              "Team statistics will appear when server API sync is configured and the match is underway or finished.",
            )}
          </p>
        ) : (
          detail.statistics.map((stat) => (
            <div key={stat.key} className={styles.statRow}>
              <span className={styles.statHome}>{stat.home ?? "–"}</span>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statAway}>{stat.away ?? "–"}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

type MatchLineupsProps = {
  detail: MatchDetailPayload;
  homeTeamId: string;
  awayTeamId: string;
  loading: boolean;
};

function LineupBlock({
  title,
  side,
}: {
  title: string;
  side: MatchDetailPayload["lineups"]["home"];
}) {
  if (!side) {
    return (
      <div className={styles.lineupSide}>
        <h3>{title}</h3>
        <p className={styles.emptyState}>Lineup not available yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.lineupSide}>
      <h3>{title}</h3>
      <p className={styles.lineupMeta}>
        {side.formation ? `Formation ${side.formation}` : "Formation TBC"}
        {side.coach ? ` · ${side.coach}` : ""}
      </p>
      <p className={styles.lineupMeta}>Starting XI</p>
      <ul className={styles.lineupList}>
        {side.startXI.map((player) => (
          <li key={`${player.number}-${player.name}`} className={styles.lineupPlayer}>
            <span className={styles.lineupNum}>{player.number ?? "–"}</span>
            <span>
              {player.name}
              {player.position ? ` (${player.position})` : ""}
            </span>
          </li>
        ))}
      </ul>
      {side.substitutes.length > 0 ? (
        <>
          <p className={styles.lineupMeta} style={{ marginTop: 12 }}>
            Bench
          </p>
          <ul className={styles.lineupList}>
            {side.substitutes.map((player) => (
              <li key={`sub-${player.number}-${player.name}`} className={styles.lineupPlayer}>
                <span className={styles.lineupNum}>{player.number ?? "–"}</span>
                <span>{player.name}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

export function MatchLineups({
  detail,
  homeTeamId,
  awayTeamId,
  loading,
}: MatchLineupsProps) {
  const home = getTeamById(homeTeamId);
  const away = getTeamById(awayTeamId);

  return (
    <section className={styles.section} aria-labelledby="match-lineups-heading">
      <h2 id="match-lineups-heading" className={styles.sectionTitle}>
        Lineups
      </h2>
      <div className={styles.panel}>
        {loading ? (
          <p className={styles.emptyState}>Loading lineups…</p>
        ) : !detail.lineups.home && !detail.lineups.away ? (
          <p className={styles.emptyState}>
            {detailEmptyMessage(
              detail,
              "Lineups will be published closer to kickoff when the API feed is available.",
              "Lineups will appear when server API sync is configured and the match is underway or finished.",
            )}
          </p>
        ) : (
          <div className={styles.lineupGrid}>
            <LineupBlock title={home?.name ?? "Home"} side={detail.lineups.home} />
            <LineupBlock title={away?.name ?? "Away"} side={detail.lineups.away} />
          </div>
        )}
      </div>
    </section>
  );
}
