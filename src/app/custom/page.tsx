"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SudokuPlayer from "@/components/SudokuPlayer";

export default function CustomPage() {
  /* some kind of noise about "suspense boundaries" and useSearchParams() being async under the hood */
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerCustomPage />
    </Suspense>
  );
}

function InnerCustomPage() {

  const searchParams = useSearchParams();
  const data = searchParams.get('data');
  const puzzle = decodePuzzleData(data);
  const clues = decodePuzzleData(data);

  console.log(puzzle);

  return (
    <main className="bg-[#EEE9DA] flex justify-center">
      <div className="w-[95%] md:w-[75%] mt-4">
        <h1 className="text-2xl font-semibold text-[#333333] mb-2 text-center">Custom Puzzle</h1>
        <SudokuPlayer puzzle={puzzle} clues={clues} />
      </div>
    </main>
  );

}

function decodePuzzleData(data: string | null): number[][] {
  if (!data || data.length !== 81) {
    // fallback: empty grid
    return Array.from({ length: 9 }, () => Array(9).fill(0));
  }

  const decoded = decodeURIComponent(data);
  const grid: number[][] = [];

  for (let i = 0; i < 9; i++) {
    grid.push(decoded.slice(i * 9, (i + 1) * 9).split('').map(Number));
  }

  return grid;
}
