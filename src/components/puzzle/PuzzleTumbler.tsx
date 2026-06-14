"use client";
import React from "react";
import { Video } from "lucide-react";
import { SudokuBoard } from "./SudokuBoard";
import { MiniGrid } from "../brand/MiniGrid";

export interface TumblerPuzzle {
  /** Display id, e.g. "0001". */
  id: string;
  difficulty: "easy" | "medium" | "hard";
  /** 9×9 clue grid (0 = empty), used for the line-item's top-left box. */
  cells: number[][];
  /** Whether a walkthrough video exists for this puzzle. */
  hasVideo?: boolean;
}

export interface PuzzleTumblerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  puzzles: TumblerPuzzle[];
  /** Index centered on load. */
  defaultIndex?: number;
  /** How many items are visible at once. */
  visibleCount?: number;
  /** Height of the active (center) item in px. */
  itemHeight?: number;
  /** Center-to-center spacing in px (< itemHeight = items tuck under for depth). */
  step?: number;
  /** Fired whenever the active item changes (and once on mount). */
  onChange?: (index: number, puzzle: TumblerPuzzle) => void;
  /** Fired when the active item is clicked / Enter-pressed — navigate to the puzzle. */
  onActivate?: (puzzle: TumblerPuzzle, index: number) => void;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "var(--difficulty-easy)",
  medium: "var(--difficulty-medium)",
  hard: "var(--difficulty-hard)",
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function Chevron({ dir = "down", size = 11 }: { dir?: "up" | "down"; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRight: "2px solid currentColor",
        borderBottom: "2px solid currentColor",
        transform: dir === "up" ? "rotate(-135deg)" : "rotate(45deg)",
        marginTop: dir === "up" ? size * 0.28 : -size * 0.28,
      }}
    />
  );
}

function ArrowButton({
  dir,
  onClick,
  disabled,
  label,
}: {
  dir: "up" | "down";
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 42,
        height: 42,
        borderRadius: 9999,
        border: "1px solid " + (hover && !disabled ? "var(--teal-400)" : "var(--paper-300)"),
        background: hover && !disabled ? "var(--teal-100)" : "var(--paper-0)",
        color: disabled ? "var(--ink-300)" : hover ? "var(--teal-700)" : "var(--ink-600)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.45 : 1,
        boxShadow: "var(--shadow-sm)",
        transition:
          "background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <Chevron dir={dir} />
    </button>
  );
}

export function PuzzleTumbler({
  puzzles,
  defaultIndex = 0,
  visibleCount = 5,
  itemHeight = 86,
  step = 62,
  onChange,
  onActivate,
  style = {},
  ...rest
}: PuzzleTumblerProps) {
  const [active, setActive] = React.useState(defaultIndex);
  const wheelLock = React.useRef(0);
  const touchY = React.useRef<number | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const len = puzzles.length;
  const half = Math.ceil(visibleCount / 2);
  const drumHeight = step * (visibleCount - 1) + itemHeight;

  const clamp = (n: number) => Math.max(0, Math.min(len - 1, n));
  const move = React.useCallback(
    (dir: number) => setActive((cur) => clamp(cur + dir)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [len]
  );

  // notify parent (and on mount, sync the first item)
  React.useEffect(() => {
    if (onChange && puzzles[active]) onChange(active, puzzles[active]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - wheelLock.current < 320) return;
    if (Math.abs(e.deltaY) < 4) return;
    wheelLock.current = now;
    move(e.deltaY > 0 ? 1 : -1);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current == null) return;
    const dy = e.changedTouches[0].clientY - touchY.current;
    if (Math.abs(dy) > 28) move(dy < 0 ? 1 : -1);
    touchY.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter" && puzzles[active]) {
      onActivate?.(puzzles[active], active);
    }
  };

  const itemTransition = reduced
    ? "none"
    : "transform 0.46s var(--ease-out), opacity 0.46s var(--ease-out), filter 0.46s var(--ease-out)";

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, ...style }}
      {...rest}
    >
      <ArrowButton dir="up" label="Previous puzzle" disabled={active === 0} onClick={() => move(-1)} />

      <div
        ref={rootRef}
        tabIndex={0}
        role="listbox"
        aria-label="Puzzles"
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onKeyDown={onKeyDown}
        style={{
          position: "relative",
          width: "100%",
          height: drumHeight,
          overflow: "hidden",
          outline: "none",
          touchAction: "pan-x",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)",
          maskImage: "linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)",
        }}
      >
        {puzzles.map((p, i) => {
          const off = i - active;
          const dist = Math.abs(off);
          const visible = dist <= half;
          const scale = Math.max(0.6, 1 - 0.12 * dist);
          const opacity = visible ? Math.max(0, 1 - 0.24 * dist) : 0;
          const blur = dist <= 1 ? 0 : (dist - 1) * 0.7;
          const isActive = off === 0;
          const diffColor = DIFFICULTY_COLOR[p.difficulty] || "var(--teal-500)";

          return (
            <div
              key={p.id + "-" + i}
              role="option"
              aria-selected={isActive}
              onClick={() => (isActive ? onActivate?.(p, i) : setActive(i))}
              style={{
                position: "absolute",
                left: 10,
                right: 10,
                top: "50%",
                height: itemHeight,
                marginTop: -itemHeight / 2,
                transform: `translateY(${off * step}px) scale(${scale})`,
                transformOrigin: "center center",
                opacity,
                filter: blur ? `blur(${blur}px)` : "none",
                zIndex: 100 - dist,
                pointerEvents: visible ? "auto" : "none",
                transition: itemTransition,
                cursor: "pointer",
              }}
            >
              {/* card surface */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: 6,
                  background: isActive ? "var(--white)" : "var(--paper-0)",
                  border: "1px solid " + (isActive ? "var(--border-ink)" : "var(--paper-300)"),
                  boxShadow: isActive ? "var(--shadow-md)" : "var(--shadow-sm)",
                  transition:
                    "background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
                }}
              >
                {/* left — brand motif half-diamond, clipped by the edge */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    transform: "translate(-46%, -50%) rotate(45deg)",
                    opacity: 0.85,
                  }}
                >
                  <MiniGrid uniform size={itemHeight * 0.6} lineColor="var(--teal-400)" />
                </div>

                {/* right — the puzzle's top-left 3×3 box, slightly rotated, clipped */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: 16,
                    transform: "translateY(-50%) rotate(-3deg)",
                    boxShadow: "var(--shadow-sm)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <SudokuBoard
                    cells={p.cells}
                    size={itemHeight * 0.78}
                    region={{ row: 0, col: 0, rows: 3, cols: 3 }}
                  />
                </div>

                {/* center — label + difficulty dot */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "0 72px",
                    pointerEvents: "none",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "var(--font-display)",
                      fontSize: isActive ? "1.75rem" : "1.375rem",
                      fontWeight: 500,
                      color: "var(--ink-800)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      transition: "font-size var(--dur-base) var(--ease-out)",
                    }}
                  >
                    Puzzle {p.id}
                    {p.hasVideo && (
                      <Video
                        size={isActive ? 18 : 16}
                        color="var(--teal-500)"
                        aria-label="Walkthrough video available"
                        style={{ flexShrink: 0 }}
                      />
                    )}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: diffColor,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        color: "var(--ink-400)",
                        textTransform: "capitalize",
                      }}
                    >
                      {p.difficulty}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ArrowButton dir="down" label="Next puzzle" disabled={active === len - 1} onClick={() => move(1)} />
    </div>
  );
}
