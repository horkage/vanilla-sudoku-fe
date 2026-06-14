import React from "react";

export interface SudokuRegion {
  row: number;
  col: number;
  rows: number;
  cols: number;
}

export interface SudokuBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 9×9 array of clue digits (0 or falsy = empty). */
  cells: number[][];
  /** Board width in px (height derives from the region's aspect). */
  size?: number;
  /** Render only a sub-region — e.g. the top-left box: { row:0, col:0, rows:3, cols:3 }. Null = full 9×9. */
  region?: SudokuRegion | null;
  /** Optional 9×9 of player-entered digits, rendered in teal. */
  entries?: number[][] | null;
  clueColor?: string;
  entryColor?: string;
}

/**
 * Vanilla Sudoku — SudokuBoard
 * Read-only, scalable rendering of a puzzle. Renders the full 9×9 grid, or a
 * cropped sub-region (e.g. the top-left 3×3 box) via `region`. Gray hairlines
 * inside boxes, thick ink lines on box boundaries. Purely presentational —
 * no interaction, no state.
 */
export function SudokuBoard({
  cells,
  size = 360,
  region = null,
  entries = null,
  clueColor = "var(--ink-600)",
  entryColor = "var(--teal-500)",
  style = {},
  ...rest
}: SudokuBoardProps) {
  const lineThin = "1px solid var(--border-grid)";
  const lineThick = "2.5px solid var(--ink-800)";

  const r0 = region ? region.row : 0;
  const c0 = region ? region.col : 0;
  const rows = region ? region.rows : 9;
  const cols = region ? region.cols : 9;
  const cellPx = size / cols;

  const out: React.ReactNode[] = [];
  for (let ri = 0; ri < rows; ri++) {
    for (let ci = 0; ci < cols; ci++) {
      const r = r0 + ri;
      const c = c0 + ci;
      const clue = (cells[r] && cells[r][c]) || 0;
      const entry = (entries && entries[r] && entries[r][c]) || 0;
      const val = clue || entry;
      const isEntry = !clue && !!entry;
      const cs: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        fontFamily: "var(--font-numeral)",
        fontWeight: 700,
        fontSize: cellPx * 0.6,
        lineHeight: 1,
        color: isEntry ? entryColor : clueColor,
      };
      if (ri > 0) cs.borderTop = r % 3 === 0 ? lineThick : lineThin;
      if (ci > 0) cs.borderLeft = c % 3 === 0 ? lineThick : lineThin;
      out.push(
        <div key={ri + "-" + ci} style={cs}>
          {val || ""}
        </div>
      );
    }
  }

  return (
    <div
      role="img"
      aria-label="Sudoku puzzle"
      style={{
        width: size,
        height: cellPx * rows,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        background: "var(--white)",
        border: lineThick,
        boxSizing: "border-box",
        ...style,
      }}
      {...rest}
    >
      {out}
    </div>
  );
}
