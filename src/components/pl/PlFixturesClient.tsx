"use client";

import { useEffect, useMemo, useState } from "react";
import PlFixtureCard from "@/components/pl/PlFixtureCard";
import type { PlFixtureRow, PlFixturesApiResponse } from "@/lib/pl/types";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./PlFixtures.module.css";

type ViewState = "loading" | "error" | "empty" | "ready";

function groupFixturesByMatchweek(
  fixtures: PlFixtureRow[],
): Array<{ key: string; label: string; items: PlFixtureRow[] }> {
  const groups = new Map<string, PlFixtureRow[]>();

  for (const fixture of fixtures) {
    const key =
      fixture.matchweek !== null
        ? `mw-${fixture.matchweek}`
        : fixture.round ?? "unknown";
    const existing = groups.get(key) ?? [];
    existing.push(fixture);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([key, items]) => {
    const matchweek = items[0]?.matchweek;
    const label =
      matchweek !== null && matchweek !== undefined
        ? `Matchweek ${matchweek}`
        : items[0]?.round ?? "Fixtures";

    return { key, label, items };
  });
}

export default function PlFixturesClient() {
  const [view, setView] = useState<ViewState>("loading");
  const [data, setData] = useState<PlFixturesApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadFixtures() {
      setView("loading");
      setErrorMessage(null);

      try {
        const res = await fetch("/api/pl/fixtures", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`);
        }

        const body = (await res.json()) as PlFixturesApiResponse;
        if (cancelled) return;

        setData(body);

        if (!body.fixtures.length) {
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

    void loadFixtures();
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo(
    () => (data?.fixtures ? groupFixturesByMatchweek(data.fixtures) : []),
    [data?.fixtures],
  );

  const emptyMessage =
    data?.error ??
    (data?.configured === false
      ? "Fixtures will appear when the API key is configured on the server."
      : "The 2026/27 Premier League fixtures are not available yet. Check back when the season starts.");

  return (
    <main className={styles.plPage}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Premier League Fixtures 2026/27</h1>
        <p className={styles.heroSub}>
          Full season schedule on {SITE_NAME} — kickoffs shown in your local
          timezone.
        </p>
      </header>

      {view === "loading" ? (
        <div className={styles.panel} role="status" aria-live="polite">
          <div className={styles.spinner} aria-hidden="true" />
          <p className={styles.panelTitle}>Loading fixtures</p>
          <p className={styles.panelText}>Fetching Premier League schedule…</p>
        </div>
      ) : null}

      {view === "error" ? (
        <div className={styles.panel} role="alert">
          <p className={styles.panelTitle}>Could not load fixtures</p>
          <p className={styles.panelText}>
            {errorMessage ??
              "The fixtures API is temporarily unavailable. Please try again shortly."}
          </p>
        </div>
      ) : null}

      {view === "empty" ? (
        <div className={styles.panel} role="status">
          <p className={styles.panelTitle}>Fixtures not available yet</p>
          <p className={styles.panelText}>{emptyMessage}</p>
        </div>
      ) : null}

      {view === "ready" && data ? (
        <>
          {groups.map((group) => (
            <section key={group.key} className={styles.group}>
              <h2 className={styles.sectionTitle}>{group.label}</h2>
              {group.items.map((fixture) => (
                <PlFixtureCard key={fixture.fixtureId} fixture={fixture} />
              ))}
            </section>
          ))}

          <p className={styles.meta}>
            Source: {data.source} · {data.fixtures.length} fixtures · Updated{" "}
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
