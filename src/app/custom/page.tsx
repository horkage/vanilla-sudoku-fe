"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SudokuPlayer from "@/components/SudokuPlayer";
import { decodeGameState } from "@/utils/gameStateCodec";

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
  const data = decodeGameState(searchParams.get('state'));

  const puzzle = data.clues.map((row, i) =>
    row.map((cell, j) =>
      data.inputs[i][j] !== 0 ? data.inputs[i][j] : cell
    )
  );

  return (
    <main className="bg-[#EEE9DA] flex justify-center">
      <div className="w-[95%] md:w-[75%] mt-4">
        <h1 className="text-2xl font-semibold text-[#333333] mb-2 text-center">Custom Puzzle</h1>
        <SudokuPlayer puzzle={puzzle} clues={data.clues} />
      </div>
    </main>
  );

}
