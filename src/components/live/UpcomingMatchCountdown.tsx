"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import TeamFlag from "@/components/TeamFlag";
import { getVenueById, groupLabel } from "@/data/wc26";
import { useLocalizedKickoffLabel } from "@/lib/client/use-local-kickoff";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { formatStageLabel } from "@/lib/wc26-fixtures-page";
import { resolveFixtureParticipant } from "@/lib/wc26-live";
import { matchHref } from "@/lib/wc26-match";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import styles from "./live.module.css";

type UpcomingMatchCountdownProps = {
  fixture: EffectiveFixture;
};

function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function UpcomingMatchCountdown({
  fixture,
}: UpcomingMatchCountdownProps) {
  const fixtures = useEffectiveFixtures();
  const home = resolveFixtureParticipant(fixture, "home", fixtures);
  const away = resolveFixtureParticipant(fixture, "away", fixtures);
  const venue = getVenueById(fixture.venueId);
  const kickoffLabel = useLocalizedKickoffLabel(fixture.kickoffUtc);
  const competitionLabel = fixture.groupId
    ? groupLabel(fixture.groupId)
    : formatStageLabel(fixture.stage);

  const kickoffMs = useMemo(
    () => new Date(fixture.kickoffUtc).getTime(),
    [fixture.kickoffUtc],
  );

  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, kickoffMs - Date.now()),
  );

  useEffect(() => {
    const tick = () => {
      setRemainingMs(Math.max(0, kickoffMs - Date.now()));
    };

    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [kickoffMs]);

  const countdown = formatCountdown(remainingMs);
  const venueLabel = venue
    ? `${venue.name}${venue.city ? ` - ${venue.city}` : ""}`
    : null;

  return (
    <article
      className={styles.countdownCard}
      aria-live="polite"
      aria-label={`Next match: ${home.label} vs ${away.label}, kick-off in ${countdown}`}
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
          <time className={styles.countdownKickoff} dateTime={fixture.kickoffUtc}>
            {kickoffLabel}
          </time>
        ) : null}
        {venueLabel ? (
          <span className={styles.countdownVenue}>{venueLabel}</span>
        ) : null}
      </div>

      <Link href={matchHref(fixture.id)} className={styles.countdownLink}>
        View match centre
      </Link>
    </article>
  );
}