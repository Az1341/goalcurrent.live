"use client";

import { useEffect, useState } from "react";
import AdSenseUnit from "@/components/AdSenseUnit";
import type {
  PlStandingRow,
  PlStandingsApiResponse,
} from "@/lib/pl/types";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./PlTable.module.css";

type ViewState = "loading" | "error" | "empty" | "ready";

function teamInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 3).toUpperCase();
  }
  return parts
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

function formatGoalDiff(value: number): string {
  if (value > 0) return `+${value}`;
  return String(value);
}

function zoneClass(rank: number, total: number): string | undefined {
  if (rank <= 4) return styles.zoneUcl;
  if (rank === 5) return styles.zoneEl;
  if (rank <= 7) return styles.zoneConf;
  if (rank > total - 3) return styles.zoneRel;
  return undefined;
}

function TeamBadge({ row }: { row: PlStandingRow }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = row.teamLogo && !logoFailed;

  return (
    <span className={styles.badge} aria-hidden="true">
      {showLogo ? (
        <img
          src={row.teamLogo!}
          alt=""
          width={22}
          height={22}
          loading="lazy"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        teamInitials(row.teamName)
      )}
    </span>
  );
}

function StandingRow({
  row,
  totalTeams,
}: {
  row: PlStandingRow;
  totalTeams: number;
}) {
  const zone = zoneClass(row.rank, totalTeams);
  const gdClass =
    row.goalDiff > 0
      ? styles.gdPos
      : row.goalDiff < 0
        ? styles.gdNeg
        : undefined;

  return (
    <tr>
      <td className={styles.colRank}>{row.rank}</td>
      <td className={styles.colClub}>
        <div className={styles.clubCell}>
          <span
            className={`${styles.zoneBar} ${zone ?? ""}`}
            aria-hidden="true"
          />
          <TeamBadge row={row} />
          <span className={styles.clubName}>{row.teamName}</span>
        </div>
      </td>
      <td>{row.played}</td>
      <td className={styles.hideSm}>{row.win}</td>
      <td className={styles.hideSm}>{row.draw}</td>
      <td className={styles.hideSm}>{row.lose}</td>
      <td className={gdClass}>{formatGoalDiff(row.goalDiff)}</td>
      <td className={styles.colPts}>{row.points}</td>
    </tr>
  );
}

export default function PlTableClient() {
  const [view, setView] = useState<ViewState>("loading");
  const [data, setData] = useState<PlStandingsApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStandings() {
      setView("loading");
      setErrorMessage(null);

      try {
        const res = await fetch("/api/pl/standings", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`);
        }

        const body = (await res.json()) as PlStandingsApiResponse;
        if (cancelled) return;

        setData(body);

        if (!body.standings.length) {
          setView("empty");
          return;
        }

        setView("ready");
      } catch (error) {
        if (cancelled) return;
        setData(null);
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error",
        );
        setView("error");
      }
    }

    void loadStandings();
    return () => {
      cancelled = true;
    };
  }, []);

  const emptyMessage =
    data?.error ??
    (data?.configured === false
      ? "Live standings will appear when the API key is configured on the server."
      : "The 2026/27 Premier League table is not available yet. Check back when the season starts.");

  return (
    <main className={styles.plPage}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Premier League Table 2026/27</h1>
        <p className={styles.heroSub}>
          Live standings on {SITE_NAME} — updated from official data when
          available.
        </p>
      </header>

      <div className={styles.adWrap}>
        <AdSenseUnit slot="3456789012" />
      </div>

      {view === "loading" ? (
        <div className={styles.panel} role="status" aria-live="polite">
          <div className={styles.spinner} aria-hidden="true" />
          <p className={styles.panelTitle}>Loading standings</p>
          <p className={styles.panelText}>Fetching Premier League table…</p>
        </div>
      ) : null}

      {view === "error" ? (
        <div className={styles.panel} role="alert">
          <p className={styles.panelTitle}>Could not load table</p>
          <p className={styles.panelText}>
            {errorMessage ??
              "The standings API is temporarily unavailable. Please try again shortly."}
          </p>
        </div>
      ) : null}

      {view === "empty" ? (
        <div className={styles.panel} role="status">
          <p className={styles.panelTitle}>Table not available yet</p>
          <p className={styles.panelText}>{emptyMessage}</p>
        </div>
      ) : null}

      {view === "ready" && data ? (
        <>
          <div className={styles.legend} aria-label="Table zone legend">
            <span className={styles.legendItem}>
              <span className={`${styles.legendSwatch} ${styles.zoneUcl}`} />
              CL
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendSwatch} ${styles.zoneEl}`} />
              EL
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendSwatch} ${styles.zoneConf}`} />
              Conf
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendSwatch} ${styles.zoneRel}`} />
              Rel
            </span>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col" className={styles.colClub}>
                    Club
                  </th>
                  <th scope="col">P</th>
                  <th scope="col" className={styles.hideSm}>
                    W
                  </th>
                  <th scope="col" className={styles.hideSm}>
                    D
                  </th>
                  <th scope="col" className={styles.hideSm}>
                    L
                  </th>
                  <th scope="col">GD</th>
                  <th scope="col" className={styles.colPts}>
                    Pts
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.standings.map((row) => (
                  <StandingRow
                    key={`${row.teamId}-${row.rank}`}
                    row={row}
                    totalTeams={data.standings.length}
                  />
                ))}
              </tbody>
            </table>
          </div>

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
