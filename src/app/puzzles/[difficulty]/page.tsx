import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next'
import PuzzleIndexClient from '@/components/puzzle/PuzzleIndexClient';
import type { TumblerPuzzle } from '@/components/puzzle/PuzzleTumbler';

export async function generateMetadata({
  params
}: {
  params: Promise<{ difficulty: string }>
}): Promise<Metadata> {
  const { difficulty } = await params;
  const difficultyString = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return {
    title: `${difficultyString} Puzzles | Vanilla Sudoku`,
    description: `Try out ${difficultyString} level sudoku puzzles. Puzzles with a video icon means there is an accompanying walkthrough video.`,
    openGraph: {
      title: `${difficultyString} Puzzles | Vanilla Sudoku`,
      description: `Try out ${difficultyString} level sudoku puzzles. Puzzles with a video icon means there is an accompanying walkthrough video.`,
    },
    twitter: {
      title: `${difficultyString} Puzzles | Vanilla Sudoku`,
      description: `Try out ${difficultyString} level sudoku puzzles. Puzzles with a video icon means there is an accompanying walkthrough video.`,
    },
  };
}

export default async function DifficultyIndexPage({
  params,
}: {
  params: Promise<{ difficulty: string }>;
}) {
  const { difficulty } = await params;
  const puzzleDir = path.join(process.cwd(), 'puzzle-data', difficulty);

  if (!fs.existsSync(puzzleDir)) {
    notFound();
  }

  const parse = (s: string): number[][] =>
    s.trim().split('\n').map((line) => line.trim().split(' ').map(Number));

  const puzzles: TumblerPuzzle[] = fs.readdirSync(puzzleDir)
    .filter((file) => file.endsWith('.puzzle'))
    .sort((a, b) => b.localeCompare(a)) // newest-first (highest id leads)
    .map((file) => {
      const id = path.basename(file, '.puzzle');
      const cells = parse(fs.readFileSync(path.join(puzzleDir, file), 'utf8'));
      const hasVideo = fs.existsSync(path.join(puzzleDir, `${id}.youtube`));
      return { id, difficulty: difficulty as TumblerPuzzle['difficulty'], cells, hasVideo };
    });

  return <PuzzleIndexClient difficulty={difficulty} puzzles={puzzles} />;
}
