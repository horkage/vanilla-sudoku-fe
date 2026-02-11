import { notFound } from "next/navigation";
import fs from "fs";
import fsPromise from 'fs/promises';
import path from "path";
import SudokuPlayer from "@/components/SudokuPlayer";
import { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ difficulty: string, puzzleId: string }>
}): Promise<Metadata> {
  const { difficulty, puzzleId } = await params;
  const difficultyString = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  const metaFilePath = path.join(process.cwd(), 'puzzle-data', difficulty, `${puzzleId}.metadata.json`);

  try {
    const file = await fsPromise.readFile(metaFilePath, 'utf-8');
    const data = JSON.parse(file) as {
      title?: string;
      description?: string;
      videoUrl?: string;
      image?: string;
    };

    return {
      title: data.title ?? `${difficultyString} Sudoku Puzzle ${puzzleId} | Vanilla Sudoku`,
      description: data.description ?? `Play ${difficultyString} Sudoku Puzzle ${puzzleId}`,
      openGraph: {
        title: data.title ?? `${difficultyString} Sudoku Puzzle ${puzzleId} | Vanilla Sudoku`,
        description: data.description ?? `Play ${difficultyString} Sudoku Puzzle ${puzzleId}`,
        url: data.videoUrl,
        images: data.image
          ? [{ url: data.image, width: 1200, height: 630, alt: data.title ?? 'Vanilla Sudoku' }]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: data.title ?? `${difficultyString} Sudoku Puzzle ${puzzleId} | Vanilla Sudoku`,
        description: data.description ?? `Play ${difficultyString} Sudoku Puzzle ${puzzleId}`,
        images: data.image ? [data.image] : undefined,
      },
    };
  } catch {
    // Metadata file doesn't exist, fall back to basic version
    return {
      title: `${difficultyString} Sudoku Puzzle ${puzzleId} | Vanilla Sudoku`,
      description: `Play ${difficultyString} Sudoku Puzzle ${puzzleId}`,
      openGraph: {
        title: `${difficultyString} Sudoku Puzzle ${puzzleId} | Vanilla Sudoku`,
        description: `Play ${difficultyString} Sudoku Puzzle ${puzzleId}`,
      },
      twitter: {
        title: `${difficultyString} Sudoku Puzzle ${puzzleId} | Vanilla Sudoku`,
        description: `Play ${difficultyString} Sudoku Puzzle ${puzzleId}`,
      },
    };
  }
}

export default async function PuzzlePage({
  params,
}: {
  params: Promise<{ difficulty: string, puzzleId: string }>;
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
    const clues = parse(puzzleStr);
    const solution = parse(solutionStr);

    // youtube things
    let youtubeId: string | null = null
    const youtubePath = path.join(dir, `${puzzleId}.youtube`)
    if (fs.existsSync(youtubePath)) {
       youtubeId = fs.readFileSync(youtubePath, 'utf-8').trim()
    }

    return (
      <div className="flex justify-center">
        <div className="w-[95%] md:w-[75%] mt-4">
          <h1 className="text-2xl font-semibold text-[#333333] mb-2 text-center">{difficulty.charAt(0).toUpperCase()}{difficulty.slice(1)} Puzzle: {puzzleId}</h1>
          <SudokuPlayer puzzle={puzzle} clues={clues} solution={solution} youtubeId={youtubeId} />
        </div>
      </div>
    );
  } catch {
    return notFound();
  }
}
