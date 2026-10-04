"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FREE_COMPETITIONS, hasFinalScore, isCompetitionCode, isStale, partitionMatches, type FootballSnapshot, type FreeMatch } from "@/lib/free-football/model";
import styles from "./HomeResultsBoard.module.css";

export default function HomeResultsBoard({ snapshot }: { snapshot: FootballSnapshot }) {
  const t = useTranslations("freeFootball");
  const [competition, setCompetition] = useState("PL");
  const [clock, setClock] = useState<{now: Date; zone: string} | null>(null);
  useEffect(() => {
    const update = () => setClock({now: new Date(), zone: Intl.DateTimeFormat().resolvedOptions().timeZone});
    const initial = window.setTimeout(() => {
      const query = new URLSearchParams(window.location.search).get("competition");
      if (query === "ALL" || (query && isCompetitionCode(query))) setCompetition(query);
      update();
    }, 0);
    const timer = window.setInterval(update, 60000); // Only local clock; no polling.
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, []);
  const selected = snapshot.competitions.filter(c => competition === "ALL" || c.code === competition);
  const matches = selected.flatMap(c => c.matches);
  const sections = clock ? partitionMatches(matches, clock.now, clock.zone) : null;
  const stale = clock && selected.some(c => isStale(c.fetchedAt, clock.now));
  const dates = selected.map(c => c.fetchedAt).filter((v):v is string => Boolean(v)).sort();
  const updated = dates[0]; // Oldest selected feed, never claim all are newer.
  const dateText = (iso: string) => new Intl.DateTimeFormat(undefined, {dateStyle:"medium",timeStyle:"short",timeZone:clock?.zone || "UTC"}).format(new Date(iso));
  const renderMatch = (m: FreeMatch) => {
    const started = clock && Date.parse(m.kickoffUtc) <= clock.now.getTime();
    const status = hasFinalScore(m) ? t("final") : m.status === "POSTPONED" ? t("postponed") : m.status === "CANCELLED" ? t("cancelled") : started ? t("pending") : t("scheduled");
    return <li key={m.id} className={styles.match}>
      <div className={styles.teams}><span>{m.home}</span><strong aria-label={hasFinalScore(m) ? t("score", {home:m.homeScore!,away:m.awayScore!}) : status}>{hasFinalScore(m) ? `${m.homeScore} – ${m.awayScore}` : "vs"}</strong><span>{m.away}</span></div>
      <div className={styles.meta}><time dateTime={m.kickoffUtc}>{dateText(m.kickoffUtc)}</time><span>{status}</span></div>
    </li>;
  };
  const renderSection = (title: string, rows: FreeMatch[], empty: string) => <section className={styles.section}>
    <h2>{title}</h2>
    {rows.length ? FREE_COMPETITIONS.filter(c => rows.some(m => m.competition === c.code)).map(c => <div key={c.code} className={styles.group}>
      <h3>{c.flag ? <Image unoptimized src={`/flags/4x3/${c.flag}.svg`} alt="" width={22} height={17}/> : <span aria-hidden="true">⚽</span>}{c.name}</h3>
      <ul>{rows.filter(m => m.competition === c.code).map(renderMatch)}</ul>
    </div>) : <p className={styles.empty}>{empty}</p>}
  </section>;
  return <section className={styles.board} aria-labelledby="football-board-title">
    <div className={styles.intro}><div><p className={styles.eyebrow}>{t("eyebrow")}</p><h1 id="football-board-title">{t("heading")}</h1><p>{t("description")}</p></div>
      <label className={styles.filter}>{t("competition")}<select value={competition} onChange={e=>setCompetition(e.target.value)}>
        {FREE_COMPETITIONS.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}<option value="ALL">{t("all")}</option>
      </select></label>
    </div>
    <div className={styles.notice} role="status">
      {updated && clock ? <span>{t("updated", {date:dateText(updated)})}</span> : <span>{t("unavailable")}</span>}
      {stale && updated ? <strong>{t("stale")}</strong> : null}<span>{t("delayed")}</span>
    </div>
    {!selected.every(c=>c.available) ? <p className={styles.warning}>{t("missing")}</p> : null}
    {sections ? <>
      {renderSection(t("today"),sections.today,t("noToday"))}
      {!sections.today.length ? renderSection(t("next"),sections.upcoming.slice(0,3),t("noUpcoming")) : null}
      {renderSection(t("results"),sections.results,t("noResults"))}
      {renderSection(t("upcoming"),sections.upcoming,t("noUpcoming"))}
    </> : <p className={styles.empty}>{t("localising")}</p>}
    <p className={styles.attribution}>Football data provided by the <a href="https://www.football-data.org/" target="_blank" rel="noopener noreferrer">Football-Data.org API</a></p>
  </section>;
}
