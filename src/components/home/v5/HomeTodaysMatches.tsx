"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { KickoffTime } from "@/components/KickoffTime";
import { useDeviceTimezoneLabel, useIsClientMounted } from "@/lib/client/use-local-kickoff";
import { MATCHDAY_COMPETITIONS, isLive, matchdayHref, sourceHealth, todayMatches, type MatchdayFilter, type MatchdaySource } from "@/lib/home/matchday";
import MatchdayCard, { MatchdaySourceNotice } from "./MatchdayCard";
import styles from "./Matchday.module.css";

const FILTERS: MatchdayFilter[] = ["all", "live", "finished", "upcoming"];

export default function HomeTodaysMatches({ sources, now }: { sources: MatchdaySource[]; now: Date }) {
  const t = useTranslations("matchday");
  const locale = useLocale();
  const timezone = useDeviceTimezoneLabel();
  const mounted = useIsClientMounted();
  const [filter, setFilter] = useState<MatchdayFilter>("all");
  const [expanded, setExpanded] = useState<string[]>([]);
  const ready = mounted && sources.every(s => sourceHealth(s, now) === "available");
  const groups = sources.map(source => ({ source, rows: mounted ? todayMatches(source.data?.fixtures ?? [], now, filter) : [] }))
    .sort((a, b) => Number(b.rows.some(isLive)) - Number(a.rows.some(isLive)));
  const next = sources.flatMap(source => {
    const row = source.data?.fixtures?.filter(f => f.status === "UPCOMING" && f.kickoffUtc && Date.parse(f.kickoffUtc) > now.getTime() && !todayMatches([f], now).length)
      .sort((a,b) => Date.parse(a.kickoffUtc!) - Date.parse(b.kickoffUtc!))[0];
    return row ? [{ source, row }] : [];
  }).sort((a,b) => Date.parse(a.row.kickoffUtc!) - Date.parse(b.row.kickoffUtc!));

  return <section className={styles.board} aria-labelledby="home-today-heading" data-testid="matchday-board">
    <header className={styles.header}><div>
      <h2 id="home-today-heading">{t("today")}</h2>
      <p className={styles.muted}>{mounted ? now.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" }) : t("loading")} {timezone ? `· ${timezone}` : ""}</p>
    </div></header>
    <div className={styles.filters} role="group" aria-label={t("filters")}>
      {FILTERS.map(value => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>
        {t(`filtersLabel.${value}`)} <span>({ready ? sources.reduce((count, s) => count + todayMatches(s.data?.fixtures ?? [], now, value).length, 0) : "–"})</span>
      </button>)}
    </div>
    {groups.map(({ source, rows }) => {
      const health = sourceHealth(source, now);
      const shown = expanded.includes(source.key) ? rows : rows.slice(0, 6);
      return <section key={source.key} className={styles.group} aria-label={MATCHDAY_COMPETITIONS[source.key].label}>
        <div className={styles.groupHeader}><h3><Link href={MATCHDAY_COMPETITIONS[source.key].href}>{MATCHDAY_COMPETITIONS[source.key].label}</Link></h3>
          <span>{mounted && (health === "available" || rows.length > 0) ? t("matchCount", { count: rows.length }) : "–"}</span></div>
        <MatchdaySourceNotice source={source} now={now} />
        <div className={styles.grid}>{shown.map(row => <MatchdayCard key={row.fixtureId} fixture={row} source={source} now={now} />)}</div>
        {!rows.length && mounted && !source.loading && health === "available" ? <p className={styles.muted}>{t(filter === "all" ? "noMatches" : "noFilterMatches")}</p> : null}
        {rows.length > 6 ? <button type="button" className={styles.showAll} aria-expanded={expanded.includes(source.key)} onClick={() => setExpanded(old => old.includes(source.key) ? old.filter(k => k !== source.key) : [...old, source.key])}>
          {expanded.includes(source.key) ? t("showLess") : t("showAll", { count: rows.length })}
        </button> : null}
      </section>;
    })}
    {mounted && next.length ? <section className={styles.next} aria-label={t("nextUp")}><h3>{t("nextUp")}</h3>
      {next.map(({ source, row }) => <Link prefetch={false} key={source.key} href={matchdayHref(source.key, row.fixtureId)}>
        <span><small>{MATCHDAY_COMPETITIONS[source.key].label}</small><strong>{row.homeTeamName} vs {row.awayTeamName}</strong></span>
        <span><KickoffTime utcDate={row.kickoffUtc!} /><small>{t("matchHub")} →</small></span>
      </Link>)}
    </section> : null}
  </section>;
}
