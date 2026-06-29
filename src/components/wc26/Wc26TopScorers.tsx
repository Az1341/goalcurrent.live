"use client";

import { useState, useMemo } from "react";
import TeamFlag from "@/components/TeamFlag";
import { WC26_TOP_SCORERS_FALLBACK } from "@/data/wc26Standings";
import { useLiveTopScorers } from "@/lib/client/useLiveTopScorers";
import { resolveTeamId } from "@/lib/teamIdentity";
import {
  formatTopScorerPlayerName,
  type TopScorerRow,
} from "@/lib/wc26-top-scorers";
import styles from "./wc26.module.css";
const TOP_SCORERS_VISIBLE = 6;

function formatFreshnessLabel(fetchedAtIso: string): string {
  const fetchedMs = Date.parse(fetchedAtIso);
  if (Number.isNaN(fetchedMs)) {
    return "Updated just now";
  }

  const ageSeconds = Math.max(0, Math.floor((Date.now() - fetchedMs) / 1000));

  if (ageSeconds < 5) {
    return "Updated just now";
  }

  if (ageSeconds >= 60) {
    const minutes = Math.floor(ageSeconds / 60);
    return `Updated ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  return `Updated ${ageSeconds} seconds ago`;
}

type Wc26TopScorersProps = {
  /** When true, omit outer section title (parent supplies heading). */
  embedded?: boolean;
  /** Optional anchor id for in-page links (e.g. bracket page). */
  sectionId?: string;
  /** When set, use unified top scorers data from parent (e.g. group hub). */
  scorers?: readonly TopScorerRow[];
  loading?: boolean;
  configured?: boolean;
  matchesProcessed?: number;
  matchesWithVerifiedEvents?: number;
  fetchedAt?: string;
};

function ScorerTableRow({
  row,
  moreSectionStart = false,
}: {
  row: TopScorerRow;
  moreSectionStart?: boolean;
}) {
  const teamId = resolveTeamId(row.teamName);

  return (
    <tr
      className={moreSectionStart ? styles.topScorersRowMoreStart : undefined}
    >
      <td>{row.rank}</td>
      <td className={styles.colPlayer}>{formatTopScorerPlayerName(row)}</td>
      <td className={styles.colTeam}>
        <span className={styles.topScorerTeamCell}>
          {teamId ? <TeamFlag teamId={teamId} size={20} /> : null}
          <span className={styles.topScorerTeamName}>{row.teamName}</span>
        </span>
      </td>
      <td>{row.goals}</td>
    </tr>
  );
}

export default function Wc26TopScorers({
  embedded = false,
  sectionId = "top-scorers",
  scorers: scorersProp,
  loading: loadingProp,
  fetchedAt: fetchedAtProp,
}: Wc26TopScorersProps) {
  const shouldFetch = scorersProp === undefined;
  const { data, error, isLoading } = useLiveTopScorers(shouldFetch);

  const [expanded, setExpanded] = useState(false);

  const fallbackScorers = useMemo(
    () =>
      WC26_TOP_SCORERS_FALLBACK.map((row) => ({
        ...row,
        ownGoals: 0,
      })),
    [],
  );

  const loading = loadingProp ?? (shouldFetch ? isLoading && !data : false);
  const apiScorers = scorersProp ?? data?.scorers ?? [];
  const scorers =
    apiScorers.length > 0
      ? apiScorers
      : loading
        ? []
        : fallbackScorers;
  const usingFallback = apiScorers.length === 0 && !loading;
  const fetchedAt = fetchedAtProp ?? data?.fetchedAt;
  const freshnessLabel =
    !usingFallback && fetchedAt ? formatFreshnessLabel(fetchedAt) : null;
  const hasScorers = scorers.length > 0;
  const hasMoreScorers = scorers.length > TOP_SCORERS_VISIBLE;
  const visibleScorers = expanded
    ? scorers
    : scorers.slice(0, TOP_SCORERS_VISIBLE);

  return (
    <section
      id={sectionId}
      className={styles.topScorersSection}
      aria-labelledby={embedded ? undefined : "top-scorers-heading"}
    >
      {embedded ? null : (
        <h2 id="top-scorers-heading" className={styles.sectionTitle}>
          Top scorers
        </h2>
      )}

      <div className={styles.topScorersShell}>
        {loading ? (
          <p className={styles.topScorersEmpty}>Loading top scorers…</p>
        ) : error && !hasScorers ? (
          <p className={styles.topScorersEmpty}>
            Top scorers will appear when live data is available.
          </p>
        ) : !hasScorers ? (
          <p className={styles.topScorersEmpty}>
            Top scorers will appear when live data is available.
          </p>
        ) : (
          <>
            {freshnessLabel ? (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                <span
                  style={{
                    background: "#555",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: 9999,
                    fontSize: 12,
                    lineHeight: 1.2,
                  }}
                >
                  {freshnessLabel}
                </span>
              </div>
            ) : null}
            <table className={styles.topScorersTable}>
              <thead className={styles.topScorersThead}>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col" className={styles.colPlayer}>
                    Player
                  </th>
                  <th scope="col" className={styles.colTeam}>
                    Team
                  </th>
                  <th scope="col">Goals</th>
                </tr>
              </thead>
              <tbody>
                {visibleScorers.map((row, index) => (
                  <ScorerTableRow
                    key={`${row.rank}-${row.playerName}-${row.teamName}`}
                    row={row}
                    moreSectionStart={expanded && index === TOP_SCORERS_VISIBLE}
                  />
                ))}
              </tbody>
            </table>
            {hasMoreScorers ? (
              <button
                type="button"
                className={styles.topScorersExpandBtn}
                aria-expanded={expanded}
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? "Show top 6 only" : "Show all goal scorers"}
              </button>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
