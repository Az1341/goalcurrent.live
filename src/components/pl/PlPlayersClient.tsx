"use client";

import { useEffect, useMemo, useState } from "react";
import type { PlPlayerStatRow, PlPlayersApiResponse } from "@/lib/pl/types";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./PlData.module.css";
import {
  PlErrorPanel,
  PlLoadingPanel,
  PlSearchInput,
  PlTeamLogo,
} from "./PlShared";

type ViewState = "loading" | "error" | "ready";

function PlayerPhoto({
  name,
  photo,
}: {
  name: string;
  photo: string | null;
}) {
  return (
    <PlTeamLogo name={name} logo={photo} size={36} rounded />
  );
}

export default function PlPlayersClient() {
  const [view, setView] = useState<ViewState>("loading");
  const [data, setData] = useState<PlPlayersApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setView("loading");
      try {
        const res = await fetch("/api/pl/players", { cache: "no-store" });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const body = (await res.json()) as PlPlayersApiResponse;
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

  const filtered = useMemo(() => {
    if (!data?.players.length) return [] as PlPlayerStatRow[];
    const q = query.trim().toLowerCase();
    if (!q) return data.players;
    return data.players.filter(
      (player) =>
        player.name.toLowerCase().includes(q) ||
        (player.teamName?.toLowerCase().includes(q) ?? false),
    );
  }, [data, query]);

  return (
    <main className={styles.plPage}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Premier League Players 2026/27</h1>
        <p className={styles.heroSub}>
          Premier League squads on {SITE_NAME} — sourced from API-Football.
        </p>
      </header>

      {view === "loading" ? (
        <PlLoadingPanel title="Loading players" text="Fetching player data…" />
      ) : null}
      {view === "error" ? (
        <PlErrorPanel
          title="Could not load players"
          text={errorMessage ?? "The players API is temporarily unavailable."}
        />
      ) : null}

      {view === "ready" && data ? (
        <>
          <PlSearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search players or clubs…"
          />
          {filtered.length === 0 ? (
            <p className={styles.meta}>
              {data.players.length
                ? "No players match your search."
                : "Player squads will appear here when registered for the season."}
            </p>
          ) : (
            <div className={styles.list}>
              {filtered.map((player, index) => (
                <div key={`${player.playerId}-${index}`} className={styles.listRow}>
                  <PlayerPhoto name={player.name} photo={player.photo} />
                  <div className={styles.listMain}>
                    <div className={styles.listTitle}>{player.name}</div>
                    <div className={styles.listSub}>
                      {[player.teamName, player.position].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  {player.teamLogo ? (
                    <PlTeamLogo
                      name={player.teamName ?? "Team"}
                      logo={player.teamLogo}
                      size={28}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          )}
          <p className={styles.meta}>
            Source: {data.source} · {data.players.length} players · Updated{" "}
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
