import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DUNGEON_CARDS_MONSTER_URL,
  loadDungeonCardsMonsters,
  normalizeMonsterExport,
  normalizeMonsterSummary
} from '../encounter-monster-catalog.js';

const sources = [
  {
    edition: 'srd-5.1-2014', version: '5.1', pdfUrl: 'https://example.test/srd-5.1.pdf',
    sha256: 'a'.repeat(64), attribution: 'SRD 5.1 Creative Commons Attribution 4.0.', monsterCount: 1, license: 'CC BY 4.0'
  },
  {
    edition: 'srd-5.2.1-2024', version: '5.2.1', pdfUrl: 'https://example.test/srd-5.2.1.pdf',
    sha256: 'b'.repeat(64), attribution: 'SRD 5.2.1 Creative Commons Attribution 4.0.', monsterCount: 1, license: 'CC BY 4.0'
  }
];

const monster2014 = {
  id: 'srd-5.1-2014-monster-aboleth', ruleset: '2014', edition: 'srd-5.1-2014', sourceVersion: '5.1',
  name: 'Aboleth', size: 'Large', type: 'aberration', alignment: 'lawful evil', armorClass: 17,
  armorClassText: '17 (natural armor)', hitPoints: 135, hitPointsText: '135 (18d10 + 36)', speed: '10 ft., swim 40 ft.',
  challengeRating: '10', xp: 5900, dexterity: 9, dexterityModifier: -1, legendary: true,
  sourcePage: 261, sourceReference: 'SRD 5.1 p. 261'
};

const monster2024 = {
  id: 'srd-5.2.1-2024-monster-adult-black-dragon', ruleset: '2024', edition: 'srd-5.2.1-2024', sourceVersion: '5.2.1',
  name: 'Adult Black Dragon', size: 'Huge', type: 'Dragon', alignment: 'chaotic evil', armorClass: 19,
  armorClassText: '19', hitPoints: 195, hitPointsText: '195 (17d12 + 85)', speed: '40 ft., Fly 80 ft., Swim 40 ft.',
  challengeRating: '14', xp: 11500, dexterity: 14, dexterityModifier: 2, legendary: true,
  sourcePage: 274, sourceReference: 'SRD 5.2.1 p. 274'
};

function payload() {
  return { schemaVersion: 1, generatedBy: 'test', recordCount: 2, sources, monsters: [monster2014, monster2024] };
}

test('DungeonCards URL stays on the free deployed companion', () => {
  assert.equal(DUNGEON_CARDS_MONSTER_URL, 'https://cbw29512.github.io/DungeonCards/dm-forge/srd-monster-summaries.json');
});

test('monster summaries map into the existing Encounter Forge catalog contract', () => {
  const first = normalizeMonsterSummary(monster2014);
  assert.deepEqual({
    sourceId: first.sourceId,
    ruleset: first.ruleset,
    cr: first.cr,
    xp: first.xp,
    ac: first.ac,
    hp: first.hp,
    dex: first.dex,
    sourceReference: first.sourceReference,
    license: first.sourceLicense
  }, {
    sourceId: 'dungeoncards:srd-5.1-2014-monster-aboleth',
    ruleset: '5e-2014',
    cr: '10',
    xp: 5900,
    ac: 17,
    hp: 135,
    dex: 9,
    sourceReference: 'SRD 5.1 p. 261',
    license: 'CC BY 4.0'
  });
  assert.equal(normalizeMonsterSummary(monster2024).ruleset, '5e-2024');
});

test('export validation enforces counts, digests, licenses, editions, and unique IDs', () => {
  const normalized = normalizeMonsterExport(payload());
  assert.equal(normalized.recordCount, 2);
  assert.equal(normalized.monsters.length, 2);
  assert.equal(normalized.sources.length, 2);

  assert.throws(() => normalizeMonsterExport({ ...payload(), recordCount: 3 }), /counts disagree/);
  assert.throws(() => normalizeMonsterExport({ ...payload(), sources: [{ ...sources[0], license: 'Unknown' }, sources[1]] }), /unexpected license/);
  assert.throws(() => normalizeMonsterExport({ ...payload(), monsters: [monster2014, monster2014] }), /duplicate source IDs/);
  assert.throws(() => normalizeMonsterExport({ ...payload(), monsters: [{ ...monster2014, ruleset: 'homebrew' }, monster2024] }), /unsupported ruleset/);
});

test('loader supports dependency-injected fetch and reports HTTP failures', async () => {
  const loaded = await loadDungeonCardsMonsters({
    fetchImpl: async () => ({ ok: true, json: async () => payload() }),
    timeoutMs: 100
  });
  assert.equal(loaded.recordCount, 2);

  await assert.rejects(() => loadDungeonCardsMonsters({
    fetchImpl: async () => ({ ok: false, status: 503 }), timeoutMs: 100
  }), /HTTP 503/);
});
