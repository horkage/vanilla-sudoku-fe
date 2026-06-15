"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PuzzleTumbler, type TumblerPuzzle } from "./PuzzleTumbler";
import { SudokuBoard } from "./SudokuBoard";

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "var(--difficulty-easy)",
  medium: "var(--difficulty-medium)",
  hard: "var(--difficulty-hard)",
};

export interface PuzzleIndexClientProps {
  difficulty: string;
  puzzles: TumblerPuzzle[];
}

export default function PuzzleIndexClient({ difficulty, puzzles }: PuzzleIndexClientProps) {
  const router = useRouter();
  const [active, setActive] = React.useState<TumblerPuzzle | null>(puzzles[0] ?? null);
  const [shown, setShown] = React.useState<TumblerPuzzle | null>(puzzles[0] ?? null);
  const [visible, setVisible] = React.useState(true);

  // cross-fade the preview when the active item changes
  React.useEffect(() => {
    if (!active || (shown && active.id === shown.id)) return;
    setVisible(false);
    const t = setTimeout(() => {
      setShown(active);
      setVisible(true);
    }, 220);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const open = (p: TumblerPuzzle) => router.push(`/puzzles/${difficulty}/puzzle/${p.id}`);

  // prefetch the active puzzle so the jump into the player is instant
  React.useEffect(() => {
    if (active) router.prefetch(`/puzzles/${difficulty}/puzzle/${active.id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (puzzles.length === 0) {
    return (
      <div className="mx-auto max-w-[640px] px-7 py-24 text-center">
        <p
          className="text-lg italic text-[color:var(--ink-400)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          No {difficulty} puzzles just yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--paper-100)", minHeight: "calc(100vh - 64px)" }}>
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-7 py-12 pb-16 min-[860px]:grid-cols-2">
        {/* LEFT — heading + tumbler */}
        <section className="min-w-0">
          <header className="mb-6 max-w-[440px]">
            <div
              className="mb-2 flex items-center gap-5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {DIFFICULTIES.map((d) => {
                const isActive = d === difficulty;
                const label = d.charAt(0).toUpperCase() + d.slice(1);
                const dot = (
                  <span
                    className="inline-block h-[9px] w-[9px] rounded-full"
                    style={
                      isActive
                        ? { background: DIFFICULTY_COLOR[d] }
                        : { border: "1px solid var(--ink-300)" }
                    }
                  />
                );
                const text = (
                  <span
                    className={`text-sm font-semibold uppercase tracking-[0.12em] ${
                      isActive
                        ? "text-[color:var(--ink-800)] underline underline-offset-4"
                        : "text-[color:var(--ink-300)]"
                    }`}
                  >
                    {label}
                  </span>
                );
                return isActive ? (
                  <span key={d} className="inline-flex items-center gap-2">
                    {dot}
                    {text}
                  </span>
                ) : (
                  <Link
                    key={d}
                    href={`/puzzles/${d}`}
                    className="inline-flex items-center gap-2 transition-opacity hover:opacity-70"
                  >
                    {dot}
                    {text}
                  </Link>
                );
              })}
            </div>
            <h1
              className="m-0 text-[3rem] font-normal italic leading-[1.05] tracking-[-0.02em] text-[color:var(--ink-800)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Take your pick.
            </h1>
            <p
              className="mt-3 text-base leading-[1.7] text-[color:var(--ink-600)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Roll through the {difficulty} puzzles. See where it takes you.
            </p>
          </header>

          <PuzzleTumbler
            puzzles={puzzles}
            defaultIndex={0}
            onChange={(_i, p) => setActive(p)}
            onActivate={(p) => open(p)}
          />

          {/* mobile hint */}
          <p
            className="block px-6 pt-8 text-center text-base italic text-[color:var(--ink-400)] min-[860px]:hidden"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Swipe to browse &middot; tap a puzzle to begin.
          </p>
        </section>

        {/* RIGHT — preview pane (desktop only) */}
        <section className="hidden flex-col items-center justify-center gap-8 min-[860px]:flex">
          <div
            className="flex flex-col items-center gap-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.22s var(--ease-out), transform 0.22s var(--ease-out)",
            }}
          >
            {shown && (
              <SudokuBoard cells={shown.cells} size={380} style={{ boxShadow: "var(--shadow-lg)" }} />
            )}
            {shown && (
              <Link
                href={`/puzzles/${difficulty}/puzzle/${shown.id}`}
                className="inline-flex items-center gap-2.5 rounded-md border border-[#6096B4] bg-[#6096B4] px-9 py-4 text-lg font-semibold text-[#EEE9DA] shadow-[0_1px_2px_rgba(43,42,38,0.06)] transition-colors duration-300 ease-out hover:border-[#4A7C97] hover:bg-[#4A7C97] active:translate-y-px active:border-[#3D6B85] active:bg-[#3D6B85]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Play this puzzle
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
