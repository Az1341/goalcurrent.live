"use client";

import { useMemo } from "react";
import TeamFlag from "@/components/TeamFlag";
import TeamLink from "@/components/wc26/TeamLink";
import { FavouriteMatchButton } from "@/components/FavouriteButton";
import { getTeamById } from "@/data/wc26";
import type { MatchDetailPayload } from "@/types/match-detail";
import { extractMatchGoalSummary } from "./match-goal-summary";
import {
  resolveTimelineEventDisplay,
  resolveEventSide,
  sortTimelineEvents,
  type TimelineEventDisplay,
  type TimelineEventSide,
} from "./timeline-event-badge";
import { LocalizedKickoffLabel } from "@/components/match/LocalizedKickoff";
import { useIsClientMounted, useLocalizedKickoffTime } from "@/lib/client/use-local-kickoff";
import styles from "./match.module.css";
import MatchLineupPitchSection from "./MatchLineupPitchSection";
import {
  aggregateMatchPlayerStats,
  formatOptionalStat,
  formatPlayerCards,
  formatPlayerSubstitution,
} from "@/lib/match-player-stats";
import {
  MATCH_MOVEMENT_LABELS,
  MATCH_MOVEMENT_STAT_KEYS,
  type MatchStatsViewModel,
} from "@/lib/match-stats-shared";

import type { HomepageMatchView } from "@/lib/wc26-live";

const API_UNAVAILABLE_MESSAGE =
  "Unable to load match details from the API. Try refreshing the page.";

function showSectionLoading(loading: boolean, hasContent: boolean): boolean {
  return loading && !hasContent;
}

function detailEmptyMessage(
  detail: Pick<MatchDetailPayload, "configured" | "apiAvailable">,
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
  detail: MatchDetailPayload;
  loading: boolean;
};

export function MatchDetailHeader({ header, detail, loading }: MatchDetailHeaderProps) {
  const mounted = useIsClientMounted();
  const isLive = header.matchClass === "live";
  const isUpcoming = header.matchClass === "upcoming";
  const isFinishedOrLive = header.matchClass === "live" || header.matchClass === "ft";
  const showLiveSnapshot = !isLive || mounted;
  const kickoffTime = useLocalizedKickoffTime(header.kickoffUtc);
  const scoreText =
    showLiveSnapshot && header.score
      ? `${header.score.home} – ${header.score.away}`
      : isLive
        ? "vs"
        : header.score
          ? `${header.score.home} – ${header.score.away}`
          : "vs";

  const goalSummary =
    showLiveSnapshot && !loading && isFinishedOrLive
      ? extractMatchGoalSummary(
          detail.events,
          header.homeName,
          header.awayName,
          detail.lineups.home?.teamName ?? null,
          detail.lineups.away?.teamName ?? null,
          isLive ? header.elapsed : null,
        )
      : null;

  const showGoalSummary =
    goalSummary != null && (goalSummary.home.length > 0 || goalSummary.away.length > 0);

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
              <TeamFlag teamId={header.homeTeamId} size={48} />
              <div className={styles.teamName}>{header.homeName}</div>
            </TeamLink>
            {showGoalSummary && goalSummary!.home.length > 0 ? (
              <ul className={styles.headerScorers} aria-label={`${header.homeName} goal scorers`}>
                {goalSummary!.home.map((line) => (
                  <li
                    key={`home-${line.minute}-${line.playerName}`}
                    className={styles.headerScorerLine}
                  >
                    <span className={styles.headerScorerIcon} aria-hidden="true">
                      {line.symbol}
                    </span>
                    <span className={styles.headerScorerPlayer}>{line.playerName}</span>
                    <span className={styles.headerScorerMinute}>{line.minute}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className={styles.scoreCol}>
            <div className={styles.scoreMain}>{scoreText}</div>
            <div className={styles.scoreSub}>
              {isUpcoming ? kickoffTime : header.statusLabel}
              {header.elapsed != null && isLive && showLiveSnapshot ? (
                <span className={styles.scoreElapsed}>{header.elapsed}&apos;</span>
              ) : null}
            </div>
          </div>
          <div className={`${styles.teamCol} ${styles.teamColAway}`}>
            <TeamLink teamId={header.awayTeamId} className={styles.teamNameLink}>
              <TeamFlag teamId={header.awayTeamId} size={48} />
              <div className={styles.teamName}>{header.awayName}</div>
            </TeamLink>
            {showGoalSummary && goalSummary!.away.length > 0 ? (
              <ul className={`${styles.headerScorers} ${styles.headerScorersAway}`} aria-label={`${header.awayName} goal scorers`}>
                {goalSummary!.away.map((line) => (
                  <li
                    key={`away-${line.minute}-${line.playerName}`}
                    className={styles.headerScorerLine}
                  >
                    <span className={styles.headerScorerIcon} aria-hidden="true">
                      {line.symbol}
                    </span>
                    <span className={styles.headerScorerPlayer}>{line.playerName}</span>
                    <span className={styles.headerScorerMinute}>{line.minute}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        <p className={styles.kickoffLine}>
          <LocalizedKickoffLabel iso={header.kickoffUtc} />
          {header.venueLabel ? ` · ${header.venueLabel}` : ""}
        </p>
      </div>
    </section>
  );
}

type MatchTimelineProps = {
  detail: MatchDetailPayload;
  loading: boolean;
  homeTeamName: string;
  awayTeamName: string;
};

const TIMELINE_TONE_CLASS: Record<TimelineEventDisplay["badge"]["tone"], string> = {
  goal: styles.timelineCardGoal,
  penalty: styles.timelineCardPenalty,
  "penalty-missed": styles.timelineCardPenaltyMissed,
  "own-goal": styles.timelineCardOwnGoal,
  "var-denied": styles.timelineCardVarDenied,
  var: styles.timelineCardVar,
  subst: styles.timelineCardSubst,
  yellow: styles.timelineCardYellow,
  red: styles.timelineCardRed,
  "second-yellow": styles.timelineCardSecondYellow,
  injury: styles.timelineCardInjury,
  period: styles.timelineCardPeriod,
  neutral: styles.timelineCardNeutral,
};

const TIMELINE_ICON_CLASS: Record<TimelineEventDisplay["badge"]["tone"], string> = {
  goal: styles.timelineIconGoal,
  penalty: styles.timelineIconPenalty,
  "penalty-missed": styles.timelineIconPenaltyMissed,
  "own-goal": styles.timelineIconOwnGoal,
  "var-denied": styles.timelineIconVarDenied,
  var: styles.timelineIconVar,
  subst: styles.timelineIconSubst,
  yellow: styles.timelineIconYellow,
  red: styles.timelineIconRed,
  "second-yellow": styles.timelineIconSecondYellow,
  injury: styles.timelineIconInjury,
  period: styles.timelineIconPeriod,
  neutral: styles.timelineIconNeutral,
};

function TimelineEventIcon({ display }: { display: TimelineEventDisplay }) {
  return (
    <span
      className={[
        styles.timelineIcon,
        display.badge.variant === "text" ? styles.timelineIconText : "",
        TIMELINE_ICON_CLASS[display.badge.tone],
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={display.badge.ariaLabel}
      title={display.badge.ariaLabel}
    >
      <span className={styles.timelineIconSymbol} aria-hidden="true">
        {display.badge.symbol}
      </span>
      {display.badge.secondarySymbol ? (
        <span className={styles.timelineIconSymbolSecondary} aria-hidden="true">
          {display.badge.secondarySymbol}
        </span>
      ) : null}
    </span>
  );
}

function TimelineEventCard({
  display,
  side,
}: {
  display: TimelineEventDisplay;
  side: TimelineEventSide;
}) {
  const isAway = side === "away";
  const cardClassName = [
    styles.timelineCard,
    isAway ? styles.timelineCardAway : styles.timelineCardHome,
    display.isGoal ? styles.timelineCardHighlight : "",
    TIMELINE_TONE_CLASS[display.badge.tone],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClassName}>
      <div className={styles.timelineCardRow}>
        <TimelineEventIcon display={display} />
        <div className={styles.timelineContent}>
          {display.playerName ? (
            <div className={styles.timelinePlayer}>{display.playerName}</div>
          ) : null}
          <div className={styles.timelineTitle}>{display.title}</div>
          {display.assistLabel ? (
            <div className={styles.timelineAssist}>{display.assistLabel}</div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function MatchTimeline({
  detail,
  loading,
  homeTeamName,
  awayTeamName,
}: MatchTimelineProps) {
  const lineupHomeName = detail.lineups.home?.teamName ?? null;
  const lineupAwayName = detail.lineups.away?.teamName ?? null;
  const sortedEvents = sortTimelineEvents(detail.events);

  return (
    <section className={styles.section} aria-labelledby="match-timeline-heading">
      <h2 id="match-timeline-heading" className={styles.sectionTitle}>
        Match timeline
      </h2>
      <div className={styles.panel}>
        {showSectionLoading(loading, sortedEvents.length > 0) ? (
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
          <div className={styles.timelineBoard}>
            <div className={styles.timelineBoardHeader} aria-hidden="true">
              <span className={styles.timelineBoardTeamHome}>{homeTeamName}</span>
              <span className={styles.timelineBoardCenter}>Timeline</span>
              <span className={styles.timelineBoardTeamAway}>{awayTeamName}</span>
            </div>
            <ol className={styles.timelineRows}>
              {sortedEvents.map((event, index) => {
                const display = resolveTimelineEventDisplay(event);
                const side = display.isPeriod
                  ? "neutral"
                  : resolveEventSide(
                      display.teamName,
                      homeTeamName,
                      awayTeamName,
                      lineupHomeName,
                      lineupAwayName,
                    );

                if (display.isPeriod) {
                  return (
                    <li
                      key={`period-${display.minute}-${index}`}
                      className={[styles.timelineRow, styles.timelineRowPeriod]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className={styles.timelineColPeriod}>
                        <article className={`${styles.timelineCard} ${styles.timelineCardPeriod}`}>
                          <TimelineEventIcon display={display} />
                          <span className={styles.timelinePeriodLabel}>{display.title}</span>
                        </article>
                      </div>
                    </li>
                  );
                }

                return (
                  <li
                    key={`${event.minute}-${event.extra ?? 0}-${event.playerName}-${index}`}
                    className={styles.timelineRow}
                  >
                    <div className={styles.timelineColHome}>
                      {side === "home" ? (
                        <TimelineEventCard display={display} side="home" />
                      ) : null}
                    </div>
                    <div className={styles.timelineColCenter}>
                      <span className={styles.timelineMinuteCenter}>{display.minute}</span>
                    </div>
                    <div className={styles.timelineColAway}>
                      {side === "away" ? (
                        <TimelineEventCard display={display} side="away" />
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

type MatchMovementProps = {
  detail: MatchStatsViewModel;
  loading: boolean;
};

/** Comparison bars for key team statistics (single stats view — no numeric table). */
export function MatchMovement({ detail, loading }: MatchMovementProps) {
  const rows = detail.statistics.filter((stat) =>
    (MATCH_MOVEMENT_STAT_KEYS as readonly string[]).includes(stat.key),
  );

  return (
    <section className={styles.section} aria-labelledby="match-stats-heading">
      <h2 id="match-stats-heading" className={styles.sectionTitle}>
        Statistics
      </h2>
      <div className={styles.panel}>
        {showSectionLoading(loading, rows.length > 0) ? (
          <p className={styles.emptyState}>Loading statistics…</p>
        ) : rows.length === 0 ? (
          <p className={styles.emptyState}>
            {detailEmptyMessage(
              detail,
              "Team statistics will appear when the match is in progress or completed and the API feed is available.",
              "Team statistics will appear when server API sync is configured and the match is underway or finished.",
            )}
          </p>
        ) : (
          rows.map((stat) => {
            const homeVal = stat.home;
            const awayVal = stat.away;

            const homeNum =
              homeVal == null
                ? null
                : typeof homeVal === "string"
                  ? parseFloat(homeVal)
                  : homeVal;
            const awayNum =
              awayVal == null
                ? null
                : typeof awayVal === "string"
                  ? parseFloat(awayVal)
                  : awayVal;

            const total = (homeNum ?? 0) + (awayNum ?? 0);
            const homePct = total > 0 ? ((homeNum ?? 0) / total) * 100 : 50;
            const awayPct = total > 0 ? ((awayNum ?? 0) / total) * 100 : 50;

            return (
              <div key={stat.key} className={styles.movementRow}>
                <span className={styles.movementHome}>{homeVal ?? "–"}</span>
                <div className={styles.movementBar}>
                  <div className={styles.movementBarLabel}>
                    {MATCH_MOVEMENT_LABELS[stat.key] ?? stat.label}
                  </div>
                  <div className={styles.movementBarTrack}>
                    <div
                      className={styles.movementBarHome}
                      style={{ width: `${homePct}%` }}
                    />
                    <div
                      className={styles.movementBarAway}
                      style={{ width: `${awayPct}%` }}
                    />
                  </div>
                </div>
                <span className={styles.movementAway}>{awayVal ?? "–"}</span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

type MatchPlayerStatsProps = {
  detail: MatchStatsViewModel;
  loading: boolean;
  homeTeamName: string;
  awayTeamName: string;
};

export function MatchPlayerStats({
  detail,
  loading,
  homeTeamName,
  awayTeamName,
}: MatchPlayerStatsProps) {
  const rows = useMemo(
    () =>
      aggregateMatchPlayerStats(
        {
          events: detail.events,
          lineups: detail.lineups,
        },
        homeTeamName,
        awayTeamName,
      ),
    [detail.events, detail.lineups, homeTeamName, awayTeamName],
  );

  return (
    <section className={styles.section} aria-labelledby="match-player-stats-heading">
      <h2 id="match-player-stats-heading" className={styles.sectionTitle}>
        Player stats
      </h2>
      <div className={styles.panel}>
        {showSectionLoading(loading, rows.length > 0) ? (
          <p className={styles.emptyState}>Loading player statistics…</p>
        ) : rows.length === 0 ? (
          <p className={styles.emptyState}>
            {detailEmptyMessage(
              detail,
              "Player goals, assists, cards and substitutions will appear when the live feed records match events.",
              "Player statistics will appear when server API sync is configured and the match is underway or finished.",
            )}
          </p>
        ) : (
          <>
            <p className={styles.playerStatsNote}>
              From match events. Shots, pass accuracy and ratings appear when the
              provider supplies player-level data.
            </p>
            <div className={styles.playerStatsTableWrap}>
              <table className={styles.playerStatsTable}>
                <thead>
                  <tr>
                    <th scope="col">Player</th>
                    <th scope="col">G</th>
                    <th scope="col">A</th>
                    <th scope="col">Sh</th>
                    <th scope="col">SOT</th>
                    <th scope="col">Pass%</th>
                    <th scope="col">F</th>
                    <th scope="col">C</th>
                    <th scope="col">Sub</th>
                    <th scope="col">Rat</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={`${row.teamName}-${row.playerName}`}>
                      <td className={styles.playerStatsNameCell}>
                        <span className={styles.playerStatsName}>
                          {row.number != null ? (
                            <span className={styles.playerStatsNum}>{row.number}</span>
                          ) : null}
                          {row.playerName}
                        </span>
                        <span className={styles.playerStatsTeam}>{row.teamName}</span>
                      </td>
                      <td>{row.goals > 0 ? row.goals : "—"}</td>
                      <td>{row.assists > 0 ? row.assists : "—"}</td>
                      <td>{formatOptionalStat(row.shots)}</td>
                      <td>{formatOptionalStat(row.shotsOnTarget)}</td>
                      <td>{formatOptionalStat(row.passAccuracy)}</td>
                      <td>{formatOptionalStat(row.fouls)}</td>
                      <td>{formatPlayerCards(row)}</td>
                      <td>{formatPlayerSubstitution(row)}</td>
                      <td>{formatOptionalStat(row.rating)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

type MatchLineupsProps = {
  detail: MatchDetailPayload;
  homeTeamId: string;
  awayTeamId: string;
  matchNumber: number;
  fixtureId: string;
  loading: boolean;
};

export function MatchLineups({
  detail,
  homeTeamId,
  awayTeamId,
  matchNumber,
  fixtureId,
  loading,
}: MatchLineupsProps) {
  return (
    <MatchLineupPitchSection
      fixtureId={fixtureId}
      matchNumber={matchNumber}
      homeTeamId={homeTeamId}
      awayTeamId={awayTeamId}
      detail={detail}
      loading={loading}
      variant="page"
    />
  );
}
