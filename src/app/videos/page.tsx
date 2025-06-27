export const metadata = {
  title: 'Videos | Vanilla Sudoku',
  description: 'Featured videos and sudoku puzzle walkthrough videos.',
};

export default function Videos() {
  return (
    <main className="bg-[#EEE9DA] min-h-screen py-8">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-[90%] md:w-[75%] p-6 overflow-hidden border border-[#333333] rounded bg-white shadow">
          <h1 className="text-xl md:text-2xl font-bold mb-4 tracking-wide border-b border-[#CCC]">
            Featured Videos
          </h1>

          {/* introduction */ }
          <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
            <a
              href="https://www.youtube.com/watch?v=MeQ6Wjz-9zo"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-60 shrink-0"
            >
              <img
                src="https://img.youtube.com/vi/MeQ6Wjz-9zo/hqdefault.jpg"
                alt="Video thumbnail"
                className="rounded shadow-md hover:brightness-90 transition"
              />
            </a>
            <div>
              <h2 className="text-lg font-semibold mb-1">
                <a
                  href="https://www.youtube.com/watch?v=MeQ6Wjz-9zo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Introduction
                </a>
              </h2>
              <p className="text-sm text-gray-700">
                Why I play sudoku and how I find a bit of tranquility from a bunch of scattered numbers on a grid.
              </p>
            </div>
          </div>

          {/* sovling puzzles */}
          <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
            <a
              href="https://www.youtube.com/watch?v=mIboT_Cqemc"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-60 shrink-0"
            >
              <img
                src="https://img.youtube.com/vi/mIboT_Cqemc/hqdefault.jpg"
                alt="Video thumbnail"
                className="rounded shadow-md hover:brightness-90 transition"
              />
            </a>
            <div>
              <h2 className="text-lg font-semibold mb-1">
                <a
                  href="https://www.youtube.com/watch?v=mIboT_Cqemc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Solving Puzzles Overview
                </a>
              </h2>
              <p className="text-sm text-gray-700">
                A high level overview of how I visually solve sudoku puzzles, with step by step instructions that will help you solve your own digital or analog puzzles.
              </p>
            </div>
          </div>

          {/* there is no math */}
          <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
            <a
              href="https://www.youtube.com/watch?v=WIVtsf3Fpc4"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-60 shrink-0"
            >
              <img
                src="https://img.youtube.com/vi/WIVtsf3Fpc4/hqdefault.jpg"
                alt="Video thumbnail"
                className="rounded shadow-md hover:brightness-90 transition"
              />
            </a>
            <div>
              <h2 className="text-lg font-semibold mb-1">
                <a
                  href="https://www.youtube.com/watch?v=WIVtsf3Fpc4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  There Is No Math
                </a>
              </h2>
              <p className="text-sm text-gray-700">
                A quick demonstration that shows math is not needed to solve sudoku puzzles. It does not matter what we use as symbols or glyphs - all that matters is that they are unique.
              </p>
            </div>
          </div>


        </div>
        <div className="relative w-[90%] md:w-[75%] p-6 overflow-hidden border border-[#333333] rounded bg-white shadow">
          <h1 className="text-xl md:text-2xl font-bold mb-4 tracking-wide border-b border-[#CCC]">
            Puzzle Walkthroughs
          </h1>

          {/* easy puzzle 0001 */}
          <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
            <a
              href="https://www.youtube.com/watch?v=6fH0DfH6kEM"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-60 shrink-0"
            >
              <img
                src="https://img.youtube.com/vi/6fH0DfH6kEM/hqdefault.jpg"
                alt="Video thumbnail"
                className="rounded shadow-md hover:brightness-90 transition"
              />
            </a>
            <div>
              <h2 className="text-lg font-semibold mb-1">
                <a
                  href="https://www.youtube.com/watch?v=6fH0DfH6kEM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Easy Puzzle 0001
                </a>
              </h2>
              <p className="text-sm text-gray-700">
                I narrate a walkthrough solving the very first sudoku puzzle I made.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
