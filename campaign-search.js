'use strict';

const KEYS = {
  sessions: 'dmforge-session-console-v1',
  encounters: 'dmforge-encounter-forge-v1',
  npcs: 'dmforge-npc-forge-v1',
  loot: 'dmforge-loot-forge-v1',
  items: 'dmforge-magic-items-v2'
};

const TYPE_LABELS = { session: 'Session', encounter: 'Encounter', npc: 'NPC', loot: 'Loot', item: 'Magic Item', cleric: 'Cleric in a Box' };
const $ = (selector) => document.querySelector(selector);
let records = [];

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch (error) { console.error(`[CampaignSearch] Could not read ${key}`, error); return fallback; }
}

function clean(value, maximum = 12000) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maximum);
}

function validDate(value) {
  const time = Date.parse(value || '');
  return Number.isFinite(time) ? time : 0;
}

function routeWithCampaign(route, campaign) {
  const url = new URL(route, location.href);
  if (campaign) url.searchParams.set('campaign', campaign);
  return `${url.pathname.split('/').pop()}${url.search}`;
}

function flatten(value, excludedKeys = new Set(), depth = 0) {
  if (depth > 6 || value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return clean(value, 4000);
  if (Array.isArray(value)) return value.map((entry) => flatten(entry, excludedKeys, depth + 1)).filter(Boolean).join(' ');
  if (typeof value === 'object') return Object.entries(value).filter(([key]) => !excludedKeys.has(key)).map(([key, entry]) => `${key} ${flatten(entry, excludedKeys, depth + 1)}`).join(' ');
  return '';
}

function sessionRecords() {
  const state = readJson(KEYS.sessions, null);
  if (!state?.campaigns?.length) return [];
  const output = [];
  for (const campaign of state.campaigns) {
    const add = (session, status) => {
      if (!session) return;
      const logText = (session.log || []).map((entry) => entry.text).join(' ');
      const combatText = (session.initiative?.log || []).map((entry) => entry.text).join(' ');
      const generatorText = (session.generatorHistory || []).map((entry) => entry.text).join(' ');
      const prepText = Object.values(session.prep || {}).join(' ');
      output.push({
        id: `session-${status}-${session.id || output.length}`,
        type: 'session', campaign: campaign.name || 'Unsorted',
        title: session.title || (status === 'archived' ? 'Archived Session' : 'Current Session'),
        subtitle: `${status === 'archived' ? 'Archived' : 'Working session'}${session.date ? ` · ${session.date}` : ''}`,
        text: clean(`${prepText} ${logText} ${combatText} ${generatorText}`, 30000),
        updatedAt: validDate(session.archivedAt || session.updatedAt || session.createdAt),
        route: routeWithCampaign('session-console.html', campaign.name)
      });
    };
    add(campaign.session, 'working');
    (campaign.archives || []).forEach((session) => add(session, 'archived'));
  }
  return output;
}

function encounterRecords() {
  const state = readJson(KEYS.encounters, null);
  return (state?.encounters || []).map((encounter) => ({
    id: `encounter-${encounter.id}`,
    type: 'encounter', campaign: encounter.campaign || 'Unsorted',
    title: encounter.name || 'Untitled Encounter',
    subtitle: `${encounter.result?.difficulty || 'Unrated'} · ${encounter.environment || 'Other'} · ${encounter.ruleset || 'Rules not set'}`,
    text: clean(`${encounter.objective || ''} ${encounter.notes || ''} ${(encounter.monsters || []).map((monster) => `${monster.name} CR ${monster.cr} quantity ${monster.quantity}`).join(' ')} ${(encounter.party || []).map((character) => `${character.name} level ${character.level}`).join(' ')}`, 20000),
    updatedAt: validDate(encounter.updatedAt),
    route: routeWithCampaign('encounter-forge.html', encounter.campaign)
  }));
}

function npcRecords() {
  const stored = readJson(KEYS.npcs, { npcs: [] });
  const list = Array.isArray(stored) ? stored : stored.npcs || [];
  return list.map((npc) => ({
    id: `npc-${npc.id}`,
    type: 'npc', campaign: npc.campaign || 'Unsorted',
    title: npc.name || 'Unnamed NPC',
    subtitle: `${npc.role || 'NPC'}${npc.faction ? ` · ${npc.faction}` : ''}${npc.status ? ` · ${npc.status}` : ''}`,
    text: clean(flatten(npc, new Set(['id', 'updatedAt'])), 22000),
    updatedAt: validDate(npc.updatedAt),
    route: routeWithCampaign('npc-forge.html', npc.campaign)
  }));
}

function lootRecords() {
  const stored = readJson(KEYS.loot, { parcels: [] });
  const list = Array.isArray(stored) ? stored : stored.parcels || [];
  return list.map((parcel) => ({
    id: `loot-${parcel.id}`,
    type: 'loot', campaign: parcel.campaign || 'Unsorted',
    title: parcel.title || 'Untitled Treasure Parcel',
    subtitle: `${parcel.status || 'Planned'} · ${parcel.tier || 'Minor'}${parcel.source ? ` · ${parcel.source}` : ''}`,
    text: clean(flatten(parcel, new Set(['id', 'updatedAt'])), 24000),
    updatedAt: validDate(parcel.updatedAt),
    route: routeWithCampaign('loot-forge.html', parcel.campaign)
  }));
}

function magicItemRecords() {
  const list = readJson(KEYS.items, []);
  if (!Array.isArray(list)) return [];
  return list.map((item) => ({
    id: `item-${item.id}`,
    type: 'item', campaign: item.campaign || 'Unsorted',
    title: item.name || 'Unnamed Magic Item',
    subtitle: `${item.rarity || 'Homebrew'} · ${item.category || 'Magic Item'}${item.owner ? ` · ${item.owner}` : ''}`,
    text: clean(flatten(item, new Set(['id', 'updatedAt', 'artData'])), 26000),
    updatedAt: validDate(item.updatedAt),
    route: routeWithCampaign('magic-items.html', item.campaign)
  }));
}

function clericRecords() {
  const output = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith('cleric-box-')) continue;
    const state = readJson(key, null);
    if (!state) continue;
    const code = key.slice('cleric-box-'.length).toUpperCase();
    const history = (state.history || []).map((entry) => typeof entry === 'string' ? entry : entry.text || entry.result || '').join(' ');
    const charges = (state.charges || []).map((charge) => `${charge.level || charge.spellLevel || ''} ${charge.result || ''}`).join(' ');
    output.push({
      id: `cleric-${code}`, type: 'cleric', campaign: state.campaign || 'My Campaign',
      title: `Cleric in a Box · Room ${code}`,
      subtitle: `Level ${state.level || 1} · ${state.ruleset || 2014} rules · ${(state.charges || []).filter((charge) => !charge.spent).length} charges remaining`,
      text: clean(`${state.deity || ''} ${history} ${charges}`, 20000),
      updatedAt: validDate(state.updatedAt || state.createdAt),
      route: `https://cbw29512.github.io/healingbox/?host=${encodeURIComponent(code)}`
    });
  }
  return output;
}

function buildIndex() {
  records = [...sessionRecords(), ...encounterRecords(), ...npcRecords(), ...lootRecords(), ...magicItemRecords(), ...clericRecords()]
    .sort((a, b) => b.updatedAt - a.updatedAt || a.title.localeCompare(b.title));
}

function campaigns() {
  const shared = globalThis.DMForgeStore?.listCampaigns?.().map((campaign) => campaign.name) || [];
  return [...new Set([...shared, ...records.map((record) => record.campaign).filter(Boolean)])].sort((a, b) => a.localeCompare(b));
}

function renderCampaignOptions() {
  const selected = $('#campaignFilter').value;
  const names = campaigns();
  $('#campaignFilter').replaceChildren(new Option('All campaigns', 'all'), ...names.map((name) => new Option(name, name)));
  const requested = new URLSearchParams(location.search).get('campaign');
  if (requested && names.includes(requested)) $('#campaignFilter').value = requested;
  else if (names.includes(selected)) $('#campaignFilter').value = selected;
  else {
    const active = globalThis.DMForgeStore?.getActiveCampaign?.();
    if (active && names.includes(active.name)) $('#campaignFilter').value = active.name;
  }
}

function categoryCounts(filtered = records) {
  const counts = Object.fromEntries(Object.keys(TYPE_LABELS).map((type) => [type, 0]));
  filtered.forEach((record) => { counts[record.type] = (counts[record.type] || 0) + 1; });
  return counts;
}

function renderSummary() {
  const campaign = $('#campaignFilter').value;
  const scoped = campaign === 'all' ? records : records.filter((record) => record.campaign === campaign);
  const counts = categoryCounts(scoped);
  $('#summaryGrid').replaceChildren(...Object.entries(TYPE_LABELS).map(([type, label]) => {
    const card = document.createElement('article');
    card.className = 'summary-card';
    const strong = document.createElement('strong'); strong.textContent = counts[type] || 0;
    const span = document.createElement('span'); span.textContent = label;
    card.append(strong, span);
    return card;
  }));
}

function matches(record, queryTerms, campaign, type) {
  if (campaign !== 'all' && record.campaign !== campaign) return false;
  if (type !== 'all' && record.type !== type) return false;
  if (!queryTerms.length) return true;
  const haystack = `${record.title} ${record.subtitle} ${record.campaign} ${record.text}`.toLocaleLowerCase();
  return queryTerms.every((term) => haystack.includes(term));
}

function snippet(record, terms) {
  const source = clean(record.text, 30000);
  if (!source) return 'No searchable detail is stored for this record.';
  if (!terms.length) return source.slice(0, 280) + (source.length > 280 ? '…' : '');
  const lower = source.toLocaleLowerCase();
  const indexes = terms.map((term) => lower.indexOf(term)).filter((index) => index >= 0);
  const first = indexes.length ? Math.min(...indexes) : 0;
  const start = Math.max(0, first - 100);
  const end = Math.min(source.length, first + 220);
  return `${start ? '…' : ''}${source.slice(start, end)}${end < source.length ? '…' : ''}`;
}

function formatUpdated(time) {
  if (!time) return 'No update timestamp';
  return new Date(time).toLocaleString([], { month:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit' });
}

function resultCard(record, terms) {
  const article = document.createElement('article'); article.className = 'result-card';
  const head = document.createElement('div'); head.className = 'result-head';
  const titleWrap = document.createElement('div');
  const pill = document.createElement('span'); pill.className = 'type-pill'; pill.textContent = TYPE_LABELS[record.type];
  const title = document.createElement('h3'); title.textContent = record.title;
  const meta = document.createElement('p'); meta.className = 'result-meta'; meta.textContent = `${record.campaign} · ${record.subtitle} · ${formatUpdated(record.updatedAt)}`;
  titleWrap.append(pill, title, meta);
  const link = document.createElement('a'); link.className = 'btn light'; link.textContent = 'Open Source Tool'; link.href = record.route;
  if (record.route.startsWith('http')) { link.target = '_blank'; link.rel = 'noopener'; }
  head.append(titleWrap, link);
  const detail = document.createElement('div'); detail.className = 'snippet'; detail.textContent = snippet(record, terms);
  article.append(head, detail);
  return article;
}

function runSearch(event) {
  event?.preventDefault();
  const query = clean($('#query').value, 200).toLocaleLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  const campaign = $('#campaignFilter').value;
  const type = $('#typeFilter').value;
  const matched = records.filter((record) => matches(record, terms, campaign, type)).slice(0, query ? 200 : 60);
  $('#results').replaceChildren(...(matched.length ? matched.map((record) => resultCard(record, terms)) : [emptyState(query)]));
  $('#resultHeading').textContent = query ? 'Search Results' : 'Recent Records';
  $('#resultSummary').textContent = query ? `${matched.length} matching record${matched.length === 1 ? '' : 's'} on this browser.` : `Showing the ${matched.length} newest record${matched.length === 1 ? '' : 's'} for the selected filters.`;
  $('#searchStatus').textContent = `${records.length} total private record${records.length === 1 ? '' : 's'} indexed · ${matched.length} shown`;
  renderSummary();
}

function emptyState(query) {
  const section = document.createElement('section'); section.className = 'empty-state';
  const heading = document.createElement('h2'); heading.textContent = 'No matching records';
  const copy = document.createElement('p'); copy.textContent = query ? 'Try fewer words, a different campaign, or another record type.' : 'Create campaign records in the DM Forge tools and they will appear here.';
  section.append(heading, copy);
  return section;
}

function refreshIndex() {
  buildIndex();
  renderCampaignOptions();
  runSearch();
}

$('#searchForm').addEventListener('submit', runSearch);
$('#query').addEventListener('input', () => { clearTimeout(runSearch.timer); runSearch.timer = setTimeout(runSearch, 180); });
$('#campaignFilter').addEventListener('change', runSearch);
$('#typeFilter').addEventListener('change', runSearch);
$('#clearSearch').onclick = () => { $('#query').value = ''; $('#typeFilter').value = 'all'; runSearch(); };
window.addEventListener('storage', refreshIndex);
window.addEventListener('dmforge:store-changed', refreshIndex);
refreshIndex();
