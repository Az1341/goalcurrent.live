"use client";

import { useNow, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LIVE_API_PATHS, useLiveApi } from "@/lib/client/live-data";
import { MATCHDAY_COMPETITIONS, sourceHealth, type MatchdayCompetition, type MatchdayData, type MatchdayFixture, type MatchdaySource } from "@/lib/home/matchday";
import { unlGroupHrefFromGroupId } from "@/lib/unl/live-partition";
import MatchdayCard, { MatchdaySourceNotice } from "./MatchdayCard";
import styles from "./Matchday.module.css";

const paths = { pl: LIVE_API_PATHS.plFixtures, ucl: LIVE_API_PATHS.uclFixtures, facup: LIVE_API_PATHS.facupFixtures, unl: LIVE_API_PATHS.unlFixtures };

/** Reuses the competition feed and its SWR key; opening a card adds no new provider pipeline. */
export default function CompetitionMatchHub({ competition, fixtureId, initialFixture }: {
  competition: MatchdayCompetition; fixtureId: number; initialFixture?: MatchdayFixture;
}) {
  const t = useTranslations("matchday");
  const { data, error, isLoading } = useLiveApi<MatchdayData>(paths[competition]);
  const now = useNow({ updateInterval: 30_000 });
  const latest = data?.fixtures?.find(f => f.fixtureId === fixtureId);
  const fixture = latest ?? initialFixture;
  const source: MatchdaySource = {
    key: competition, loading: isLoading, failed: Boolean(error),
    data: !latest && initialFixture ? { configured: false, source: "fallback", fixtures: [initialFixture] } : data,
  };
  const config = MATCHDAY_COMPETITIONS[competition];
  return <main className={styles.hub}>
    <Link href="/">← {t("backToToday")}</Link>
    <p><Link href={config.href}>{config.label}</Link></p>
    <h1>{fixture ? `${fixture.homeTeamName} vs ${fixture.awayTeamName}` : t("matchHub")}</h1>
    <MatchdaySourceNotice source={source} now={now} />
    {fixture ? <>
      <MatchdayCard detail fixture={fixture} source={source} now={now} />
      <p>{fixture.round}</p>
      {"venue" in fixture && fixture.venue ? <p>{fixture.venue}</p> : null}
      {"groupId" in fixture ? <p><Link href={unlGroupHrefFromGroupId(fixture.groupId)}>{t("groupTable")} →</Link></p> : null}
      <p className={styles.muted}>{t("detailCoverage")}</p>
    </> : !isLoading && sourceHealth(source, now) === "available" ? <p>{t("matchNotFound")}</p> : null}
  </main>;
}
