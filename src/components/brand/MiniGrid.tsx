import React from "react";

export interface MiniGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 3×3 of display strings — used in the detailed (non-uniform) mode. */
  cells?: string[][];
  size?: number;
  digitColor?: string;
  /** Favicon-style flat mark: uniform line weight, no digits. */
  uniform?: boolean;
  lineColor?: string;
  lineWidth?: number;
}

/**
 * Vanilla Sudoku — MiniGrid
 * The recurring brand motif: a small 3×3 sudoku-box fragment. In `uniform`
 * mode it's the flat favicon mark (uniform hairlines, no digits) used as a
 * quiet accent; otherwise it shows a few teal digits on white.
 */
export function MiniGrid({
  cells = [["", "2", ""], ["", "", "6"], ["", "7", ""]],
  size = 132,
  digitColor = "var(--teal-500)",
  uniform = false,
  lineColor = "var(--ink-800)",
  lineWidth = 1,
  style = {},
  ...rest
}: MiniGridProps) {
  if (uniform) {
    const lw = Math.max(1, lineWidth);
    return (
      <div
        role="img"
        aria-label="Sudoku grid mark"
        style={{
          width: size,
          height: size,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: lw,
          padding: lw,
          background: lineColor,
          borderRadius: "2px",
          boxSizing: "border-box",
          ...style,
        }}
        {...rest}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} style={{ background: "var(--white)" }} />
        ))}
      </div>
    );
  }

  const cell = size / 3;
  return (
    <div
      role="img"
      aria-label="Sudoku grid fragment"
      style={{
        width: size,
        height: size,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        background: "var(--white)",
        border: "2px solid var(--ink-800)",
        borderRadius: "2px",
        boxShadow: "var(--shadow-sm)",
        ...style,
      }}
      {...rest}
    >
      {cells.flat().map((v, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: i % 3 !== 2 ? "1px solid var(--border-grid)" : "none",
            borderBottom: i < 6 ? "1px solid var(--border-grid)" : "none",
            fontFamily: "var(--font-numeral)",
            fontWeight: 700,
            fontSize: cell * 0.5,
            color: digitColor,
          }}
        >
          {v}
        </div>
      ))}
    </div>
  );
}
