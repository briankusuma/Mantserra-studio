import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Regresi: CSS development benar, tetapi minifier pernah menyisakan prefix saja.
const buildDirectory = resolve('dist');
const html = await readFile(resolve(buildDirectory, 'index.html'), 'utf8');
const stylesheetPaths = [...html.matchAll(/href="([^\"]+\.css)"/g)]
  .map(match => resolve(buildDirectory, match[1].replace(/^\//, '')));
assert.ok(stylesheetPaths.length, 'Build tidak memiliki stylesheet.');
const css = (await Promise.all(stylesheetPaths.map(path => readFile(path, 'utf8')))).join('\n');

for (const selector of ['.ticket__window', '.experiences__ticket-button', '.ticket-dialog::backdrop']) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rules = [...css.matchAll(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`, 'g'))];
  const glassRule = rules.find(match => /(?:^|;)(?:-webkit-)?backdrop-filter:/.test(match[1]));
  assert.ok(glassRule, `Efek kaca hilang dari ${selector}.`);
  assert.match(glassRule[1], /(?:^|;)backdrop-filter:blur\(/, `Blur standar hilang setelah build: ${selector}`);
  assert.match(glassRule[1], /(?:^|;)-webkit-backdrop-filter:blur\(/, `Blur WebKit hilang setelah build: ${selector}`);
}

console.log('PASS: CSS produksi mempertahankan blur standar dan WebKit pada ketiga surface.');
