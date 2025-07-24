# Vanilla Sudoku Front-End

A clean, traditional Sudoku experience built to make puzzles feel **approachable for anyone at any skill level**, using a blend of **digital minimalism** and **natural puzzle progression**. Puzzles have accompanying walkthrough videos to help approachability of the game to everyone.

This is the front-end client for *Vanilla Sudoku*, designed with a focus on simplicity, responsiveness, and intuitive gameplay, with a tight focus on mobile device UI/UX.

[Live Demo →](https://vanilla-sudoku.com)
[GitHub Repo →](https://github.com/horkage/vanilla-sudoku-fe)
[YouTube Walkthroughs →](https://www.youtube.com/channel/UCW9YYOpYh2W_HXqvHjG0l0A)

---

## Features

- **Minimal UI** puzzle input can work entirely with a keyboard or without, or even both should you like
- **Responsive layout** tuned for mobile and desktop
- **Narration tool** for highlighting logic during solving (not advertized, but it is there)
- **Sharable puzzle states** via custom URL codec
- Built with a focus on **visual clarity** and **natural play flow**

## Narration Mode
- If, for whatever reason, you'd like to use the Narration Tool, access it by hitting "n" on your keyboard. This drops you into Narration Mode and other keyboard inputs become available. "b", "r", and "c" change highlight mode to Box, Row, and Column respectively. The arrow keys work as you'd expect, left/right/up/down to move the box/row/colum highlight. Narration Mode also allows right-click to place red Xs on the grid. In addition to this, it allows you to highlight any number with a left-mouse click - either numbers you have placed or original number clues. Narration Mode also works on all shared/custom puzzles.

---

## Tech Stack

- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Author
Michael Wood
GitHub: @horkage

---

License
This project is open source under the MIT License.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/horkage/vanilla-sudoku-fe.git

# Navigate into the project folder
cd vanilla-sudoku-fe

# Install dependencies
npm install

# Start the dev server
npm run dev

