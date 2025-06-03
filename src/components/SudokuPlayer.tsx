'use client';

import { useState } from 'react';
import { SudokuGrid } from "@/components/SudokuGrid";
import NumberPad from '@/components/NumberPad';
import HintPad from '@/components/HintPad';

export default function SudokuPlayer({ puzzle, puzzleId, clues, solution, youtubeId }) {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [currentGrid, setCurrentGrid] = useState<number[][]>(structuredClone(puzzle));
  const [hints, setHints] = useState<boolean[][][]>(
    Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => Array(9).fill(false))
    )
  );
  const [incorrectCells, setIncorrectCells] = useState<boolean[][]>(
    Array(9).fill(null).map(() => Array(9).fill(false))
  );

  function handleCellClick(row: number, col: number) {
    setSelectedCell({ row, col });
  }

  function handleNumberInput(num: number, mode: "number" | "hint") {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (mode === "number") {
      const newGrid = structuredClone(currentGrid);
      if (newGrid[row][col] === num) {
        newGrid[row][col] = 0;
      } else {
        newGrid[row][col] = num;
      }
      incorrectCells[row][col] = false;

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
    }
  }

  function handleReset() {
    // Clear all user-entered values and hints
    setCurrentGrid(clues.map(row => row.map(cell => cell))); // Reset puzzle to clues
    setHints(
      Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => Array(9).fill(false))
      )
    );
  }

  function handleCheck() {
    const newIncorrectCells = currentGrid.map((row, rowIndex) =>
      row.map((value, colIndex) => {
        const isEditable = clues[rowIndex][colIndex] === 0;
        return isEditable && value !== 0 && value !== solution[rowIndex][colIndex];
      })
    );
    setIncorrectCells(newIncorrectCells);
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 items-start">
        <div className="flex-1">
          <SudokuGrid
            puzzle={currentGrid}
            clues={clues}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
            hints={hints}
            incorrectCells={incorrectCells}
          />
          <div className="flex justify-center gap-8 mt-2">
            <div className="text-center">
              <HintPad label="Hints" onInput={(num) => handleNumberInput(num, 'hints')} />
            </div>
            <div className="text-center">
              <NumberPad label="Numbers" onInput={(num) => handleNumberInput(num, 'number')} />
            </div>
          </div>

          <div className="flex justify-center gap-8 mt-4 mb-4">
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded-lg bg-[#6096B4] text-[#EEE9DA] font-semibold shadow hover:brightness-110 transition"
            >
              Reset
            </button>
            <button
              onClick={handleCheck}
              className="px-6 py-2 rounded-lg bg-[#6096B4] text-[#EEE9DA] font-semibold shadow hover:brightness-110 transition"
            >
              Check
            </button>
          </div>
        </div>

      {youtubeId ? (
        <div className="aspect-video w-full md:w-[40%] rounded-xl shadow-md overflow-hidden text-center mb-4">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="mx-auto rounded-xl shadow-md w-full h-full"
          ></iframe>
        </div>
      ) : (
        <p></p>
      )}

      </div>

    </>
  );
}

