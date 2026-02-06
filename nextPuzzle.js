#!/usr/bin/env node

/**
 * Next Puzzle Script
 * 
 * Intelligently fills the candidate slot (001) with the next puzzle:
 * 1. Check if slot 001 is already occupied
 * 2. Try to pull from backlog (tools/output/solved/)
 * 3. If backlog empty, run generator to create new puzzles
 * 4. Auto-commit and push to trigger dev deployment
 * 
 * Usage: npm run next-puzzle
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TOOLS_DIR = path.join(__dirname, 'tools');
const PROJECT_ROOT = __dirname;
const CANDIDATE_DIR = path.join(PROJECT_ROOT, 'puzzle-data', 'candidate');
const BACKLOG_DIR = path.join(TOOLS_DIR, 'output', 'solved');

console.log('Next Puzzle Script');
console.log('==================\n');

// Check if slot is occupied
const slotOccupied = fs.existsSync(path.join(CANDIDATE_DIR, '001.puzzle'));

if (slotOccupied) {
  console.log('Slot 001 is currently occupied.');
  console.log('Please promote or reject the current candidate first:');
  console.log('  View: http://dev.vanilla-sudoku.com:3000/puzzles/candidate/puzzle/1');
  console.log('  GitHub Actions: https://github.com/horkage/vanilla-sudoku-fe/actions\n');
  process.exit(0);
}

console.log('Slot 001 is available!\n');

// Check backlog
let backlogPuzzles = [];
if (fs.existsSync(BACKLOG_DIR)) {
  backlogPuzzles = fs.readdirSync(BACKLOG_DIR)
    .filter(f => f.endsWith('.puzzle'))
    .sort();
}

if (backlogPuzzles.length > 0) {
  console.log('Found ' + backlogPuzzles.length + ' puzzle(s) in backlog');
  console.log('Pulling from backlog...\n');
  
  // Copy first puzzle from backlog to slot 001
  const puzzleFile = backlogPuzzles[0];
  const baseName = puzzleFile.replace('.puzzle', '');
  
  const puzzleSrc = path.join(BACKLOG_DIR, puzzleFile);
  const gridSrc = path.join(BACKLOG_DIR, baseName + '.grid');
  
  const puzzleDest = path.join(CANDIDATE_DIR, '001.puzzle');
  const gridDest = path.join(CANDIDATE_DIR, '001.grid');
  
  if (!fs.existsSync(CANDIDATE_DIR)) {
    fs.mkdirSync(CANDIDATE_DIR, { recursive: true });
  }
  
  fs.copyFileSync(puzzleSrc, puzzleDest);
  fs.copyFileSync(gridSrc, gridDest);
  
  // Remove from backlog
  fs.unlinkSync(puzzleSrc);
  fs.unlinkSync(gridSrc);
  
  console.log('Staged puzzle from backlog to slot 001');
} else {
  console.log('No puzzles in backlog, running generator...\n');
  
  try {
    execSync('npm run generate:candidates:quick', {
      cwd: PROJECT_ROOT,
      stdio: 'inherit'
    });
  } catch (error) {
    console.error('\nFailed to generate puzzle');
    process.exit(1);
  }
}

// Check if we successfully got a puzzle
if (!fs.existsSync(path.join(CANDIDATE_DIR, '001.puzzle'))) {
  console.error('\nFailed to fill slot 001');
  process.exit(1);
}

// Auto-commit and push
console.log('\nCommitting and pushing to candidate branch...');
try {
  execSync('git add puzzle-data/candidate/', { cwd: PROJECT_ROOT, stdio: 'inherit' });
  execSync('git commit -m "Add next candidate puzzle to slot 001"', { cwd: PROJECT_ROOT, stdio: 'inherit' });
  execSync('git push', { cwd: PROJECT_ROOT, stdio: 'inherit' });
  
  console.log('\nSuccess! Candidate deployed to dev');
  console.log('Test at: http://dev.vanilla-sudoku.com:3000/puzzles/candidate/puzzle/1\n');
} catch (error) {
  console.error('\nFailed to commit/push');
  console.error('You may need to manually commit and push the changes');
  process.exit(1);
}
