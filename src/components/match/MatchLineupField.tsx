"use client";

import Image from "next/image";
import { useState } from "react";
import TeamFlag from "@/components/TeamFlag";
import type { MatchLineupPlayer } from "@/types/match-detail";
import type { TeamId } from "@/types/team";
import { shouldUseUnoptimizedImage } from "@/lib/images";
import styles from "./MatchLineupField.module.css";

export type MatchLineupFieldProps = {
  home: readonly MatchLineupPlayer[];
  away: readonly MatchLineupPlayer[];
  homeTeamName?: string;
  awayTeamName?: string;
  homeFormation?: string | null;
  awayFormation?: string | null;
  variant?: "page" | "embedded";
  homeTeamId?: string;
  awayTeamId?: string;
  /** Broadcast-style strip under the team banner, e.g. "Group Stage | Kick-off 20:00". */
  matchMetaLabel?: string | null;
};

type GridCoord = { row: number; col: number };

function parseGridPosition(position: string | null | undefined): GridCoord | null {
  if (!position) return null;
  const [rowRaw, colRaw] = position.split(":");
  const row = Number(rowRaw);
  const col = Number(colRaw);
  if (!Number.isFinite(row) || !Number.isFinite(col) || row < 1 || col < 1) {
    return null;
  }
  return { row, col };
}

function buildRowMaxCols(players: readonly MatchLineupPlayer[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const player of players) {
    const grid = parseGridPosition(player.grid_position);
    if (!grid) continue;
    map.set(grid.row, Math.max(map.get(grid.row) ?? 0, grid.col));
  }
  return map;
}

function getMaxRow(rowMaxCols: Map<number, number>): number {
  if (rowMaxCols.size === 0) return 1;
  return Math.max(...rowMaxCols.keys());
}

function fallbackGrid(
  player: MatchLineupPlayer,
  index: number,
  players: readonly MatchLineupPlayer[],
): GridCoord {
  const positionKey = (player.position ?? "M").charAt(0).toUpperCase();
  const rowByPosition: Record<string, number> = { G: 1, D: 2, M: 3, F: 5 };
  const row = rowByPosition[positionKey] ?? 3;
  const sameRowIndex = players
    .slice(0, index + 1)
    .filter((entry) => (entry.position ?? "M").charAt(0).toUpperCase() === positionKey)
    .length;
  return { row, col: sameRowIndex };
}

function gridToPercent(
  grid: GridCoord,
  maxRow: number,
  rowMaxCols: Map<number, number>,
  side: "home" | "away",
): { left: number; top: number } {
  const colsInRow = Math.max(rowMaxCols.get(grid.row) ?? grid.col, 1);
  const left = ((grid.col - 0.5) / colsInRow) * 100;
  const rowSpan = Math.max(maxRow - 1, 1);
  const rowProgress = (grid.row - 1) / rowSpan;
  // Broadcast cards are tall — spread each half over a wide vertical band.
  const homeTop = 8 + rowProgress * 38;
  const awayTop = 92 - rowProgress * 38;
  const top = side === "home" ? homeTop : awayTop;
  return { left, top };
}

function surname(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

function ratingClass(rating: number | null | undefined): string {
  if (rating == null) return styles.ratingMuted;
  if (rating >= 8) return styles.ratingHigh;
  if (rating >= 7.5) return styles.ratingGood;
  if (rating >= 7) return styles.ratingMid;
  return styles.ratingLow;
}

function PlayerAvatar({ name, photo }: { name: string; photo?: string | null }) {
  const [failed, setFailed] = useState(false);
  const initial = surname(name).charAt(0).toUpperCase() || "?";
  const showPhoto = Boolean(photo) && !failed;

  return (
    <div className={styles.avatar}>
      {showPhoto ? (
        <Image
          src={photo!}
          alt={name}
          width={56}
          height={56}
          className={styles.avatarPhoto}
          unoptimized={shouldUseUnoptimizedImage(photo!)}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={styles.avatarInitial}>{initial}</span>
      )}
    </div>
  );
}

function PlayerMarker({
  player,
  side,
  rowMaxCols,
  maxRow,
  grid,
}: {
  player: MatchLineupPlayer;
  side: "home" | "away";
  rowMaxCols: Map<number, number>;
  maxRow: number;
  grid: GridCoord;
}) {
  const { left, top } = gridToPercent(grid, maxRow, rowMaxCols, side);

  return (
    <div
      className={styles.marker}
      // Upper cards stack above lower ones so nameplates stay readable.
      style={{ left: `${left}%`, top: `${top}%`, zIndex: Math.round(100 - top) }}
      title={`${player.name}${player.number != null ? ` · #${player.number}` : ""}`}
    >
      <div className={`${styles.card} ${side === "home" ? styles.cardHome : styles.cardAway}`}>
        <div className={styles.avatarWrap}>
          <PlayerAvatar name={player.name} photo={player.photo} />
          {player.rating != null ? (
            <span className={`${styles.rating} ${ratingClass(player.rating)}`}>
              {player.rating.toFixed(1)}
            </span>
          ) : null}
          {player.is_captain ? (
            <span className={styles.captain} aria-label="Captain">
              C
            </span>
          ) : null}
        </div>
        <span className={styles.plate}>
          <span className={styles.plateNumber}>{player.number ?? "–"}</span>
          <span className={styles.plateName}>{surname(player.name)}</span>
        </span>
      </div>
    </div>
  );
}

function spreadDuplicateGrid(
  grid: GridCoord,
  seen: Map<string, number>,
): GridCoord {
  const key = `${grid.row}:${grid.col}`;
  const duplicates = seen.get(key) ?? 0;
  seen.set(key, duplicates + 1);
  if (duplicates === 0) {
    return grid;
  }
  return {
    row: grid.row,
    col: grid.col + duplicates * 0.22,
  };
}

function TeamMarkers({
  players,
  side,
}: {
  players: readonly MatchLineupPlayer[];
  side: "home" | "away";
}) {
  const rowMaxCols = buildRowMaxCols(players);
  const maxRow = getMaxRow(rowMaxCols);
  const seenGrids = new Map<string, number>();

  return (
    <>
      {players.map((player, index) => {
        const baseGrid =
          parseGridPosition(player.grid_position) ??
          fallbackGrid(player, index, players);
        const grid = spreadDuplicateGrid(baseGrid, seenGrids);

        return (
          <PlayerMarker
            key={`${side}-${player.number ?? "na"}-${player.name}`}
            player={player}
            side={side}
            rowMaxCols={rowMaxCols}
            maxRow={maxRow}
            grid={grid}
          />
        );
      })}
    </>
  );
}

function BroadcastBanner({
  homeTeamName,
  awayTeamName,
  homeTeamId,
  awayTeamId,
  homeFormation,
  awayFormation,
  matchMetaLabel,
}: {
  homeTeamName: string;
  awayTeamName: string;
  homeTeamId?: string;
  awayTeamId?: string;
  homeFormation?: string | null;
  awayFormation?: string | null;
  matchMetaLabel?: string | null;
}) {
  return (
    <div className={styles.banner}>
      <div className={styles.bannerBar}>
        <span className={styles.bannerTeam}>
          <TeamFlag
            teamId={homeTeamId as TeamId | undefined}
            teamName={homeTeamName}
            size={30}
            className={styles.bannerFlag}
          />
          <span className={styles.bannerTeamText}>
            <span className={styles.bannerTeamName}>{homeTeamName}</span>
            {homeFormation ? (
              <span className={styles.bannerFormation}>{homeFormation}</span>
            ) : null}
          </span>
        </span>
        <span className={styles.bannerVs} aria-hidden="true">
          VS
        </span>
        <span className={`${styles.bannerTeam} ${styles.bannerTeamAway}`}>
          <span className={`${styles.bannerTeamText} ${styles.bannerTeamTextAway}`}>
            <span className={styles.bannerTeamName}>{awayTeamName}</span>
            {awayFormation ? (
              <span className={styles.bannerFormation}>{awayFormation}</span>
            ) : null}
          </span>
          <TeamFlag
            teamId={awayTeamId as TeamId | undefined}
            teamName={awayTeamName}
            size={30}
            className={styles.bannerFlag}
          />
        </span>
      </div>
      {matchMetaLabel ? (
        <div className={styles.bannerMeta}>{matchMetaLabel}</div>
      ) : null}
    </div>
  );
}

export default function MatchLineupField({
  home,
  away,
  homeTeamName = "Home",
  awayTeamName = "Away",
  homeFormation,
  awayFormation,
  variant = "page",
  homeTeamId,
  awayTeamId,
  matchMetaLabel,
}: MatchLineupFieldProps) {
  if (home.length === 0 && away.length === 0) {
    return null;
  }

  const embedded = variant === "embedded";

  return (
    <section
      className={embedded ? styles.rootEmbedded : styles.root}
      aria-labelledby={embedded ? undefined : "lineup-field-heading"}
    >
      {embedded ? null : (
        <h2 id="lineup-field-heading" className={styles.heading}>
          Tactical lineup
        </h2>
      )}

      <div className={embedded ? `${styles.wrap} ${styles.wrapEmbedded}` : styles.wrap}>
        <div className={styles.stage}>
          <BroadcastBanner
            homeTeamName={homeTeamName}
            awayTeamName={awayTeamName}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
            homeFormation={homeFormation}
            awayFormation={awayFormation}
            matchMetaLabel={matchMetaLabel}
          />

          <div className={styles.pitch}>
            <div className={styles.pitchSurface}>
              <div className={styles.pitchStripes} />
              <div className={styles.pitchGlow} />
              <div className={styles.halfway} />
              <div className={styles.centerCircle} />
              <div className={styles.centerSpot} />
              <div className={styles.penaltyTopOuter} />
              <div className={styles.penaltyTopInner} />
              <div className={styles.penaltyBottomOuter} />
              <div className={styles.penaltyBottomInner} />
            </div>
            <div className={styles.markers}>
              <TeamMarkers players={home} side="home" />
              <TeamMarkers players={away} side="away" />
            </div>
          </div>
        </div>

        {embedded ? null : (
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={styles.legendSwatchHigh}>7.5+</span>
              Excellent
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendSwatchMid}>7.0+</span>
              Good
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendSwatchLow}>&lt;7.0</span>
              Below average
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendCaptain}>C</span>
              Captain
            </span>
          </div>
        )}
      </div>
    </section>
  );
}