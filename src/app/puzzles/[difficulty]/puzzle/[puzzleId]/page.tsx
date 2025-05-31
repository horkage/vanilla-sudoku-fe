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
        <div className="w-[90%] md:w-[75%] mt-4 p-6 bg-white border border-[#333333] rounded shadow-sm">
          <h1 className="text-2xl font-semibold text-[#333333] mb-4">Puzzle: {puzzleId}</h1>
          <SudokuGrid puzzle={puzzle} />
        </div>
      </main>
    );
  } catch {
    return notFound();
  }
}
