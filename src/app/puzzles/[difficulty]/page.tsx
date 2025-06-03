import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Video } from 'lucide-react';

export default async function DifficultyIndexPage({
  params,
}: {
  params: { difficulty: string };
}) {
  const { difficulty } = await params;
  const puzzleDir = path.join(process.cwd(), 'puzzle-data', difficulty);
  const files = fs.readdirSync(puzzleDir)
    .filter((file) => file.endsWith('.puzzle'))
    .sort((a, b) => b.localeCompare(a)); // Reverse alphanumeric

  return (
    <main className="bg-[#EEE9DA] flex justify-center">
      <div className="w-[90%] md:w-[75%] mt-4 p-6 bg-white border border-[#333333] rounded shadow-sm items-center">
        <h1 className="text-2xl font-semibold text-[#333333] text-center mb-2">{difficulty.charAt(0).toUpperCase()}{difficulty.slice(1)} Puzzles</h1>

        <ul className="flex flex-col items-center gap-4 p-0 list-none">
          {files.map((file) => {
            const puzzleId = path.basename(file, '.puzzle');

            const youtubePath = path.join(puzzleDir, `${puzzleId}.youtube`);
            const hasVideo = fs.existsSync(youtubePath);

            return (
              <li key={puzzleId} className="w-1/2 min-w-[280px]">
                <Link href={`/puzzles/${difficulty}/puzzle/${puzzleId}`} className="block px-6 py-4 border-2 border-gray-300 rounded-xl text-center no-underline font-bold bg-gray-100 text-gray-800 transition-all duration-200 hover:border-[#6096B4] hover:bg-[#93BFCF] visited:text-gray-500">
                  Puzzle {puzzleId}
                  {hasVideo && (
                    <Video className="inline w-5 h-5 text-[#6096B4] ml-2" aria-label="Video available" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
