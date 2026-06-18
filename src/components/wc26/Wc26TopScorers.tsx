"use client";

import { useState } from "react";
import TeamFlag from "@/components/TeamFlag";
import { resolveTeamId } from "@/lib/teamIdentity";
import {
  formatTopScorerPlayerName,
  type TopScorerRow,
} from "@/lib/wc26-top-scorers";
import { useWc26TopScorers } from "@/lib/use-wc26-top-scorers";
import styles from "./wc26.module.css";

const TOP_SCORERS_VISIBLE = 6;

type Wc26TopScorersProps = {
  /** When true, omit outer section title (parent supplies heading). */
  embedded?: boolean;
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

export default function Wc26TopScorers({ embedded = false }: Wc26TopScorersProps) {
  const { data, loading } = useWc26TopScorers();
  const [expanded, setExpanded] = useState(false);
  const scorers = data.scorers;
  const hasScorers = scorers.length > 0;
  const hasMoreScorers = scorers.length > TOP_SCORERS_VISIBLE;
  const visibleScorers = expanded
    ? scorers
    : scorers.slice(0, TOP_SCORERS_VISIBLE);

  return (
    <section
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
        ) : !hasScorers ? (
          <p className={styles.topScorersEmpty}>
            {data.configured
              ? "Top scorers will appear once goal events are available from completed matches."
              : "Top scorers will appear once goal events are available."}
          </p>
        ) : (
          <>
            {data.partialData ? (
              <p className={styles.topScorersNote}>
                Based on available match event data
                {data.matchesWithVerifiedEvents > 0
                  ? ` (${data.matchesWithVerifiedEvents} of ${data.matchesProcessed} completed matches with verified goal events).`
                  : "."}
              </p>
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