"use client";

import Link from "next/link";
import { getVenueById } from "@/data/wc26";
import {
  getFixtureScore,
  isEffectiveFixtureCompleted,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import {
  useLocalizedKickoffDate,
  useLocalizedKickoffTime,
} from "@/lib/client/use-local-kickoff";
import {
  formatFixtureStatusLabel,
  isLiveMatchStatus,
  resolveFixtureParticipant,
} from "@/lib/wc26-live";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { matchHref } from "@/lib/wc26-match";
import FixtureMatchRow from "@/components/match/FixtureMatchRow";
import styles from "./live.module.css";

type LiveMatchCardProps = {
  fixture: EffectiveFixture;
};

function statusColumnLabel(
  fixture: EffectiveFixture,
  isLive: boolean,
  isCompleted: boolean,
): string | undefined {
  if (isLive) {
    if (fixture.elapsed != null) {
      return `${fixture.elapsed}'`;
    }
    return formatFixtureStatusLabel(fixture.status);
  }
  if (isCompleted) {
    return "FT";
  }
  return undefined;
}

export default function LiveMatchCard({ fixture }: LiveMatchCardProps) {
  const fixtures = useEffectiveFixtures();
  const home = resolveFixtureParticipant(fixture, "home", fixtures);
  const away = resolveFixtureParticipant(fixture, "away", fixtures);
  const isLive = isLiveMatchStatus(fixture.status);
  const isCompleted = isEffectiveFixtureCompleted(fixture);
  const isScheduled = !isLive && !isCompleted;
  const kickoffTime = useLocalizedKickoffTime(fixture.kickoffUtc);
  const kickoffDate = useLocalizedKickoffDate(fixture.kickoffUtc);
  const venue = getVenueById(fixture.venueId);
  const venueLabel = venue
    ? `${venue.name}${venue.city ? ` (${venue.city})` : ""}`
    : null;
  const score = getFixtureScore(fixture);
  const label = `${home.label} vs ${away.label}`;

  const scheduleMeta =
    isScheduled && (kickoffDate || venueLabel)
      ? [kickoffDate, venueLabel].filter(Boolean).join(" · ")
      : null;

  const centrePrimary =
    isLive || isCompleted
      ? score
        ? `${score.home}–${score.away}`
        : "–"
      : kickoffTime;

  const centreSecondary = statusColumnLabel(fixture, isLive, isCompleted);

  return (
    <li className={styles.matchRowItem}>
      <Link
        href={matchHref(fixture.id)}
        className={`${styles.matchRowLink} ${isLive ? styles.matchRowLive : ""}`}
        aria-label={
          isScheduled
            ? `${label} - ${scheduleMeta ?? kickoffTime}`
            : `${label} - ${centreSecondary ?? centrePrimary}`
        }
      >
        <FixtureMatchRow
          homeTeamId={home.teamId}
          awayTeamId={away.teamId}
          homeName={home.label}
          awayName={away.label}
          centrePrimary={centrePrimary}
          centreSecondary={centreSecondary}
          flagSize={22}
          isLive={isLive}
        />
        {scheduleMeta ? (
          <p className={styles.matchRowMeta}>{scheduleMeta}</p>
        ) : null}
      </Link>
    </li>
  );
}
