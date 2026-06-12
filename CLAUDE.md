# Project Overview

The name of the project is Vanilla Sudoku.

A clean, traditional Sudoku experience built to make puzzles feel **approachable for anyone at any skill level**, using a blend of **digital minimalism** and **natural puzzle progression**. Puzzles have accompanying walkthrough videos to help approachability of the game to everyone.

This is the front-end client for *Vanilla Sudoku*, designed with a focus on simplicity, responsiveness, and intuitive gameplay, with a tight focus on mobile device UI/UX.

[Live Demo →](https://vanilla-sudoku.com)
[GitHub Repo →](https://github.com/horkage/vanilla-sudoku-fe)
[YouTube Walkthroughs →](https://www.youtube.com/channel/UCW9YYOpYh2W_HXqvHjG0l0A)

Vanilla Sudoku is not for hard-core sudoku players that spam hints and stare at a grid full of tiny numbers looking for arcane patterns to emerge. Vanilla Sudoku is all about showing people how I naturally discovered patterns within the puzzles.

---

## Tech Stack

- [Next.js 15 App Router](https://nextjs.org/docs/app) (check `package.json` for exact version)
- React 19, TypeScript, Tailwind CSS 4
- The linux filesystem is the "database" — puzzles are flat files in `puzzle-data/`, no DB
- A local offline puzzle-generating toolchain (`tools/`)
- AWS EC2 and Route53; GitHub Actions for deploys and puzzle promotion
- Playwright (dev dep) for generating puzzle preview screenshots
- WSL; we work in a linux terminal but we're on a windows host for Chrome

---

## Repo Map

- `src/app/` — Next.js App Router pages: `/` (home), `/puzzles/[difficulty]/puzzle/[puzzleId]` (play a puzzle), `/create`, `/custom` (shared-URL puzzles), `/videos`, `/about`
- `src/components/` — six components; `SudokuPlayer.tsx` is the big one (~460 lines, all gameplay state), `SudokuGrid.tsx` renders the grid, plus `NumberPad`, `HintPad`, `CreateGrid`, `Header`
- `src/utils/gameStateCodec.js` — the URL codec for sharable puzzle states
- `puzzle-data/{easy,medium,hard}/` — live puzzles served by the site (see file format below)
- `tools/` — the puzzle generator pipeline; **read `tools/PUZZLE_GENERATOR.md` first**, it documents the whole pipeline (generate → solve-validate → post-process). Note: `tools/` is gitignored **by design** — the generator is intentionally not open-source (the owner backs it up separately). Don't suggest committing it; just remember `git show`/history won't work there, so keep a copy in context before rewriting files
- `tools/solveAll.js` — verification + calibration harness: solves every live puzzle in `puzzle-data/` against its known solution and grades it (`node tools/solveAll.js`)
- `tools/difficultyGrader.js` — grades a puzzle by the lowest technique tier that can solve it (1=basic scans, 2=pointing pairs, 3=naked pairs, 4=x-wings), plus passes and clue count
- `tools/algo/` — solver technique modules (`step01BoxScan` … `step08XWingCols`); the solver doubles as the difficulty validator
- `.github/workflows/` — `deploy-prod.yml` (push to main → deploy to EC2), `deploy-dev.yml`, `promote-puzzle.yml`, `reject-puzzle.yml`

## Puzzle Data Format

Each puzzle in `puzzle-data/{difficulty}/` is a set of files sharing a zero-padded 4-digit ID:

- `NNNN.puzzle` — the starting grid (with blanks)
- `NNNN.grid` — the completed solution grid
- `NNNN.metadata.json` — optional; page title/description, `videoUrl` (YouTube walkthrough), social `image` path
- `NNNN.youtube` — optional; walkthrough video reference

## Puzzle Candidate Workflow

New puzzles flow through a single-slot candidate system on the `candidate` branch:

1. Generate candidates locally: `npm run generate:candidates`
2. Promising puzzle goes to `puzzle-data/candidate/` as ID `001`, committed to the `candidate` branch
3. Test it at `dev.vanilla-sudoku.com:3000/puzzles/candidate/puzzle/001`
4. Promote via the `promote-puzzle.yml` GitHub Action (manual dispatch, pick difficulty) — it finds the next free ID on `main` for that difficulty and commits the files there
5. Or reject via `reject-puzzle.yml`, which clears the candidate slot

Branches: `main` (production), `candidate` (puzzle staging), `custom` (legacy/feature).

## Common Commands

- `npm run dev` — local dev server
- `npm run build` — production build (good sanity check before pushing)
- `npm run generate:candidates` — run the generator pipeline (`tools/pipelineRunner.js`, batch of 500, digs toward medium by default); add `-- --target=easy|medium|hard` to aim the difficulty
- `npm run generate:candidates:quick` — 1 puzzle, batch of 100, skips post-processing
- `npm run generate:screenshots` — regenerate puzzle preview images (Playwright)
- `npm run generate:sitemap` — regenerate sitemap
- `npm run deploy` — manual deploy via `deploy.sh` (scp to EC2); normally just push to `main` and let `deploy-prod.yml` do it

## Narration Mode

- If, for whatever reason, you'd like to use the Narration Tool, access it by hitting "n" on your keyboard. This drops you into Narration Mode and other keyboard inputs become available. "b", "r", and "c" change highlight mode to Box, Row, and Column respectively. The arrow keys work as you'd expect, left/right/up/down to move the box/row/column highlight. Narration Mode also allows right-click to place red Xs on the grid. In addition to this, it allows you to highlight any number with a left-mouse click - either numbers you have placed or original number clues. Narration Mode also works on all shared/custom puzzles.

---

## Additional And Historical Context

The human spent a couple of years building all of this and deploying it in a reasonable state of completion. The human tried making higher quality puzzles with higher difficulties but couldn't quite do it well enough and gave up. You will see evidence of this in the "tools" directory. One example is an attempt to "seed" puzzles with a specific technique to solve. The human has over 25 years of experience in the open source linux ecosystem. But they only have generalized broad knowledge and their age is making it harder to pick up or follow concepts quickly. So please be patient with the human. They are old and very tired. The human is going to need your help in reminding them how their own project works.

## Overall Goals

1. To significantly boost the overall quality of puzzles
2. To significantly boost the quality of the UI/UX of the website. (ambiguous for now, we'll work through this together over time, and may mostly come from Claude Design - not sure yet)
3. BONUS: To get the puzzle generator to generate high-quality puzzles targeting a specified difficulty. (also ambiguous, we'll work through what this means over time)
