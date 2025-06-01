'use client';

import { useState } from 'react';
import { SudokuGrid } from "@/components/SudokuGrid";
import NumberPad from '@/components/NumberPad';
import HintPad from '@/components/HintPad';

export default function SudokuPlayer({ puzzle, puzzleId }) {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [currentGrid, setCurrentGrid] = useState<number[][]>(structuredClone(puzzle));
  const [hints, setHints] = useState<boolean[][][]>(
    Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => Array(9).fill(false))
    )
  );

  function handleCellClick(row: number, col: number) {
    setSelectedCell({ row, col });
  }

  function handleNumberInput(num: number, mode: "number" | "hint") {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (mode === "number") {
      const newGrid = structuredClone(currentGrid);
      newGrid[row][col] = num;
      setCurrentGrid(newGrid);
    } else {
      setHints(prev => {
        const { row, col } = selectedCell;
        const newHints = prev.map((rowHints, r) =>
          rowHints.map((cellHints, c) =>
            r === row && c === col
              ? cellHints.map((val, i) => (i === num ? !val : val))
              : cellHints
          )
        );
        return newHints;
      });
      console.log(`Hint ${num} for cell ${row},${col}`);
    }
  }

  return (
    <>
      <SudokuGrid
        puzzle={currentGrid}
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
        hints={hints}
      />
      <div className="flex justify-center gap-8 mt-4">
        <div className="text-center">
          <HintPad label="Hints" onInput={(num) => handleNumberInput(num, 'hints')} />
        </div>
        <div className="text-center">
          <NumberPad label="Numbers" onInput={(num) => handleNumberInput(num, 'number')} />
        </div>
      </div>
    </>
  );
}

