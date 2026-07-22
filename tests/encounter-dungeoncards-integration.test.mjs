import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

test('Encounter Forge keeps the DungeonCards adapter, status UI, and browser coverage', () => {
  for (const file of [
    'encounter-monster-catalog.js',
    'tests/dungeoncards-monster-adapter.test.mjs',
    'tests/browser/encounter-monster-catalog.spec.mjs'
  ]) assert.equal(existsSync(join(root, file)), true, `Missing ${file}`);

  const page = read('encounter-forge.html');
  for (const id of ['catalogSourceStatus', 'catalogResultSummary', 'monsterCatalog']) {
    assert.equal(page.includes(`id="${id}"`), true, `Encounter Forge is missing #${id}`);
  }
});

test('Encounter Forge loads source-authoritative summaries and retains local fallback behavior', () => {
  const app = read('encounter-forge.js');
  const adapter = read('encounter-monster-catalog.js');
  for (const phrase of [
    "import { loadDungeonCardsMonsters }",
    'async function loadVerifiedCatalog',
    'Built-in samples and saved custom monsters still work',
    'CATALOG_RENDER_LIMIT = 120',
    'sourceReference',
    'sourceLicense',
    'loadVerifiedCatalog();'
  ]) assert.equal(app.includes(phrase), true, `Encounter Forge lost ${phrase}`);

  assert.equal(adapter.includes('srd-monster-summaries.json'), true);
  assert.equal(adapter.includes("license !== 'CC BY 4.0'"), true);
  assert.equal(adapter.includes('counts disagree'), true);
  assert.equal(adapter.includes('duplicate source IDs'), true);
  assert.equal(adapter.includes("catalogSource: 'dungeoncards-srd'"), true);
});

test('saved and printed encounters preserve monster source attribution', () => {
  const app = read('encounter-forge.js');
  const snapshotBlock = app.slice(app.indexOf('function encounterSnapshot'), app.indexOf('function saveEncounter'));
  const printBlock = app.slice(app.indexOf('function printPacket'), app.indexOf('function exportEncounters'));
  assert.equal(snapshotBlock.includes('monsters: roster.map'), true);
  assert.equal(printBlock.includes('sourceReference'), true);
  assert.equal(printBlock.includes('CC BY 4.0'), true);
  assert.equal(printBlock.includes('<th>Source</th>'), true);
});

test('main repository does not contain a copied 642-record monster export', () => {
  assert.equal(existsSync(join(root, 'srd-monster-summaries.json')), false);
  assert.equal(existsSync(join(root, 'data/srd-monster-summaries.json')), false);
  assert.equal(existsSync(join(root, 'public/dm-forge/srd-monster-summaries.json')), false);
});
