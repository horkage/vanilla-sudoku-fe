import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-[#EEE9DA]">
      <div className="flex justify-center items-start">
        <div className="relative w-[90%] md:w-[75%] mt-3 p-6 overflow-hidden border border-[#333333] rounded bg-white">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: "url('/images/sudoku-puzzle.jpeg')" }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/100 via-white/90 to-white/80" />

          {/* Foreground Content */}
          <div className="relative z-20 text-[#333333]">
            <h1 className="text-xl md:text-2xl font-bold mb-4 tracking-wide border-b border-[#CCC]">Old Fashioned Sudoku Puzzles</h1>
            <div className="text-base md:text-lg leading-relaxed">
              I made this site because I like sudoku. It's just that I happen to like my sudoku puzzles to be like my ice cream: plain. Like good ol' fashioned vanilla. Here, watch this thing:
              <br />

              <div className="mt-4 flex justify-center">
                <a
                  href="https://www.youtube.com/watch?v=MeQ6Wjz-9zo&ab_channel=VanillaSudoku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block relative w-full md:w-[75%] lg:w-[60%] aspect-video overflow-hidden rounded border border-[#333333]"
                >
                  <img
                    src="https://img.youtube.com/vi/MeQ6Wjz-9zo/hqdefault.jpg"
                    alt="YouTube video thumbnail"
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <svg
                        className="w-6 h-6 text-[#333333]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6 4l12 6-12 6V4z" />
                      </svg>
                    </div>
                  </div>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
