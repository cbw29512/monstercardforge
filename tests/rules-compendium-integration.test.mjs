import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const companion = 'https://cbw29512.github.io/DungeonCards/';

test('Rules Compendium gateway and assets remain present', () => {
  for (const path of ['rules-compendium.html', 'rules-compendium.css', 'tests/browser/rules-compendium-companion.spec.mjs']) {
    assert.equal(existsSync(join(root, path)), true, `Missing ${path}`);
  }
});

test('gateway preserves verified catalog scope, honest automation language, and transfer boundaries', () => {
  const page = read('rules-compendium.html');
  for (const phrase of [
    '658',
    'Spell references',
    '642',
    'Monster references',
    '22',
    'Automated spell families',
    'Reference-complete does not automatically mean roll-automated.',
    'Never silently guessed',
    'send the selected verified monsters into Encounter Forge',
    'source IDs, names, edition, quantity, and campaign context',
    'Homebrew transfer remains disabled'
  ]) assert.equal(page.includes(phrase), true, `Rules Compendium lost ${phrase}`);
});

test('every supported D&D workspace has a stable companion deep link', () => {
  const page = read('rules-compendium.html');
  const pages = ['compendium', 'rules', 'player', 'dm', 'monster', 'homebrew', 'monster-homebrew'];
  for (const destination of pages) {
    const link = `${companion}?system=dnd&amp;page=${destination}`;
    assert.equal(page.includes(link), true, `Missing DungeonCards deep link ${destination}`);
  }
  assert.equal(page.includes('system=coc'), false, 'Public DM Forge gateway must not promote the experimental CoC preview');
});

test('homepage, sitemap, metadata governance, and live gate promote the integration', () => {
  const home = read('index.html');
  const sitemap = read('sitemap.xml');
  const governance = read('tests/governance.test.mjs');
  const workflow = read('.github/workflows/live-site-readiness.yml');
  for (const phrase of ['Rules Compendium &amp; Roll Cards', 'rules-compendium.html', '1,300 VERIFIED SRD RECORDS']) {
    assert.equal(home.includes(phrase), true, `Homepage lost ${phrase}`);
  }
  assert.equal(sitemap.includes('<loc>https://cbw29512.github.io/monstercardforge/rules-compendium.html</loc>'), true);
  assert.equal(governance.includes("'rules-compendium.html'"), true);
  assert.equal(workflow.includes('DUNGEON_CARDS_URL'), true);
  assert.equal(workflow.includes('/rules-compendium.html'), true);
  assert.equal(workflow.includes('DM_FORGE_LIVE_COMPANIONS'), true);
});
