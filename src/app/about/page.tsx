export const metadata = {
  title: 'About | Vanilla Sudoku',
  description: 'Learn more about Vanilla Sudoku and the mission behind it.',
};

export default function About() {
  return (
    <main className="bg-[#EEE9DA]">
      <div className="flex justify-center items-start">
        <div className="relative w-[90%] md:w-[75%] mt-3 p-6 overflow-hidden border border-[#333333] rounded bg-white">
          <h1 className="text-xl md:text-2xl font-bold mb-4 tracking-wide border-b border-[#CCC]">Enough Noise, Already</h1>
          <div className="text-base md:text-lg leading-relaxed">
            This site is my soft rebellion against tech fatigue. I wanted a sanctuary of sorts that offered a respite from the din of constant digital noise we&apos;ve been marinating in. Old-fashioned style sudoku puzzles seemed to be a natural fit to this end, and I encourage you to take a moment here with me, as we shelter in place within the eye of the proverbial hurricane, barraged by endless push notifications, software updates, data breaches, ToS updates, devices mindlessly crying out for our constant attention, et cetera...
            <br /><br />
            Here, you can find yourself playing a traditional style sudoku puzzle within the least amount of clicks I could make possible.
            <br /><br />
            Now, moving onto the actual sudoku part, I started playing sudoku a coupla years ago. I didn&apos;t even really know what it was before then. I just always thought it was this weird, puzzle-looking thing with little boxes that had math in them. I always just assumed they were some kind of arithmetic puzzle and never gave them a second thought.
            <br /><br />
            Well, I started playing some puzzles out of a book I was gifted, and a power outage led to me leafing through its pages longer than I had intended. After a while I discovered sudoku to be a hidden treasure trove of things I truly value in life, largely, tranquility.
            <br /><br />
            Being a software engineer (rumor has it, at least, I&apos;ve been called far worse), I became fascinated with how puzzles might be constructed. So, I started playing around with puzzle generation. I constructed a reasonably sophisticated toolchain that let me not only generate them but also solve them as I would.
            <br /><br />
            You see, there&apos;s a tricky thing about generating sudoku puzzles that are actually playable: ensuring an unambiguous grid. It&apos;s ok if you don&apos;t know what that means, I didn&apos;t know what it was either until I started generating things at random and throwing them at the wall. It is then that I understood that generating solvable sudoku puzzles took a little more finesse and panache than random chance and brute-force. I hope you can sense the care that went into some of these puzzles as you play them.
            <br /><br />
            I did not look up how &ldquo;Big Sudoku&ldquo; does it, nor have I sourced anyone else&apos;s work. All my puzzles are home-grown in my own personal vacuum, and hosted entirely by me. And here I am. I&apos;m still striving for generating the perfect puzzle, but in the meantime, there&apos;s no reason you can&apos;t play along with me during this unexpectedly fascinating journey.
            <br /><br />
            I have some <a className="text-[#6096B4]" href="https://www.youtube.com/@vanillasudoku" target="_blank">videos</a> you can watch that can explain things better than I could here.
            <br /><br />
            I hope to see you in a park, working a puzzle, under your favorite tree. Silencing your phone is encouraged but not required.
          </div>
        </div>
      </div>
    </main>
  );
}
