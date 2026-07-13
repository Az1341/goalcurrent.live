"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import TeamFlag from "@/components/TeamFlag";
import { getVenueById, groupLabel } from "@/data/wc26";
import { useLocalizedKickoffLabel } from "@/lib/client/use-local-kickoff";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { formatStageLabel } from "@/lib/wc26-fixtures-page";
import {
  resolveFixtureParticipant,
  shouldShowUpcomingCountdown,
} from "@/lib/wc26-live";
import { matchHref } from "@/lib/wc26-match";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import styles from "./live.module.css";

type UpcomingMatchCountdownProps = {
  fixture: EffectiveFixture;
};

function formatCountdown(remainingMs: number): string {
  const ms = Math.max(0, remainingMs);
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor(ms / 3_600_000) % 24;
  const minutes = Math.floor(ms / 60_000) % 60;
  const seconds = Math.floor(ms / 1_000) % 60;
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${days}d ${hh}:${mm}:${ss}`;
}

export default function UpcomingMatchCountdown({
  fixture,
}: UpcomingMatchCountdownProps) {
  const fixtures = useEffectiveFixtures();
  const effectiveFixture =
    fixtures.find((entry) => entry.id === fixture.id) ?? fixture;

  const kickoffMs = useMemo(
    () => new Date(effectiveFixture.kickoffUtc).getTime(),
    [effectiveFixture.kickoffUtc],
  );

  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, kickoffMs - Date.now()),
  );

  const kickoffLabel = useLocalizedKickoffLabel(effectiveFixture.kickoffUtc);

  useEffect(() => {
    const tick = () => {
      setRemainingMs(Math.max(0, kickoffMs - Date.now()));
    };

    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [kickoffMs]);

  if (!shouldShowUpcomingCountdown(effectiveFixture) || remainingMs <= 0) {
    return null;
  }

  const home = resolveFixtureParticipant(effectiveFixture, "home", fixtures);
  const away = resolveFixtureParticipant(effectiveFixture, "away", fixtures);
  const venue = getVenueById(effectiveFixture.venueId);
  const competitionLabel = effectiveFixture.groupId
    ? groupLabel(effectiveFixture.groupId)
    : formatStageLabel(effectiveFixture.stage);

  const countdown = formatCountdown(remainingMs);
  const venueLabel = venue
    ? `${venue.name}${venue.city ? ` - ${venue.city}` : ""}`
    : null;

  return (
    <article
      className={styles.countdownCard}
      aria-live="polite"
      aria-label={`Next match: ${home.label} vs ${away.label}, kick-off in ${countdown} (days hours:minutes:seconds)`}
    >
      <div className={styles.countdownHeader}>
        <span className={styles.countdownEyebrow}>Up next</span>
        <span className={styles.countdownCompetition}>{competitionLabel}</span>
      </div>

      <div className={styles.countdownTeams}>
        <div className={`${styles.countdownTeam} ${styles.countdownTeamHome}`}>
          <TeamFlag teamId={home.teamId} teamName={home.label} size={44} />
          <span className={styles.countdownTeamName}>{home.label}</span>
        </div>

        <div className={styles.countdownCentre}>
          <span className={styles.countdownTimer}>{countdown}</span>
          <span className={styles.countdownSub}>until kick-off</span>
        </div>

        <div className={`${styles.countdownTeam} ${styles.countdownTeamAway}`}>
          <TeamFlag teamId={away.teamId} teamName={away.label} size={44} />
          <span className={styles.countdownTeamName}>{away.label}</span>
        </div>
      </div>

      <div className={styles.countdownMeta}>
        {kickoffLabel ? (
          <time className={styles.countdownKickoff} dateTime={effectiveFixture.kickoffUtc}>
            {kickoffLabel}
          </time>
        ) : null}
        {venueLabel ? (
          <span className={styles.countdownVenue}>{venueLabel}</span>
        ) : null}
      </div>

      <Link href={matchHref(effectiveFixture.id)} className={styles.countdownLink}>
        View match centre
      </Link>
    </article>
  );
}