#!/usr/bin/env node
/**
 * Generate social/OG card image(s) by screenshotting the in-app
 * /social-card/<difficulty>/<id> route into public/social/<difficulty>/<id>.png.
 *
 * Tracked (unlike tools/generateSocialCards.js) so it can run in CI — the promote
 * workflow calls it so a freshly promoted puzzle gets its card automatically.
 *
 * Usage:
 *   node scripts/generate-social-card.mjs                       # all puzzles
 *   node scripts/generate-social-card.mjs --difficulty=hard --id=0002
 *
 * Env:
 *   BASE_URL  (optional)  defaults to http://localhost:3000
 *
 * Requires a running server (npm run dev) and Playwright's chromium installed.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUZZLE_DATA_DIR = path.join(PROJECT_ROOT, 'puzzle-data');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public', 'social');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const arg = (name) => {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : null;
};
const targetDifficulty = arg('difficulty');
const targetId = arg('id');

function getPuzzleList() {
  const difficulties = targetDifficulty ? [targetDifficulty] : ['easy', 'medium', 'hard'];
  const puzzles = [];
  for (const difficulty of difficulties) {
    const dir = path.join(PUZZLE_DATA_DIR, difficulty);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.puzzle')) continue;
      const id = file.replace('.puzzle', '');
      if (targetId && id !== targetId) continue;
      puzzles.push({ difficulty, id });
    }
  }
  return puzzles;
}

async function screenshotCard(page, difficulty, id) {
  const url = `${BASE_URL}/social-card/${difficulty}/${id}`;
  const outDir = path.join(OUTPUT_DIR, difficulty);
  fs.mkdirSync(outDir, { recursive: true });
  const outputPath = path.join(outDir, `${id}.png`);

  console.log(`  → ${url}`);
  // Generous timeouts: a cold dev server compiles the route on first hit (slow in CI).
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const card = await page.waitForSelector('#og-card', { timeout: 60000 });
  await page.waitForTimeout(500); // let the template image + fonts settle
  await card.screenshot({ path: outputPath });
  console.log(`  ✅ ${outputPath}`);
}

async function run() {
  const puzzles = getPuzzleList();
  if (puzzles.length === 0) {
    console.error('No puzzles found to process.');
    process.exit(1);
  }
  console.log(`Generating ${puzzles.length} social card(s) from ${BASE_URL}\n`);

  // Ensure the server is up before launching a browser.
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`status ${res.status}`);
  } catch (e) {
    console.error(`❌ Server not reachable at ${BASE_URL} (${e.message}). Start it with: npm run dev`);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  let ok = 0;
  let fail = 0;
  for (const { difficulty, id } of puzzles) {
    try {
      await screenshotCard(page, difficulty, id);
      ok++;
    } catch (e) {
      console.error(`  ❌ ${difficulty}/${id}: ${e.message}`);
      fail++;
    }
  }
  await browser.close();

  console.log(`\nDone. ✅ ${ok}  ❌ ${fail}  (of ${puzzles.length})`);
  if (fail > 0) process.exit(1);
}

run().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
