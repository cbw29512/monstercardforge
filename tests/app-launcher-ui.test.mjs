import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');

test('DM Forge landing page uses one consistent app-card layout', () => {
  assert.equal(html.includes('class="tool featured"'), false);
  assert.match(html, /\.tool-grid\{display:grid;grid-template-columns:repeat\(auto-fit,minmax\(280px,1fr\)\)/);
  assert.match(html, /\.tool\{height:100%;min-height:350px/);
  assert.equal((html.match(/<article class="tool"/g) || []).length, 12);
});

test('DM Forge provides task-first navigation and clear tool categories', () => {
  for (const requirement of [
    'aria-label="DM Forge primary navigation"',
    'aria-label="Common DM Forge tasks"',
    'id="prepare"',
    'id="run"',
    'id="create"',
    'id="reference"',
    'Open Cleric in a Box'
  ]) {
    assert.equal(html.includes(requirement), true, `Missing ${requirement}`);
  }
});
