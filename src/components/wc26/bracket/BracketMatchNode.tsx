"use client";

import { Link } from "@/i18n/navigation";
import TeamFlag from "@/components/TeamFlag";
import TeamLink from "@/components/wc26/TeamLink";
import { KickoffTime } from "@/components/KickoffTime";
import { matchHref } from "@/lib/wc26-match";
import type { BracketMatchCardView } from "@/lib/wc26/bracket-view";
import styles from "./BracketView.module.css";

type BracketMatchNodeProps = {
  match: BracketMatchCardView;
  viewMatchCenterLabel: string;
  liveLabel: string;
};

function TeamRow({
  side,
  score,
  showScore,
  live,
}: {
  side: BracketMatchCardView["home"];
  score: number | null;
  showScore: boolean;
  live: boolean;
}) {
  const nameClass = side.pending
    ? `${styles.teamName} ${styles.teamNamePending}`
    : styles.teamName;
  const rowClass = side.isWinner
    ? `${styles.teamRow} ${styles.teamRowWinner}`
    : styles.teamRow;

  return (
    <div className={rowClass}>
      {side.teamId ? (
        <TeamFlag teamId={side.teamId} size={20} />
      ) : (
        <span className={styles.placeholderIcon} aria-hidden="true">
          🛡
        </span>
      )}
      <span className={nameClass}>
        {side.teamId ? (
          <TeamLink teamId={side.teamId}>{side.label}</TeamLink>
        ) : (
          side.label
        )}
      </span>
      {showScore && score !== null ? (
        <span className={live ? styles.teamScoreLive : styles.teamScore}>
          {score}
        </span>
      ) : null}
    </div>
  );
}

function StatusBadge({
  match,
  liveLabel,
}: {
  match: BracketMatchCardView;
  liveLabel: string;
}) {
  if (match.displayStatus === "live") {
    return (
      <div className={styles.statusLive}>
        <span className={styles.liveDot} aria-hidden="true" />
        <span>
          {liveLabel}
          {match.elapsed != null ? ` ${match.elapsed}'` : ""}
        </span>
      </div>
    );
  }
  if (match.displayStatus === "ft") {
    return <div className={styles.statusFt}>FT</div>;
  }
  return <div className={styles.statusForthcoming}>Forthcoming</div>;
}

function KickoffMeta({
  kickoffUtc,
  matchNumber,
  isSpecialRound,
}: {
  kickoffUtc: string | null;
  matchNumber: number;
  isSpecialRound: boolean;
}) {
  if (!kickoffUtc) {
    return !isSpecialRound ? <span>Match {matchNumber}</span> : null;
  }

  if (isSpecialRound) {
    return (
      <time className={styles.cardKickoffFull} dateTime={kickoffUtc}>
        <KickoffTime utcDate={kickoffUtc} />
      </time>
    );
  }

  return (
    <>
      <span>Match {matchNumber}</span>
      <time className={styles.cardKickoff} dateTime={kickoffUtc}>
        <KickoffTime utcDate={kickoffUtc} />
      </time>
    </>
  );
}

export default function BracketMatchNode({
  match,
  viewMatchCenterLabel,
  liveLabel,
}: BracketMatchNodeProps) {
  const showScore =
    match.displayStatus === "live" || match.displayStatus === "ft";
  const isLive = match.displayStatus === "live";
  const isSpecialRound = match.isFinal || match.isThirdPlace;

  const cardClass = match.isFinal
    ? styles.cardFinal
    : isLive
      ? styles.cardLive
      : match.displayStatus === "ft"
        ? styles.cardFt
        : styles.card;

  return (
    <article className={cardClass}>
      {match.isFinal ? (
        <p className={styles.cardFinalLabel}>Final</p>
      ) : match.isThirdPlace ? (
        <p className={styles.cardFinalLabel}>Third place</p>
      ) : null}

      <div className={styles.cardHead}>
        <KickoffMeta
          kickoffUtc={match.kickoffUtc}
          matchNumber={match.matchNumber}
          isSpecialRound={isSpecialRound}
        />
      </div>

      <TeamRow
        side={match.home}
        score={match.score?.home ?? null}
        showScore={showScore}
        live={isLive}
      />
      <TeamRow
        side={match.away}
        score={match.score?.away ?? null}
        showScore={showScore}
        live={isLive}
      />

      <StatusBadge match={match} liveLabel={liveLabel} />

      {match.fixtureId ? (
        <Link href={matchHref(match.fixtureId)} className={styles.matchLink}>
          {viewMatchCenterLabel}
        </Link>
      ) : null}
    </article>
  );
}
