'use client';

import { SudokuGrid } from './SudokuGrid';

/**
 * Social / OG card renderer.
 *
 * Lays a real SudokuGrid (reused from the live game, so the look matches exactly)
 * plus a puzzle-id label and a difficulty pill on top of the flattened YouTube-style
 * template (public/vs-og-1200x630.png).
 *
 * This is screenshotted by tools/generateSocialCards.js into public/social/{difficulty}/{id}.png.
 *
 * ── TWEAK ME ──────────────────────────────────────────────────────────────────
 * Everything below is meant to be nudged by eye against the template. Open
 * /social-card/<difficulty>/<id> in the browser and adjust these numbers with
 * live reload until it sits right. All values are pixels within the 1200x630 card.
 */
const CARD_W = 1200;
const CARD_H = 630;
const TEMPLATE_SRC = '/vs-og-1200x630.png';

// The readable puzzle grid
const GRID_SIZE = 370; // width/height of the square grid in px
const GRID_LEFT = 410; // distance from left edge
const GRID_TOP = 125; // distance from top edge

// The title label (e.g. "Puzzle 0002")
const ID_TOP = 36;
const ID_FONT = 61;
const ID_STROKE_WIDTH = 4; // teal outline thickness in px (matches the template's "Vanilla Sudoku")
const ID_STROKE_COLOR = '#007878'; // sampled from the template's bottom-bar text outline

// The difficulty pill
const PILL_TOP = 40;
const PILL_RIGHT = 40;
const PILL_FONT = 30;

const PILL_COLORS: Record<string, string> = {
  easy: '#2e9e4f', // green
  medium: '#e08e0b', // orange
  hard: '#cc3b3b', // red
};

function makeGrid<T>(value: T): T[][] {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => value));
}

export default function SocialCard({
  puzzle,
  difficulty,
  puzzleId,
}: {
  puzzle: number[][];
  difficulty: string;
  puzzleId: string;
}) {
  const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  const pillColor = PILL_COLORS[difficulty] ?? '#555555';

  // Inert props so SudokuGrid renders as a static, non-interactive board.
  const emptyHints: boolean[][][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => false))
  );
  const noop = () => {};

  return (
    <div
      id="og-card"
      style={{
        position: 'relative',
        width: CARD_W,
        height: CARD_H,
        overflow: 'hidden',
        backgroundImage: `url(${TEMPLATE_SRC})`,
        backgroundSize: `${CARD_W}px ${CARD_H}px`,
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Real puzzle grid */}
      <div
        style={{
          position: 'absolute',
          top: GRID_TOP,
          left: GRID_LEFT,
          width: GRID_SIZE,
          height: GRID_SIZE,
        }}
      >
        <SudokuGrid
          puzzle={puzzle}
          clues={puzzle}
          hints={emptyHints}
          selectedCell={null}
          onCellClick={noop}
          incorrectCells={makeGrid(false)}
          narrationMode={false}
          highlightMode="box"
          highlightBoxPos={null}
          handleRightClick={noop}
          narrationGrid={makeGrid('')}
        />
      </div>

      {/* Title label — full width so the text centers horizontally */}
      <div
        style={{
          position: 'absolute',
          top: ID_TOP,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: ID_FONT,
          fontWeight: 800,
          color: '#ffffff',
          WebkitTextStrokeWidth: `${ID_STROKE_WIDTH}px`,
          WebkitTextStrokeColor: ID_STROKE_COLOR,
          paintOrder: 'stroke fill',
          textShadow: '0 2px 6px rgba(0,0,0,0.45)',
          lineHeight: 1,
        }}
      >
        Puzzle {puzzleId}
      </div>

      {/* Difficulty pill */}
      <div
        style={{
          position: 'absolute',
          top: PILL_TOP,
          right: PILL_RIGHT,
          fontSize: PILL_FONT,
          fontWeight: 800,
          color: '#ffffff',
          backgroundColor: pillColor,
          padding: '8px 26px',
          borderRadius: 9999,
          lineHeight: 1.1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
          letterSpacing: '0.5px',
        }}
      >
        {difficultyLabel}
      </div>
    </div>
  );
}
