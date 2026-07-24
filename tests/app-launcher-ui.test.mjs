import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const rulesHtml = readFileSync(join(root, 'rules-compendium.html'), 'utf8');
const rulesCss = readFileSync(join(root, 'rules-compendium.css'), 'utf8');

test('DM Forge landing page uses one consistent app-card layout', () => {
  assert.equal(html.includes('class="tool featured"'), false);
  assert.match(html, /\.tool-grid\{display:grid;grid-template-columns:repeat\(auto-fit,minmax\(280px,1fr\)\)/);
  assert.match(html, /\.tool\{height:100%;min-height:350px/);
  assert.equal((html.match(/<article class="tool"/g) || []).length, 12);
});

test('DM Forge home is the D&D and Cthulhu system chooser', () => {
  assert.match(html, /aria-label="Choose a game system"/);
  assert.match(html, /system-choice--dnd/);
  assert.match(html, /system-choice--coc/);
  assert.match(html, /Dungeons &amp; Dragons/);
  assert.match(html, /Cthulhu Keeper Tools/);
  assert.match(html, /DungeonCards\/\?system=coc/);
  assert.match(html, /id="dnd-tools"/);
});

test('DM Forge provides task-first navigation and clear tool categories', () => {
  for (const requirement of [
    'aria-label="DM Forge primary navigation"',
    'aria-label="DM Forge home"',
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

test('Rules Compendium workspace cards use the same responsive size', () => {
  assert.equal(rulesHtml.includes('class="workspace featured"'), false);
  assert.equal((rulesHtml.match(/<article class="workspace"/g) || []).length, 7);
  assert.equal(rulesCss.includes('grid-template-columns:repeat(auto-fit,minmax(270px,1fr))'), true);
  assert.equal(rulesCss.includes('.workspace{height:100%;min-height:310px'), true);
  assert.equal(rulesHtml.includes('not yet synchronized into Campaign Hub'), true);
});
