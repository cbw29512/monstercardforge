import { monsters, homebrewExample } from './src/data/monsters.js';
import { CR_OPTIONS, RULES_VERIFICATION, evaluateEncounter, xpForCr } from './encounter-rules.js';
import { loadDungeonCardsMonsters } from './encounter-monster-catalog.js';

const STORAGE_KEY = 'dmforge-encounter-forge-v1';
const PENDING_KEY = 'dmforge-pending-encounter-v1';
const CATALOG_RENDER_LIMIT = 120;
const store = globalThis.DMForgeStore;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const nowIso = () => new Date().toISOString();
const uid = (prefix = 'id') => crypto.randomUUID ? `${prefix}-${crypto.randomUUID()}` : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[character]);

function readJson(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || 'null');
    return parsed ?? fallback;
  } catch (error) {
    console.error(`[EncounterForge] Could not read ${key}`, error);
    return fallback;
  }
}

function defaultCharacters() {
  return Array.from({ length: 4 }, (_, index) => ({ id: uid('character'), name: `Character ${index + 1}`, level: 5 }));
}

function activeCampaignName() {
  const requested = new URLSearchParams(location.search).get('campaign')?.trim();
  return requested || store?.getActiveCampaign()?.name || 'My Campaign';
}

function defaultProfile(campaign = activeCampaignName()) {
  return { id: uid('profile'), campaign, name: 'Core Party', ruleset: '2024', characters: defaultCharacters(), updatedAt: nowIso() };
}

function defaultState() {
  const profile = defaultProfile();
  return { version: 1, activeProfileId: profile.id, profiles: [profile], encounters: [], customMonsters: [] };
}

function normalizeState(raw) {
  const fallback = defaultState();
  if (!raw || typeof raw !== 'object') return fallback;
  const profiles = Array.isArray(raw.profiles) && raw.profiles.length ? raw.profiles : fallback.profiles;
  return {
    version: 1,
    activeProfileId: profiles.some((profile) => profile.id === raw.activeProfileId) ? raw.activeProfileId : profiles[0].id,
    profiles,
    encounters: Array.isArray(raw.encounters) ? raw.encounters : [],
    customMonsters: Array.isArray(raw.customMonsters) ? raw.customMonsters : []
  };
}

let state = normalizeState(readJson(STORAGE_KEY, null));
let roster = [];
let editingEncounterId = null;
let verifiedMonsters = [];
let verifiedSources = [];
let catalogLoadState = 'loading';
let catalogLoadError = '';

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  syncShared();
}

function profile() {
  return state.profiles.find((entry) => entry.id === state.activeProfileId) || state.profiles[0];
}

function cleanName(value, fallback = 'Untitled') {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 120) || fallback;
}

function crOptions(selected = '1') {
  return CR_OPTIONS.map((cr) => `<option value="${cr}" ${String(cr) === String(selected) ? 'selected' : ''}>${cr}</option>`).join('');
}

function rulesLabel(value) {
  if (value === '5e-2014') return '5e (2014)';
  if (value === '5e-2024') return '5.5e (2024)';
  return value === 'homebrew' ? 'Homebrew' : value;
}

function importedCatalog() {
  return [...monsters, homebrewExample].map((monster) => ({
    sourceId: monster.id,
    name: monster.name,
    cr: String(monster.cr),
    xp: xpForCr(monster.cr),
    type: monster.type || 'creature',
    ruleset: monster.ruleset || 'homebrew',
    ac: Number.parseInt(monster.ac, 10) || null,
    hp: Number.parseInt(monster.hp, 10) || null,
    dex: Number(monster.abilities?.dex) || 10,
    source: monster.source || 'Monster Card Forge',
    sourceReference: monster.source || 'Monster Card Forge',
    sourceLicense: monster.license || (monster.ruleset === 'homebrew' ? 'DM Forge Original Homebrew' : 'CC BY 4.0'),
    catalogSource: monster.ruleset === 'homebrew' ? 'homebrew-sample' : 'monster-card-forge'
  }));
}

function catalogKey(monster) {
  return `${String(monster.ruleset).toLocaleLowerCase()}|${String(monster.name).trim().toLocaleLowerCase()}`;
}

function catalog() {
  const merged = [];
  const seen = new Set();
  for (const monster of [...verifiedMonsters, ...importedCatalog()]) {
    const key = catalogKey(monster);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(monster);
  }
  return [...merged, ...state.customMonsters];
}

function renderCatalogSourceStatus() {
  const container = $('#catalogSourceStatus');
  if (!container) return;
  if (catalogLoadState === 'loading') {
    container.className = 'catalog-source-status loading';
    container.innerHTML = '<div><b>Loading verified DungeonCards SRD catalog…</b><span>Built-in samples and custom monsters remain available while it loads.</span></div>';
    return;
  }
  if (catalogLoadState === 'ready') {
    const count2014 = verifiedMonsters.filter((monster) => monster.ruleset === '5e-2014').length;
    const count2024 = verifiedMonsters.filter((monster) => monster.ruleset === '5e-2024').length;
    container.className = 'catalog-source-status ready';
    container.innerHTML = `<div><b>${verifiedMonsters.length.toLocaleString()} verified SRD monsters loaded</b><span>${count2014} from SRD 5.1 · ${count2024} from SRD 5.2.1 · Source pages and CC BY 4.0 attribution preserved.</span></div><a class="btn light" href="rules-compendium.html">Open Rules Compendium</a>`;
    return;
  }
  container.className = 'catalog-source-status warning';
  container.innerHTML = `<div><b>Verified catalog unavailable</b><span>${esc(catalogLoadError || 'DungeonCards could not be reached.')} Built-in samples and saved custom monsters still work.</span></div><button class="btn light" id="retryMonsterCatalog" type="button">Retry Catalog</button>`;
  $('#retryMonsterCatalog').onclick = loadVerifiedCatalog;
}

async function loadVerifiedCatalog() {
  catalogLoadState = 'loading';
  catalogLoadError = '';
  renderCatalogSourceStatus();
  try {
    const result = await loadDungeonCardsMonsters();
    verifiedMonsters = result.monsters;
    verifiedSources = result.sources;
    catalogLoadState = 'ready';
  } catch (error) {
    console.error('[EncounterForge] Could not load DungeonCards monster catalog', error);
    verifiedMonsters = [];
    verifiedSources = [];
    catalogLoadState = 'error';
    catalogLoadError = error?.message || 'The verified catalog could not be loaded.';
  }
  renderCatalogSourceStatus();
  renderFilters();
  renderCatalog();
}

function renderContext() {
  const campaign = activeCampaignName();
  const shared = store?.listCampaigns().find((entry) => entry.name.toLocaleLowerCase() === campaign.toLocaleLowerCase());
  const counts = shared ? store.counts(shared.id) : { encounters: 0, sessions: 0 };
  $('#sharedContext').innerHTML = `<div><b>Shared Campaign:</b> ${esc(campaign)}<span>${counts.encounters} saved encounter${counts.encounters === 1 ? '' : 's'} · ${counts.sessions} session record${counts.sessions === 1 ? '' : 's'}</span></div><div class="actions compact"><button class="btn light" id="makeEncounterCampaignActive" type="button">Use Everywhere</button><a class="btn light" href="campaigns.html">Campaign Hub</a></div>`;
  $('#makeEncounterCampaignActive').onclick = () => {
    store?.ensureCampaign(campaign, { source: 'encounter-forge', ruleset: profile().ruleset });
    store?.setActiveCampaign(campaign);
    renderContext();
  };
}

function renderProfiles() {
  const select = $('#profileSelect');
  select.innerHTML = state.profiles.map((entry) => `<option value="${esc(entry.id)}">${esc(entry.name)} · ${esc(entry.campaign)}</option>`).join('');
  select.value = profile().id;
  $('#profileName').value = profile().name;
  $('#ruleset').value = profile().ruleset;
  renderPartyRows();
}

function renderPartyRows() {
  $('#partyRows').innerHTML = profile().characters.map((character, index) => `<div class="party-row" data-character="${esc(character.id)}"><label>Character ${index + 1}<input data-character-name="${esc(character.id)}" maxlength="80" value="${esc(character.name)}"></label><label>Level<select data-character-level="${esc(character.id)}">${Array.from({ length: 20 }, (_, levelIndex) => `<option value="${levelIndex + 1}" ${Number(character.level) === levelIndex + 1 ? 'selected' : ''}>${levelIndex + 1}</option>`).join('')}</select></label><button class="btn light remove" type="button" data-remove-character="${esc(character.id)}" aria-label="Remove ${esc(character.name)}">Remove</button></div>`).join('');
  $$('[data-character-name]').forEach((input) => input.oninput = () => { profile().characters.find((entry) => entry.id === input.dataset.characterName).name = input.value; calculate(); });
  $$('[data-character-level]').forEach((select) => select.onchange = () => { profile().characters.find((entry) => entry.id === select.dataset.characterLevel).level = Number(select.value); calculate(); });
  $$('[data-remove-character]').forEach((button) => button.onclick = () => {
    if (profile().characters.length <= 1) return toast('Keep at least one character in the party.');
    profile().characters = profile().characters.filter((entry) => entry.id !== button.dataset.removeCharacter);
    renderPartyRows(); calculate();
  });
}

function saveProfile() {
  profile().name = cleanName($('#profileName').value, 'Party Profile');
  profile().ruleset = $('#ruleset').value;
  profile().campaign = activeCampaignName();
  profile().updatedAt = nowIso();
  persist(); renderProfiles(); calculate(); toast('Party profile saved.');
}

function newProfile() {
  const created = defaultProfile(activeCampaignName());
  created.name = `Party ${state.profiles.length + 1}`;
  state.profiles.push(created);
  state.activeProfileId = created.id;
  persist(); renderProfiles(); calculate();
}

function renderFilters() {
  const typeSelect = $('#typeFilter');
  const selectedType = typeSelect.value || 'all';
  const types = [...new Set(catalog().map((monster) => monster.type))].sort((a, b) => a.localeCompare(b));
  typeSelect.innerHTML = '<option value="all">All types</option>' + types.map((type) => `<option value="${esc(type)}">${esc(type)}</option>`).join('');
  typeSelect.value = types.includes(selectedType) ? selectedType : 'all';
  if (!$('#customCr').options.length) $('#customCr').innerHTML = crOptions('1');
}

function renderCatalog() {
  const search = $('#monsterSearch').value.trim().toLocaleLowerCase();
  const type = $('#typeFilter').value;
  const rules = $('#monsterRulesFilter').value;
  const matches = catalog().filter((monster) => (!search || `${monster.name} ${monster.type} ${monster.cr} ${monster.sourceReference || monster.source || ''}`.toLocaleLowerCase().includes(search)) && (type === 'all' || monster.type === type) && (rules === 'all' || monster.ruleset === rules));
  const visible = matches.slice(0, CATALOG_RENDER_LIMIT);
  const summary = $('#catalogResultSummary');
  if (summary) summary.textContent = matches.length > CATALOG_RENDER_LIMIT ? `Showing the first ${CATALOG_RENDER_LIMIT} of ${matches.length.toLocaleString()} matches. Search or filter to narrow the list.` : `${matches.length.toLocaleString()} monster${matches.length === 1 ? '' : 's'} match the current filters.`;
  $('#monsterCatalog').innerHTML = visible.length ? visible.map((monster) => `<article class="monster-option"><h3>${esc(monster.name)}</h3><div class="monster-meta">CR ${esc(monster.cr)} · ${Number(monster.xp).toLocaleString()} XP</div><div class="monster-meta">${esc(monster.type)} · ${esc(rulesLabel(monster.ruleset))}</div><p>AC ${monster.ac ?? '—'} · HP ${monster.hp ?? '—'} · Dex ${monster.dex ?? '—'}</p><small class="monster-source">${esc(monster.sourceReference || monster.source || 'Custom monster')} · ${esc(monster.sourceLicense || 'User-created')}</small><button class="btn light" type="button" data-add-monster="${esc(monster.sourceId)}">Add to Encounter</button></article>`).join('') : '<p class="empty-state">No monsters match these filters.</p>';
  $$('[data-add-monster]').forEach((button) => button.onclick = () => addMonster(button.dataset.addMonster));
}

function addMonster(sourceId, quantity = 1) {
  const source = catalog().find((monster) => monster.sourceId === sourceId);
  if (!source) return;
  const existing = roster.find((monster) => monster.sourceId === sourceId);
  if (existing) existing.quantity += quantity;
  else roster.push({ ...source, quantity });
  renderRoster(); calculate();
}

function addCustomMonster(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const monster = {
    sourceId: uid('custom-monster'), name: cleanName(data.name, 'Custom Monster'), cr: data.cr,
    xp: xpForCr(data.cr), type: cleanName(data.type, 'creature').toLocaleLowerCase(), ruleset: data.ruleset,
    ac: Number(data.ac) || null, hp: Number(data.hp) || null, dex: Number(data.dex) || 10,
    source: 'Encounter Forge custom', sourceReference: 'User-created custom monster',
    sourceLicense: 'User-created homebrew', catalogSource: 'encounter-forge-custom'
  };
  state.customMonsters.unshift(monster);
  persist(); renderFilters(); renderCatalog(); addMonster(monster.sourceId, Math.max(1, Number(data.quantity) || 1));
  event.currentTarget.reset(); $('#customCr').value = '1'; toast(`${monster.name} added and saved to the custom catalog.`);
}

function renderRoster() {
  const container = $('#encounterRoster');
  if (!roster.length) {
    container.innerHTML = '<div class="empty-state">Add monsters from the catalog or create a custom monster.</div>';
    return;
  }
  container.innerHTML = roster.map((monster) => `<article class="roster-row"><div><h3>${esc(monster.name)}</h3><small>CR ${esc(monster.cr)} · ${Number(monster.xp).toLocaleString()} XP each · AC ${monster.ac ?? '—'} · HP ${monster.hp ?? '—'}</small><small>${esc(monster.sourceReference || monster.source || 'Custom monster')}</small></div><div class="qty-controls"><button type="button" data-qty="${esc(monster.sourceId)}" data-delta="-1">−</button><b>${monster.quantity}</b><button type="button" data-qty="${esc(monster.sourceId)}" data-delta="1">+</button></div><b>${(monster.xp * monster.quantity).toLocaleString()} XP</b><button class="btn light" type="button" data-remove-monster="${esc(monster.sourceId)}">Remove</button></article>`).join('');
  $$('[data-qty]').forEach((button) => button.onclick = () => {
    const monster = roster.find((entry) => entry.sourceId === button.dataset.qty);
    if (!monster) return;
    monster.quantity += Number(button.dataset.delta);
    if (monster.quantity <= 0) roster = roster.filter((entry) => entry.sourceId !== monster.sourceId);
    renderRoster(); calculate();
  });
  $$('[data-remove-monster]').forEach((button) => button.onclick = () => { roster = roster.filter((entry) => entry.sourceId !== button.dataset.removeMonster); renderRoster(); calculate(); });
}

function evaluation() {
  return evaluateEncounter({ ruleset: $('#ruleset').value, characters: profile().characters, monsters: roster });
}

function calculate() {
  profile().ruleset = $('#ruleset').value;
  const result = evaluation();
  const grid = $('#budgetGrid');
  grid.style.gridTemplateColumns = `repeat(${result.thresholds.length},1fr)`;
  grid.innerHTML = result.labels.map((label, index) => `<div class="budget-card"><span>${esc(label)}</span><b>${Number(result.thresholds[index]).toLocaleString()}</b></div>`).join('');
  $('#rawXp').textContent = result.rawXp.toLocaleString();
  $('#adjustedXp').textContent = result.adjustedXp.toLocaleString();
  $('#monsterCount').textContent = result.monsterCount;
  $('#multiplier').textContent = `×${result.multiplier}`;
  $('#adjustedLabel').textContent = result.ruleset === '2014' ? 'Adjusted XP' : 'Budget XP';
  const badge = $('#difficultyBadge');
  badge.textContent = result.difficulty;
  badge.className = `difficulty-badge ${result.difficulty.toLocaleLowerCase().replace(/\s+/g, '-')}`;
  $('#warningList').innerHTML = result.warnings.length ? result.warnings.map((warning) => `<div class="warning">${esc(warning)}</div>`).join('') : '<div class="ready-note">No automatic warnings. Difficulty math is a guideline; terrain, surprise, resources, and monster abilities still matter.</div>';
  renderContext();
}

function encounterSnapshot() {
  const result = evaluation();
  return {
    id: editingEncounterId || uid('encounter'), campaign: activeCampaignName(), name: cleanName($('#encounterName').value, 'Untitled Encounter'),
    environment: $('#environment').value, objective: $('#objective').value.trim().slice(0, 240), notes: $('#encounterNotes').value.trim().slice(0, 4000),
    ruleset: $('#ruleset').value, profileId: profile().id,
    party: profile().characters.map((character) => ({ name: cleanName(character.name, 'Character'), level: Number(character.level) })),
    monsters: roster.map((monster) => ({ ...monster })),
    result: { rawXp: result.rawXp, adjustedXp: result.adjustedXp, multiplier: result.multiplier, difficulty: result.difficulty, monsterCount: result.monsterCount, warnings: result.warnings },
    updatedAt: nowIso()
  };
}

function saveEncounter() {
  if (!roster.length) return toast('Add at least one monster before saving.');
  const encounter = encounterSnapshot();
  const index = state.encounters.findIndex((entry) => entry.id === encounter.id);
  if (index >= 0) state.encounters[index] = encounter;
  else state.encounters.unshift(encounter);
  editingEncounterId = encounter.id;
  persist(); renderSaved(); toast('Encounter saved to this browser and shared campaign summary.');
}

function loadEncounter(id) {
  const encounter = state.encounters.find((entry) => entry.id === id);
  if (!encounter) return;
  editingEncounterId = encounter.id;
  $('#encounterName').value = encounter.name;
  $('#environment').value = encounter.environment || 'Other';
  $('#objective').value = encounter.objective || '';
  $('#encounterNotes').value = encounter.notes || '';
  $('#ruleset').value = encounter.ruleset || '2024';
  const loadedProfile = state.profiles.find((entry) => entry.id === encounter.profileId);
  if (loadedProfile) state.activeProfileId = loadedProfile.id;
  else {
    const created = { id: uid('profile'), campaign: encounter.campaign, name: `${encounter.name} Party`, ruleset: encounter.ruleset, characters: encounter.party.map((character) => ({ id: uid('character'), ...character })), updatedAt: nowIso() };
    state.profiles.push(created); state.activeProfileId = created.id;
  }
  roster = encounter.monsters.map((monster) => ({ ...monster }));
  renderProfiles(); renderRoster(); calculate(); window.scrollTo({ top: 0, behavior: 'smooth' });
}

function duplicateEncounter(id) {
  const source = state.encounters.find((entry) => entry.id === id);
  if (!source) return;
  state.encounters.unshift({ ...structuredClone(source), id: uid('encounter'), name: `${source.name} — Copy`, updatedAt: nowIso() });
  persist(); renderSaved();
}

function deleteEncounter(id) {
  if (!confirm('Delete this saved encounter?')) return;
  state.encounters = state.encounters.filter((entry) => entry.id !== id);
  if (editingEncounterId === id) editingEncounterId = null;
  persist(); renderSaved();
}

function renderSaved() {
  const campaign = activeCampaignName().toLocaleLowerCase();
  const visible = state.encounters.filter((encounter) => encounter.campaign.toLocaleLowerCase() === campaign);
  $('#savedEncounters').innerHTML = visible.length ? visible.map((encounter) => `<article class="saved-card"><h3>${esc(encounter.name)}</h3><p class="saved-meta">${esc(encounter.environment)} · ${esc(encounter.ruleset)} rules · Updated ${new Date(encounter.updatedAt).toLocaleDateString()}</p><div class="saved-stats"><div><b>${esc(encounter.result.difficulty)}</b>Difficulty</div><div><b>${Number(encounter.result.adjustedXp).toLocaleString()}</b>${encounter.ruleset === '2014' ? 'Adjusted XP' : 'XP'}</div><div><b>${encounter.result.monsterCount}</b>Creatures</div></div><div class="actions compact"><button class="btn light" data-load-encounter="${esc(encounter.id)}" type="button">Load</button><button class="btn light" data-copy-encounter="${esc(encounter.id)}" type="button">Duplicate</button><button class="btn danger" data-delete-encounter="${esc(encounter.id)}" type="button">Delete</button></div></article>`).join('') : '<p class="empty-state">No encounters saved for this campaign yet.</p>';
  $$('[data-load-encounter]').forEach((button) => button.onclick = () => loadEncounter(button.dataset.loadEncounter));
  $$('[data-copy-encounter]').forEach((button) => button.onclick = () => duplicateEncounter(button.dataset.copyEncounter));
  $$('[data-delete-encounter]').forEach((button) => button.onclick = () => deleteEncounter(button.dataset.deleteEncounter));
}

function randomInt(max) {
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  do crypto.getRandomValues(buffer); while (buffer[0] >= limit);
  return buffer[0] % max;
}

function initiativeFor(monster, mode) {
  const modifier = Math.floor(((Number(monster.dex) || 10) - 10) / 2);
  if (mode === 'zero') return 0;
  if (mode === 'score') return 10 + modifier;
  return randomInt(20) + 1 + modifier;
}

function expandedCombatants(encounter, mode) {
  const combatants = [];
  for (const monster of encounter.monsters) {
    for (let index = 1; index <= monster.quantity; index += 1) {
      const name = monster.quantity > 1 ? `${monster.name} ${index}` : monster.name;
      const dexModifier = Math.floor(((Number(monster.dex) || 10) - 10) / 2);
      combatants.push({ id: uid('combatant'), name, type: 'enemy', initiative: initiativeFor(monster, mode), dex: dexModifier, ac: monster.ac ?? null, maxHp: monster.hp ?? null, currentHp: monster.hp ?? null, conditions: [] });
    }
  }
  return combatants.sort((a, b) => b.initiative - a.initiative || b.dex - a.dex || a.name.localeCompare(b.name));
}

function launchSession() {
  if (!roster.length) return toast('Add monsters before launching the encounter.');
  const encounter = encounterSnapshot();
  const payload = { version: 1, createdAt: nowIso(), campaign: encounter.campaign, encounterId: encounter.id, name: encounter.name, ruleset: encounter.ruleset, combatants: expandedCombatants(encounter, $('#initiativeMode').value), notes: encounter.notes, objective: encounter.objective };
  localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
  saveEncounter();
  location.href = `session-console.html?campaign=${encodeURIComponent(encounter.campaign)}&importEncounter=1`;
}

function syncShared() {
  if (!store) return;
  store.ensureCampaign(activeCampaignName(), { source: 'encounter-forge', ruleset: profile().ruleset });
  store.syncEncounters?.(state.encounters);
}

function printPacket() {
  const encounter = encounterSnapshot();
  const result = evaluation();
  const partyRows = encounter.party.map((character) => `<tr><td>${esc(character.name)}</td><td>${character.level}</td></tr>`).join('');
  const monsterRows = encounter.monsters.map((monster) => `<tr><td>${esc(monster.name)}</td><td>${monster.quantity}</td><td>${esc(monster.cr)}</td><td>${Number(monster.xp).toLocaleString()}</td><td>${monster.ac ?? '—'}</td><td>${monster.hp ?? '—'}</td><td>${esc(monster.sourceReference || monster.source || 'Custom')}</td></tr>`).join('');
  const sourceNote = verifiedSources.length ? '<p><b>Catalog sources:</b> SRD 5.1 and SRD 5.2.1, CC BY 4.0, generated and validated by DungeonCards.</p>' : '<p><b>Catalog source:</b> Built-in samples and user-created custom monsters.</p>';
  $('#printPacket').innerHTML = `<h1>${esc(encounter.name)}</h1><p>${esc(encounter.campaign)} · ${esc(encounter.ruleset)} rules · ${esc(encounter.environment)}</p><div class="print-summary"><div><b>${esc(result.difficulty)}</b><br>Difficulty</div><div><b>${result.rawXp.toLocaleString()}</b><br>Base XP</div><div><b>${result.adjustedXp.toLocaleString()}</b><br>${result.ruleset === '2014' ? 'Adjusted XP' : 'Budget XP'}</div><div><b>${result.monsterCount}</b><br>Creatures</div></div><div class="print-grid"><section class="print-block"><h2>Party</h2><table class="print-table"><thead><tr><th>Character</th><th>Level</th></tr></thead><tbody>${partyRows}</tbody></table></section><section class="print-block"><h2>Scene</h2><p><b>Objective:</b> ${esc(encounter.objective || '—')}</p><p><b>Terrain / tactics:</b> ${esc(encounter.notes || '—')}</p></section><section class="print-block wide"><h2>Opposition</h2><table class="print-table"><thead><tr><th>Monster</th><th>Qty</th><th>CR</th><th>XP Each</th><th>AC</th><th>HP</th><th>Source</th></tr></thead><tbody>${monsterRows}</tbody></table>${sourceNote}</section><section class="print-block wide"><h2>Warnings and Reminders</h2>${result.warnings.length ? result.warnings.map((warning) => `<p class="print-warning">${esc(warning)}</p>`).join('') : '<p>No automatic warnings.</p>'}<p>Difficulty is a planning guideline. Terrain, surprise, resources, monster abilities, and player tactics can change the result.</p><p><b>Encounter math verified:</b> ${RULES_VERIFICATION.verifiedAt}</p></section></div>`;
  window.print();
}

function exportEncounters() {
  const blob = new Blob([JSON.stringify({ product: 'DM Forge Encounter Forge', version: 1, exportedAt: nowIso(), state }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = 'dm-forge-encounters.json'; anchor.click(); URL.revokeObjectURL(url);
}

function clearCurrent() {
  if (roster.length && !confirm('Clear the current encounter roster and scene details?')) return;
  roster = []; editingEncounterId = null; $('#encounterName').value = 'New Encounter'; $('#objective').value = ''; $('#encounterNotes').value = ''; renderRoster(); calculate();
}

function toast(message) {
  const element = document.createElement('div');
  element.textContent = message; element.setAttribute('role', 'status');
  element.style = 'position:fixed;z-index:120;left:50%;bottom:20px;transform:translateX(-50%);background:#281713;color:#fff4ce;padding:12px 18px;border:1px solid #d4a64c;border-radius:8px;max-width:90vw;box-shadow:0 8px 30px #0008';
  document.body.append(element); setTimeout(() => element.remove(), 3000);
}

$('#profileSelect').onchange = () => { state.activeProfileId = $('#profileSelect').value; renderProfiles(); calculate(); };
$('#newProfile').onclick = newProfile;
$('#saveProfile').onclick = saveProfile;
$('#addCharacter').onclick = () => { profile().characters.push({ id: uid('character'), name: `Character ${profile().characters.length + 1}`, level: 5 }); renderPartyRows(); calculate(); };
$('#ruleset').onchange = calculate;
$('#monsterSearch').oninput = renderCatalog;
$('#typeFilter').onchange = renderCatalog;
$('#monsterRulesFilter').onchange = renderCatalog;
$('#customMonsterForm').onsubmit = addCustomMonster;
$('#saveEncounter').onclick = saveEncounter;
$('#clearEncounter').onclick = clearCurrent;
$('#launchSession').onclick = launchSession;
$('#printEncounter').onclick = printPacket;
$('#exportEncounters').onclick = exportEncounters;

for (const selector of ['#encounterName','#environment','#objective','#encounterNotes']) $(selector).addEventListener('input', calculate);
window.addEventListener('storage', (event) => { if (event.key === store?.STORAGE_KEY) { renderContext(); renderSaved(); } });
window.addEventListener('dmforge:store-changed', renderContext);

renderCatalogSourceStatus();
renderFilters();
renderProfiles();
renderCatalog();
renderRoster();
renderSaved();
syncShared();
calculate();
loadVerifiedCatalog();
