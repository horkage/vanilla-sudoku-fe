'use client';

interface SudokuGridProps {
  puzzle: number[][];
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
}

export function SudokuGrid({
  puzzle,
  hints,
  selectedCell,
  onCellClick 
}: SudokuGridProps) {
  return (
    <div id="outer" className="flex justify-center">
      <div id="inner" className="grid grid-cols-9 grid-rows-9 aspect-square max-w-[500px]">
        {puzzle.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isClue = value !== 0;

            return (

              <div
                onClick={() => onCellClick(rowIndex, colIndex)}
                key={`${rowIndex}-${colIndex}`}
                className={`relative flex items-center justify-center p-4 md:p-6 border-t-1 border-l-1 border-gray-500
                bg-white md:text-3xl text-2xl font-bold text-gray-600 aspect-square bg-white
                  ${getBorderClasses(rowIndex, colIndex)}
                  ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'bg-yellow-200' : ''}
                `}
              >
                {/* Hints grid */}
                {!isClue && (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 text-[0.55rem] md:text-xs text-blue-600 font-medium pointer-events-none">
                    {Array.from({ length: 9 }, (_, i) => (
                      <div key={i} className="flex items-center justify-center">
                        {hints?.[rowIndex]?.[colIndex]?.[i] ? i + 1 : ''}
                      </div>
                    ))}
                  </div>
                )}

                {/* Main number (if filled) */}
                {isClue || puzzle[rowIndex][colIndex] !== 0 ? (
                  <div className="absolute flex items-center justify-center text-2xl md:text-3xl font-bold text-gray-700">
                    {puzzle[rowIndex][colIndex]}
                  </div>
                ) : null}
              </div>

            );
          })
        )}
      </div>
    </div>
  );
}

// Helper to draw thicker borders between 3x3 boxes
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
