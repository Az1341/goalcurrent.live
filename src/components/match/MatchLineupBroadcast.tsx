"use client";

import Image from "next/image";
import { useState } from "react";
import TeamFlag from "@/components/TeamFlag";
import { shouldUseUnoptimizedImage } from "@/lib/images";
import type { MatchLineupPlayer } from "@/types/match-detail";
import type { TeamId } from "@/types/team";
import styles from "./MatchLineupBroadcast.module.css";

// ── Public API ────────────────────────────────────────────────────────

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
};

// ── Grid → coordinate helpers ─────────────────────────────────────────
// Reference frame: 1440 px wide × 700 px tall pitch area.
// x = % of full width (1440 px).
// y = % of pitch height (700 px).

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

function spreadDuplicates(grid: GridCoord, seen: Map<string, number>): GridCoord {
  const key = `${grid.row}:${grid.col}`;
  const dupes = seen.get(key) ?? 0;
  seen.set(key, dupes + 1);
  return dupes === 0 ? grid : { row: grid.row, col: grid.col + dupes * 0.3 };
}

/**
 * Convert grid_position row/col → (x%, y%) within the 1440×700 pitch area.
 *
 * Both teams render GK at the TOP (y≈16%) and attackers at the BOTTOM (y≈85%),
 * side-by-side — matching the Figma broadcast layout exactly.
 *
 * Home occupies the LEFT half  (x: 4 – 40%)
 * Away occupies the RIGHT half (x: 60 – 96%)
 */
function gridToXY(
  grid: GridCoord,
  maxRow: number,
  rowMaxCols: Map<number, number>,
  side: "home" | "away",
): { x: number; y: number } {
  const colsInRow = Math.max(rowMaxCols.get(grid.row) ?? grid.col, 1);
  const rowProgress = (grid.row - 1) / Math.max(maxRow - 1, 1);
  const y = 16 + rowProgress * 69; // 16% (GK) → 85% (FW)
  const xSpan = 36; // spread within each half
  const colFrac = (grid.col - 0.5) / colsInRow;
  const x =
    side === "home"
      ? 4 + colFrac * xSpan          // home: 4 – 40%
      : 96 - colFrac * xSpan;        // away: 96 – 60% (mirrored)
  return { x, y };
}

function surname(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

// ── Player card ───────────────────────────────────────────────────────

function PlayerCard({
  player,
  x,
  y,
}: {
  player: MatchLineupPlayer;
  x: number;
  y: number;
}) {
  const [imgErr, setImgErr] = useState(false);
  const initials = surname(player.name).substring(0, 2).toUpperCase();
  const displayName = surname(player.name);

  return (
    <div
      className={styles.player}
      style={{ left: `${x}%`, top: `${y}%` }}
      title={`${player.name}${player.number != null ? ` · #${player.number}` : ""}`}
    >
      {/* Photo */}
      <div className={styles.photoWrap}>
        {player.photo && !imgErr ? (
          <Image
            src={player.photo}
            alt={player.name}
            fill
            sizes="110px"
            className={styles.photo}
            unoptimized={shouldUseUnoptimizedImage(player.photo)}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className={styles.photoFallback}>{initials}</div>
        )}

        {/* Red number badge — top-left of photo, Figma #ba1d23 */}
        {player.number != null ? (
          <span className={styles.numberBadge}>{player.number}</span>
        ) : null}
      </div>

      {/* Dark name tag — Figma #05080f strip below photo */}
      <div className={styles.nameTag}>
        <span className={styles.nameText}>{displayName}</span>
      </div>
    </div>
  );
}

// ── Team side renderer ────────────────────────────────────────────────

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
          <PlayerCard
            key={`${side}-${player.number ?? "na"}-${player.name}`}
            player={player}
            x={x}
            y={y}
          />
        );
      })}
    </>
  );
}

// ── Main export ───────────────────────────────────────────────────────

export default function MatchLineupBroadcast({
  home,
  away,
  homeTeamName,
  awayTeamName,
  homeTeamId,
  awayTeamId,
  matchMetaLabel,
}: MatchLineupBroadcastProps) {
  const hasLineup = home.length > 0 || away.length > 0;

  return (
    <div className={styles.root}>
      {/* Stadium image + overlays */}
      <div className={styles.stadiumBg} aria-hidden="true" />
      <div className={styles.stadiumVeil} aria-hidden="true" />
      <div className={styles.pitchOverlay} aria-hidden="true" />

      {/* Header — teams bar + info strip */}
      <div className={styles.header}>
        <div className={styles.teamsBar}>
          {/* Home: flag LEFT of name */}
          <div className={styles.teamGroup}>
            <div className={styles.flagBox}>
              <TeamFlag
                teamId={homeTeamId as TeamId | undefined}
                teamName={homeTeamName}
                size={80}
                className={styles.flagImg}
              />
            </div>
            <span className={styles.teamName}>{homeTeamName}</span>
          </div>

          {/* Away: name LEFT of flag */}
          <div className={`${styles.teamGroup} ${styles.teamGroupAway}`}>
            <div className={styles.flagBox}>
              <TeamFlag
                teamId={awayTeamId as TeamId | undefined}
                teamName={awayTeamName}
                size={80}
                className={styles.flagImg}
              />
            </div>
            <span className={styles.teamName}>{awayTeamName}</span>
          </div>
        </div>

        {matchMetaLabel ? (
          <div className={styles.infoStrip}>{matchMetaLabel}</div>
        ) : null}
      </div>

      {/* Pitch — absolute-positioned players */}
      {hasLineup ? (
        <div className={styles.pitch} aria-label="Tactical lineup">
          <TeamSide players={home} side="home" />
          <TeamSide players={away} side="away" />
        </div>
      ) : (
        <p className={styles.empty}>
          Lineups will appear here when the teams are announced.
        </p>
      )}
    </div>
  );
}