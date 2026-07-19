"use client";

import TeamFlag from "@/components/TeamFlag";
import type { MatchLineupPlayer } from "@/types/match-detail";
import type { TeamId } from "@/types/team";
import {
  buildRowMaxCols,
  getMaxRow,
  parseGridPosition,
  type GridCoord,
} from "@/lib/match-lineup-grid";
import styles from "./MatchLineupBroadcast.module.css";

export type MatchLineupBroadcastProps = {
  home: readonly MatchLineupPlayer[];
  away: readonly MatchLineupPlayer[];
  homeFormation?: string | null;
  awayFormation?: string | null;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamId?: string;
  awayTeamId?: string;
  matchMetaLabel?: string | null;
  homeBench?: readonly MatchLineupPlayer[];
  awayBench?: readonly MatchLineupPlayer[];
  homeCoach?: string | null;
  awayCoach?: string | null;
  title?: string | null;
  kickoffLabel?: string | null;
  venueLabel?: string | null;
};

const COACH_BY_TEAM: Record<string, string> = {
  esp: "Luis de la Fuente",
  arg: "Lionel Scaloni",
};

function fallbackGrid(
  player: MatchLineupPlayer,
  index: number,
  players: readonly MatchLineupPlayer[],
): GridCoord {
  const pos = (player.position ?? "M").charAt(0).toUpperCase();
  const rowByPos: Record<string, number> = { G: 1, D: 2, M: 3, F: 5 };
  const row = rowByPos[pos] ?? 3;
  const sameRow = players
    .slice(0, index + 1)
    .filter((p) => (p.position ?? "M").charAt(0).toUpperCase() === pos).length;
  return { row, col: sameRow };
}

function spreadDuplicates(grid: GridCoord, seen: Map<string, number>): GridCoord {
  const key = `${grid.row}:${grid.col}`;
  const dupes = seen.get(key) ?? 0;
  seen.set(key, dupes + 1);
  return dupes === 0 ? grid : { row: grid.row, col: grid.col + dupes * 0.35 };
}

/** Home LEFT half, Away RIGHT half — Figma desktop broadcast. */
function gridToXY(
  grid: GridCoord,
  maxRow: number,
  rowMaxCols: Map<number, number>,
  side: "home" | "away",
): { x: number; y: number } {
  const colsInRow = Math.max(rowMaxCols.get(grid.row) ?? grid.col, 1);
  const rowProgress = (grid.row - 1) / Math.max(maxRow - 1, 1);
  const y = 14 + rowProgress * 72;
  const colFrac = (grid.col - 0.5) / colsInRow;
  const xSpan = 34;
  const x =
    side === "home" ? 8 + colFrac * xSpan : 92 - colFrac * xSpan;
  return { x, y };
}

function surname(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

function resolveCoach(teamId: string | undefined, override?: string | null): string | null {
  if (override) return override;
  if (!teamId) return null;
  return COACH_BY_TEAM[teamId] ?? null;
}

function PlayerNode({
  player,
  x,
  y,
  side,
}: {
  player: MatchLineupPlayer;
  x: number;
  y: number;
  side: "home" | "away";
}) {
  const nodeClass = side === "home" ? styles.nodeHome : styles.nodeAway;

  return (
    <div
      className={styles.player}
      style={{ left: `${x}%`, top: `${y}%` }}
      title={`${player.name}${player.number != null ? ` · #${player.number}` : ""}`}
    >
      <div className={`${styles.node} ${nodeClass}`}>
        <span className={styles.nodeNumber}>
          {player.number != null ? player.number : "–"}
        </span>
        {player.is_captain ? (
          <span className={styles.captainStar} aria-label="Captain">
            ★
          </span>
        ) : null}
      </div>
      <span className={styles.playerName}>{surname(player.name)}</span>
    </div>
  );
}

function TeamSide({
  players,
  side,
}: {
  players: readonly MatchLineupPlayer[];
  side: "home" | "away";
}) {
  const starters = players.slice(0, 11);
  const rowMaxCols = buildRowMaxCols(starters);
  const maxRow = getMaxRow(rowMaxCols);
  const seen = new Map<string, number>();

  return (
    <>
      {starters.map((player, index) => {
        const baseGrid =
          parseGridPosition(player.grid_position) ??
          fallbackGrid(player, index, starters);
        const grid = spreadDuplicates(baseGrid, seen);
        const { x, y } = gridToXY(grid, maxRow, rowMaxCols, side);
        return (
          <PlayerNode
            key={`${side}-${player.number ?? "na"}-${player.name}`}
            player={player}
            x={x}
            y={y}
            side={side}
          />
        );
      })}
    </>
  );
}

function SubstitutePills({
  title,
  players,
}: {
  title: string;
  players: readonly MatchLineupPlayer[];
}) {
  if (players.length === 0) return null;
  return (
    <div className={styles.subsCol}>
      <p className={styles.subsTitle}>{title}</p>
      <div className={styles.subsPills}>
        {players.map((player) => (
          <span
            key={`sub-${player.number ?? "na"}-${player.name}`}
            className={styles.subPill}
          >
            {player.number != null ? `${player.number} ` : ""}
            {surname(player.name)}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MatchLineupBroadcast({
  home,
  away,
  homeFormation,
  awayFormation,
  homeTeamName,
  awayTeamName,
  homeTeamId,
  awayTeamId,
  matchMetaLabel,
  homeBench = [],
  awayBench = [],
  homeCoach,
  awayCoach,
  title = "FIFA WORLD CUP 2026 FINAL",
  kickoffLabel,
  venueLabel,
}: MatchLineupBroadcastProps) {
  const hasLineup = home.length > 0 || away.length > 0;
  const homeCoachName = resolveCoach(homeTeamId, homeCoach);
  const awayCoachName = resolveCoach(awayTeamId, awayCoach);
  const homeMeta = [homeCoachName, homeFormation ? `(${homeFormation})` : null]
    .filter(Boolean)
    .join(" ");
  const awayMeta = [awayCoachName, awayFormation ? `(${awayFormation})` : null]
    .filter(Boolean)
    .join(" ");
  const centerKickoff = kickoffLabel ?? matchMetaLabel;
  const hasSubs = homeBench.length > 0 || awayBench.length > 0;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.teamBlock}>
          <div className={styles.teamIdentity}>
            <TeamFlag
              teamId={homeTeamId as TeamId | undefined}
              teamName={homeTeamName}
              size={36}
              className={styles.crest}
            />
            <span className={styles.teamName}>{homeTeamName}</span>
          </div>
          {homeMeta ? <p className={styles.coachMeta}>{homeMeta}</p> : null}
        </div>

        <div className={styles.centerMeta}>
          <p className={styles.finalTitle}>
            <span className={styles.trophy} aria-hidden="true">
              🏆
            </span>
            {title}
            <span className={styles.trophy} aria-hidden="true">
              🏆
            </span>
          </p>
          {centerKickoff ? <p className={styles.kickoff}>{centerKickoff}</p> : null}
          {venueLabel ? <p className={styles.venue}>{venueLabel}</p> : null}
        </div>

        <div className={`${styles.teamBlock} ${styles.teamBlockAway}`}>
          <div className={styles.teamIdentity}>
            <span className={styles.teamName}>{awayTeamName}</span>
            <TeamFlag
              teamId={awayTeamId as TeamId | undefined}
              teamName={awayTeamName}
              size={36}
              className={styles.crest}
            />
          </div>
          {awayMeta ? <p className={styles.coachMeta}>{awayMeta}</p> : null}
        </div>
      </header>

      {hasLineup ? (
        <div className={styles.pitchShell}>
          <div className={styles.pitch} aria-label="Tactical lineup">
            <div className={styles.pitchMarkings} aria-hidden="true">
              <div className={styles.halfway} />
              <div className={styles.centerCircle} />
              <div className={`${styles.box} ${styles.boxLeft}`} />
              <div className={`${styles.box} ${styles.boxRight}`} />
            </div>
            <TeamSide players={home} side="home" />
            <TeamSide players={away} side="away" />
          </div>
        </div>
      ) : (
        <p className={styles.empty}>
          Lineups will appear here when the teams are announced.
        </p>
      )}

      {hasSubs ? (
        <div className={styles.subs}>
          <SubstitutePills
            title={`${homeTeamName.toUpperCase()} SUBSTITUTES`}
            players={homeBench}
          />
          <SubstitutePills
            title={`${awayTeamName.toUpperCase()} SUBSTITUTES`}
            players={awayBench}
          />
        </div>
      ) : null}
    </div>
  );
}
