"use client";

import { useEffect, useState } from "react";
import type { PlTransfersApiResponse } from "@/lib/pl/types";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./PlData.module.css";
import {
  PlEmptyPanel,
  PlErrorPanel,
  PlLoadingPanel,
} from "./PlShared";

type ViewState = "loading" | "error" | "empty" | "ready";

export default function PlTransfersClient() {
  const [view, setView] = useState<ViewState>("loading");
  const [data, setData] = useState<PlTransfersApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setView("loading");
      try {
        const res = await fetch("/api/pl/transfers", { cache: "no-store" });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const body = (await res.json()) as PlTransfersApiResponse;
        if (cancelled) return;
        setData(body);
        setView(body.transfers.length ? "ready" : "empty");
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

  const emptyMessage =
    data?.error ??
    "Transfer feed not available from current API source yet.";

  return (
    <main className={styles.plPage}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Premier League Transfers 2026/27</h1>
        <p className={styles.heroSub}>
          Transfer updates on {SITE_NAME} when supported by the data source.
        </p>
      </header>

      {view === "loading" ? (
        <PlLoadingPanel title="Loading transfers" text="Checking transfer feed…" />
      ) : null}
      {view === "error" ? (
        <PlErrorPanel
          title="Could not load transfers"
          text={errorMessage ?? "The transfers API is temporarily unavailable."}
        />
      ) : null}
      {view === "empty" ? (
        <PlEmptyPanel title="Transfers not available yet" text={emptyMessage} />
      ) : null}

      {view === "ready" && data ? (
        <>
          <div className={styles.list}>
            {data.transfers.map((transfer, index) => (
              <div key={`${transfer.playerId}-${index}`} className={styles.listRow}>
                <span className={styles.listRank}>{index + 1}</span>
                <div className={styles.listMain}>
                  <div className={styles.listTitle}>{transfer.playerName}</div>
                  <div className={styles.listSub}>
                    {[transfer.fromTeam, transfer.toTeam].filter(Boolean).join(" → ")}
                    {transfer.type ? ` · ${transfer.type}` : ""}
                  </div>
                </div>
                <span className={styles.listSub}>
                  {transfer.date
                    ? new Date(transfer.date).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })
                    : "—"}
                </span>
              </div>
            ))}
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
