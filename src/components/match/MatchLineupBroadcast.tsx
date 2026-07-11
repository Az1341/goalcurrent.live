"use client";

import Image from "next/image";
import { useState } from "react";
import TeamFlag from "@/components/TeamFlag";
import { shouldUseUnoptimizedImage } from "@/lib/images";
import type { MatchLineupPlayer } from "@/types/match-detail";
import type { TeamId } from "@/types/team";
import styles from "./MatchLineupBroadcast.module.css";

// ── Types ─────────────────────────────────────────────────────────────

export type MatchLineupBroadcastProps = {
  /** Starting XI for the home team (max 11 used). */
  home: readonly MatchLineupPlayer[];
  /** Starting XI for the away team (max 11 used). */
  away: readonly MatchLineupPlayer[];
  homeFormation?: string | null;
  awayFormation?: string | null;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamId?: string;
  awayTeamId?: string;
  /** Short meta string, e.g. "Group Stage · Kick-off 20:00" */
  matchMetaLabel?: string | null;
};

// ── Grid coordinate helpers ───────────────────────────────────────────

type GridCoord = { row: number; col: number };

function parseGridPosition(pos: string | null | undefined): GridCoord | null {
  if (!pos) return null;
  const [r, c] = pos.split(":");
  const row = Number(r);
  const col = Number(c);
  if (!isFinite(row) || !isFinite(col) || row < 1 || col < 1) return null;
  return { row, col };
}

function buildRowMaxCols(players: readonly MatchLineupPlayer[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const p of players) {
    const g = parseGridPosition(p.grid_position);
    if (!g) continue;
    map.set(g.row, Math.max(map.get(g.row) ?? 0, g.col));
  }
  return map;
}

function getMaxRow(map: Map<number, number>): number {
  return map.size === 0 ? 1 : Math.max(...map.keys());
}

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

/**
 * Convert grid row/col into x/y percentages for a HORIZONTAL pitch layout.
 *
 * Home half (left div):  row 1 (GK) → x≈8%,  row max (FW) → x≈87%
 * Away half (right div): row 1 (GK) → x≈92%, row max (FW) → x≈13%
 * y is vertical position within the half, spread by column.
 */
function gridToXY(
  grid: GridCoord,
  maxRow: number,
  rowMaxCols: Map<number, number>,
  side: "home" | "away",
): { x: number; y: number } {
  const colsInRow = Math.max(rowMaxCols.get(grid.row) ?? grid.col, 1);
  const y = ((grid.col - 0.5) / colsInRow) * 100;
  const rowProgress = (grid.row - 1) / Math.max(maxRow - 1, 1);
  const x = side === "home" ? 8 + rowProgress * 79 : 92 - rowProgress * 79;
  return { x, y };
}

function spreadDuplicates(grid: GridCoord, seen: Map<string, number>): GridCoord {
  const key = `${grid.row}:${grid.col}`;
  const dupes = seen.get(key) ?? 0;
  seen.set(key, dupes + 1);
  return dupes === 0 ? grid : { row: grid.row, col: grid.col + dupes * 0.25 };
}

function surname(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

// ── Rating badge ──────────────────────────────────────────────────────

function ratingClass(r: number | null | undefined): string | undefined {
  if (r == null) return undefined;
  if (r >= 8) return styles.ratingHigh;
  if (r >= 7.5) return styles.ratingGood;
  if (r >= 7) return styles.ratingMid;
  return styles.ratingLow;
}

// ── Player card ───────────────────────────────────────────────────────

function PlayerCard({
  player,
  side,
  x,
  y,
}: {
  player: MatchLineupPlayer;
  side: "home" | "away";
  x: number;
  y: number;
}) {
  const [imgErr, setImgErr] = useState(false);
  const initials = surname(player.name).substring(0, 2).toUpperCase();
  const badgeBg = side === "home" ? "#9f1239" : "#1e3a8a";
  const rCls = ratingClass(player.rating);

  return (
    <div
      className={styles.player}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        zIndex: Math.round(100 - y),
      }}
      title={`${player.name}${player.number != null ? ` · #${player.number}` : ""}`}
    >
      <div className={styles.photoWrap}>
        {player.photo && !imgErr ? (
          <Image
            src={player.photo}
            alt={player.name}
            fill
            sizes="60px"
            className={styles.photo}
            unoptimized={shouldUseUnoptimizedImage(player.photo)}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className={styles.photoFallback}>{initials}</div>
        )}

        {player.number != null ? (
          <span
            className={styles.numberBadge}
            style={{ backgroundColor: badgeBg }}
          >
            {player.number}
          </span>
        ) : null}

        {player.is_captain ? (
          <span className={styles.captainBadge} aria-label="Captain">
            C
          </span>
        ) : null}

        {rCls ? (
          <span className={`${styles.ratingBadge} ${rCls}`}>
            {player.rating!.toFixed(1)}
          </span>
        ) : null}
      </div>

      <span
        className={`${styles.nameplate} ${side === "home" ? styles.nameplateHome : styles.nameplateAway}`}
      >
        {player.number != null ? (
          <span className={styles.nameplateNum}>{player.number}</span>
        ) : null}
        <span className={styles.nameplateName}>{surname(player.name)}</span>
      </span>
    </div>
  );
}

// ── Team half renderer ────────────────────────────────────────────────

function TeamHalf({
  players,
  side,
}: {
  players: readonly MatchLineupPlayer[];
  side: "home" | "away";
}) {
  const starters = players.filter((_, i) => i < 11);
  const rowMaxCols = buildRowMaxCols(starters);
  const maxRow = getMaxRow(rowMaxCols);
  const seen = new Map<string, number>();

  return (
    <div className={styles.half}>
      {starters.map((player, index) => {
        const baseGrid =
          parseGridPosition(player.grid_position) ??
          fallbackGrid(player, index, starters);
        const grid = spreadDuplicates(baseGrid, seen);
        const { x, y } = gridToXY(grid, maxRow, rowMaxCols, side);

        return (
          <PlayerCard
            key={`${side}-${player.number ?? "na"}-${player.name}`}
            player={player}
            side={side}
            x={x}
            y={y}
          />
        );
      })}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────

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
}: MatchLineupBroadcastProps) {
  const hasLineup = home.length > 0 || away.length > 0;

  return (
    <div className={styles.root}>
      {/* Stadium backdrop */}
      <div className={styles.stadiumBg} aria-hidden="true" />
      <div className={styles.overlay} aria-hidden="true" />

      {/* Team header */}
      <div className={styles.banner}>
        <div className={styles.teamSide}>
          <TeamFlag
            teamId={homeTeamId as TeamId | undefined}
            teamName={homeTeamName}
            size={44}
            className={styles.flag}
          />
          <div className={styles.teamInfo}>
            <span className={styles.teamName}>{homeTeamName}</span>
            {homeFormation ? (
              <span className={styles.formation}>{homeFormation}</span>
            ) : null}
          </div>
        </div>

        <span className={styles.vs} aria-hidden="true">
          VS
        </span>

        <div className={`${styles.teamSide} ${styles.teamSideAway}`}>
          <div className={`${styles.teamInfo} ${styles.teamInfoAway}`}>
            <span className={styles.teamName}>{awayTeamName}</span>
            {awayFormation ? (
              <span className={styles.formation}>{awayFormation}</span>
            ) : null}
          </div>
          <TeamFlag
            teamId={awayTeamId as TeamId | undefined}
            teamName={awayTeamName}
            size={44}
            className={styles.flag}
          />
        </div>
      </div>

      {/* Match meta pill */}
      {matchMetaLabel ? (
        <div className={styles.metaRow}>
          <span className={styles.metaPill}>{matchMetaLabel}</span>
        </div>
      ) : null}

      {/* Pitch */}
      {hasLineup ? (
        <div className={styles.pitchArea} aria-label="Tactical lineup pitch">
          {/* Halfway-line decorations sit between the two halves */}
          <div className={styles.halfDivider} aria-hidden="true" />
          <div className={styles.centreCircle} aria-hidden="true" />

          <TeamHalf players={home} side="home" />
          <TeamHalf players={away} side="away" />
        </div>
      ) : (
        <p className={styles.empty}>
          Lineups will appear here when the teams are announced.
        </p>
      )}

      {/* Bottom fade */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </div>
  );
}