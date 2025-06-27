import Link from 'next/link';

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
              I didn&apos;t even know what sudoku was until a couple of years ago. I started puttering at it in some puzzle books and found that I started to really like the game a lot, and, now I&apos;m making my own puzzles. I believe that there could very well be a hidden sudoku player within you that you just haven&apos;t met yet - because that&apos;s what happened with me.<br /><br />My hope is that I can shine you on to sudoku if you&apos;re new to it, and hopefully show things from a different, yet useful perspective to veterans as well.<br /><br /><Link className="vs-link" href="/puzzles">All of my puzzles</Link> are home-made and are designed to be enjoyed the way I enjoy sudoku: with minimal digital fuss and a nod towards analog play. Here, watch this thing:
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

      <div className="flex justify-center mt-6 mb-12">
        <div className="w-[90%] md:w-[75%] space-y-6">
          { /* news stuff things */ }

          { /* embedded thing */ }
          <div className="bg-white border border-[#333333] rounded p-4 mb-4 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <iframe
                className="w-full aspect-video rounded"
                src="https://www.youtube.com/embed/bMQ6rY01V4c"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[#333333] mb-2">New Video: Introductory Sudoku Walkthrough Part 2</h2>
              <p className="text-[#333333] text-base leading-relaxed">
                This is part two of my introductory sudoku walkthrough where I apply what I covered in part one to solve one of my very own difficult puzzles.  We address things like pointing pairs, naked pairs, and x-wings, but we do so as they naturally and organically reveal themselves within the grid as we solve the puzzle.<br /><br />If there is a sudoku player hiding within you, I hope this video will help coax them out!<br /><br />
                You can play this very puzzle featured within this video <Link className="vs-link" href="/puzzles/hard/puzzle/0001">right here</Link>.
              </p>
              <p className="text-sm text-[#666] mt-2">Jun 26, 2025</p>
            </div>
          </div>

          { /* embedded thing */ }
          <div className="bg-white border border-[#333333] rounded p-4 mb-4 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <iframe
                className="w-full aspect-video rounded"
                src="https://www.youtube.com/embed/2CVLuVnCxws"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[#333333] mb-2">New Video: Introductory Sudoku Walkthrough Part 1</h2>
              <p className="text-[#333333] text-base leading-relaxed">
                This is part one of my introductory sudoku walkthrough where I lay some basic foundations for solving any puzzle.  In the second part, we will actually solve a hard puzzle together using what we cover in this video. You can even play the puzzle featured in this video yourself <Link className="vs-link" href="/puzzles/hard/puzzle/0001">right here</Link>.<br /><br />We cover basics like the rules of sudoku and general strategy that can be applied to any puzzle, and with this two-part series, you will be ready to blast through almost any puzzle!
              </p>
              <p className="text-sm text-[#666] mt-2">Jun 26, 2025</p>
            </div>
          </div>

          { /* embedded thing */ }
          <div className="bg-white border border-[#333333] rounded p-4 mb-4 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <iframe
                className="w-full aspect-video rounded"
                src="https://www.youtube.com/embed/6fH0DfH6kEM"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[#333333] mb-2">New Video: Easy Puzzle 0001 Walkthrough</h2>
              <p className="text-[#333333] text-base leading-relaxed">
                I walk through and narrate solving the very first puzzle my algorithm ever made. I make some fun mistakes, so check it out!<br /><br />Or, you can <Link className="vs-link" href="/puzzles/easy/puzzle/0001">play the puzzle</Link> yourself right now.
              </p>
              <p className="text-sm text-[#666] mt-2">Jun 7, 2025</p>
            </div>
          </div>

          { /* text only thing */ }
          <div className="bg-white border border-[#333333] rounded p-4 mb-4 shadow-sm">
            <h2 className="text-lg font-semibold text-[#333333] mb-2">New Stuff!</h2>
            <p className="text-[#333333] text-base leading-relaxed">
              I pulled the site out of the stone age. It should be reasonably responsive on all devices, now. The words &quot;reasonably&quot; and &quot;should&quot; are doing a lot of heavy lifting here, of course. Be sure to checkout some of the puzzles I have made.<br /><br />I have some <Link className="vs-link" href="/puzzles/easy">easy</Link> puzzles, some <Link className="vs-link" href="/puzzles/medium">medium</Link> ones, and a lonely <Link className="vs-link" href="/puzzles/hard">hard</Link> one, all by itself.  If there is a video icon next to the puzzle, that means that puzzle has a walkthrough!
            </p>
            <p className="text-sm text-[#666] mt-2">May 28, 2025</p>
          </div>

          { /* embedded thing */ }
          <div className="bg-white border border-[#333333] rounded p-4 mb-4 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <iframe
                className="w-full aspect-video rounded"
                src="https://www.youtube.com/embed/mIboT_Cqemc"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[#333333] mb-2">New Video: Solving Puzzles</h2>
              <p className="text-[#333333] text-base leading-relaxed">
                Walkthrough showing how I go about solving analog puzzles. Digital ones, too!
              </p>
              <p className="text-sm text-[#666] mt-2">May 28, 2025</p>
            </div>
          </div>

          { /* embedded thing */ }
          <div className="bg-white border border-[#333333] rounded p-4 mb-4 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <iframe
                className="w-full aspect-video rounded"
                src="https://www.youtube.com/embed/WIVtsf3Fpc4"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[#333333] mb-2">New Video: There Is No Math</h2>
              <p className="text-[#333333] text-base leading-relaxed">
                No, really. There isn&apos;t. I promise.
              </p>
              <p className="text-sm text-[#666] mt-2">May 28, 2025</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
