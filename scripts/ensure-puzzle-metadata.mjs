#!/usr/bin/env node
/**
 * Ensure a puzzle's metadata.json exists and points its OG image at the social card.
 *
 * - If puzzle-data/<difficulty>/<id>.metadata.json is missing, create it with the
 *   uniform title/description and the correct image path.
 * - If it already exists, leave title/description/videoUrl alone but make sure the
 *   "image" field points at /social/<difficulty>/<id>.png.
 *
 * No browser needed. Used by the promote workflow and runnable locally.
 *
 * Usage: node scripts/ensure-puzzle-metadata.mjs --difficulty=hard --id=0002
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const arg = (name) => {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : null;
};
const difficulty = arg('difficulty');
const id = arg('id');
if (!difficulty || !id) {
  console.error('Need --difficulty=<easy|medium|hard> and --id=<NNNN>');
  process.exit(1);
}

const difficultyCap = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
const imagePath = `/social/${difficulty}/${id}.png`;
const metaPath = path.join(PROJECT_ROOT, 'puzzle-data', difficulty, `${id}.metadata.json`);

let meta;
let action;
if (fs.existsSync(metaPath)) {
  meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  action = meta.image === imagePath ? 'unchanged' : 'updated image on';
  meta.image = imagePath;
} else {
  meta = {
    title: `Play ${difficultyCap} Sudoku Puzzle ${id}`,
    description: `Play this ${difficulty} sudoku puzzle on Vanilla Sudoku — a clean, traditional puzzle that stays approachable at any skill level.`,
    image: imagePath,
  };
  action = 'created';
}

fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
console.log(`✅ ${action} ${path.relative(PROJECT_ROOT, metaPath)} (image: ${imagePath})`);
