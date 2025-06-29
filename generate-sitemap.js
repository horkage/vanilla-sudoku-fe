const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://vanilla-sudoku.com';
const PUZZLE_ROOT = path.join(__dirname, 'puzzle-data');
const OUTPUT_FILE = path.join(__dirname, 'public', 'sitemap.xml');

function getPuzzleUrls() {
  const urls = [];

  const difficulties = fs.readdirSync(PUZZLE_ROOT, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const difficulty of difficulties) {
    const dirPath = path.join(PUZZLE_ROOT, difficulty);
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      if (file.endsWith('.puzzle')) {
        const [id] = file.split('.');
        const url = `${BASE_URL}/puzzles/${difficulty}/puzzle/${id}`;
        urls.push(url);
      }
    }
  }

  return urls;
}

function getStaticUrls() {
  return [
    '/',
    '/about',
    '/videos',
    '/puzzles/easy',
    '/puzzles/medium',
    '/puzzles/hard',
  ].map(path => `${BASE_URL}${path}`);
}

function generateSitemapXml(urls) {
  const timestamp = new Date().toISOString();

  const urlset = urls.map(url => `
    <url>
      <loc>${url}</loc>
      <lastmod>${timestamp}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlset}
  </urlset>`;
}

function writeSitemap() {
  const dynamicUrls = getPuzzleUrls();
  const staticUrls = getStaticUrls();
  const allUrls = [...staticUrls, ...dynamicUrls];

  const xml = generateSitemapXml(allUrls);

  fs.writeFileSync(OUTPUT_FILE, xml.trim());
  console.log(`✅ Sitemap written to ${OUTPUT_FILE}`);
}

writeSitemap();

