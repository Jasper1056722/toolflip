// Smoke test for the 7 new tools against a running preview server.
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4321';
let failures = 0;

function log(test, pass, detail = '') {
  if (!pass) failures++;
  console.log(`  ${pass ? '✓' : '✗'} ${test}${detail ? ' — ' + detail : ''}`);
}

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', err => console.log('  [pageerror]', err.message));

// YAML to JSON
console.log('\n[YAML to JSON]');
await page.goto(`${BASE}/tools/yaml-to-json`);
await page.click('text=Load sample');
await page.waitForTimeout(300);
const yamlOut = await page.locator('pre').first().textContent();
log('sample converts to valid JSON', (() => { try { return JSON.parse(yamlOut).server.port === 8080; } catch { return false; } })());
await page.locator('textarea').fill('a: [1, 2');
await page.waitForTimeout(300);
log('shows error for invalid YAML', await page.locator('.bg-red-50').isVisible());

// CSS Gradient
console.log('\n[CSS Gradient]');
await page.goto(`${BASE}/tools/css-gradient`);
const gradCss = await page.locator('pre').first().textContent();
log('outputs linear-gradient CSS', gradCss.includes('linear-gradient(90deg'));
await page.click('button:has-text("radial")');
const radialCss = await page.locator('pre').first().textContent();
log('switches to radial', radialCss.includes('radial-gradient(circle'));
await page.click('text=+ Add stop');
const threeStops = await page.locator('pre').first().textContent();
log('add stop appears in CSS', (threeStops.match(/#[0-9a-f]{6}/g) || []).length === 3);

// Box Shadow
console.log('\n[Box Shadow]');
await page.goto(`${BASE}/tools/box-shadow`);
const shadowCss = await page.locator('pre').first().textContent();
log('outputs box-shadow CSS', shadowCss.includes('box-shadow:') && shadowCss.includes('rgba('));
await page.locator('input[type="checkbox"]').check();
const insetCss = await page.locator('pre').first().textContent();
log('inset toggle works', insetCss.includes('inset'));

// Color Contrast
console.log('\n[Color Contrast]');
await page.goto(`${BASE}/tools/color-contrast`);
const ratio = await page.locator('.text-4xl').textContent();
log('shows contrast ratio', /\d+(\.\d+)?:1/.test(ratio));
log('default colors pass AA', (await page.locator('text=✓ Pass').count()) >= 2);
const fgText = page.locator('input[type="text"]').first();
await fgText.fill('#f8fafc');
await page.waitForTimeout(200);
const lowRatio = await page.locator('.text-4xl').textContent();
log('same fg/bg gives 1:1', lowRatio.trim() === '1:1', lowRatio.trim());

// SVG Optimizer
console.log('\n[SVG Optimizer]');
await page.goto(`${BASE}/tools/svg-optimizer`);
const fatSvg = `<?xml version="1.0"?><!-- comment --><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
  <title>junk</title>
  <rect width="10" height="10" fill="red"/>
</svg>`;
await page.locator('textarea').fill(fatSvg);
await page.waitForTimeout(300);
const optimized = await page.locator('pre').first().textContent();
log('removes comments and title', !optimized.includes('comment') && !optimized.includes('junk'));
log('keeps rect element', optimized.includes('<rect'));
log('shows savings badge', await page.locator('text=/−\\d+%/').isVisible());

// SVG to PNG
console.log('\n[SVG to PNG]');
await page.goto(`${BASE}/tools/svg-to-png`);
await page.locator('textarea').fill('<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><circle cx="25" cy="25" r="20" fill="blue"/></svg>');
await page.click('text=Convert to PNG');
await page.waitForSelector('img[alt="PNG result"]', { timeout: 5000 });
log('renders PNG result', true);
log('shows scaled dimensions (2x default)', (await page.locator('text=100 × 100 px').count()) === 1);

// Favicon Generator
console.log('\n[Favicon Generator]');
await page.goto(`${BASE}/tools/favicon-generator`);
const svgBuffer = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="green"/></svg>');
await page.locator('input[type="file"]').setInputFiles({ name: 'icon.svg', mimeType: 'image/svg+xml', buffer: svgBuffer });
// note: plain text=favicon.ico would match the FAQ copy, so wait for the download link itself
await page.waitForSelector('a[download="favicon.ico"]', { timeout: 5000 });
log('generates favicon.ico entry', true);
const dlCount = await page.locator('a[download]').count();
log('generates all PNG sizes', dlCount === 7, `got ${dlCount} download links`);

// Homepage: no more coming soon
console.log('\n[Homepage]');
await page.goto(BASE);
log('no Coming soon badges left', (await page.locator('text=Coming soon').count()) === 0);
log('14 tool links', (await page.locator('a[href^="/tools/"]').count()) >= 14);
log('stats shows 14 tools', (await page.locator('text=14').count()) >= 1);

await browser.close();
console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
