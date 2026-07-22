import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

test('Encounter Forge loads the DungeonCards handoff adapter after its main module', () => {
  const page = read('encounter-forge.html');
  const appIndex = page.indexOf('src="encounter-forge.js"');
  const adapterIndex = page.indexOf('src="shared/dungeoncards-encounter-adapter.js"');
  assert.ok(appIndex >= 0, 'Encounter Forge main module is missing');
  assert.ok(adapterIndex > appIndex, 'DungeonCards adapter must load after Encounter Forge');
});

test('DungeonCards handoff resolves authoritative catalog records instead of trusting transferred combat stats', () => {
  const adapter = read('shared/dungeoncards-encounter-adapter.js');
  for (const requirement of [
    "const HANDOFF_KEY = 'dmforge-dungeoncards-encounter-handoff-v1'",
    'loadDungeonCardsMonsters',
    'matchMonster',
    'sourceRecordId',
    'evaluateEncounter',
    'MAX_HANDOFF_AGE_MS',
    "payload.version !== 1",
    "!['2014', '2024'].includes",
    'localStorage.removeItem(HANDOFF_KEY)'
  ]) assert.equal(adapter.includes(requirement), true, `Handoff adapter lost ${requirement}`);

  for (const unsafe of ['requested.ac', 'requested.hp', 'requested.dex', 'requested.xp', 'requested.sourceLicense']) {
    assert.equal(adapter.includes(unsafe), false, `Handoff must not trust transferred ${unsafe}`);
  }
});

test('imported DungeonCards encounters retain party, ruleset, source records, and computed difficulty', () => {
  const adapter = read('shared/dungeoncards-encounter-adapter.js');
  for (const requirement of [
    "name: 'DungeonCards Encounter'",
    'profileFor(state, campaign, ruleset)',
    'partyProfile.characters',
    'monsters,',
    'rawXp: result.rawXp',
    'adjustedXp: result.adjustedXp',
    'difficulty: result.difficulty',
    'warnings: result.warnings',
    'Review party levels, quantities, terrain, and warnings'
  ]) assert.equal(adapter.includes(requirement), true, `Imported encounter lost ${requirement}`);
});
