import { chromium } from 'playwright';

const BASE = 'http://localhost:4321';
const results = [];

function log(tool, test, pass, detail = '') {
  const icon = pass ? '✓' : '✗';
  results.push({ tool, test, pass, detail });
  console.log(`  ${icon} ${test}${detail ? ' — ' + detail : ''}`);
}

async function testCsvToJson(page) {
  console.log('\n[CSV to JSON]');
  await page.goto(`${BASE}/tools/csv-to-json`);
  await page.waitForSelector('textarea');
  await page.click('text=Load sample');
  await page.waitForTimeout(300);
  const output = await page.locator('pre').textContent();
  log('CSV→JSON', 'sample loads', !!output);
  log('CSV→JSON', 'output is valid JSON', (() => { try { JSON.parse(output); return true; } catch { return false; } })());
  log('CSV→JSON', 'contains expected key', output.includes('"name"'));

  // test error state
  await page.locator('textarea').fill('bad,csv\n1,2,3');
  await page.waitForTimeout(300);
  const err = await page.locator('.bg-red-50').isVisible();
  log('CSV→JSON', 'shows error for mismatched columns', err);
}

async function testJsonFormatter(page) {
  console.log('\n[JSON Formatter]');
  await page.goto(`${BASE}/tools/json-formatter`);
  await page.waitForSelector('textarea');
  await page.locator('textarea').fill('{"b":2,"a":1}');
  await page.getByRole('button', { name: 'Format' }).click();
  await page.waitForTimeout(300);
  const output = await page.locator('pre').textContent();
  log('JSON Formatter', 'formats output', output.includes('\n'));
  log('JSON Formatter', 'valid JSON output', (() => { try { JSON.parse(output); return true; } catch { return false; } })());

  await page.getByRole('button', { name: 'Minify' }).click();
  await page.waitForTimeout(300);
  const minified = await page.locator('pre').textContent();
  const isCompact = !minified.includes('\n') && (() => { try { JSON.parse(minified); return true; } catch { return false; } })();
  log('JSON Formatter', 'minifies (compact valid JSON)', isCompact, minified.substring(0, 40));

  // invalid JSON
  await page.locator('textarea').fill('{bad json}');
  await page.waitForTimeout(300);
  const err = await page.locator('.bg-red-50').isVisible();
  log('JSON Formatter', 'shows error for invalid JSON', err);
}

async function testBase64(page) {
  console.log('\n[Base64]');
  await page.goto(`${BASE}/tools/base64`);
  await page.waitForSelector('textarea');
  const textareas = page.locator('textarea');
  await textareas.first().fill('Hello, World!');
  await page.waitForTimeout(300);
  const encoded = await textareas.nth(1).inputValue();
  log('Base64', 'encodes text', encoded === 'SGVsbG8sIFdvcmxkIQ==', encoded);

  // decode direction
  await textareas.first().fill('');
  await textareas.nth(1).fill('SGVsbG8sIFdvcmxkIQ==');
  await page.waitForTimeout(300);
  const decoded = await textareas.first().inputValue();
  log('Base64', 'decodes base64', decoded === 'Hello, World!', decoded);

  // invalid base64
  await textareas.nth(1).fill('!!!invalid!!!');
  await page.waitForTimeout(300);
  const err = await page.locator('.bg-red-50').isVisible();
  log('Base64', 'shows error for invalid base64', err);
}

async function testCharCounter(page) {
  console.log('\n[Character Counter]');
  await page.goto(`${BASE}/tools/character-counter`);
  await page.waitForSelector('textarea');
  await page.locator('textarea').fill('Hello World');
  await page.waitForTimeout(300);
  const cards = page.locator('.text-indigo-600.text-2xl');
  const charCount = await cards.first().textContent();
  log('Char Counter', 'counts characters', charCount === '11', `got "${charCount}"`);
  const wordCount = await cards.nth(2).textContent();
  log('Char Counter', 'counts words', wordCount === '2', `got "${wordCount}"`);

  // over-limit check
  await page.locator('textarea').fill('x'.repeat(290));
  await page.waitForTimeout(300);
  const overText = await page.locator('text=over').first().isVisible();
  log('Char Counter', 'flags Twitter over-limit', overText);
}

async function testTextCase(page) {
  console.log('\n[Text Case Converter]');
  await page.goto(`${BASE}/tools/text-case`);
  await page.waitForSelector('textarea');
  await page.locator('textarea').fill('hello world foo');
  await page.waitForTimeout(300);

  const cases = [
    { btn: 'camelCase',    expected: 'helloWorldFoo' },
    { btn: 'PascalCase',   expected: 'HelloWorldFoo' },
    { btn: 'snake_case',   expected: 'hello_world_foo' },
    { btn: 'kebab-case',   expected: 'hello-world-foo' },
    { btn: 'UPPERCASE',    expected: 'HELLO WORLD FOO' },
  ];

  for (const { btn, expected } of cases) {
    await page.getByRole('button', { name: btn, exact: true }).click();
    await page.waitForTimeout(300);
    const resultEl = page.locator('div.font-mono');
    const result = await resultEl.last().textContent();
    log('Text Case', btn, result?.trim() === expected, `"${result?.trim()}" expected "${expected}"`);
  }
}

async function testSlugGenerator(page) {
  console.log('\n[Slug Generator]');
  await page.goto(`${BASE}/tools/slug-generator`);
  await page.waitForSelector('input[type="text"]');
  await page.locator('input[type="text"]').fill('Hello World! This is a Test.');
  await page.waitForTimeout(200);
  const slug = await page.locator('.font-mono.text-indigo-700').textContent();
  log('Slug', 'basic slug', slug?.trim() === 'hello-world-this-is-a-test', `got "${slug?.trim()}"`);

  // underscore separator
  await page.click('text=underscore');
  await page.waitForTimeout(200);
  const slugUnder = await page.locator('.font-mono.text-indigo-700').textContent();
  log('Slug', 'underscore separator', slugUnder?.trim() === 'hello_world_this_is_a_test', `got "${slugUnder?.trim()}"`);
}

async function testLineSorter(page) {
  console.log('\n[Line Sorter]');
  await page.goto(`${BASE}/tools/line-sorter`);
  await page.waitForSelector('textarea');
  await page.locator('textarea').first().fill('banana\napple\ncherry\napple');
  await page.waitForTimeout(200);

  // Sort A→Z on original: banana,apple,cherry,apple → apple,apple,banana,cherry
  await page.getByRole('button', { name: 'Sort A → Z' }).click();
  await page.waitForTimeout(300);
  const sorted = await page.locator('textarea').nth(1).inputValue();
  log('Line Sorter', 'sorts A→Z', sorted.startsWith('apple'), `got "${sorted.split('\n')[0]}"`);

  // Remove duplicates chains on sorted output: apple,apple,banana,cherry → apple,banana,cherry
  await page.getByRole('button', { name: 'Remove duplicates' }).click();
  await page.waitForTimeout(300);
  const deduped = await page.locator('textarea').nth(1).inputValue();
  const dedupedLines = deduped.split('\n');
  log('Line Sorter', 'removes duplicates (chained)', dedupedLines.length === 3, `${dedupedLines.length} lines`);

  // Reverse chains on deduped: apple,banana,cherry → cherry,banana,apple
  await page.getByRole('button', { name: 'Reverse' }).click();
  await page.waitForTimeout(300);
  const reversed = await page.locator('textarea').nth(1).inputValue();
  log('Line Sorter', 'reverses (chained)', reversed.split('\n')[0] === 'cherry', `got "${reversed.split('\n')[0]}"`);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(8000);

  await testCsvToJson(page);
  await testJsonFormatter(page);
  await testBase64(page);
  await testCharCounter(page);
  await testTextCase(page);
  await testSlugGenerator(page);
  await testLineSorter(page);

  await browser.close();

  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  console.log(`\n${'─'.repeat(40)}`);
  console.log(`${passed} passed  ${failed} failed  (${results.length} total)`);
  if (failed > 0) {
    console.log('\nFailed:');
    results.filter(r => !r.pass).forEach(r => console.log(`  ✗ [${r.tool}] ${r.test} ${r.detail}`));
    process.exit(1);
  }
})();
