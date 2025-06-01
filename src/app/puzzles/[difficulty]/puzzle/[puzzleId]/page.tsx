import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { SudokuGrid } from "@/components/SudokuGrid";

export default async function PuzzlePage({
  params,
}: {
  params: { difficulty: string; puzzleId: string };
}) {
  const { difficulty, puzzleId } = await params;

  try {
    const dir = path.join(process.cwd(), "puzzle-data", difficulty);
    const puzzleStr = fs.readFileSync(path.join(dir, `${puzzleId}.puzzle`), "utf8");
    const solutionStr = fs.readFileSync(path.join(dir, `${puzzleId}.grid`), "utf8");

    const parse = (s: string) =>
      s
        .trim()
        .split("\n")
        .map((line) => line.trim().split(" ").map(Number));

    const puzzle = parse(puzzleStr);
    const solution = parse(solutionStr);

    return (
      <main className="bg-[#EEE9DA] flex justify-center">
        <div className="w-[95%] md:w-[75%] mt-4">
          <h1 className="text-2xl font-semibold text-[#333333] mb-2 text-center">{difficulty.charAt(0).toUpperCase()}{difficulty.slice(1)} Puzzle: {puzzleId}</h1>
          <SudokuGrid puzzle={puzzle} />

          {/* num pads */}
          <div className="flex justify-center mt-1 gap-8">
            {/* Hints Grid */}
            <div className="flex flex-col items-center">
              <div className="mb-1 font-medium text-gray-700">Hints</div>
              <div className="grid grid-cols-3 grid-rows-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <button
                    key={`hint-${i + 1}`}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-400 rounded shadow hover:bg-gray-100 text-2xl font-bold text-[#666]"
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Numbers Grid */}
            <div className="flex flex-col items-center">
              <div className="mb-1 font-medium text-gray-700">Numbers</div>
              <div className="grid grid-cols-3 grid-rows-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <button
                    key={`number-${i + 1}`}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-400 rounded shadow hover:bg-gray-100 text-2xl font-bold text-[#6096B4]"
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* /num pads */}

        </div>
      </main>
    );
  } catch {
    return notFound();
  }
}
