export const DUNGEON_CARDS_MONSTER_URL = 'https://cbw29512.github.io/DungeonCards/dm-forge/srd-monster-summaries.json';
export const MONSTER_EXPORT_SCHEMA_VERSION = 1;

function cleanText(value, label, maximum = 240) {
  const text = String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim();
  if (!text) throw new Error(`Monster catalog record is missing ${label}.`);
  return text.slice(0, maximum);
}

function finiteNumber(value, label, minimum = 0) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum) throw new Error(`Monster catalog has an invalid ${label}.`);
  return number;
}

function publicCatalogRuleset(value) {
  if (String(value) === '2014') return '5e-2014';
  if (String(value) === '2024') return '5e-2024';
  throw new Error(`Monster catalog uses an unsupported ruleset: ${value}`);
}

export function normalizeMonsterSummary(record) {
  if (!record || typeof record !== 'object') throw new Error('Monster catalog record must be an object.');
  const sourceId = cleanText(record.id, 'source ID', 180);
  const sourceReference = cleanText(record.sourceReference, 'source reference', 120);
  const sourceVersion = cleanText(record.sourceVersion, 'source version', 20);
  const dexterity = finiteNumber(record.dexterity, 'Dexterity score', 1);
  const dexterityModifier = finiteNumber(record.dexterityModifier, 'Dexterity modifier', -20);
  if (dexterity > 40 || dexterityModifier > 20) throw new Error(`Monster catalog has an implausible Dexterity value for ${sourceId}.`);

  return {
    sourceId: `dungeoncards:${sourceId}`,
    sourceRecordId: sourceId,
    name: cleanText(record.name, 'name', 160),
    cr: cleanText(record.challengeRating, 'Challenge Rating', 12),
    xp: finiteNumber(record.xp, 'XP', 0),
    type: cleanText(record.type, 'creature type', 100).toLocaleLowerCase(),
    size: cleanText(record.size, 'size', 60),
    alignment: cleanText(record.alignment, 'alignment', 100),
    ruleset: publicCatalogRuleset(record.ruleset),
    ac: finiteNumber(record.armorClass, 'Armor Class', 0),
    acText: cleanText(record.armorClassText, 'Armor Class text', 160),
    hp: finiteNumber(record.hitPoints, 'Hit Points', 0),
    hpText: cleanText(record.hitPointsText, 'Hit Points text', 160),
    dex: dexterity,
    dexModifier: dexterityModifier,
    speed: cleanText(record.speed, 'speed', 240),
    legendary: Boolean(record.legendary),
    source: `${sourceReference} · DungeonCards`,
    sourceReference,
    sourceVersion,
    sourcePage: finiteNumber(record.sourcePage, 'source page', 1),
    sourceLicense: 'CC BY 4.0',
    catalogSource: 'dungeoncards-srd'
  };
}

export function normalizeMonsterExport(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('DungeonCards monster catalog response is not an object.');
  if (payload.schemaVersion !== MONSTER_EXPORT_SCHEMA_VERSION) throw new Error(`Unsupported DungeonCards monster schema: ${payload.schemaVersion}`);
  if (!Array.isArray(payload.sources) || payload.sources.length !== 2) throw new Error('DungeonCards monster catalog is missing its two SRD sources.');
  if (!Array.isArray(payload.monsters)) throw new Error('DungeonCards monster catalog is missing monster records.');

  const sourceCount = payload.sources.reduce((sum, source) => {
    if (source?.license !== 'CC BY 4.0') throw new Error('DungeonCards monster source has an unexpected license.');
    if (!/^[a-f0-9]{64}$/i.test(String(source?.sha256 || ''))) throw new Error('DungeonCards monster source is missing its PDF digest.');
    cleanText(source.attribution, 'source attribution', 1200);
    return sum + finiteNumber(source.monsterCount, 'source monster count', 1);
  }, 0);

  const declaredCount = finiteNumber(payload.recordCount, 'record count', 1);
  if (declaredCount !== payload.monsters.length || declaredCount !== sourceCount) {
    throw new Error(`DungeonCards monster counts disagree: declared ${declaredCount}, records ${payload.monsters.length}, sources ${sourceCount}.`);
  }

  const monsters = payload.monsters.map(normalizeMonsterSummary);
  const ids = new Set(monsters.map((monster) => monster.sourceId));
  if (ids.size !== monsters.length) throw new Error('DungeonCards monster catalog contains duplicate source IDs.');

  return {
    schemaVersion: payload.schemaVersion,
    recordCount: declaredCount,
    sources: structuredClone(payload.sources),
    monsters
  };
}

export async function loadDungeonCardsMonsters({
  url = DUNGEON_CARDS_MONSTER_URL,
  fetchImpl = globalThis.fetch,
  timeoutMs = 12000
} = {}) {
  if (typeof fetchImpl !== 'function') throw new Error('This browser cannot load the DungeonCards monster catalog.');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-cache',
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`DungeonCards monster catalog returned HTTP ${response.status}.`);
    return normalizeMonsterExport(await response.json());
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error('DungeonCards monster catalog timed out.');
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
