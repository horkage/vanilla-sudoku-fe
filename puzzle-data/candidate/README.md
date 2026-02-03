# Candidate Puzzles

This directory contains unvetted puzzles awaiting review.

## Workflow
1. Generate puzzle files (`.grid` and `.puzzle`) and place them here with sequential IDs (001, 002, etc.)
2. Commit and push to `candidate` branch → auto-deploys to dev environment
3. Play puzzle at `dev.vanilla-sudoku.com:3000/puzzles/candidate/puzzle/{id}`
4. Use GitHub Actions to either:
   - **Promote** to production (easy/medium/hard)
   - **Reject** and delete from candidates

## File Naming
- `001.grid` - Completed solution grid
- `001.puzzle` - Starting puzzle (with zeros for empty cells)
- Optional: `001.metadata.json` - Custom metadata (title, description, etc.)
