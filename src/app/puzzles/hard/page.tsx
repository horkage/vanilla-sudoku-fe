import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function EasyPuzzlesPage() {
  const puzzleDir = path.join(process.cwd(), 'puzzle-data', 'hard');
  const files = fs.readdirSync(puzzleDir)
    .filter((file) => file.endsWith('.puzzle'))
    .sort((a, b) => b.localeCompare(a)); // Reverse alphanumeric

  return (
    <main className="bg-[#EEE9DA] flex justify-center">
      <div className="w-[90%] md:w-[75%] mt-4 p-6 bg-white border border-[#333333] rounded shadow-sm">
        <h1 className="text-2xl font-semibold text-[#333333] mb-4">Hard Sudoku Puzzles</h1>
        <p className="text-base md:text-lg text-[#333333] mb-6">
          Here you'll find all the hard-level puzzles. New puzzles will be added regularly.
        </p>

        <ul className="space-y-2">
          {files.map((file) => {
            const puzzleId = path.basename(file, '.puzzle');
            return (
              <li key={puzzleId}>
                <Link href={`/puzzles/easy/${puzzleId}`} className="text-blue-600 hover:underline">
                  Puzzle {puzzleId}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

