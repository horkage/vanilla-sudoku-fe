'use client';

import { useState, useEffect } from 'react';
import { CreateGrid } from "@/components/CreateGrid";
import NumberPad from '@/components/NumberPad';

export default function CreatePage() {
  const puzzle: number[][] = Array.from({ length: 9 }, () =>
    Array(9).fill(0)
  );
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [currentGrid, setCurrentGrid] = useState<number[][]>(structuredClone(puzzle));

  function handleCellClick(row: number, col: number) {
    setSelectedCell({ row, col });

    // de-select cell if clicked again
    if (selectedCell?.row === row && selectedCell?.col === col) setSelectedCell(null);
  }

  function handleNumberInput(num: number, mode: "number" | "hint") {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const newGrid = structuredClone(currentGrid);
    if (newGrid[row][col] === num) {
      newGrid[row][col] = 0;
    } else {
      newGrid[row][col] = num;
    }

    setCurrentGrid(newGrid);
  }

  function deleteInput() {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    const newGrid = structuredClone(currentGrid);
    newGrid[row][col] = 0;
    setCurrentGrid(newGrid);
  }

  function handleReset() {
    // Clear all user-entered values and hints
    setCurrentGrid(clues.map(row => row.map(cell => cell))); // Reset puzzle to clues
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      // Handle numeric input
      if (/^(Digit|Numpad)[1-9]$/.test(e.code)) {
        let num = parseInt(e.code.replace('Digit', '').replace('Numpad', ''), 10);
        const mode = e.shiftKey ? 'hint' : 'number';
        if (mode === 'hint') num = num - 1;
        handleNumberInput(num, mode);
      }

      // Handle backspace to delete
      if (key === 'Backspace' || key === 'Delete') {
        deleteInput();
      }

      // Handle de-selecting cells
      if (key === 'Escape') {
        setSelectedCell(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberInput, deleteInput]);

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-[#333333] m-2">Create Basic & Shareable Puzzle</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-2 items-start">
        <div className="flex-1">
          <CreateGrid
            puzzle={currentGrid}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
          />
          <div className="flex justify-center gap-1 mt-2">
            <div className="text-center">
              <NumberPad label="Numbers" onInput={(num) => handleNumberInput(num, 'number')} />
            </div>
          </div>

          <div className="flex justify-center gap-8 mt-4 mb-4">
            <button
              className="px-6 py-2 rounded-lg bg-[#6096B4] text-[#EEE9DA] font-semibold shadow hover:brightness-110 transition"
            >
              Make Shareable Link
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

