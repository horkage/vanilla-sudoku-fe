'use client';

import { useState } from 'react';
import { SudokuGrid } from "@/components/SudokuGrid";
import NumberPad from '@/components/NumberPad';
import HintPad from '@/components/HintPad';

export default function SudokuPlayer({ puzzle, puzzleId }) {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [currentGrid, setCurrentGrid] = useState<number[][]>(structuredClone(puzzle));

  function handleCellClick(row: number, col: number) {
    setSelectedCell({ row, col });
  }

  function handleNumberInput(num: number, mode: "number" | "hint") {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const newGrid = structuredClone(currentGrid);
    if (mode === "number") {
      newGrid[row][col] = num;
    } else {
      console.log(`Hint ${num} for cell ${row},${col}`);
    }
    setCurrentGrid(newGrid);
  }

  return (
    <>
      <SudokuGrid
        puzzle={currentGrid}
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
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

