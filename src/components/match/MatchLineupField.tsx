"use client";

import Image from "next/image";
import { useState } from "react";
import type { MatchLineupPlayer } from "@/types/match-detail";
import { shouldUseUnoptimizedImage } from "@/lib/images";

export type MatchLineupFieldProps = {
  home: readonly MatchLineupPlayer[];
  away: readonly MatchLineupPlayer[];
  homeTeamName?: string;
  awayTeamName?: string;
  homeFormation?: string | null;
  awayFormation?: string | null;
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
  const rowByPosition: Record<string, number> = {
    G: 1,
    D: 2,
    M: 3,
    F: 5,
  };
  const row = rowByPosition[positionKey] ?? 3;
  const sameRowIndex =
    players
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
  const homeTop = 6 + rowProgress * 38;
  const awayTop = 94 - rowProgress * 38;
  const top = side === "home" ? homeTop : awayTop;

  return { left, top };
}

function surname(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

function ratingTone(rating: number | null | undefined): string {
  if (rating == null) return "bg-slate-600";
  if (rating >= 7.5) return "bg-emerald-500";
  if (rating >= 7) return "bg-amber-500";
  return "bg-orange-500";
}

function PlayerAvatar({ name, photo }: { name: string; photo?: string | null }) {
  const [failed, setFailed] = useState(false);
  const initial = surname(name).charAt(0).toUpperCase() || "?";
  const showPhoto = Boolean(photo) && !failed;

  return (
    <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white/90 bg-slate-700 shadow-md">
      {showPhoto ? (
        <Image
          src={photo!}
          alt={name}
          width={44}
          height={44}
          className="h-full w-full object-cover"
          unoptimized={shouldUseUnoptimizedImage(photo!)}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-white/90">
          {initial}
        </span>
      )}
    </div>
  );
}

function PlayerMarker({
  player,
  index,
  players,
  side,
  rowMaxCols,
  maxRow,
}: {
  player: MatchLineupPlayer;
  index: number;
  players: readonly MatchLineupPlayer[];
  side: "home" | "away";
  rowMaxCols: Map<number, number>;
  maxRow: number;
}) {
  const grid =
    parseGridPosition(player.grid_position) ?? fallbackGrid(player, index, players);
  const { left, top } = gridToPercent(grid, maxRow, rowMaxCols, side);

  return (
    <div
      className="absolute z-10 flex w-[4.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{ left: `${left}%`, top: `${top}%` }}
      title={`${player.name}${player.number != null ? ` · #${player.number}` : ""}`}
    >
      <div className="relative">
        <PlayerAvatar name={player.name} photo={player.photo} />

        {player.rating != null ? (
          <span
            className={`absolute -right-1 -top-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none text-white shadow ${ratingTone(player.rating)}`}
          >
            {player.rating.toFixed(1)}
          </span>
        ) : null}

        <span className="absolute -bottom-1 -right-1 flex items-center gap-0.5">
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-white/80 bg-slate-900/90 px-1 text-[10px] font-bold text-white shadow">
            {player.number ?? "–"}
          </span>
          {player.is_captain ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-extrabold text-slate-900 shadow">
              C
            </span>
          ) : null}
        </span>
      </div>

      <span className="mt-1 max-w-[4.75rem] truncate text-center text-[10px] font-semibold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
        {surname(player.name)}
      </span>
    </div>
  );
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

  return (
    <>
      {players.map((player, index) => (
        <PlayerMarker
          key={`${side}-${player.number ?? "na"}-${player.name}`}
          player={player}
          index={index}
          players={players}
          side={side}
          rowMaxCols={rowMaxCols}
          maxRow={maxRow}
        />
      ))}
    </>
  );
}

function TeamHeader({
  teamName,
  formation,
  align,
  className = "",
}: {
  teamName: string;
  formation?: string | null;
  align: "start" | "end";
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-1 ${
        align === "end" ? "flex-row-reverse justify-end" : "justify-between"
      } ${className}`}
    >
      <span className="text-sm font-semibold text-[var(--gc-text-primary)]">{teamName}</span>
      {formation ? (
        <span className="rounded-full border border-emerald-800/30 bg-emerald-900/10 px-2.5 py-0.5 text-xs font-medium text-emerald-900">
          {formation}
        </span>
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
}: MatchLineupFieldProps) {
  if (home.length === 0 && away.length === 0) {
    return null;
  }

  return (
    <section
      className="mb-8"
      aria-labelledby="lineup-field-heading"
    >
      <h2
        id="lineup-field-heading"
        className="mb-3 text-lg font-semibold text-[var(--gc-text-primary)]"
      >
        Tactical lineup
      </h2>

      <div className="relative mx-auto w-full max-w-xl">
        <TeamHeader
          teamName={homeTeamName}
          formation={homeFormation}
          align="start"
          className="mb-2"
        />

        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border-2 border-white/85 bg-gradient-to-b from-emerald-800 via-emerald-900 to-emerald-800 shadow-[inset_0_0_80px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_65%)]" />

          <div className="absolute inset-x-0 top-1/2 h-px bg-white/75" />
          <div className="absolute left-1/2 top-1/2 h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/75" />
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/85" />

          <div className="absolute left-1/2 top-0 h-[17%] w-[48%] -translate-x-1/2 border border-t-0 border-white/75" />
          <div className="absolute left-1/2 top-0 h-[7%] w-[22%] -translate-x-1/2 border border-t-0 border-white/75" />
          <div className="absolute bottom-0 left-1/2 h-[17%] w-[48%] -translate-x-1/2 border border-b-0 border-white/75" />
          <div className="absolute bottom-0 left-1/2 h-[7%] w-[22%] -translate-x-1/2 border border-b-0 border-white/75" />

          <div className="absolute inset-0">
            <TeamMarkers players={home} side="home" />
            <TeamMarkers players={away} side="away" />
          </div>
        </div>

        <TeamHeader
          teamName={awayTeamName}
          formation={awayFormation}
          align="end"
          className="mt-2"
        />

        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--gc-text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              7.5+
            </span>
            Excellent
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              7.0+
            </span>
            Good
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              &lt;7.0
            </span>
            Below average
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-extrabold text-slate-900">
              C
            </span>
            Captain
          </span>
        </div>
      </div>
    </section>
  );
}
