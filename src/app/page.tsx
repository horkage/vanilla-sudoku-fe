import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Detailed 3x3 sudoku-fragment motif: 84px, white cells, 2px ink outer border,
// 1px gray inner hairlines, a few teal digits.
const HERO_CELLS = ['', '2', '', '', '', '6', '', '7', ''];

function HeroGrid() {
  return (
    <div
      aria-label="Sudoku grid fragment"
      role="img"
      className="grid h-[84px] w-[84px] grid-cols-3 grid-rows-3 rounded-[2px] border-2 border-[#333333] bg-white shadow-[0_1px_2px_rgba(43,42,38,0.06)]"
    >
      {HERO_CELLS.map((v, i) => (
        <div
          key={i}
          className="flex items-center justify-center text-[14px] font-bold leading-none text-[#6096B4]"
          style={{
            fontFamily: 'var(--font-body)',
            borderRight: i % 3 !== 2 ? '1px solid #6B7280' : 'none',
            borderBottom: i < 6 ? '1px solid #6B7280' : 'none',
          }}
        >
          {v}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <section className="relative overflow-hidden bg-[#EEE9DA]">
      {/* Barely-there defocused grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/sudoku-puzzle.jpeg')",
          opacity: 0.5,
          filter: 'saturate(0.7)',
        }}
      />
      {/* Heavy cream veil over the texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(238,233,218,0.86) 0%, rgba(238,233,218,0.93) 55%, #EEE9DA 100%)',
        }}
      />

      <div
        className="relative z-[1] mx-auto flex max-w-[660px] flex-col items-center text-center"
        style={{ padding: 'clamp(64px, 12vw, 128px) 28px clamp(72px, 12vw, 120px)' }}
      >
        {/* Quiet brand motif */}
        <div className="mb-12 opacity-95">
          <HeroGrid />
        </div>

        {/* Eyebrow */}
        <div
          className="mb-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#8A8576]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Vanilla Sudoku
        </div>

        {/* The line */}
        <h1
          className="m-0 text-[clamp(2.75rem,8vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.02em] text-[#333333]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Sudoku for the <em className="italic text-[#4A7C97]">curious.</em>
        </h1>

        {/* The exhale */}
        <p
          className="mt-8 max-w-[540px] text-[clamp(1.125rem,2.6vw,1.5rem)] font-light italic leading-[1.55] text-[#5C594F]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Tech fatigue is real. Unplug for a little while.
        </p>

        {/* The invitation */}
        <p
          className="mb-6 mt-16 text-lg font-normal leading-[1.7] text-[#5C594F]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Pick a puzzle. See where it takes you.
        </p>

        {/* Primary CTA */}
        <Link
          href="/puzzles"
          className="inline-flex items-center gap-2.5 rounded-md border border-[#6096B4] bg-[#6096B4] px-9 py-4 text-lg font-semibold text-[#EEE9DA] shadow-[0_1px_2px_rgba(43,42,38,0.06)] transition-colors duration-300 ease-out hover:border-[#4A7C97] hover:bg-[#4A7C97] active:translate-y-px active:border-[#3D6B85] active:bg-[#3D6B85]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Pick a puzzle
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
