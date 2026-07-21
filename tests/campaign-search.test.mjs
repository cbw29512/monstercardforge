import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

for (const file of ['campaign-search.html', 'campaign-search.css', 'campaign-search.js']) {
  test(`${file} exists`, () => assert.equal(existsSync(join(root, file)), true));
}

test('Campaign Search JavaScript parses', () => {
  const result = spawnSync(process.execPath, ['--check', join(root, 'campaign-search.js')], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('Campaign Search indexes every private campaign tool', () => {
  const script = readFileSync(join(root, 'campaign-search.js'), 'utf8');
  for (const key of ['dmforge-session-console-v1', 'dmforge-encounter-forge-v1', 'dmforge-npc-forge-v1', 'dmforge-loot-forge-v1', 'dmforge-magic-items-v2', 'cleric-box-']) {
    assert.equal(script.includes(key), true, `Missing search source ${key}`);
  }
  for (const extractor of ['sessionRecords', 'encounterRecords', 'npcRecords', 'lootRecords', 'magicItemRecords', 'clericRecords']) {
    assert.equal(script.includes(`function ${extractor}`), true, `Missing ${extractor}`);
  }
});

test('Campaign Search avoids image blobs and renders record text safely', () => {
  const script = readFileSync(join(root, 'campaign-search.js'), 'utf8');
  assert.equal(script.includes("new Set(['id', 'updatedAt', 'artData'])"), true);
  assert.equal(script.includes('detail.textContent = snippet(record, terms)'), true);
  assert.equal(script.includes('title.textContent = record.title'), true);
});

test('Campaign Search is clearly marked private and linked from navigation', () => {
  const page = readFileSync(join(root, 'campaign-search.html'), 'utf8');
  const hub = readFileSync(join(root, 'campaigns.html'), 'utf8');
  const homepage = readFileSync(join(root, 'index.html'), 'utf8');
  assert.equal(page.includes('Private DM view:'), true);
  assert.equal(page.includes('should not be shown on the Player Display'), true);
  assert.equal(hub.includes('campaign-search.html'), true);
  assert.equal(hub.includes('Search Everything'), true);
  assert.equal(homepage.includes('campaign-search.html'), true);
  assert.equal(homepage.includes('Campaign Search'), true);
});
