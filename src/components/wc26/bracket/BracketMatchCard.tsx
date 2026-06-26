"use client";

import { Link } from "@/i18n/navigation";
import TeamFlag from "@/components/TeamFlag";
import TeamLink from "@/components/wc26/TeamLink";
import { getVenueById } from "@/data/wc26";
import { useLocalizedKickoffLabel } from "@/lib/client/use-local-kickoff";
import { matchHref } from "@/lib/wc26-match";
import type { BracketMatchCardView } from "@/lib/wc26/bracket-view";
import styles from "./bracket.module.css";

type BracketMatchCardProps = {
  match: BracketMatchCardView;
  size?: "default" | "compact";
  viewMatchCenterLabel: string;
  liveLabel: string;
};

function ScoreCentre({
  match,
  liveLabel,
}: {
  match: BracketMatchCardView;
  liveLabel: string;
}) {
  if (match.status === "live" && match.score) {
    return (
      <div className={styles.scoreCentre}>
        <div className={styles.scoreBoxes}>
          <span className={`${styles.scoreBox} ${styles.scoreBoxLive}`}>
            {match.score.home}
          </span>
          <span className={styles.scoreDash}>–</span>
          <span className={`${styles.scoreBox} ${styles.scoreBoxLive}`}>
            {match.score.away}
          </span>
        </div>
        {match.elapsed != null ? (
          <span className={styles.liveMinute}>
            {liveLabel} {match.elapsed}&apos;
          </span>
        ) : null}
      </div>
    );
  }

  if (match.status === "finished" && match.score) {
    return (
      <div className={styles.scoreCentre}>
        <div className={styles.scoreBoxes}>
          <span className={`${styles.scoreBox} ${styles.scoreBoxFinished}`}>
            {match.score.home}
          </span>
          <span className={styles.scoreDash}>–</span>
          <span className={`${styles.scoreBox} ${styles.scoreBoxFinished}`}>
            {match.score.away}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scoreCentre}>
      <span className={styles.scorePlaceholder}>vs</span>
    </div>
  );
}

function TeamSide({
  side,
  align,
}: {
  side: BracketMatchCardView["home"];
  align: "home" | "away";
}) {
  const className = [
    styles.teamSide,
    align === "away" ? styles.teamSideAway : "",
    side.pending ? styles.teamSidePending : "",
    side.isWinner ? styles.teamSideWinner : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (side.teamId) {
    return (
      <div className={className}>
        <TeamFlag teamId={side.teamId} size={20} />
        <span className={styles.teamName}>
          <TeamLink teamId={side.teamId}>{side.label}</TeamLink>
        </span>
      </div>
    );
  }

  return <div className={className}>{side.label}</div>;
}

export default function BracketMatchCard({
  match,
  size = "default",
  viewMatchCenterLabel,
  liveLabel,
}: BracketMatchCardProps) {
  const kickoffLabel = useLocalizedKickoffLabel(match.kickoffUtc ?? "");
  const venue = match.venueId ? getVenueById(match.venueId) : undefined;
  const venueLabel = venue
    ? `${venue.name}${venue.city ? `, ${venue.city}` : ""}`
    : null;

  const cardClass = [
    styles.matchCard,
    match.status === "live" ? styles.matchCardLive : "",
    match.isFinal ? styles.matchCardFinal : "",
    size === "compact" ? styles.matchCardCompact : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClass}>
      <div className={styles.matchHead}>
        <span className={styles.matchHeadTitle}>
          {match.isFinal ? (
            <>
              <span className={styles.finalTrophy} aria-hidden="true">
                🏆
              </span>
              Match {match.matchNumber}
            </>
          ) : (
            <>Match {match.matchNumber}</>
          )}
        </span>
        {match.kickoffUtc ? (
          <time className={styles.matchHeadKickoff} dateTime={match.kickoffUtc}>
            {kickoffLabel}
          </time>
        ) : null}
      </div>

      <div className={styles.matchTeams}>
        <TeamSide side={match.home} align="home" />
        <ScoreCentre match={match} liveLabel={liveLabel} />
        <TeamSide side={match.away} align="away" />
      </div>

      {venueLabel ? (
        <p className={styles.matchVenueRow}>📍 {venueLabel}</p>
      ) : null}

      {match.fixtureId ? (
        <p className={styles.matchLinkRow}>
          <Link href={matchHref(match.fixtureId)} className={styles.matchLink}>
            {viewMatchCenterLabel}
          </Link>
        </p>
      ) : null}
    </article>
  );
}
