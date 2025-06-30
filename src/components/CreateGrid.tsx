'use client';

interface CreateGridProps {
  puzzle: number[][];
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
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

export function CreateGrid({
  puzzle,
  selectedCell,
  onCellClick
}: CreateGridProps) {
  return (
    <div id="outer" className="flex justify-center">
      <div id="inner" className="grid grid-cols-9 grid-rows-9 aspect-square w-full max-w-[400px] sm:max-w-[525px] md:max-w-[525px] lg:max-w-[525px]">
        {puzzle.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => {

            return (
              <div
                onClick={() => onCellClick(rowIndex, colIndex)}
                key={`${rowIndex}-${colIndex}`}
                className={`relative flex items-center justify-center p-5 md:p-6 border-t-1 border-l-1 border-gray-500
                md:text-3xl text-2xl font-bold text-gray-600 aspect-square cursor-default
                  ${getBorderClasses(rowIndex, colIndex)}
                  ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'bg-selected' : 'bg-white'}
                  ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex && puzzle[rowIndex][colIndex] === 0 ? 'bg-selected' : ''}
                `}
              >

                {/* Main number (if filled) */}
                <div className="absolute flex items-center justify-center text-2xl md:text-3xl font-bold">
                  {puzzle[rowIndex][colIndex] === 0 ? '' : puzzle[rowIndex][colIndex]}
                </div>
              </div>

            );
          })
        )}
      </div>
    </div>
  );
}

