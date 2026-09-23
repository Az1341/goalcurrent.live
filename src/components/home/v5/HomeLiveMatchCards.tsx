"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLocalizedKickoffTime } from "@/lib/client/use-local-kickoff";
import type { HomepageMatchView } from "@/lib/wc26-live";
import type { PlFixtureRow } from "@/lib/pl/types";
import TeamFlag from "@/components/TeamFlag";
import { PlTeamBadge } from "@/components/pl/PlShared";
import { FavouriteMatchButton } from "@/components/FavouriteButton";
import { matchHref } from "@/lib/wc26-match";
import {
  formatMatchdayScore,
  normalizePlFixtures,
  orderMatchdayForFeatured,
  type MatchdayCard,
} from "@/lib/home/matchday";
import styles from "../home-v5.module.css";
import favouriteStyles from "./HomeMatchFavourite.module.css";

function Wc26StatusPill({ match }: { match: HomepageMatchView }) {
  const kickoffTime = useLocalizedKickoffTime(match.kickoffUtc);
  if (match.matchClass === "live") {
    const label =
      match.elapsed != null ? `LIVE ${match.elapsed}'` : match.statusLabel;
    return <span className={styles.statusLive}>{label}</span>;
  }
  if (match.matchClass === "ft") {
    return <span className={styles.statusFt}>{match.statusLabel}</span>;
  }
  return <span className={styles.statusUpcoming}>{kickoffTime}</span>;
}

function MatchdayStatusPill({ card }: { card: MatchdayCard }) {
  const kickoffTime = useLocalizedKickoffTime(card.kickoffUtc ?? "");
  if (card.bucket === "live") {
    const short = card.statusShort?.trim().toUpperCase();
    const period =
      short === "1H" || short === "2H" || short === "HT" || short === "ET" || short === "P"
        ? short === "P"
          ? "PEN"
          : short
        : null;
    const label =
      card.elapsed != null ? `LIVE ${card.elapsed}'` : period ?? "LIVE";
    return <span className={styles.statusLive}>{label}</span>;
  }
  if (card.bucket === "finished") {
    const short = card.statusShort?.trim().toUpperCase();
    const label =
      short === "AET" || short === "PEN" ? short : card.status === "ABANDONED" ? "ABD" : "FT";
    return <span className={styles.statusFt}>{label}</span>;
  }
  if (card.status === "POSTPONED") {
    return <span className={styles.statusUpcoming}>PST</span>;
  }
  if (card.status === "CANCELLED") {
    return <span className={styles.statusUpcoming}>CANC</span>;
  }
  return (
    <span className={styles.statusUpcoming}>
      {card.kickoffUtc ? kickoffTime : "TBC"}
    </span>
  );
}

function Wc26MatchCard({
  match,
  compact = false,
}: {
  match: HomepageMatchView;
  compact?: boolean;
}) {
  const score = formatMatchdayScore(
    match.score?.home ?? null,
    match.score?.away ?? null,
  );
  const showScore =
    match.matchClass === "live" ||
    match.matchClass === "ft" ||
    match.score != null;
  const displayHome = showScore ? score.home : "\u2013";
  const displayAway = showScore ? score.away : "\u2013";
  const cardClass = compact ? styles.todayMatchCard : styles.liveCard;
  const label = `${match.homeName} vs ${match.awayName}`;

  return (
    <div className={favouriteStyles.cardShell}>
      <Link href={matchHref(match.fixtureId)} className={cardClass}>
        <div className={styles.liveCardTop}>
          <span className={styles.liveCardComp}>World Cup 2026</span>
          <Wc26StatusPill match={match} />
        </div>
        <div className={styles.liveCardTeams}>
          <div className={styles.liveCardTeamRow}>
            <div className={styles.liveCardTeamLeft}>
              <TeamFlag teamId={match.homeTeamId} teamName={match.homeName} size={32} />
              <span className={styles.liveCardTeamName}>{match.homeName}</span>
            </div>
            <span className={styles.liveCardScore}>{displayHome}</span>
          </div>
          <div className={styles.liveCardTeamRow}>
            <div className={styles.liveCardTeamLeft}>
              <TeamFlag teamId={match.awayTeamId} teamName={match.awayName} size={32} />
              <span className={styles.liveCardTeamName}>{match.awayName}</span>
            </div>
            <span className={styles.liveCardScore}>{displayAway}</span>
          </div>
        </div>
      </Link>
      <FavouriteMatchButton
        matchId={match.fixtureId}
        label={label}
        className={favouriteStyles.star}
      />
    </div>
  );
}

export function MatchdayMatchCard({
  card,
  compact = false,
}: {
  card: MatchdayCard;
  compact?: boolean;
}) {
  const t = useTranslations("home.matchday");
  const score = formatMatchdayScore(card.homeScore, card.awayScore);
  const wantsScore =
    card.bucket === "live" ||
    card.bucket === "finished" ||
    (card.homeScore != null && card.awayScore != null);
  const homeScore = wantsScore ? score.home : "\u2013";
  const awayScore = wantsScore ? score.away : "\u2013";
  const cardClass = compact ? styles.todayMatchCard : styles.liveCard;
  const label = `${card.homeTeamName} vs ${card.awayTeamName}`;

  return (
    <div className={favouriteStyles.cardShell} data-gc-matchday-card={card.qualifiedId}>
      <Link href={card.hubHref} className={cardClass} data-gc-match-hub={card.hubHref}>
        <div className={styles.liveCardTop}>
          <span className={styles.liveCardComp}>{card.competitionLabel}</span>
          <MatchdayStatusPill card={card} />
        </div>
        <div className={styles.liveCardTeams}>
          <div className={styles.liveCardTeamRow}>
            <div className={styles.liveCardTeamLeft}>
              <PlTeamBadge
                name={card.homeTeamName}
                logo={card.homeTeamLogo}
                size={32}
              />
              <span className={styles.liveCardTeamName}>{card.homeTeamName}</span>
            </div>
            <span className={styles.liveCardScore} data-gc-score-home>
              {homeScore}
            </span>
          </div>
          <div className={styles.liveCardTeamRow}>
            <div className={styles.liveCardTeamLeft}>
              <PlTeamBadge
                name={card.awayTeamName}
                logo={card.awayTeamLogo}
                size={32}
              />
              <span className={styles.liveCardTeamName}>{card.awayTeamName}</span>
            </div>
            <span className={styles.liveCardScore} data-gc-score-away>
              {awayScore}
            </span>
          </div>
        </div>
        <span className={styles.matchHubAffordance}>{t("matchHub")}</span>
      </Link>
      <FavouriteMatchButton
        matchId={card.favouriteMatchId}
        label={label}
        className={favouriteStyles.star}
      />
    </div>
  );
}

/** @deprecated Prefer MatchdayMatchCard; kept for PL-only call sites. */
function PlMatchCard({
  fixture,
  compact = false,
}: {
  fixture: PlFixtureRow;
  compact?: boolean;
}) {
  const [card] = normalizePlFixtures([fixture]);
  return <MatchdayMatchCard card={card} compact={compact} />;
}

type HomeFeaturedMatchCardsProps = {
  wc26Views: readonly HomepageMatchView[];
  plFixtures: readonly PlFixtureRow[];
  matchdayCards?: readonly MatchdayCard[];
  compact?: boolean;
  limit?: number;
};

export default function HomeFeaturedMatchCards({
  wc26Views,
  plFixtures,
  matchdayCards,
  compact = false,
  limit = 3,
}: HomeFeaturedMatchCardsProps) {
  const cards = useMemo(() => {
    const nodes: ReactNode[] = [];
    for (const match of wc26Views.slice(0, limit)) {
      nodes.push(
        <Wc26MatchCard key={match.fixtureId} match={match} compact={compact} />,
      );
    }
    if (nodes.length < limit) {
      const pool =
        matchdayCards && matchdayCards.length > 0
          ? matchdayCards
          : normalizePlFixtures(plFixtures);
      for (const fixture of orderMatchdayForFeatured(pool).slice(
        0,
        limit - nodes.length,
      )) {
        nodes.push(
          <MatchdayMatchCard
            key={fixture.qualifiedId}
            card={fixture}
            compact={compact}
          />,
        );
      }
    }
    return nodes;
  }, [wc26Views, plFixtures, matchdayCards, compact, limit]);

  if (cards.length === 0) {
    return null;
  }

  return (
    <div
      className={compact ? styles.todayCardGrid : styles.liveCardsGrid}
      data-gc-featured-matches
    >
      {cards}
    </div>
  );
}

export { Wc26MatchCard, PlMatchCard };
