"use client";

import { LIVE_API_PATHS, useLiveApi } from "@/lib/client/live-data";
import type { PlPlayerLeaderboardApiResponse } from "@/lib/pl/types";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./PlData.module.css";
import {
  PlEmptyPanel,
  PlErrorPanel,
  PlLoadingPanel,
} from "./PlShared";

function LeaderRow({
  row,
  rank,
}: {
  row: PlPlayerLeaderboardApiResponse["leaders"][number];
  rank: number;
}) {
  return (
    <div className={styles.listRow}>
      <span className={styles.listRank}>{rank}</span>
      <div className={styles.listMain}>
        <div className={styles.listTitle}>{row.name}</div>
        <div className={styles.listSub}>
          {[row.teamName, row.position].filter(Boolean).join(" · ")}
        </div>
      </div>
      <span className={styles.listValue}>{row.value ?? "—"} goals</span>
    </div>
  );
}

export default function PlTopScorersClient() {
  const { data, error, isLoading } = useLiveApi<PlPlayerLeaderboardApiResponse>(
    LIVE_API_PATHS.plTopScorers,
  );

  if (isLoading && !data) {
    return (
      <PlLoadingPanel title="Loading top scorers" text="Fetching PL scorers…" />
    );
  }

  if (error && !data) {
    return (
      <PlErrorPanel
        title="Could not load top scorers"
        text="The top scorers API is temporarily unavailable."
      />
    );
  }

  if (!data) {
    return null;
  }

  const leaders = Array.isArray(data.leaders) ? data.leaders : [];
  const emptyMessage =
    data.error ??
    (data.configured === false
      ? "Top scorers will appear when the API key is configured on the server."
      : "Top scorers are not available yet from the live data source.");

  return (
    <main className={styles.plPage}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Premier League Top Scorers 2026/27</h1>
        <p className={styles.heroSub}>
          Goal leaders on {SITE_NAME} — refreshed every 30 seconds.
        </p>
      </header>

      {leaders.length === 0 ? (
        <PlEmptyPanel title="Top scorers not available yet" text={emptyMessage} />
      ) : (
        <section className={styles.section} aria-label="Top scorers">
          <div className={styles.list}>
            {leaders.map((row, index) => (
              <LeaderRow key={`${row.playerId}-${index}`} row={row} rank={index + 1} />
            ))}
          </div>
        </section>
      )}

      <p className={styles.meta}>
        Source: {data.source} · Updated{" "}
        {new Date(data.fetchedAt).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>
    </main>
  );
}
