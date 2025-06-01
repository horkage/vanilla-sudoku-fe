'use client';

interface SudokuGridProps {
  puzzle: number[][];
}

export function SudokuGrid({ puzzle }: SudokuGridProps) {
  return (
    <div id="outer" className="flex justify-center">
      <div id="inner" className="grid grid-cols-9 grid-rows-9 aspect-square max-w-[500px]">
        {puzzle.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isClue = value !== 0;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`flex items-center justify-center p-4 md:p-6 border-t-1 border-l-1 border-gray-500
                bg-white md:text-3xl text-2xl font-bold text-gray-600
                ${getBorderClasses(rowIndex, colIndex)}
                `}
              >
                {isClue ? value : ""}
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
