"use client";

import { useMemo, useEffect, useState } from "react";
import type {
  BracketConvergingColumn,
  BracketConvergingView,
  BracketPositionedMatch,
} from "@/lib/wc26/bracket-view";
import BracketMatchNode from "./BracketMatchNode";
import styles from "./BracketView.module.css";

type BracketViewProps = {
  view: BracketConvergingView;
  viewMatchCenterLabel: string;
  liveLabel: string;
};

type ConnectorLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const COLUMN_WIDTH = 180;
const COLUMN_GAP = 28;
const ROW_HEIGHT = 52;
const HEADER_OFFSET = 24;

function columnCenterX(columnIndex: number): number {
  return columnIndex * (COLUMN_WIDTH + COLUMN_GAP) + COLUMN_WIDTH / 2;
}

function rowCenterY(gridRow: number): number {
  return HEADER_OFFSET + (gridRow - 0.5) * ROW_HEIGHT;
}

function findPositionedMatch(
  view: BracketConvergingView,
  matchNumber: number,
): BracketPositionedMatch | null {
  for (const column of view.columns) {
    const match = column.matches.find((entry) => entry.matchNumber === matchNumber);
    if (match) {
      return match;
    }
  }
  return null;
}

function buildParentChildConnectors(view: BracketConvergingView): ConnectorLine[] {
  const lines: ConnectorLine[] = [];

  const pairs: Array<{
    children: readonly number[];
    parent: number;
    childColumn: number;
    parentColumn: number;
  }> = [
    { children: [73, 75], parent: 89, childColumn: 0, parentColumn: 1 },
    { children: [74, 77], parent: 90, childColumn: 0, parentColumn: 1 },
    { children: [83, 84], parent: 93, childColumn: 0, parentColumn: 1 },
    { children: [81, 82], parent: 94, childColumn: 0, parentColumn: 1 },
    { children: [89, 90], parent: 97, childColumn: 1, parentColumn: 2 },
    { children: [93, 94], parent: 98, childColumn: 1, parentColumn: 2 },
    { children: [97, 98], parent: 101, childColumn: 2, parentColumn: 3 },
    { children: [76, 78], parent: 91, childColumn: 8, parentColumn: 7 },
    { children: [79, 80], parent: 92, childColumn: 8, parentColumn: 7 },
    { children: [86, 88], parent: 95, childColumn: 8, parentColumn: 7 },
    { children: [85, 87], parent: 96, childColumn: 8, parentColumn: 7 },
    { children: [91, 92], parent: 99, childColumn: 7, parentColumn: 6 },
    { children: [95, 96], parent: 100, childColumn: 7, parentColumn: 6 },
    { children: [99, 100], parent: 102, childColumn: 6, parentColumn: 5 },
    { children: [101, 102], parent: 104, childColumn: 3, parentColumn: 4 },
  ];

  for (const { children, parent, childColumn, parentColumn } of pairs) {
    const parentPos = findPositionedMatch(view, parent);
    if (!parentPos) {
      continue;
    }

    const childPositions = children
      .map((num) => findPositionedMatch(view, num))
      .filter((entry): entry is BracketPositionedMatch => entry !== null);
    if (childPositions.length === 0) {
      continue;
    }

    const parentY = rowCenterY(parentPos.gridRow);
    const parentX =
      parentColumn < childColumn
        ? columnCenterX(parentColumn) + COLUMN_WIDTH / 2
        : columnCenterX(parentColumn) - COLUMN_WIDTH / 2;

    for (const child of childPositions) {
      const childY = rowCenterY(child.gridRow);
      const childX =
        childColumn < parentColumn
          ? columnCenterX(childColumn) + COLUMN_WIDTH / 2
          : columnCenterX(childColumn) - COLUMN_WIDTH / 2;
      const midX = (childX + parentX) / 2;

      lines.push({ x1: childX, y1: childY, x2: midX, y2: childY });
      lines.push({ x1: midX, y1: childY, x2: midX, y2: parentY });
      lines.push({ x1: midX, y1: parentY, x2: parentX, y2: parentY });
    }

    if (childPositions.length === 2) {
      const y1 = rowCenterY(childPositions[0]!.gridRow);
      const y2 = rowCenterY(childPositions[1]!.gridRow);
      const joinX =
        childColumn < parentColumn
          ? columnCenterX(childColumn) + COLUMN_WIDTH / 2 + 14
          : columnCenterX(childColumn) - COLUMN_WIDTH / 2 - 14;
      lines.push({ x1: joinX, y1, x2: joinX, y2 });
    }
  }

  return lines;
}

function BracketConnectors({ view }: { view: BracketConvergingView }) {
  const lines = useMemo(() => buildParentChildConnectors(view), [view]);
  const width = 9 * COLUMN_WIDTH + 8 * COLUMN_GAP;
  const height = HEADER_OFFSET + view.rowCount * ROW_HEIGHT;

  return (
    <svg
      className={styles.connectors}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      {lines.map((line, index) => (
        <line
          key={index}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="#cccccc"
          strokeWidth={1}
        />
      ))}
    </svg>
  );
}

function columnLabelClass(column: BracketConvergingColumn): string {
  if (column.side === "center") {
    return styles.columnLabelCenter;
  }
  if (column.side === "right") {
    return styles.columnLabelRight;
  }
  return styles.columnLabelLeft;
}

export function BracketViewSkeleton() {
  const skeletonRows = [
    { col: 1, row: 2 },
    { col: 1, row: 6 },
    { col: 1, row: 10 },
    { col: 1, row: 14 },
    { col: 2, row: 4 },
    { col: 2, row: 12 },
    { col: 3, row: 8 },
    { col: 4, row: 9 },
    { col: 5, row: 11 },
    { col: 6, row: 9 },
    { col: 7, row: 8 },
    { col: 8, row: 4 },
    { col: 8, row: 12 },
    { col: 9, row: 2 },
    { col: 9, row: 6 },
    { col: 9, row: 10 },
    { col: 9, row: 14 },
  ];

  return (
    <div className={styles.scrollWrap}>
      <div className={styles.skeletonShell} aria-hidden="true">
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={`label-${index}`}
              className={styles.skeletonLabel}
              style={{ gridColumn: index + 1, gridRow: 1 }}
            />
          ))}
          {skeletonRows.map((slot, index) => (
            <div
              key={index}
              className={styles.skeletonCard}
              style={{ gridColumn: slot.col, gridRow: slot.row }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BracketView({
  view,
  viewMatchCenterLabel,
  liveLabel,
}: BracketViewProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className={styles.scrollWrap}>
      <div className={styles.bracketShell}>
        {ready ? <BracketConnectors view={view} /> : null}
        <div
          className={styles.bracketGrid}
          style={{
            gridTemplateRows: `24px repeat(${view.rowCount}, ${ROW_HEIGHT}px)`,
          }}
        >
          {view.columns.map((column) => (
            <div
              key={`${column.side}-${column.roundKey}-${column.columnIndex}`}
              className={styles.column}
            >
              <h2
                className={columnLabelClass(column)}
                style={{
                  gridColumn: column.columnIndex + 1,
                  gridRow: 1,
                }}
              >
                {column.roundLabel}
              </h2>
              {column.matches.map((match) => (
                <div
                  key={match.matchNumber}
                  className={
                    match.isFinal ? styles.matchSlotFinal : styles.matchSlot
                  }
                  style={{
                    gridColumn: column.columnIndex + 1,
                    gridRow: match.gridRow + 1,
                  }}
                >
                  <BracketMatchNode
                    match={match}
                    viewMatchCenterLabel={viewMatchCenterLabel}
                    liveLabel={liveLabel}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
