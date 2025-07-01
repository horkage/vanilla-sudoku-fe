'use client';

import { useState, useEffect } from 'react';
import { SudokuGrid } from "@/components/SudokuGrid";
import NumberPad from '@/components/NumberPad';
import HintPad from '@/components/HintPad';
import { encodeGameState } from "@/utils/gameStateCodec";
import Link from 'next/link';

export default function SudokuPlayer({ puzzle, clues, solution, youtubeId, customHints }) {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [currentGrid, setCurrentGrid] = useState<number[][]>(structuredClone(puzzle));

  const [hints, setHints] = useState<boolean[][][]>(
    () => customHints
      ? customHints
      : Array.from({ length: 9 }, () =>
          Array.from({ length: 9 }, () => Array(9).fill(false))
        )
  );

  const [incorrectCells, setIncorrectCells] = useState<boolean[][]>(
    Array(9).fill(null).map(() => Array(9).fill(false))
  );
  const [narrationGrid, setNarrationGrid] = useState<string[][]>(
    Array(9).fill(null).map(() => Array(9).fill(null))
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCheckDialog, setShowCheckDialog] = useState(false);
  const [showSolvedDialog, setShowSolvedDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [narrationMode, setNarrationMode] = useState(false);
  const [highlightMode, setHighlightMode] = useState<"box" | "row" | "column" | null>(null);
  const [highlightBoxPos, setHighlightBoxPos] = useState<[number, number] | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);

  function handleCellClick(row: number, col: number) {
    if (clues[row][col] === 0) { // don't let user select clue cells
      setSelectedCell({ row, col });
    }

    // de-select cell if clicked again
    if (!narrationMode && selectedCell?.row === row && selectedCell?.col === col) setSelectedCell(null);

    if (narrationMode) {
      // setSelectedCell({ row, col });
      setNarrationGrid(prev => {
        const newGrid = prev.map(r => [...r]); // deep clone
        newGrid[row][col] = currentGrid[row][col];
        return newGrid;
      });
    }
  }

  function handleRightClick(row: number, col: number) {
    if (narrationMode) {
      setNarrationGrid(prev => {
        const newGrid = prev.map(r => [...r]); // deep clone
        newGrid[row][col] = newGrid[row][col] === "X" ? "" : "X"; // toggle
        return newGrid;
      });
    }
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

  function deleteInput() {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    const newGrid = structuredClone(currentGrid);
    if (clues[row][col] === 0 && currentGrid[row][col] !== 0) {
      newGrid[row][col] = 0;
      incorrectCells[row][col] = false;
      setCurrentGrid(newGrid);
      return; // return early if we deleted a number just in case there are hints as well
    }

    // Then, if no number was deleted, check for hints to clear
    const hasHints = hints[row][col].some((val) => val);
    if (hasHints) {
      setHints((prev) => {
        const newHints = prev.map((rowHints, r) =>
          rowHints.map((cellHints, c) =>
            r === row && c === col ? cellHints.map(() => false) : cellHints
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

  function handleShare() {
    // Build inputs: only user-entered numbers
    const customInputs = currentGrid.map((row, i) =>
      row.map((cell, j) =>
        cell !== clues[i][j] ? cell : 0
      )
    );

    // Flatten for encoder
    const flatClues = clues.flat();
    const flatInputs = customInputs.flat();
    const flatHints = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        flatHints.push(hints[i][j]);
      }
    }

    const properHints = Array.from({ length: 9 }, (_, i) =>
      Array.from({ length: 9 }, (_, j) =>
        flatHints[i * 9 + j]
      )
    );

    // Encode state
    const state = encodeGameState({ clues: flatClues, inputs: flatInputs, hints: properHints });

    // Now safely build full URL in the browser
    const url = `${window.location.origin}/custom?state=${state}`;

    // Copy to clipboard
    navigator.clipboard.writeText(url)
      .then(() => console.log("Copied to clipboard!"))
      .catch(console.error);

    setShareLink(url);
    setShowShareDialog(true);
  }

  /* narration stuff */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'n') {
        setNarrationMode((prev) => !prev);
        setHighlightBoxPos(null);
      } else {
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

        // bomb out from here if not in narration mode
        if (!narrationMode) return;

        // Handle mode switching
        if (key === 'b') setHighlightMode('box');
        else if (key === 'r') setHighlightMode('row');
        else if (key === 'c') setHighlightMode('column');
        else if (key === 'x') setNarrationGrid(Array(9).fill(null).map(() => Array(9).fill(null)));

        // Handle navigation
        else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
          e.preventDefault(); // Prevent scroll

          setHighlightBoxPos((prev) => {
            if (!prev) return [0, 0];

            const [r, c] = prev;

            if (highlightMode === 'box') {
              const newRow = Math.max(0, Math.min(2, r + (key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0)));
              const newCol = Math.max(0, Math.min(2, c + (key === 'ArrowRight' ? 1 : key === 'ArrowLeft' ? -1 : 0)));
              return [newRow, newCol];
            }

            if (highlightMode === 'row') {
              const newRow = Math.max(0, Math.min(8, r + (key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0)));
              return [newRow, c]; // Only row changes
            }

            if (highlightMode === 'column') {
              const newCol = Math.max(0, Math.min(8, c + (key === 'ArrowRight' ? 1 : key === 'ArrowLeft' ? -1 : 0)));
              return [r, newCol]; // Only col changes
            }

            return prev;
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [narrationMode, highlightMode, highlightBoxPos, handleNumberInput, deleteInput]);

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

        {/* share dialog */}
        {showShareDialog && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
              <p className="mb-4 text-gray-800 font-semibold">Puzzle copied to clipboard.</p>
              <p className="mb-4 text-gray-800 font-semibold">
                <Link className="vs-link" target="_new" href={shareLink}>Puzzle Link</Link>
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowShareDialog(false)}
                  className="px-6 py-2 rounded-lg bg-[#6096B4] text-[#EEE9DA] font-semibold shadow hover:brightness-110 transition"
                >
                  Ok
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

        {/* help dialog */}
        {showHelpDialog && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
              <p className="mb-4 text-gray-800 font-semibold">
                How to play
              </p>
              <p className="mb-4 text-gray-800 text-left">
                Place numbers within the puzzle grid so that each number in every box, row, and column are all unique.
              </p>
              <p className="mb-4 text-gray-800 text-left">
                Poke a cell, and then poke either a hint (lower left) or a number (lower right). Hints and numbers can be undone by poking the same number again on the selected cell or mashing the big X button in between the number pads. The X button will first delete a number, then hints, if any exist. Poke a cell again to de-select it
              </p>
              <p className="mb-4 text-gray-800 text-left">
                You can see if your numbers are correct at any time using the Check button below. Clear the entire grid with the Reset button if you wish to start over.
              </p>
              <p className="mb-4 text-gray-800 text-left">
                You could also use the Check button to step through each number until it turns blue if you happen to get stuck or are new to sudoku.
              </p>
              <p className="mb-4 text-gray-800 text-left hidden md:block">
                You can also use the number keys or your numeric keypad to place numbers, and hold <code><b>Shift</b></code> with the number keys to place hints. Hit <code><b>Escape</b></code> to de-select a cell, <code><b>Backspace</b></code> or <code><b>Del</b></code> to remove hints and numbers.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowHelpDialog(false)}
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
            narrationMode={narrationMode}
            highlightMode={highlightMode}
            highlightBoxPos={highlightBoxPos}
            handleRightClick={handleRightClick}
            narrationGrid={narrationGrid}
          />
          <div className="flex justify-center gap-1 mt-2">
            <div className="text-center">
              <HintPad label="Hints" onInput={(num) => handleNumberInput(num, 'hints')} />
            </div>

            {/* Button stack between pads */}
            <div className="flex flex-col items-center justify-center gap-4 ml-2 mr-2 mt-8">
              <button
                className="px-4 py-2 rounded-lg bg-[#6096B4] text-[#EEE9DA] font-semibold shadow hover:brightness-110 transition"
                onClick={() => deleteInput()}
              >
                X
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#6096B4] text-[#EEE9DA] font-semibold shadow hover:brightness-110 transition"
                onClick={() => setShowHelpDialog(true)}
              >
                ?
              </button>
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

            {solution && (
              <button
                onClick={handleCheck}
                className="px-6 py-2 rounded-lg bg-[#6096B4] text-[#EEE9DA] font-semibold shadow hover:brightness-110 transition"
              >
                Check
              </button>
            )}
            <button
              onClick={handleShare}
              className="hidden md:block px-6 py-2 rounded-lg bg-[#6096B4] text-[#EEE9DA] font-semibold shadow hover:brightness-110 transition"
            >
              Share
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

