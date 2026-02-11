export const metadata = {
  title: 'Puzzles | Vanilla Sudoku',
  description: 'Puzzle difficulty selection page.'
};

export default function PuzzlesLanding() {
  return (
    <div className="flex justify-center items-start pt-10">
      <div className="w-[90%] md:w-[75%] space-y-6">
        <h1 className="text-2xl font-semibold text-[#333333] mb-4 text-center">
          Choose Your Puzzle Difficulty
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Easy', 'Medium', 'Hard'].map((level) => (
            <a
              key={level}
              href={`/puzzles/${level.toLowerCase()}`}
              className="block bg-white border border-[#333333] rounded-lg p-6 text-center shadow-md hover:bg-[#f5f5f5] transition"
            >
              <h2 className="text-xl font-semibold text-[#333333]">{level}</h2>
              <p className="text-sm text-[#666] mt-2">
                See all {level.toLowerCase()} puzzles
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
