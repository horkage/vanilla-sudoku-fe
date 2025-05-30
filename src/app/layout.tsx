import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Vanilla Sudoku',
  description: 'Interactive, human-style Sudoku solving with visual walkthroughs.',
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

