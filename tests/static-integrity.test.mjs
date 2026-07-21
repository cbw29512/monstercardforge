import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'campaigns.html', 'monster-cards.html', 'magic-items.html', 'session-console.html', 'encounter-forge.html', 'player-display.html', 'npc-forge.html', 'loot-forge.html', 'backup-center.html'];

function localAssetReferences(html) {
  const references = [];
  for (const pattern of [/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi, /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi]) {
    for (const match of html.matchAll(pattern)) references.push(match[1]);
  }
  return references.filter((reference) => {
    const value = reference.trim();
    return value && !/^(?:https?:|data:|mailto:|tel:|#|\/\/|\/)/i.test(value);
  });
}

function javascriptFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    if (['.git', 'node_modules'].includes(entry)) continue;
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) files.push(...javascriptFiles(fullPath));
    else if (entry.endsWith('.js')) files.push(fullPath);
  }
  return files;
}

test('all primary pages and their local JS/CSS assets exist', () => {
  for (const page of pages) {
    const pagePath = join(root, page);
    assert.equal(existsSync(pagePath), true, `Missing ${page}`);
    const html = readFileSync(pagePath, 'utf8');
    for (const reference of localAssetReferences(html)) {
      const cleanReference = reference.split(/[?#]/, 1)[0];
      const assetPath = normalize(join(dirname(pagePath), cleanReference));
      assert.equal(existsSync(assetPath), true, `${page} references missing local asset ${reference}`);
    }
  }
});

test('every production JavaScript file parses successfully', () => {
  const failures = [];
  for (const file of javascriptFiles(root)) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) failures.push(`${relative(root, file)}\n${result.stderr || result.stdout}`);
  }
  assert.deepEqual(failures, []);
});

test('Magic Item Forge retains overflow detection and continuation printing', () => {
  const script = readFileSync(join(root, 'magic-items.js'), 'utf8');
  const html = readFileSync(join(root, 'magic-items.html'), 'utf8');
  const css = readFileSync(join(root, 'magic-items.css'), 'utf8');
  for (const requirement of ['function cardOverflows', 'function measureFace', 'function continuationHtml', 'function overflowContinuations']) assert.equal(script.includes(requirement), true, `Missing ${requirement}`);
  assert.equal(html.includes('id="fitStatus"'), true);
  assert.equal(html.includes('aria-live="polite"'), true);
  assert.equal(css.includes('.continuation-page'), true);
  assert.equal(css.includes('.fit-status.warning'), true);
});

test('Campaign Hub and shared adapters are loaded by connected tools', () => {
  const campaignPage = readFileSync(join(root, 'campaigns.html'), 'utf8');
  const sessionPage = readFileSync(join(root, 'session-console.html'), 'utf8');
  const itemPage = readFileSync(join(root, 'magic-items.html'), 'utf8');
  const encounterPage = readFileSync(join(root, 'encounter-forge.html'), 'utf8');
  const npcPage = readFileSync(join(root, 'npc-forge.html'), 'utf8');
  const lootPage = readFileSync(join(root, 'loot-forge.html'), 'utf8');
  for (const asset of ['shared/dmforge-store.js', 'campaigns.js', 'campaigns.css']) assert.equal(campaignPage.includes(asset), true, `Campaign Hub is missing ${asset}`);
  for (const asset of ['shared/dmforge-store.js', 'shared/session-console-adapter.js', 'shared/player-display-host.js']) assert.equal(sessionPage.includes(asset), true, `Session Console is missing ${asset}`);
  for (const asset of ['shared/dmforge-store.js', 'shared/magic-items-adapter.js']) assert.equal(itemPage.includes(asset), true, `Magic Item Forge is missing ${asset}`);
  for (const asset of ['shared/dmforge-store.js', 'encounter-forge.js']) assert.equal(encounterPage.includes(asset), true, `Encounter Forge is missing ${asset}`);
  for (const asset of ['shared/dmforge-store.js', 'npc-forge.js', 'shared/npc-forge-hardening.js']) assert.equal(npcPage.includes(asset), true, `NPC Forge is missing ${asset}`);
  for (const asset of ['shared/dmforge-store.js', 'loot-forge.js', 'shared/loot-forge-hardening.js']) assert.equal(lootPage.includes(asset), true, `Loot Forge is missing ${asset}`);
});

test('Magic Item reward handoff copies only a safe summary into Session Console', () => {
  const adapter = readFileSync(join(root, 'shared/magic-items-adapter.js'), 'utf8');
  assert.equal(adapter.includes('Send to Session Rewards'), true);
  assert.equal(adapter.includes('Magic item reward:'), true);
  assert.equal(adapter.includes('item.secret'), false);
  assert.equal(adapter.includes('item.artData'), false);
  assert.equal(adapter.includes('item.properties'), false);
});

test('Encounter Forge retains official rules data and Session Console handoff', () => {
  const engine = readFileSync(join(root, 'encounter-rules.js'), 'utf8');
  const app = readFileSync(join(root, 'encounter-forge.js'), 'utf8');
  const page = readFileSync(join(root, 'encounter-forge.html'), 'utf8');
  const sharedStore = readFileSync(join(root, 'shared/dmforge-store.js'), 'utf8');
  const sessionAdapter = readFileSync(join(root, 'shared/session-console-adapter.js'), 'utf8');
  assert.equal(engine.includes('THRESHOLDS_2014'), true);
  assert.equal(engine.includes('BUDGETS_2024'), true);
  assert.equal(app.includes('dmforge-pending-encounter-v1'), true);
  assert.equal(page.includes('Launch in Session Console'), true);
  assert.equal(sharedStore.includes('function syncEncounters'), true);
  assert.equal(sessionAdapter.includes('function consumePendingEncounter'), true);
});

test('Player Display sends only public initiative fields', () => {
  const host = readFileSync(join(root, 'shared/player-display-host.js'), 'utf8');
  const page = readFileSync(join(root, 'player-display.html'), 'utf8');
  assert.equal(host.includes('function publicState'), true);
  for (const allowed of ['currentId', 'initiative', 'conditions', 'round', 'sessionTitle']) assert.equal(host.includes(allowed), true, `Public state is missing ${allowed}`);
  const publicStateBlock = host.slice(host.indexOf('function publicState'), host.indexOf('function campaignRoom'));
  for (const privateField of ['currentHp', 'maxHp', 'ac:', 'prep:', 'log:', 'dex:']) assert.equal(publicStateBlock.includes(privateField), false, `Player Display exposes ${privateField}`);
  assert.equal(page.includes('This page is read-only'), true);
  assert.equal(page.includes('enemy HP, AC, Dexterity, combat logs, or DM notes'), true);
});

test('NPC Forge keeps player cards and shared summaries free of DM secrets', () => {
  const app = readFileSync(join(root, 'npc-forge.js'), 'utf8');
  const storeScript = readFileSync(join(root, 'shared/dmforge-store.js'), 'utf8');
  const playerBlock = app.slice(app.indexOf('function playerCardHtml'), app.indexOf('function dmCardHtml'));
  for (const privateField of ['npc.secret', 'npc.lie', 'npc.motive', 'npc.combatNotes', 'npc.relationships']) assert.equal(playerBlock.includes(privateField), false, `Player NPC card exposes ${privateField}`);
  const syncBlock = storeScript.slice(storeScript.indexOf('function syncNpcs'), storeScript.indexOf('function syncLoot'));
  for (const privateField of ['secret:', 'motive:', 'lie:', 'relationships:', 'combatNotes:', 'publicNotes:']) assert.equal(syncBlock.includes(privateField), false, `Shared NPC summary exposes ${privateField}`);
  assert.equal(syncBlock.includes('relationshipCount'), true);
  assert.equal(syncBlock.includes('tagCount'), true);
});

test('NPC Forge retains overflow continuation and safe Session Console handoff', () => {
  const app = readFileSync(join(root, 'npc-forge.js'), 'utf8');
  const hardening = readFileSync(join(root, 'shared/npc-forge-hardening.js'), 'utf8');
  const page = readFileSync(join(root, 'npc-forge.html'), 'utf8');
  const sessionAdapter = readFileSync(join(root, 'shared/session-console-adapter.js'), 'utf8');
  for (const requirement of ['function cardOverflows', 'function measure', 'function continuationHtml']) assert.equal(app.includes(requirement), true, `NPC Forge is missing ${requirement}`);
  assert.equal(page.includes('id="fitStatus"'), true);
  assert.equal(app.includes('Send to Session NPCs'), true);
  const handoffBlock = hardening.slice(hardening.indexOf('sendToSession ='), hardening.indexOf("document.getElementById('newNpc')"));
  assert.equal(handoffBlock.includes('Mannerism:'), true);
  assert.equal(handoffBlock.includes('Motive:'), true);
  assert.equal(handoffBlock.includes('npc.secret'), false);
  assert.equal(handoffBlock.includes('npc.lie'), false);
  assert.equal(sessionAdapter.includes("{ key: 'npcs', label: 'NPCs & Motives' }"), true);
});

test('Backup Center validates recognized keys and excludes transient handoffs', () => {
  const page = readFileSync(join(root, 'backup-center.html'), 'utf8');
  const script = readFileSync(join(root, 'backup-center.js'), 'utf8');
  for (const control of ['downloadBackup', 'importBackup', 'confirmRestore', 'applyImport', 'storageGrid']) assert.equal(page.includes(`id="${control}"`), true, `Backup Center is missing ${control}`);
  for (const requirement of ['function acceptedKey', 'function buildBackup', 'function validateBackup', 'function applyImport', "const MAX_IMPORT_BYTES", 'SHA-256']) assert.equal(script.includes(requirement), true, `Backup Center is missing ${requirement}`);
  assert.equal(script.includes("'dmforge-pending-encounter-v1'"), true);
  assert.equal(script.includes("/^cleric-box-"), true);
  assert.equal(script.includes('record.sha256'), true);
});

test('DM Forge homepage links every live tool', () => {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  for (const route of ['campaigns.html', 'session-console.html', 'encounter-forge.html', 'player-display.html', 'npc-forge.html', 'loot-forge.html', 'backup-center.html', 'monster-cards.html', 'magic-items.html', 'https://cbw29512.github.io/healingbox/']) assert.equal(html.includes(route), true, `Homepage is missing ${route}`);
});
