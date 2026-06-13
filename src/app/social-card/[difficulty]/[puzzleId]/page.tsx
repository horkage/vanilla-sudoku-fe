import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import SocialCard from '@/components/SocialCard';

// Internal tooling route used only to generate social/OG images. Keep it out of search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SocialCardPage({
  params,
}: {
  params: Promise<{ difficulty: string; puzzleId: string }>;
}) {
  const { difficulty, puzzleId } = await params;

  try {
    const dir = path.join(process.cwd(), 'puzzle-data', difficulty);
    const puzzleStr = fs.readFileSync(path.join(dir, `${puzzleId}.puzzle`), 'utf8');

    const puzzle = puzzleStr
      .trim()
      .split('\n')
      .map((line) => line.trim().split(' ').map(Number));

    return <SocialCard puzzle={puzzle} difficulty={difficulty} puzzleId={puzzleId} />;
  } catch {
    return notFound();
  }
}
