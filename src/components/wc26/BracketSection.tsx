"use client";

import { useMemo } from "react";
import TeamFlag from "@/components/TeamFlag";
import TeamLink from "@/components/wc26/TeamLink";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import {
  buildGroupBBracketView,
  getGroupQualification,
  teamDisplayName,
  type ResolvedBracketSide,
} from "@/lib/wc26-standings";
import styles from "./wc26.module.css";

const KNOCKOUT_ROUNDS = [
  "Round of 32",
  "Round of 16",
  "Quarter-finals",
  "Semi-finals",
  "Third place",
  "Final",
];

function BracketSideRow({ side }: { side: ResolvedBracketSide }) {
  if (side.teamId) {
    return (
      <div className={styles.bracketMatchSide}>
        <TeamFlag teamId={side.teamId} size={20} />
        <TeamLink teamId={side.teamId}>{side.label}</TeamLink>
      </div>
    );
  }

  return (
    <div className={`${styles.bracketMatchSide} ${styles.bracketMatchSidePending}`}>
      {side.label}
    </div>
  );
}

export default function BracketSection() {
  const fixtures = useEffectiveFixtures();
  const groupBMatches = useMemo(
    () => buildGroupBBracketView(fixtures),
    [fixtures],
  );
  const groupBQual = useMemo(
    () => getGroupQualification("b", fixtures),
    [fixtures],
  );

  return (
    <section aria-labelledby="bracket-section-heading">
      <h2 id="bracket-section-heading" className={styles.sectionTitle}>
        Knockout bracket
      </h2>

      <p className={styles.phaseNote}>
        Round of 32 slots involving Group B update automatically from final group
        standings when all Group B matches are full-time.
      </p>

      <div className={styles.bracketShell}>
        <div className={styles.shellHead}>Round of 32 — Group B paths</div>
        {groupBMatches.map((match) => (
          <div key={match.matchNumber} className={styles.bracketMatchCard}>
            <div className={styles.bracketMatchMeta}>
              Match {match.matchNumber} · {match.round}
            </div>
            <div className={styles.bracketMatchTeams}>
              <BracketSideRow side={match.home} />
              <div className={styles.bracketMatchVs}>vs</div>
              <BracketSideRow side={match.away} />
            </div>
          </div>
        ))}
        {groupBQual.complete ? (
          <p className={styles.bracketGroupBNote}>
            Group B complete —{" "}
            {groupBQual.winner
              ? `${teamDisplayName(groupBQual.winner.teamId)} (winner)`
              : "winner"}{" "}
            and{" "}
            {groupBQual.runnerUp
              ? `${teamDisplayName(groupBQual.runnerUp.teamId)} (runner-up)`
              : "runner-up"}{" "}
            are locked into the bracket above.
          </p>
        ) : (
          <p className={styles.bracketGroupBNote}>
            Group B still in progress — winner and runner-up slots show placeholders
            until all six group matches finish.
          </p>
        )}
      </div>

      <div className={styles.bracketShell}>
        <div className={styles.shellHead}>Full knockout stage</div>
        <div className={styles.bracketRounds}>
          {KNOCKOUT_ROUNDS.map((round) => (
            <div key={round} className={styles.bracketRound}>
              <div className={styles.bracketRoundLabel}>{round}</div>
              <div className={styles.bracketSlot}>TBD vs TBD</div>
              <div className={styles.bracketSlot}>TBD vs TBD</div>
            </div>
          ))}
        </div>
        <p className={styles.standingsEmpty}>
          Remaining knockout pairings will connect as more groups complete and
          third-place qualifiers are determined.
        </p>
      </div>
    </section>
  );
}
