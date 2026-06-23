"use client";

import { useEffect, useState } from "react";
import type {
  PlPlayerStatRow,
  PlStatisticsApiResponse,
} from "@/lib/pl/types";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./PlData.module.css";
import {
  PlErrorPanel,
  PlLoadingPanel,
} from "./PlShared";

type ViewState = "loading" | "error" | "ready";

function LeaderList({
  title,
  rows,
  valueLabel,
}: {
  title: string;
  rows: PlPlayerStatRow[];
  valueLabel: string;
}) {
  if (!rows.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.list}>
        {rows.map((row, index) => (
          <div key={`${title}-${row.playerId}-${index}`} className={styles.listRow}>
            <span className={styles.listRank}>{index + 1}</span>
            <div className={styles.listMain}>
              <div className={styles.listTitle}>{row.name}</div>
              <div className={styles.listSub}>
                {[row.teamName, row.position].filter(Boolean).join(" · ")}
              </div>
            </div>
            <span className={styles.listValue}>
              {row.value ?? "—"} {valueLabel}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PlStatisticsClient() {
  const [view, setView] = useState<ViewState>("loading");
  const [data, setData] = useState<PlStatisticsApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setView("loading");
      try {
        const res = await fetch("/api/pl/statistics", { cache: "no-store" });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const body = (await res.json()) as PlStatisticsApiResponse;
        if (cancelled) return;
        setData(body);
        setView("ready");
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error",
        );
        setView("error");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasLeaders =
    data &&
    (data.statistics.topScorers.length > 0 ||
      data.statistics.topAssists.length > 0 ||
      data.statistics.discipline.length > 0);

  return (
    <main className={styles.plPage}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Premier League Statistics 2026/27</h1>
        <p className={styles.heroSub}>
          Season leaders on {SITE_NAME} — top scorers, assists and discipline.
        </p>
      </header>

      {view === "loading" ? (
        <PlLoadingPanel title="Loading statistics" text="Fetching PL stats…" />
      ) : null}
      {view === "error" ? (
        <PlErrorPanel
          title="Could not load statistics"
          text={errorMessage ?? "The statistics API is temporarily unavailable."}
        />
      ) : null}

      {view === "ready" && data ? (
        <>
          <LeaderList
            title="Top Scorers"
            rows={data.statistics.topScorers}
            valueLabel="goals"
          />
          <LeaderList
            title="Top Assists"
            rows={data.statistics.topAssists}
            valueLabel="assists"
          />
          <LeaderList
            title="Discipline"
            rows={data.statistics.discipline}
            valueLabel="cards"
          />
          {!hasLeaders ? (
            <p className={styles.meta}>
              {data.error ??
                "Season statistics will populate here once matches are played and API-Football publishes leader data for this season."}
            </p>
          ) : null}
          <p className={styles.meta}>
            Source: {data.source} · Updated{" "}
            {new Date(data.fetchedAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </>
      ) : null}
    </main>
  );
}
