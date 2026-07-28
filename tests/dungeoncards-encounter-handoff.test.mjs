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

test('DungeonCards handoff resolves authoritative records and uses strict validation', () => {
  const adapter = read('shared/dungeoncards-encounter-adapter.js');
  const model = read('shared/dungeoncards-handoff-model.js');
  for (const requirement of [
    "const HANDOFF_KEY = 'dmforge-dungeoncards-encounter-handoff-v1'",
    'loadDungeonCardsMonsters',
    'matchMonster',
    'sourceRecordId',
    'evaluateEncounter',
    'validateDungeonCardsHandoff',
    'selectOrCreateEditionProfile',
    'localStorage.removeItem(HANDOFF_KEY)'
  ]) assert.equal(adapter.includes(requirement), true, `Handoff adapter lost ${requirement}`);

  for (const requirement of [
    'MAX_HANDOFF_AGE_MS',
    'MAX_HANDOFF_CLOCK_SKEW_MS',
    'MAX_HANDOFF_COMBATANTS',
    'crosses the encounter edition boundary',
    'Number.isInteger(quantity)',
    'selectOrCreateEditionProfile'
  ]) assert.equal(model.includes(requirement), true, `Handoff model lost ${requirement}`);

  for (const unsafe of ['requested.ac', 'requested.hp', 'requested.dex', 'requested.xp', 'requested.sourceLicense']) {
    assert.equal(adapter.includes(unsafe), false, `Handoff must not trust transferred ${unsafe}`);
  }
});

test('fresh-browser imports wait for normal startup and create safe fallback state when needed', () => {
  const adapter = read('shared/dungeoncards-encounter-adapter.js');
  const model = read('shared/dungeoncards-handoff-model.js');
  for (const requirement of [
    'waitForEncounterForgeState',
    'STORAGE_READY_ATTEMPTS',
    'await delay(STORAGE_READY_DELAY_MS)',
    'createInitialEncounterForgeState',
    'localStorage.setItem(STORAGE_KEY, JSON.stringify(created))',
    'const state = await waitForEncounterForgeState(campaign, ruleset)'
  ]) assert.equal(adapter.includes(requirement), true, `Fresh-browser adapter lost ${requirement}`);
  assert.equal(model.includes('export function createInitialEncounterForgeState'), true);
  assert.equal(model.includes("name: 'Core Party'"), true);
  assert.equal(model.includes('Array.from({ length: 4 }'), true);
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

test('cross-edition imports preserve the original party profile', () => {
  const model = read('shared/dungeoncards-handoff-model.js');
  assert.equal(model.includes('const exact = profiles.find'), true);
  assert.equal(model.includes('profiles.push(created)'), true);
  assert.equal(model.includes('state.activeProfileId = created.id'), true);
  assert.equal(model.includes('template.ruleset = ruleset'), false, 'The adapter must not rewrite the template profile edition');
});
