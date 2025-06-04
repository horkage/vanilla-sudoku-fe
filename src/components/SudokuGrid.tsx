'use client';
import clsx from 'clsx';

interface SudokuGridProps {
  puzzle: number[][];
  clues: number[][];
  hints: boolean[][][];
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
  incorrectCells: boolean[][];
  narrationMode: boolean;
  highlightMode: 'box' | 'row' | 'column' | null;
  highlightBoxPos: [number, number] | null;
  handleRightClick: (row: number, col: number) => void;
  narrationGrid: string[][];
}

function getBorderClasses(row: number, col: number) {
  const classes = [];
  if (col % 3 === 0) classes.push("border-l-3");
  if (row % 3 === 0) classes.push("border-t-3");
  if (col === 8) classes.push("border-r-3");
  if (row === 8) classes.push("border-b-3");

  if (col === 8) classes.push("border-r-1");
  if (row === 8) classes.push("border-b-1");
  return classes.join(" ");
}

function isCellInBox(cellRow: number, cellCol: number, boxRow: number, boxCol: number): boolean {
  const startRow = boxRow * 3;
  const startCol = boxCol * 3;
  return (
    cellRow >= startRow && cellRow < startRow + 3 &&
    cellCol >= startCol && cellCol < startCol + 3
  );
}


function getNarrationHighlightBorderClass(
  row: number,
  col: number,
  highlightMode: string,
  highlightBoxPos: [number, number] | null
): string {
  if (!highlightMode || !highlightBoxPos) return '';

  const [boxRow, boxCol] = highlightBoxPos;
  const borders: string[] = [];

  if (highlightMode === 'box') {
    const startRow = boxRow * 3;
    const startCol = boxCol * 3;
    const endRow = startRow + 2;
    const endCol = startCol + 2;

    if (row < startRow || row > endRow || col < startCol || col > endCol) return '';

    if (row === startRow) borders.push('border-t-1', 'border-t-red-500');
    if (row === endRow) borders.push('border-b-1', 'border-b-red-500');
    if (col === startCol) borders.push('border-l-1', 'border-l-red-500');
    if (col === endCol) borders.push('border-r-1', 'border-r-red-500');
  }

  if (highlightMode === 'row') {
    if (row === boxRow) {
      borders.push('border-t-1', 'border-t-red-500');
      borders.push('border-b-1', 'border-b-red-500');
      if (col === 0) borders.push('border-l-1', 'border-l-red-500');
      if (col === 8) borders.push('border-r-1', 'border-r-red-500');
    }
  }

  if (highlightMode === 'column') {
    if (col === boxCol) {
      borders.push('border-l-1', 'border-l-red-500');
      borders.push('border-r-1', 'border-r-red-500');
      if (row === 0) borders.push('border-t-1', 'border-t-red-500');
      if (row === 8) borders.push('border-b-1', 'border-b-red-500');
    }
  }

  return borders.join(' ');
}


export function SudokuGrid({
  puzzle,
  hints,
  clues,
  selectedCell,
  onCellClick,
  incorrectCells,
  narrationMode,
  highlightMode,
  highlightBoxPos,
  handleRightClick,
  narrationGrid
}: SudokuGridProps) {
  return (
    <div id="outer" className="flex justify-center">
      <div id="inner" className="grid grid-cols-9 grid-rows-9 aspect-square w-full max-w-[400px] sm:max-w-[525px] md:max-w-[525px] lg:max-w-[525px]">
        {puzzle.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isClue = value !== 0;

            return (
              <div
                onClick={() => onCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleRightClick(rowIndex, colIndex)
                }}
                key={`${rowIndex}-${colIndex}`}
                className={`relative flex items-center justify-center p-5 md:p-6 border-t-1 border-l-1 border-gray-500
                md:text-3xl text-2xl font-bold text-gray-600 aspect-square cursor-default
                  ${narrationMode ? getNarrationHighlightBorderClass(rowIndex, colIndex, highlightMode, highlightBoxPos) : 'border-gray-500'}
                  ${getBorderClasses(rowIndex, colIndex)}
                  ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex && !narrationMode ? 'bg-selected' : ''}
                  ${puzzle[rowIndex][colIndex] === narrationGrid[rowIndex][colIndex] && narrationGrid[rowIndex][colIndex] ? 'bg-gray-700' : 'bg-white'}
                  ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex && puzzle[rowIndex][colIndex] === 0 ? 'bg-selected' : ''}
                `}
              >
                {/* Hints grid */}
                {!isClue && (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 md:text-[0.85rem] text-[0.75rem] text-sm text-[#6096B4] font-bold pointer-events-none">
                    {Array.from({ length: 9 }, (_, i) => (
                      <div key={i} className="flex items-center justify-center">
                        {hints?.[rowIndex]?.[colIndex]?.[i] ? i + 1 : ''}
                      </div>
                    ))}
                  </div>
                )}

                {/* Main number (if filled) */}
                {puzzle[rowIndex][colIndex] !== 0 && (
                  <div className={clsx("absolute flex items-center justify-center text-2xl md:text-3xl font-bold",
                    clues[rowIndex][colIndex] !== 0 ? 'text-gray-700' : 'text-[#6096B4]',
                    puzzle[rowIndex][colIndex] === narrationGrid[rowIndex][colIndex] ? 'text-yellow-600' : 'text-[#6096B4]',
                    {
                      "text-red-800": incorrectCells?.[rowIndex]?.[colIndex],
                      "text-[#6096B4]": !incorrectCells?.[rowIndex]?.[colIndex]
                    }
                    )}>
                    {puzzle[rowIndex][colIndex]}
                  </div>
                )}

                {/* narration mode - right click places big red X */}
                {narrationGrid[rowIndex][colIndex] === "X" && (
                  <div className="absolute flex items-center justify-center text-2xl md:text-3xl font-bold text-red-800">
                    {narrationGrid[rowIndex][colIndex]}
                  </div>
                )}

              </div>

            );
          })
        )}
      </div>
    </div>
  );
}

