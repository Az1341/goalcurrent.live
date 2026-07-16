"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
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

/** Max wall-clock window during which we show a LIVE NOW hero card when the
 *  API has not yet confirmed the match as live. 130 min covers a full AET +
 *  penalties match (120 min) plus a 10-min handoff buffer. */
const MATCH_WINDOW_MS = 130 * 60 * 1_000;

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
  const t = useTranslations("live.countdown");
  const fixtures = useEffectiveFixtures();
  const effectiveFixture =
    fixtures.find((entry) => entry.id === fixture.id) ?? fixture;

  const kickoffMs = useMemo(
    () => new Date(effectiveFixture.kickoffUtc).getTime(),
    [effectiveFixture.kickoffUtc],
  );

  const [nowMs, setNowMs] = useState(() => Date.now());

  const kickoffLabel = useLocalizedKickoffLabel(effectiveFixture.kickoffUtc);

  useEffect(() => {
    const tick = () => setNowMs(Date.now());
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, []);

  const remainingMs = kickoffMs - nowMs; // positive = pre-kickoff, negative = post-kickoff
  const elapsedMs   = nowMs - kickoffMs; // positive after kickoff

  // Belt-and-suspenders: the parent already stops rendering us after MATCH_WINDOW_MS,
  // but guard here in case of any timing gap.
  if (elapsedMs >= MATCH_WINDOW_MS) {
    return null;
  }

  const home = resolveFixtureParticipant(effectiveFixture, "home", fixtures);
  const away = resolveFixtureParticipant(effectiveFixture, "away", fixtures);
  const venue = getVenueById(effectiveFixture.venueId);
  const competitionLabel = effectiveFixture.groupId
    ? groupLabel(effectiveFixture.groupId)
    : formatStageLabel(effectiveFixture.stage);
  const venueLabel = venue
    ? `${venue.name}${venue.city ? ` - ${venue.city}` : ""}`
    : null;

  const isLiveNow = remainingMs <= 0;
  const approxMin = isLiveNow ? Math.floor(elapsedMs / 60_000) : 0;

  if (isLiveNow) {
    return (
      <article
        className={styles.countdownCard}
        aria-live="polite"
        aria-label={t("liveNowAria", {
          home: home.label,
          away: away.label,
          min: approxMin,
        })}
      >
        <div className={styles.countdownHeader}>
          <span className={styles.countdownLiveNow}>
            <span className={styles.countdownLiveDot} aria-hidden="true" />
            {t("liveNow")}
          </span>
          <span className={styles.countdownCompetition}>{competitionLabel}</span>
        </div>

        <div className={styles.countdownTeams}>
          <div className={`${styles.countdownTeam} ${styles.countdownTeamHome}`}>
            <TeamFlag teamId={home.teamId} teamName={home.label} size={44} />
            <span className={styles.countdownTeamName}>{home.label}</span>
          </div>

          <div className={styles.countdownCentre}>
            <span className={styles.countdownLiveBadge} aria-hidden="true">
              {t("liveBadge")}
            </span>
            <span className={styles.countdownElapsed}>
              {t("elapsed", { min: approxMin })}
            </span>
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
          {t("viewMatchCentreArrow")}
        </Link>
      </article>
    );
  }

  const countdown = formatCountdown(remainingMs);

  return (
    <article
      className={styles.countdownCard}
      aria-live="polite"
      aria-label={t("nextMatchAria", {
        home: home.label,
        away: away.label,
        countdown,
      })}
    >
      <div className={styles.countdownHeader}>
        <span className={styles.countdownEyebrow}>{t("upNext")}</span>
        <span className={styles.countdownCompetition}>{competitionLabel}</span>
      </div>

      <div className={styles.countdownTeams}>
        <div className={`${styles.countdownTeam} ${styles.countdownTeamHome}`}>
          <TeamFlag teamId={home.teamId} teamName={home.label} size={44} />
          <span className={styles.countdownTeamName}>{home.label}</span>
        </div>

        <div className={styles.countdownCentre}>
          <span className={styles.countdownTimer}>{countdown}</span>
          <span className={styles.countdownSub}>{t("untilKickoff")}</span>
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
        {t("viewMatchCentre")}
      </Link>
    </article>
  );
}