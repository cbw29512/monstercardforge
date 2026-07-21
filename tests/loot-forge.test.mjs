import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const appPath = join(root, 'loot-forge.js');
const app = readFileSync(appPath, 'utf8');
const page = readFileSync(join(root, 'loot-forge.html'), 'utf8');
const store = readFileSync(join(root, 'shared/dmforge-store.js'), 'utf8');
const hardening = readFileSync(join(root, 'shared/loot-forge-hardening.js'), 'utf8');

test('Loot Forge route, styles, scripts, and syntax are present', () => {
  for (const file of ['loot-forge.html', 'loot-forge.css', 'loot-forge.js', 'shared/loot-forge-hardening.js']) assert.equal(existsSync(join(root, file)), true, `Missing ${file}`);
  for (const asset of ['loot-forge.css', 'shared/dmforge-store.js', 'loot-forge.js']) assert.equal(page.includes(asset), true, `Loot Forge page is missing ${asset}`);
  const result = spawnSync(process.execPath, ['--check', appPath], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('Loot Forge generator uses cryptographic randomness and is labeled original', () => {
  assert.equal(app.includes('crypto.getRandomValues'), true);
  assert.equal(app.includes('function generateParcel'), true);
  assert.equal(page.includes('original DM Forge content, not an official treasure table'), true);
});

test('shared Loot summaries exclude parcel contents and private notes', () => {
  const block = store.slice(store.indexOf('function syncLoot'), store.indexOf('function syncHealingRoom'));
  assert.equal(block.includes('function syncLoot'), true);
  for (const privateField of ['dmNotes:', 'playerNotes:', 'valuables:', 'mundaneItems:', 'magicItems:', 'clues:']) assert.equal(block.includes(privateField), false, `Shared Loot summary exposes ${privateField}`);
  for (const safeCount of ['valuableCount', 'mundaneCount', 'magicItemCount', 'clueCount']) assert.equal(block.includes(safeCount), true, `Shared Loot summary is missing ${safeCount}`);
});

test('Session Console handoff excludes private DM notes', () => {
  const block = app.slice(app.indexOf('function sessionSummary'), app.indexOf('function inferredCategory'));
  assert.equal(block.includes('Loot:'), true);
  assert.equal(block.includes('parcel.dmNotes'), false);
  assert.equal(block.includes('prep.rewards'), true);
});

test('Magic Item handoff creates rule-free unidentified placeholders', () => {
  const block = app.slice(app.indexOf('function placeholderItem'), app.indexOf('function selectedParcels'));
  assert.equal(block.includes("identification: 'unidentified'"), true);
  assert.equal(block.includes("properties: ''"), true);
  assert.equal(block.includes('parcel.dmNotes'), false);
  assert.equal(block.includes('parcel.clues'), false);
  assert.equal(block.includes('Complete its appearance and rules before revealing it.'), true);
});

test('hardening preserves edited Magic Items and stable draft identity', () => {
  assert.equal(hardening.includes("let draftId = uid('loot-draft')"), true);
  assert.equal(hardening.includes('if (map.has(itemId)) return'), true);
  assert.equal(hardening.includes('Existing Magic Item edits were preserved'), true);
});

test('Campaign Hub exposes Loot Forge and synchronizes parcel summaries', () => {
  const hub = readFileSync(join(root, 'campaigns.html'), 'utf8');
  const hubScript = readFileSync(join(root, 'campaigns.js'), 'utf8');
  assert.equal(hub.includes('loot-forge.html'), true);
  assert.equal(hubScript.includes("readJson('dmforge-loot-forge-v1'"), true);
  assert.equal(hubScript.includes('store.syncLoot'), true);
});
