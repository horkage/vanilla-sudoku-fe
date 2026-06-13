#!/usr/bin/env node
/**
 * Post a puzzle to Bluesky WITH a proper link card (image thumbnail).
 *
 * Why this exists: Bluesky does NOT scrape OpenGraph tags the way Facebook/X/
 * LinkedIn do. The interactive composer calls Bluesky's CardyB service to build a
 * card, but the API does not — so an API post only shows a card if WE attach an
 * `app.bsky.embed.external` embed with our own uploaded thumbnail blob. This
 * script does exactly that, and is used both for local testing and from
 * .github/workflows/deploy-prod.yml (single source of truth).
 *
 * Usage:
 *   BLUESKY_APP_PASSWORD='xxxx-xxxx-xxxx-xxxx' \
 *     node scripts/post-to-bluesky.mjs --difficulty=hard --id=0002 [--dry-run]
 *
 * Env:
 *   BLUESKY_APP_PASSWORD  (required)  app password from Bluesky settings
 *   BLUESKY_HANDLE        (optional)  defaults to vanillasudoku.bsky.social
 *   BLUESKY_PDS           (optional)  defaults to https://bsky.social
 *
 * --dry-run authenticates and uploads the image blob (harmless; unreferenced
 * blobs are garbage-collected) but does NOT create the post. It prints the exact
 * record that would be sent. Use it to confirm everything before posting for real.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_ORIGIN = 'https://vanilla-sudoku.com';

function arg(name, fallback = null) {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : fallback;
}
const hasFlag = (name) => process.argv.slice(2).includes(`--${name}`);

const difficulty = arg('difficulty');
const puzzleId = arg('id');
const dryRun = hasFlag('dry-run');
const handle = process.env.BLUESKY_HANDLE || 'vanillasudoku.bsky.social';
const password = process.env.BLUESKY_APP_PASSWORD;
const pds = process.env.BLUESKY_PDS || 'https://bsky.social';

function die(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

if (!difficulty || !puzzleId) die('Need --difficulty=<easy|medium|hard> and --id=<NNNN>');
if (!password) die('BLUESKY_APP_PASSWORD env var is required (do not paste it on the command line history if avoidable)');

// ── Resolve assets ────────────────────────────────────────────────────────────
const cardPath = path.join(PROJECT_ROOT, 'public', 'social', difficulty, `${puzzleId}.png`);
if (!fs.existsSync(cardPath)) {
  // Skip rather than fail: a missing card must never turn a deploy red. The page
  // still falls back to its bare-grid preview image; post the card next time.
  console.warn(`⚠️  Card image not found: ${cardPath} — skipping Bluesky post (nothing to attach).`);
  process.exit(0);
}

const difficultyCap = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
const displayNum = String(parseInt(puzzleId, 10)); // strip leading zeros for display only
const puzzleUrl = `${SITE_ORIGIN}/puzzles/${difficulty}/puzzle/${puzzleId}`;

// Card title/description come from the puzzle metadata (same source the OG tags use),
// falling back to sensible defaults if there's no metadata file yet.
let title = `Play ${difficultyCap} Sudoku Puzzle ${puzzleId}`;
let description = `Play ${difficultyCap} Sudoku Puzzle ${puzzleId} on Vanilla Sudoku.`;
const metaPath = path.join(PROJECT_ROOT, 'puzzle-data', difficulty, `${puzzleId}.metadata.json`);
if (fs.existsSync(metaPath)) {
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    if (meta.title) title = meta.title;
    if (meta.description) description = meta.description;
  } catch {
    console.warn(`⚠️  Could not parse ${metaPath}; using default title/description`);
  }
}

// ── Post text + facets (clickable link + tappable hashtags) ─────────────────────
const text =
  `Fresh puzzle from Vanilla Sudoku! 🧩 #${displayNum} (${difficultyCap}) - can you solve it? ` +
  `${puzzleUrl} #Sudoku #LogicPuzzle`;

// Facets are indexed by UTF-8 BYTE offsets, so locate substrings by byte length.
function byteFacet(sub, feature, fromChar = 0) {
  const at = text.indexOf(sub, fromChar);
  if (at < 0) return { facet: null, nextChar: fromChar };
  const byteStart = Buffer.byteLength(text.slice(0, at), 'utf8');
  const byteEnd = byteStart + Buffer.byteLength(sub, 'utf8');
  return {
    facet: { index: { byteStart, byteEnd }, features: [feature] },
    nextChar: at + sub.length,
  };
}

const facets = [];
const link = byteFacet(puzzleUrl, { $type: 'app.bsky.richtext.facet#link', uri: puzzleUrl });
if (link.facet) facets.push(link.facet);
const sudoku = byteFacet('#Sudoku', { $type: 'app.bsky.richtext.facet#tag', tag: 'Sudoku' }, link.nextChar);
if (sudoku.facet) facets.push(sudoku.facet);
const logic = byteFacet('#LogicPuzzle', { $type: 'app.bsky.richtext.facet#tag', tag: 'LogicPuzzle' }, sudoku.nextChar);
if (logic.facet) facets.push(logic.facet);

// ── Bluesky API helpers ─────────────────────────────────────────────────────────
async function xrpc(method, body, { token, contentType = 'application/json', auth = true } = {}) {
  const headers = { 'Content-Type': contentType };
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${pds}/xrpc/${method}`, {
    method: 'POST',
    headers,
    body: contentType === 'application/json' ? JSON.stringify(body) : body,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) die(`${method} failed (${res.status}): ${JSON.stringify(json)}`);
  return json;
}

// ── Run ───────────────────────────────────────────────────────────────────────
console.log(`→ Logging in as ${handle} …`);
const session = await xrpc(
  'com.atproto.server.createSession',
  { identifier: handle, password },
  { auth: false }
);
const { accessJwt, did } = session;
if (!accessJwt) die('No access token returned from createSession');
console.log(`✓ Authenticated (did ${did})`);

console.log(`→ Uploading card image (${(fs.statSync(cardPath).size / 1024).toFixed(0)} KB) …`);
const imageBytes = fs.readFileSync(cardPath);
const uploaded = await xrpc('com.atproto.repo.uploadBlob', imageBytes, {
  token: accessJwt,
  contentType: 'image/png',
});
const thumb = uploaded.blob;
console.log(`✓ Blob uploaded (${thumb?.ref?.$link ?? 'ref?'})`);

const record = {
  $type: 'app.bsky.feed.post',
  text,
  facets,
  createdAt: new Date().toISOString(),
  embed: {
    $type: 'app.bsky.embed.external',
    external: { uri: puzzleUrl, title, description, thumb },
  },
};

if (dryRun) {
  console.log('\n--- DRY RUN: record that WOULD be posted ---');
  console.log(JSON.stringify(record, null, 2));
  console.log('\n✓ Dry run complete. No post was created. Re-run without --dry-run to post for real.');
  process.exit(0);
}

console.log('→ Creating post …');
const result = await xrpc(
  'com.atproto.repo.createRecord',
  { repo: did, collection: 'app.bsky.feed.post', record },
  { token: accessJwt }
);
const rkey = result.uri?.split('/').pop();
console.log(`✅ Posted to Bluesky: https://bsky.app/profile/${handle}/post/${rkey}`);
