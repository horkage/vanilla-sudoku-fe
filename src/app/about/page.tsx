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
            I started playing sudoku a coupla years ago. I didn't even really know what it was before then. I just always thought it was this weird, puzzle-looking thing with little boxes that had math in them. I always just assumed they were some kind arithmetic puzzle and never gave them a second thought.
            <br /><br />
            Well, I started playing some puzzles out of a book I was gifted, and a power outage led to me leafing through its pages. After a while I discovered sudoku to be a hidden treasure trove of things I truly value in life, largely, tranquility.
            <br /><br />
            Being a software engineer (rumor has it, at least, I've been called far worse), I became fascinated with how puzzles might be constructed. So, I started playing around with puzzle generation. I constructed a reasonably sophisticated toolchain that let me not only generate them but also solve them as I would.
            <br /><br />
            You see, there's a tricky thing about generating sudoku puzzles that are actually playable: ensuring an unambiguous grid. It's ok if you don't know what that means, I didn't know what it was either until I started generating things at random and throwing them at the wall. It is then that I understood that generating solvable sudoku puzzles took a little more than random chance and brute force solving.
            <br /><br />
            I did not look up how "Big Sudoku" does it, nor have I sourced anyone else's work. All my puzzles are home-grown and hosted entirely by me. And here I am. I'm still striving for generating the perfect puzzle, but in the meantime, there's no reason you can't play along with me during this unexpectedly fascinating journey.
            <br /><br />
            I have some <a className="text-[#6096B4]" href="https://www.youtube.com/@vanillasudoku" target="_blank">videos</a> you can watch that can explain things better than I could here.
            <br /><br />
            Hope to see you in a park and under your favorite tree working a puzzle!
          </div>
        </div>
      </div>
    </main>
  );
}
