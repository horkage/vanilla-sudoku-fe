'use client';

interface SudokuGridProps {
  puzzle: number[][];
}

export function SudokuGrid({ puzzle }: SudokuGridProps) {
  return (
    <div className="grid grid-cols-9 grid-rows-9 gap-[1px] bg-black w-full max-w-[450px] aspect-square">
      {puzzle.flatMap((row, rowIndex) =>
        row.map((value, colIndex) => {
          const isClue = value !== 0;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`flex items-center justify-center text-lg font-medium
                ${isClue ? 'bg-[#DDD] text-black' : 'bg-white text-gray-500'}
                border border-gray-400
                ${getBorderClasses(rowIndex, colIndex)}
              `}
            >
              {isClue ? value : ""}
            </div>
          );
        })
      )}
    </div>
  );
}

// Helper to draw thicker borders between 3x3 boxes
function getBorderClasses(row: number, col: number) {
  const classes = [];
  if (col % 3 === 0) classes.push("border-l-2");
  if (row % 3 === 0) classes.push("border-t-2");
  if (col === 8) classes.push("border-r-2");
  if (row === 8) classes.push("border-b-2");
  return classes.join(" ");
}
