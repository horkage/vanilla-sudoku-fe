import './globals.css';
import type { Metadata } from 'next';
import { Youtube } from 'lucide-react';
import { Newsreader, Hanken_Grotesk } from 'next/font/google';
import Header from '@/components/Header';

// Display serif "voice" — headlines, hero copy, footer tagline, wordmark.
const serif = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

// UI/body sans — nav, button, invitation line, copyright.
const sans = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vanilla Sudoku',
  description: 'Play original home grown sudoku puzzles with visual walkthroughs and beginner friendly learning videos.',
  keywords: ['Sudoku', 'Sudoku Walkthroughs', 'Sudoku Tutorial', 'Sudoku How To'],
  metadataBase: new URL('https://vanilla-sudoku.com'),
  openGraph: {
    title: 'Vanilla Sudoku',
    description: 'Play original home grown sudoku puzzles with visual walkthroughs and beginner friendly learning videos.',
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
    description: 'Play original home grown sudoku puzzles with visual walkthroughs and beginner friendly learning videos.',
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
  const year = new Date().getFullYear();

  return (
    <html lang="en" className={`h-full ${serif.variable} ${sans.variable}`}>
      <body className="flex flex-col min-h-screen bg-[#EEE9DA] text-gray-800 m-0 p-0">
        <div className="relative">
          <Header />
        </div>

        <main className="flex-1">
          {children}
        </main>

        {/* Quiet teal footer — grounds the brand. */}
        <footer className="bg-[#6096B4] text-[#EEE9DA]">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-8">
            <span
              className="text-lg font-medium"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              A quiet place for puzzles.
            </span>
            <div
              className="flex items-center gap-6 text-sm"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <a
                href="https://www.youtube.com/@vanillasudoku"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 opacity-90 transition-opacity hover:opacity-100"
              >
                <Youtube size={16} /> Walkthroughs
              </a>
              <span className="opacity-[0.85]">&copy; {year} Vanilla Sudoku</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
