export const metadata = {
  title: 'About | Vanilla Sudoku',
  description: 'Learn more about Vanilla Sudoku and the mission behind it.',
};

export default function About() {
  return (
    <main className="bg-[#EEE9DA]">
      <div className="flex justify-center items-start">
        <div className="relative w-[90%] md:w-[75%] mt-3 p-6 overflow-hidden border border-[#333333] rounded bg-white">
          <h1 className="text-xl md:text-2xl font-bold mb-4 tracking-wide border-b border-[#CCC]">About</h1>
          <div className="text-base md:text-lg leading-relaxed">
            This little site is my soft rebellion against tech fatigue &mdash; and, in a way, against the way most people think Sudoku has to be played. There is no right or wrong way to play Sudoku, of course, but I lean more toward a casual and organic approach.
            <br /><br />
            I build each puzzle by hand, with care, hoping to capture the quiet joy of natural logic and discovery. Here, you won&apos;t need to start by penciling in hundreds of tiny hints or memorizing esoteric patterns with names like &quot;Jellyfish&quot; or &quot;Skyscrapers.&quot;
            <br /><br />
            Instead, my puzzles invite you to solve them step by step, letting simple reasoning lead the way. If you listen closely, they might even tell you exactly how to solve them.
            <br /><br />
            I like to think of this as Sudoku for people who want to enjoy the process of naturally solving puzzles &mdash; not just cataloging techniques.
            <br /><br />
            So take a deep breath, pick a puzzle, and see where it takes you. Maybe, like me, you&apos;ll find something quietly joyful here too.
            <br /><br />
            I have some <a className="text-[#6096B4]" href="https://www.youtube.com/@vanillasudoku" target="_blank">videos</a> that go into further detail, should you be so inclined.
            <br /><br />
            <i>&mdash; Michael</i>
          </div>
        </div>
      </div>
    </main>
  );
}
