import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import SudokuPlayer from "@/components/SudokuPlayer";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Candidate Puzzle | Vanilla Sudoku',
  description: 'Preview and test candidate puzzle before promotion',
};

export default async function CandidatePuzzlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const dir = path.join(process.cwd(), "puzzle-data", "candidate");
    
    // Pad the ID to 3 digits (e.g., "1" -> "001")
    const paddedId = id.padStart(3, '0');
    
    const puzzleStr = fs.readFileSync(path.join(dir, `${paddedId}.puzzle`), "utf8");
    const solutionStr = fs.readFileSync(path.join(dir, `${paddedId}.grid`), "utf8");

    const parse = (s: string) =>
      s
        .trim()
        .split("\n")
        .map((line) => line.trim().split(" ").map(Number));

    const puzzle = parse(puzzleStr);
    const clues = parse(puzzleStr);
    const solution = parse(solutionStr);

    return (
      <main className="bg-[#EEE9DA] flex justify-center">
        <div className="w-[95%] md:w-[75%] mt-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
            <p className="font-bold">⚠️ Candidate Puzzle</p>
            <p>This is an unvetted puzzle. Play through to verify uniqueness and assess difficulty.</p>
          </div>
          <h1 className="text-2xl font-semibold text-[#333333] mb-2 text-center">
            Candidate Puzzle: {id}
          </h1>
          <SudokuPlayer puzzle={puzzle} clues={clues} solution={solution} youtubeId={null} />
        </div>
      </main>
    );
  } catch {
    return notFound();
  }
}
