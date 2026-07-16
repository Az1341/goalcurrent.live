import type { MatchLineupPlayer } from "@/types/match-detail";

export type GridCoord = { row: number; col: number };

export function parseGridPosition(
  position: string | null | undefined,
): GridCoord | null {
  if (!position) return null;
  const [rowRaw, colRaw] = position.split(":");
  const row = Number(rowRaw);
  const col = Number(colRaw);
  if (!Number.isFinite(row) || !Number.isFinite(col) || row < 1 || col < 1) {
    return null;
  }
  return { row, col };
}

export function buildRowMaxCols(
  players: readonly MatchLineupPlayer[],
): Map<number, number> {
  const map = new Map<number, number>();
  for (const player of players) {
    const grid = parseGridPosition(player.grid_position);
    if (!grid) continue;
    map.set(grid.row, Math.max(map.get(grid.row) ?? 0, grid.col));
  }
  return map;
}

export function getMaxRow(rowMaxCols: Map<number, number>): number {
  if (rowMaxCols.size === 0) return 1;
  return Math.max(...rowMaxCols.keys());
}