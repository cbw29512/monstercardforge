import { evaluateEncounter } from '../encounter-rules.js';
import { loadDungeonCardsMonsters } from '../encounter-monster-catalog.js';

const HANDOFF_KEY = 'dmforge-dungeoncards-encounter-handoff-v1';
const STORAGE_KEY = 'dmforge-encounter-forge-v1';
const MAX_HANDOFF_AGE_MS = 15 * 60 * 1000;

function uid(prefix) {
  const random = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${random}`;
}

function readJson(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); }
  catch (error) { console.error('[DungeonCardsEncounterAdapter]', error); return null; }
}

function cleanText(value, maximum = 160) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maximum);
}

function validHandoff(payload) {
  if (!payload || payload.version !== 1 || !Array.isArray(payload.monsters) || !payload.monsters.length) return false;
  if (!['2014', '2024'].includes(String(payload.ruleset))) return false;
  const createdAt = Date.parse(payload.createdAt);
  if (!Number.isFinite(createdAt) || Date.now() - createdAt > MAX_HANDOFF_AGE_MS) return false;
  return payload.monsters.length <= 100;
}

function profileFor(state, campaign, ruleset) {
  const profiles = Array.isArray(state.profiles) ? state.profiles : [];
  let profile = profiles.find((entry) => String(entry.campaign || '').toLocaleLowerCase() === campaign.toLocaleLowerCase())
    || profiles.find((entry) => entry.id === state.activeProfileId)
    || profiles[0];
  if (!profile) throw new Error('Encounter Forge has no party profile available for this import.');
  profile.campaign = campaign;
  profile.ruleset = ruleset;
  profile.updatedAt = new Date().toISOString();
  state.activeProfileId = profile.id;
  return profile;
}

function catalogRuleset(value) {
  return value === '2014' ? '5e-2014' : '5e-2024';
}

function matchMonster(catalog, requested) {
  const ruleset = catalogRuleset(String(requested.ruleset));
  const recordId = cleanText(requested.sourceRecordId, 180);
  const name = cleanText(requested.name).toLocaleLowerCase();
  return catalog.find((monster) => monster.sourceRecordId === recordId && monster.ruleset === ruleset)
    || catalog.find((monster) => monster.ruleset === ruleset && monster.name.toLocaleLowerCase() === name)
    || null;
}

function notify(message, type = 'status') {
  const element = document.createElement('div');
  element.textContent = message;
  element.setAttribute('role', type);
  element.style = 'position:fixed;z-index:160;left:50%;bottom:20px;transform:translateX(-50%);background:#281713;color:#fff4ce;padding:12px 18px;border:1px solid #d4a64c;border-radius:8px;max-width:min(92vw,760px);box-shadow:0 8px 30px #0008';
  document.body.append(element);
  setTimeout(() => element.remove(), 5000);
}

async function createImportedEncounter(payload) {
  const state = readJson(STORAGE_KEY);
  if (!state || !Array.isArray(state.profiles)) throw new Error('Encounter Forge storage is not ready. Reload and try the transfer again.');

  const exported = await loadDungeonCardsMonsters();
  const campaign = cleanText(payload.campaign, 100) || 'My Campaign';
  const ruleset = String(payload.ruleset);
  const partyProfile = profileFor(state, campaign, ruleset);
  const missing = [];
  const monsters = [];

  for (const requested of payload.monsters) {
    const source = matchMonster(exported.monsters, requested);
    if (!source) {
      missing.push(cleanText(requested.name) || 'Unknown monster');
      continue;
    }
    const quantity = Math.min(99, Math.max(1, Number(requested.quantity) || 1));
    const existing = monsters.find((entry) => entry.sourceId === source.sourceId);
    if (existing) existing.quantity = Math.min(99, existing.quantity + quantity);
    else monsters.push({ ...source, quantity });
  }

  if (!monsters.length) throw new Error('None of the selected DungeonCards monsters could be matched to the verified Encounter Forge catalog.');

  const result = evaluateEncounter({ ruleset, characters: partyProfile.characters, monsters });
  const encounter = {
    id: uid('encounter'),
    campaign,
    name: 'DungeonCards Encounter',
    environment: 'Other',
    objective: '',
    notes: `Imported from DungeonCards My Encounter.${missing.length ? ` Unmatched: ${missing.join(', ')}.` : ''}`,
    ruleset,
    profileId: partyProfile.id,
    party: partyProfile.characters.map((character) => ({ name: cleanText(character.name, 80) || 'Character', level: Number(character.level) || 1 })),
    monsters,
    result: {
      rawXp: result.rawXp,
      adjustedXp: result.adjustedXp,
      multiplier: result.multiplier,
      difficulty: result.difficulty,
      monsterCount: result.monsterCount,
      warnings: result.warnings
    },
    updatedAt: new Date().toISOString()
  };

  state.encounters = Array.isArray(state.encounters) ? state.encounters : [];
  state.encounters.unshift(encounter);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  localStorage.removeItem(HANDOFF_KEY);
  return { encounter, missing };
}

function openImportedEncounter(id) {
  const escaped = globalThis.CSS?.escape ? CSS.escape(id) : id.replace(/[^a-zA-Z0-9_-]/g, '');
  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    const button = document.querySelector(`[data-load-encounter="${escaped}"]`);
    if (button) {
      clearInterval(timer);
      button.click();
      const url = new URL(location.href);
      url.searchParams.delete('loadDungeonCardsEncounter');
      url.searchParams.set('importedDungeonCards', '1');
      history.replaceState(null, '', `${url.pathname}?${url.searchParams}`);
      notify('DungeonCards monsters imported. Review party levels, quantities, terrain, and warnings before saving or launching.');
    } else if (attempts >= 50) {
      clearInterval(timer);
      notify('The imported encounter was saved, but Encounter Forge could not open it automatically. Load “DungeonCards Encounter” under Saved Encounters.', 'alert');
    }
  }, 100);
}

async function run() {
  const parameters = new URLSearchParams(location.search);
  const loadId = parameters.get('loadDungeonCardsEncounter');
  if (loadId) {
    openImportedEncounter(loadId);
    return;
  }

  if (parameters.get('importDungeonCards') !== '1') return;
  const payload = readJson(HANDOFF_KEY);
  if (!validHandoff(payload)) {
    localStorage.removeItem(HANDOFF_KEY);
    notify('The DungeonCards transfer was missing, expired, or invalid. Return to My Encounter and send it again.', 'alert');
    return;
  }

  try {
    const { encounter, missing } = await createImportedEncounter(payload);
    const url = new URL(location.href);
    url.searchParams.delete('importDungeonCards');
    url.searchParams.set('campaign', encounter.campaign);
    url.searchParams.set('loadDungeonCardsEncounter', encounter.id);
    if (missing.length) url.searchParams.set('unmatched', String(missing.length));
    location.replace(`${url.pathname}?${url.searchParams}`);
  } catch (error) {
    console.error('[DungeonCardsEncounterAdapter]', error);
    notify(error?.message || 'DungeonCards encounter import failed.', 'alert');
  }
}

run();
