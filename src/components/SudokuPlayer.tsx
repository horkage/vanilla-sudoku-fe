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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCheckDialog, setShowCheckDialog] = useState(false);
  const [showSolvedDialog, setShowSolvedDialog] = useState(false);

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
    setShowResetConfirm(false);
  }

  function handleCheck() {
    const newIncorrectCells = currentGrid.map((row, rowIndex) =>
      row.map((value, colIndex) => {
        const isEditable = clues[rowIndex][colIndex] === 0;
        return isEditable && value !== 0 && value !== solution[rowIndex][colIndex];
      })
    );
    setIncorrectCells(newIncorrectCells);
    // const hasIncorrect = newIncorrectCells.some(row => row.some(cell => cell));

    const isSolved = currentGrid.every((row, rowIndex) =>
      row.every((value, colIndex) => value === solution[rowIndex][colIndex])
    );

    if (isSolved) {
      setShowSolvedDialog(true);
    } else {
      setShowCheckDialog(true);
    }
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 items-start">

        {/* confirm dialog */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
              <p className="mb-4 text-gray-800 font-semibold">Are you sure you want to reset the puzzle?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 rounded-lg bg-[#6096B4] text-[#EEE9DA] font-semibold shadow hover:brightness-110 transition"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-6 py-2 rounded-lg bg-[#6096B4] text-[#EEE9DA] font-semibold shadow hover:brightness-110 transition"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* check dialog */}
        {showCheckDialog && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
              <p className="mb-4 text-gray-800 font-semibold">Numbers that are <span className="text-red-800">dark red</span> are incorrect.<br />Numbers that are <span className="text-[#6096B4]">dark blue</span> are correct.<br /></p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowCheckDialog(false)}
                  className="px-6 py-2 rounded-lg bg-[#6096B4] text-[#EEE9DA] font-semibold shadow hover:brightness-110 transition"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}

        {/* solved dialog */}
        {showSolvedDialog && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
              <p className="mb-4 text-gray-800 font-semibold">Congratuations!<br /><br />You have solved this puzzle correctly!</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowSolvedDialog(false)}
                  className="px-6 py-2 rounded-lg bg-[#6096B4] text-[#EEE9DA] font-semibold shadow hover:brightness-110 transition"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}

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
                onClick={() => setShowResetConfirm(true)}
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

