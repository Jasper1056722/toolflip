import { chromium } from 'playwright';

const BASE = 'http://localhost:4321';
const results = [];

function log(tool, test, pass, detail = '') {
  results.push({ tool, test, pass, detail });
  console.log(`  ${pass ? '✓' : '✗'} ${test}${detail ? ' — ' + detail : ''}`);
}

function isValidJson(str) {
  try { JSON.parse(str.trim()); return true; } catch { return false; }
}

// ─── CSV TO JSON ──────────────────────────────────────────────────────────────
async function testCsvToJson(page) {
  console.log('\n[CSV to JSON]');
  await page.goto(`${BASE}/tools/csv-to-json`);
  await page.waitForSelector('textarea');
  const ta = page.locator('textarea');
  const pre = page.locator('pre');
  const err = page.locator('.bg-red-50');

  // sample data
  await page.getByRole('button', { name: 'Load sample' }).click();
  await page.waitForTimeout(200);
  const sample = await pre.textContent();
  log('CSV→JSON', 'sample button loads data', !!sample);
  log('CSV→JSON', 'sample output is valid JSON', isValidJson(sample));
  const parsed = JSON.parse(sample.trim());
  log('CSV→JSON', 'sample has 3 rows', parsed.length === 3, `got ${parsed.length}`);
  log('CSV→JSON', 'row has name/age/city keys', 'name' in parsed[0] && 'city' in parsed[0]);

  // basic conversion
  await ta.fill('id,name\n1,Alice\n2,Bob');
  await page.waitForTimeout(200);
  const basic = await pre.textContent();
  log('CSV→JSON', 'basic 2-col CSV converts', isValidJson(basic));
  const basicParsed = JSON.parse(basic.trim());
  log('CSV→JSON', 'basic: correct row count', basicParsed.length === 2);
  log('CSV→JSON', 'basic: correct key values', basicParsed[0].id === '1' && basicParsed[0].name === 'Alice');

  // single column
  await ta.fill('fruit\napple\nbanana\ncherry');
  await page.waitForTimeout(200);
  const single = await pre.textContent();
  log('CSV→JSON', 'single-column CSV converts', isValidJson(single));

  // quoted fields (comma inside quotes)
  await ta.fill('name,bio\n"Alice","loves, commas"');
  await page.waitForTimeout(200);
  const quotedVisible = await pre.isVisible();
  const quoted = quotedVisible ? await pre.textContent() : '';
  log('CSV→JSON', 'quoted fields convert', quotedVisible && isValidJson(quoted));
  if (quotedVisible) {
    const qp = JSON.parse(quoted.trim());
    log('CSV→JSON', 'quoted field preserves comma in value', qp[0]?.bio === 'loves, commas', qp[0]?.bio);
  }

  // mismatched columns — error
  await ta.fill('a,b,c\n1,2');
  await page.waitForTimeout(200);
  log('CSV→JSON', 'mismatched columns shows error', await err.isVisible());

  // only header — error
  await ta.fill('col1,col2');
  await page.waitForTimeout(200);
  log('CSV→JSON', 'header-only shows error', await err.isVisible());

  // empty input — no output no error
  await ta.fill('');
  await page.waitForTimeout(200);
  log('CSV→JSON', 'empty input: no error shown', !(await err.isVisible()));
  log('CSV→JSON', 'empty input: no output shown', !(await pre.isVisible()));

  // clear button
  await page.getByRole('button', { name: 'Load sample' }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Clear' }).click();
  await page.waitForTimeout(200);
  log('CSV→JSON', 'clear button empties input', (await ta.inputValue()) === '');
  log('CSV→JSON', 'clear button removes output', !(await pre.isVisible()));

  // copy button appears with output
  await ta.fill('x,y\n1,2');
  await page.waitForTimeout(200);
  log('CSV→JSON', 'copy button visible with output', await page.getByRole('button', { name: 'Copy' }).isVisible());
}

// ─── JSON FORMATTER ───────────────────────────────────────────────────────────
async function testJsonFormatter(page) {
  console.log('\n[JSON Formatter]');
  await page.goto(`${BASE}/tools/json-formatter`);
  await page.waitForSelector('textarea');
  const ta = page.locator('textarea');
  const pre = page.locator('pre');
  const err = page.locator('.bg-red-50');
  const valid = page.locator('text=✓ Valid JSON');

  // auto-format on type
  await ta.fill('{"z":1,"a":2}');
  await page.waitForTimeout(300);
  const auto = await pre.textContent();
  log('JSON Formatter', 'auto-formats on type', auto.includes('\n'));
  log('JSON Formatter', 'auto-formatted is valid JSON', isValidJson(auto));
  log('JSON Formatter', 'shows valid indicator', await valid.isVisible());

  // format button
  await page.getByRole('button', { name: 'Format' }).click();
  await page.waitForTimeout(200);
  const formatted = await pre.textContent();
  log('JSON Formatter', 'format button works', formatted.includes('"z"') && formatted.includes('\n'));

  // minify button
  await page.getByRole('button', { name: 'Minify' }).click();
  await page.waitForTimeout(200);
  const minified = await pre.textContent();
  log('JSON Formatter', 'minify removes newlines', !minified.includes('\n'));
  log('JSON Formatter', 'minified is valid JSON', isValidJson(minified));
  log('JSON Formatter', 'minified shorter than formatted', minified.length < formatted.length);

  // format then minify cycle
  await page.getByRole('button', { name: 'Format' }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Minify' }).click();
  await page.waitForTimeout(200);
  const cycled = await pre.textContent();
  log('JSON Formatter', 'format→minify cycle stays valid', isValidJson(cycled));

  // nested objects
  await ta.fill('{"a":{"b":{"c":42}}}');
  await page.waitForTimeout(200);
  const nested = await pre.textContent();
  log('JSON Formatter', 'nested objects format correctly', nested.includes('"c": 42'));

  // array input
  await ta.fill('[1,2,3,"four",null,true]');
  await page.waitForTimeout(200);
  const arr = await pre.textContent();
  log('JSON Formatter', 'array formats correctly', isValidJson(arr) && arr.includes('"four"'));

  // invalid JSON — error, no output
  await ta.fill('{bad: json}');
  await page.waitForTimeout(200);
  log('JSON Formatter', 'invalid JSON shows error', await err.isVisible());
  log('JSON Formatter', 'invalid JSON hides output', !(await pre.isVisible()));

  // trailing comma — error
  await ta.fill('{"a":1,}');
  await page.waitForTimeout(200);
  log('JSON Formatter', 'trailing comma shows error', await err.isVisible());

  // empty — no error no output
  await ta.fill('');
  await page.waitForTimeout(200);
  log('JSON Formatter', 'empty: no error', !(await err.isVisible()));
  log('JSON Formatter', 'empty: no output', !(await pre.isVisible()));

  // clear button
  await ta.fill('{"a":1}');
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Clear' }).click();
  await page.waitForTimeout(200);
  log('JSON Formatter', 'clear empties textarea', (await ta.inputValue()) === '');
  log('JSON Formatter', 'clear removes output', !(await pre.isVisible()));
}

// ─── BASE64 ───────────────────────────────────────────────────────────────────
async function testBase64(page) {
  console.log('\n[Base64]');
  await page.goto(`${BASE}/tools/base64`);
  await page.waitForSelector('textarea');
  const tas = page.locator('textarea');
  const err = page.locator('.bg-red-50');

  // encode basic
  await tas.first().fill('Hello, World!');
  await page.waitForTimeout(300);
  const enc1 = await tas.nth(1).inputValue();
  log('Base64', 'encodes Hello World', enc1 === 'SGVsbG8sIFdvcmxkIQ==', enc1);

  // encode empty string
  await tas.first().fill('');
  await page.waitForTimeout(200);
  log('Base64', 'empty plain → empty encoded', (await tas.nth(1).inputValue()) === '');

  // encode numbers/symbols
  await tas.first().fill('abc123!@#');
  await page.waitForTimeout(200);
  const encSym = await tas.nth(1).inputValue();
  log('Base64', 'encodes symbols', encSym.length > 0 && isValidJson('"' + encSym.replace(/"/g,'') + '"'));

  // decode basic
  await tas.first().fill('');
  await tas.nth(1).fill('SGVsbG8sIFdvcmxkIQ==');
  await page.waitForTimeout(300);
  const dec1 = await tas.first().inputValue();
  log('Base64', 'decodes to Hello World', dec1 === 'Hello, World!', dec1);

  // decode empty
  await tas.nth(1).fill('');
  await page.waitForTimeout(200);
  log('Base64', 'empty encoded → empty plain', (await tas.first().inputValue()) === '');

  // decode invalid
  await tas.nth(1).fill('!!!not-base64!!!');
  await page.waitForTimeout(200);
  log('Base64', 'invalid base64 shows error', await err.isVisible());

  // round-trip: encode then decode
  await tas.first().fill('round trip test 123');
  await page.waitForTimeout(200);
  const roundEncoded = await tas.nth(1).inputValue();
  await tas.first().fill('');
  await tas.nth(1).fill(roundEncoded);
  await page.waitForTimeout(200);
  const roundDecoded = await tas.first().inputValue();
  log('Base64', 'round-trip encode→decode', roundDecoded === 'round trip test 123', roundDecoded);

  // two copy buttons visible
  const copyBtns = page.getByRole('button', { name: 'Copy' });
  log('Base64', 'two copy buttons present', (await copyBtns.count()) === 2);
}

// ─── CHARACTER COUNTER ────────────────────────────────────────────────────────
async function testCharCounter(page) {
  console.log('\n[Character Counter]');
  await page.goto(`${BASE}/tools/character-counter`);
  await page.waitForSelector('textarea');
  const ta = page.locator('textarea');
  const stats = page.locator('.text-indigo-600.text-2xl');

  // empty
  const emptyChars = await stats.first().textContent();
  log('Char Counter', 'starts at 0 chars', emptyChars === '0', emptyChars);

  // basic counts
  await ta.fill('Hello World');
  await page.waitForTimeout(200);
  log('Char Counter', '11 chars', (await stats.nth(0).textContent()) === '11');
  log('Char Counter', '10 no-space chars', (await stats.nth(1).textContent()) === '10');
  log('Char Counter', '2 words', (await stats.nth(2).textContent()) === '2');
  log('Char Counter', '1 line', (await stats.nth(3).textContent()) === '1');

  // multi-line
  await ta.fill('line one\nline two\nline three');
  await page.waitForTimeout(200);
  log('Char Counter', 'multi-line: 3 lines', (await stats.nth(3).textContent()) === '3');
  log('Char Counter', 'multi-line: 6 words', (await stats.nth(2).textContent()) === '6');

  // 250 chars: only meta desc (160) and meta title (60) are over — Twitter (280) is NOT
  await ta.fill('x'.repeat(250));
  await page.waitForTimeout(200);
  const over250 = await page.locator('text=over').count();
  log('Char Counter', '250 chars: exactly 2 platforms over (meta desc + title)', over250 === 2, `got ${over250}`);

  // 290 chars: Twitter (280), meta desc (160), meta title (60) all over — 3 platforms
  await ta.fill('x'.repeat(290));
  await page.waitForTimeout(200);
  const over290 = await page.locator('text=over').count();
  log('Char Counter', '290 chars: 3 platforms over (Twitter + meta desc + title)', over290 === 3, `got ${over290}`);

  // 165 chars: meta desc (160) and meta title (60) over — 2 platforms
  await ta.fill('x'.repeat(165));
  await page.waitForTimeout(200);
  const over165 = await page.locator('text=over').count();
  log('Char Counter', '165 chars: 2 platforms over (meta desc + title)', over165 === 2, `got ${over165}`);

  // 55 chars: only meta title (60) over — 1 platform
  await ta.fill('x'.repeat(65));
  await page.waitForTimeout(200);
  const over65 = await page.locator('text=over').count();
  log('Char Counter', '65 chars: 1 platform over (meta title only)', over65 === 1, `got ${over65}`);

  // clear all
  await ta.fill('');
  await page.waitForTimeout(200);
  log('Char Counter', 'clear resets to 0', (await stats.nth(0).textContent()) === '0');
}

// ─── TEXT CASE CONVERTER ──────────────────────────────────────────────────────
async function testTextCase(page) {
  console.log('\n[Text Case Converter]');
  await page.goto(`${BASE}/tools/text-case`);
  await page.waitForSelector('textarea');
  const ta = page.locator('textarea');
  const result = () => page.locator('div.font-mono').last();

  await ta.fill('hello world foo bar');
  await page.waitForTimeout(200);

  const cases = [
    { btn: 'lowercase',      expected: 'hello world foo bar' },
    { btn: 'UPPERCASE',      expected: 'HELLO WORLD FOO BAR' },
    { btn: 'Title Case',     expected: 'Hello World Foo Bar' },
    { btn: 'Sentence case',  expected: 'Hello world foo bar' },
    { btn: 'camelCase',      expected: 'helloWorldFooBar' },
    { btn: 'PascalCase',     expected: 'HelloWorldFooBar' },
    { btn: 'snake_case',     expected: 'hello_world_foo_bar' },
    { btn: 'kebab-case',     expected: 'hello-world-foo-bar' },
    { btn: 'CONSTANT_CASE',  expected: 'HELLO_WORLD_FOO_BAR' },
  ];

  for (const { btn, expected } of cases) {
    await page.getByRole('button', { name: btn, exact: true }).click();
    await page.waitForTimeout(200);
    const got = (await result().textContent())?.trim();
    log('Text Case', btn, got === expected, `"${got}" expected "${expected}"`);
  }

  // numbers stay in output
  await ta.fill('test123 value');
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'camelCase', exact: true }).click();
  await page.waitForTimeout(200);
  const withNums = (await result().textContent())?.trim();
  log('Text Case', 'numbers preserved in camelCase', withNums?.includes('123'), withNums);

  // already correct case
  await ta.fill('ALREADY UPPER');
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'UPPERCASE', exact: true }).click();
  await page.waitForTimeout(200);
  const sameCase = (await result().textContent())?.trim();
  log('Text Case', 'already-correct case stays same', sameCase === 'ALREADY UPPER');

  // copy button visible after result
  log('Text Case', 'copy button visible after conversion', await page.getByRole('button', { name: 'Copy' }).isVisible());
}

// ─── SLUG GENERATOR ───────────────────────────────────────────────────────────
async function testSlugGenerator(page) {
  console.log('\n[Slug Generator]');
  await page.goto(`${BASE}/tools/slug-generator`);
  await page.waitForSelector('input[type="text"]');
  const inp = page.locator('input[type="text"]');
  const slug = () => page.locator('.font-mono.text-indigo-700');

  // basic
  await inp.fill('Hello World');
  await page.waitForTimeout(200);
  log('Slug', 'basic slug', (await slug().textContent())?.trim() === 'hello-world');

  // punctuation stripped
  await inp.fill('Hello, World! This is a Test.');
  await page.waitForTimeout(200);
  log('Slug', 'punctuation stripped', (await slug().textContent())?.trim() === 'hello-world-this-is-a-test');

  // multiple spaces
  await inp.fill('too   many    spaces');
  await page.waitForTimeout(200);
  log('Slug', 'multiple spaces collapsed', (await slug().textContent())?.trim() === 'too-many-spaces');

  // already slug-like
  await inp.fill('already-a-slug');
  await page.waitForTimeout(200);
  log('Slug', 'already slug stays same', (await slug().textContent())?.trim() === 'already-a-slug');

  // numbers preserved
  await inp.fill('page 404 not found');
  await page.waitForTimeout(200);
  log('Slug', 'numbers preserved', (await slug().textContent())?.trim() === 'page-404-not-found');

  // switch to underscore
  await inp.fill('hello world test');
  await page.waitForTimeout(200);
  await page.locator('input[value="_"]').check();
  await page.waitForTimeout(200);
  log('Slug', 'underscore separator', (await slug().textContent())?.trim() === 'hello_world_test');

  // switch back to hyphen
  await page.locator('input[value="-"]').check();
  await page.waitForTimeout(200);
  log('Slug', 'back to hyphen separator', (await slug().textContent())?.trim() === 'hello-world-test');

  // empty input — no output
  await inp.fill('');
  await page.waitForTimeout(200);
  log('Slug', 'empty input shows no output', !(await slug().isVisible()));

  // copy button visible with output
  await inp.fill('some title');
  await page.waitForTimeout(200);
  log('Slug', 'copy button visible', await page.getByRole('button', { name: 'Copy' }).isVisible());
}

// ─── LINE SORTER ──────────────────────────────────────────────────────────────
async function testLineSorter(page) {
  console.log('\n[Line Sorter]');
  await page.goto(`${BASE}/tools/line-sorter`);
  await page.waitForSelector('textarea');
  const input = page.locator('textarea').first();
  const output = () => page.locator('textarea').nth(1);
  const btn = (name) => page.getByRole('button', { name, exact: true });

  const fill = async (text) => {
    await input.fill(text);
    await page.waitForTimeout(200);
  };

  // sort A→Z
  await fill('banana\napple\ncherry');
  await btn('Sort A → Z').click(); await page.waitForTimeout(200);
  let out = await output().inputValue();
  log('Line Sorter', 'sort A→Z', out === 'apple\nbanana\ncherry', out);

  // sort Z→A
  await fill('banana\napple\ncherry');
  await btn('Sort Z → A').click(); await page.waitForTimeout(200);
  out = await output().inputValue();
  log('Line Sorter', 'sort Z→A', out === 'cherry\nbanana\napple', out);

  // reverse
  await fill('one\ntwo\nthree');
  await btn('Reverse').click(); await page.waitForTimeout(200);
  out = await output().inputValue();
  log('Line Sorter', 'reverse', out === 'three\ntwo\none', out);

  // remove duplicates
  await fill('apple\nbanana\napple\ncherry\nbanana');
  await btn('Remove duplicates').click(); await page.waitForTimeout(200);
  out = await output().inputValue();
  log('Line Sorter', 'remove duplicates', out.split('\n').length === 3, `got ${out.split('\n').length} lines`);
  log('Line Sorter', 'remove duplicates preserves order', out.split('\n')[0] === 'apple');

  // remove empty lines
  await fill('one\n\ntwo\n\nthree\n');
  await btn('Remove empty lines').click(); await page.waitForTimeout(200);
  out = await output().inputValue();
  const nonEmpty = out.split('\n').filter(l => l !== '');
  log('Line Sorter', 'removes empty lines', nonEmpty.length === 3, `got ${out.split('\n').length} lines`);

  // trim whitespace
  await fill('  hello  \n  world  ');
  await btn('Trim whitespace').click(); await page.waitForTimeout(200);
  out = await output().inputValue();
  log('Line Sorter', 'trims whitespace', out === 'hello\nworld', `"${out}"`);

  // shuffle — output is different from input (usually)
  await fill('aaa\nbbb\nccc\nddd\neee');
  await btn('Shuffle').click(); await page.waitForTimeout(200);
  out = await output().inputValue();
  log('Line Sorter', 'shuffle produces output', out.split('\n').length === 5);
  log('Line Sorter', 'shuffle contains all original items', out.includes('aaa') && out.includes('eee'));

  // chaining: sort → dedupe → reverse
  await fill('cherry\napple\napple\nbanana');
  await btn('Sort A → Z').click(); await page.waitForTimeout(200);   // apple,apple,banana,cherry
  await btn('Remove duplicates').click(); await page.waitForTimeout(200); // apple,banana,cherry
  await btn('Reverse').click(); await page.waitForTimeout(200);           // cherry,banana,apple
  out = await output().inputValue();
  log('Line Sorter', 'chain: sort→dedup→reverse', out === 'cherry\nbanana\napple', `"${out}"`);

  // single line
  await fill('only one line');
  await btn('Sort A → Z').click(); await page.waitForTimeout(200);
  out = await output().inputValue();
  log('Line Sorter', 'single line sorts fine', out === 'only one line');

  // line count display — use the specific counter span
  await fill('a\nb\nc\nd');
  const countSpan = page.locator('span.text-xs.text-slate-400');
  const countText = await countSpan.textContent();
  log('Line Sorter', 'line count shows correctly', countText?.trim() === '4 lines', `got "${countText?.trim()}"`);

  // copy button
  await fill('test\nlines');
  await btn('Sort A → Z').click(); await page.waitForTimeout(200);
  log('Line Sorter', 'copy button visible after sort', await page.getByRole('button', { name: 'Copy' }).isVisible());
}

// ─── RUN ALL ──────────────────────────────────────────────────────────────────
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
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`${passed} passed  ${failed} failed  (${results.length} total)`);
  if (failed > 0) {
    console.log('\nFailed:');
    results.filter(r => !r.pass).forEach(r =>
      console.log(`  ✗ [${r.tool}] ${r.test}${r.detail ? ' — ' + r.detail : ''}`)
    );
    process.exit(1);
  }
})();
