"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PlFixtureCard from "@/components/pl/PlFixtureCard";
import type { PlLiveApiResponse } from "@/lib/pl/types";
import {
  PL_BROADCASTER_UNAVAILABLE,
  resolvePlBroadcasterForVisitor,
} from "@/lib/pl/pl-broadcasters";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./PlData.module.css";
import {
  PlEmptyPanel,
  PlErrorPanel,
  PlLoadingPanel,
} from "./PlShared";

type ViewState = "loading" | "error" | "empty" | "ready";

export default function PlLiveClient() {
  const [view, setView] = useState<ViewState>("loading");
  const [data, setData] = useState<PlLiveApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setView("loading");
      try {
        const res = await fetch("/api/pl/live", { cache: "no-store" });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        let body = (await res.json()) as PlLiveApiResponse;
        const visitorBroadcaster = resolvePlBroadcasterForVisitor();
        if (visitorBroadcaster !== PL_BROADCASTER_UNAVAILABLE) {
          body = {
            ...body,
            fixtures: body.fixtures.map((fixture) => ({
              ...fixture,
              broadcaster: visitorBroadcaster,
            })),
          };
        }
        if (cancelled) return;
        setData(body);
        setView(body.fixtures.length ? "ready" : "empty");
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error",
        );
        setView("error");
      }
    }

    void load();
    const timer = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const emptyMessage =
    data?.error ??
    (data?.configured === false
      ? "Live matches will appear when the API key is configured on the server."
      : "No Premier League live matches right now.");

  return (
    <main className={styles.plPage}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Premier League Live 2026/27</h1>
        <p className={styles.heroSub}>
          Live PL matches only on {SITE_NAME} — refreshed every 30 seconds.
        </p>
      </header>

      {view === "loading" ? (
        <PlLoadingPanel title="Loading live matches" text="Checking for live PL games…" />
      ) : null}
      {view === "error" ? (
        <PlErrorPanel
          title="Could not load live matches"
          text={errorMessage ?? "The live API is temporarily unavailable."}
        />
      ) : null}
      {view === "empty" ? (
        <>
          <PlEmptyPanel
            title="No Premier League live matches right now"
            text={emptyMessage}
          />
          <div className={styles.linkRow}>
            <Link href="/premier-league/fixtures" className={styles.linkBtn}>
              View fixtures
            </Link>
          </div>
        </>
      ) : null}

      {view === "ready" && data ? (
        <>
          <section className={styles.list} aria-label="Live Premier League matches">
            {data.fixtures.map((fixture) => (
              <PlFixtureCard key={fixture.fixtureId} fixture={fixture} />
            ))}
          </section>
          <p className={styles.meta}>
            Source: {data.source} · {data.fixtures.length} live · Updated{" "}
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
