"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { KickoffTime } from "@/components/KickoffTime";
import { PlTeamBadge } from "@/components/pl/PlShared";
import { FavouriteMatchButton } from "@/components/FavouriteButton";
import { getUnlFlagSrc } from "@/lib/unl/flag";
import { isLive, matchdayHref, matchStatusKey, scorePair, sourceHealth, type MatchdayFixture, type MatchdaySource } from "@/lib/home/matchday";
import styles from "./Matchday.module.css";

export function MatchdaySourceNotice({ source, now }: { source: MatchdaySource; now: Date }) {
  const t = useTranslations("matchday");
  const health = sourceHealth(source, now);
  return <p className={health === "available" ? styles.muted : styles.notice}>
    {t(`health.${health}`)}
    {health === "available" && source.data?.fetchedAt ? <> · <KickoffTime utcDate={source.data.fetchedAt} variant="time" /></> : null}
  </p>;
}

export default function MatchdayCard({ fixture, source, now, detail = false }: {
  fixture: MatchdayFixture; source: MatchdaySource; now: Date; detail?: boolean;
}) {
  const t = useTranslations("matchday");
  const score = scorePair(fixture);
  const status = matchStatusKey(fixture);
  const health = sourceHealth(source, now);
  const currentLive = isLive(fixture) && health === "available";
  const homeLogo = "homeTeamFlag" in fixture ? getUnlFlagSrc(fixture.homeTeamFlag) : fixture.homeTeamLogo;
  const awayLogo = "awayTeamFlag" in fixture ? getUnlFlagSrc(fixture.awayTeamFlag) : fixture.awayTeamLogo;
  const content = <>
    <div className={styles.cardMeta}>
      <span className={currentLive ? styles.live : styles.status}>
        {isLive(fixture) && !currentLive ? t("lastReportedLive") : t(`status.${status}`)}
        {currentLive && ["live", "extraTime"].includes(status) && fixture.elapsed != null ? ` ${fixture.elapsed}′` : ""}
      </span>
      {fixture.kickoffUtc ? <time dateTime={fixture.kickoffUtc}><KickoffTime utcDate={fixture.kickoffUtc} variant={detail ? "full" : "time"} /></time> : t("kickoffTbc")}
    </div>
    <div className={styles.team}><PlTeamBadge name={fixture.homeTeamName} logo={homeLogo} size={28} /><span>{fixture.homeTeamName}</span><strong>{score?.[0] ?? "–"}</strong></div>
    <div className={styles.team}><PlTeamBadge name={fixture.awayTeamName} logo={awayLogo} size={28} /><span>{fixture.awayTeamName}</span><strong>{score?.[1] ?? "–"}</strong></div>
    {fixture.status !== "UPCOMING" && !score ? <small>{t("scoreUnavailable")}</small> : null}
    {"penaltyHome" in fixture && fixture.penaltyHome != null && fixture.penaltyAway != null ?
      <small>{t("penaltyScore", { home: fixture.penaltyHome, away: fixture.penaltyAway })}</small> : null}
    {!detail ? <span className={styles.hubLink}>{t("matchHub")} <span aria-hidden="true">→</span></span> : null}
  </>;
  return <article className={styles.card} data-match-id={`${source.key}:${fixture.fixtureId}`}>
    {detail ? <div className={styles.cardContent}>{content}</div> :
      <Link prefetch={false} className={styles.cardContent} href={matchdayHref(source.key, fixture.fixtureId)} aria-label={`${fixture.homeTeamName} vs ${fixture.awayTeamName} — ${t("matchHub")}`}>{content}</Link>}
    {source.key === "pl" ? <FavouriteMatchButton matchId={`pl:${fixture.fixtureId}`} label={`${fixture.homeTeamName} vs ${fixture.awayTeamName}`} className={styles.favourite} /> : null}
  </article>;
}
