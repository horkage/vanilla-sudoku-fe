import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Vanilla Sudoku',
  description: 'Play and solve original sudoku puzzles with visual walkthroughs.',
  keywords: ['Sudoku', 'Sudoku Puzzles', 'Sudoku Walkthroughs', 'Online Sudoku', 'Playable Sudoku', 'Sudoku Tutorial'],
  metadataBase: new URL('https://vanilla-sudoku.com'),
  openGraph: {
    title: 'Vanilla Sudoku',
    description: 'Original sudoku puzzles with walkthroughs.',
    url: 'https://vanilla-sudoku.com',
    siteName: 'Vanilla Sudoku',
    images: [
      {
        url: '/social-preview.png',
        width: 1200,
        height: 630,
        alt: 'Vanilla Sudoku',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vanilla Sudoku',
    description: 'Original sudoku puzzles with walkthroughs.',
    images: ['/social-preview.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-neutral-100 text-gray-800 m-0 p-0">
        <div className="relative">
          <Header />
        </div>

        <main className="flex-1">
          {children}
        </main>

        <footer className="bg-[#6096B4] text-center p-4 text-sm text-[#EEE9DA]">
          © {new Date().getFullYear()} Vanilla Sudoku
        </footer>
      </body>
    </html>
  );
}

