"use client";

import { useEffect, useMemo, useState } from "react";
import type { PlTeamRow, PlTeamsApiResponse } from "@/lib/pl/types";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./PlData.module.css";
import {
  PlEmptyPanel,
  PlErrorPanel,
  PlLoadingPanel,
  PlSearchInput,
  PlTeamBadge,
} from "./PlShared";

type ViewState = "loading" | "error" | "empty" | "ready";

export default function PlClubsClient() {
  const [view, setView] = useState<ViewState>("loading");
  const [data, setData] = useState<PlTeamsApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setView("loading");
      try {
        const res = await fetch("/api/pl/teams", { cache: "no-store" });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const body = (await res.json()) as PlTeamsApiResponse;
        if (cancelled) return;
        setData(body);
        setView(body.teams.length ? "ready" : "empty");
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

  const filtered = useMemo(() => {
    if (!data?.teams.length) return [] as PlTeamRow[];
    const q = query.trim().toLowerCase();
    if (!q) return data.teams;
    return data.teams.filter((team) => team.name.toLowerCase().includes(q));
  }, [data?.teams, query]);

  const emptyMessage =
    data?.error ??
    (data?.configured === false
      ? "Clubs will appear when the API key is configured on the server."
      : "Premier League clubs are not available yet.");

  return (
    <main className={styles.plPage}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Premier League Clubs 2026/27</h1>
        <p className={styles.heroSub}>
          All clubs for the season on {SITE_NAME} — from official API data.
        </p>
      </header>

      {view === "loading" ? (
        <PlLoadingPanel title="Loading clubs" text="Fetching Premier League teams…" />
      ) : null}
      {view === "error" ? (
        <PlErrorPanel
          title="Could not load clubs"
          text={errorMessage ?? "The teams API is temporarily unavailable."}
        />
      ) : null}
      {view === "empty" ? (
        <PlEmptyPanel title="Clubs not available yet" text={emptyMessage} />
      ) : null}

      {view === "ready" && data ? (
        <>
          <PlSearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search clubs…"
          />
          {filtered.length === 0 ? (
            <PlEmptyPanel
              title="No clubs match your search"
              text="Try a different club name."
            />
          ) : (
            <div className={styles.grid}>
              {filtered.map((team) => (
                <div
                  key={team.teamId}
                  className={`${styles.card} ${styles.cardDisabled}`}
                  aria-label={`${team.name} — club page coming soon`}
                >
                  <PlTeamBadge name={team.name} logo={team.logo} />
                  <span className={styles.cardName}>{team.name}</span>
                  {team.venueName ? (
                    <span className={styles.listSub}>{team.venueName}</span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
          <p className={styles.meta}>
            Source: {data.source} · {data.teams.length} clubs · Updated{" "}
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
