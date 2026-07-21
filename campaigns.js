'use strict';

const store = globalThis.DMForgeStore;
const grid = document.getElementById('campaignGrid');
const activeName = document.getElementById('activeCampaignName');
const activeSummary = document.getElementById('activeCampaignSummary');
const sessionLink = document.getElementById('openSessionConsole');
const encounterLink = document.getElementById('openEncounterForge');
const npcLink = document.getElementById('openNpcForge');
const lootLink = document.getElementById('openLootForge');
const itemLink = document.getElementById('openMagicItems');
const monsterLink = document.getElementById('openMonsterCards');
const healingLink = document.getElementById('openHealingBox');
const searchLink = document.getElementById('openCampaignSearch');

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[character]);
}

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch (error) { console.error(`[CampaignHub] Could not read ${key}`, error); return fallback; }
}

function refreshFromTools() {
  const sessions = readJson('dmforge-session-console-v1', null);
  const items = readJson('dmforge-magic-items-v2', []);
  const encounters = readJson('dmforge-encounter-forge-v1', null);
  const npcs = readJson('dmforge-npc-forge-v1', null);
  const loot = readJson('dmforge-loot-forge-v1', null);
  if (sessions) store.syncSessionConsole(sessions);
  if (Array.isArray(items)) store.syncMagicItems(items);
  if (Array.isArray(encounters?.encounters)) store.syncEncounters(encounters.encounters);
  if (Array.isArray(npcs?.npcs)) store.syncNpcs(npcs.npcs);
  if (Array.isArray(loot?.parcels)) store.syncLoot(loot.parcels);

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith('cleric-box-')) continue;
    const room = key.slice('cleric-box-'.length).toUpperCase();
    const roomState = readJson(key, null);
    if (roomState) store.syncHealingRoom(room, roomState);
  }
  render();
}

function campaignLink(route, campaignName) {
  const url = new URL(route, location.href);
  url.searchParams.set('campaign', campaignName);
  return `${url.pathname.split('/').pop()}?${url.searchParams}`;
}

function setToolLinks(campaign) {
  if (!campaign) {
    sessionLink.href = 'session-console.html'; encounterLink.href = 'encounter-forge.html'; npcLink.href = 'npc-forge.html'; lootLink.href = 'loot-forge.html'; itemLink.href = 'magic-items.html'; monsterLink.href = 'monster-cards.html'; healingLink.href = 'https://cbw29512.github.io/healingbox/'; searchLink.href = 'campaign-search.html';
    return;
  }
  sessionLink.href = campaignLink('session-console.html', campaign.name);
  encounterLink.href = campaignLink('encounter-forge.html', campaign.name);
  npcLink.href = campaignLink('npc-forge.html', campaign.name);
  lootLink.href = campaignLink('loot-forge.html', campaign.name);
  itemLink.href = campaignLink('magic-items.html', campaign.name);
  searchLink.href = campaignLink('campaign-search.html', campaign.name);
  monsterLink.href = 'monster-cards.html';
  const healing = new URL('https://cbw29512.github.io/healingbox/');
  healing.searchParams.set('campaign', campaign.name);
  healingLink.href = healing.toString();
}

function renderActive() {
  const active = store.getActiveCampaign();
  if (!active) {
    activeName.textContent = 'No campaign selected';
    activeSummary.textContent = 'Create or select a campaign to begin.';
    setToolLinks(null);
    return;
  }
  const counts = store.counts(active.id);
  activeName.textContent = active.name;
  activeSummary.textContent = `${counts.sessions} sessions · ${counts.encounters} encounters · ${counts.npcs} NPCs · ${counts.loot} loot parcels · ${counts.magicItems} magic items · ${counts.healingRooms} artifact rooms`;
  setToolLinks(active);
}

function renderCampaigns() {
  const campaigns = store.listCampaigns();
  const active = store.getActiveCampaign();
  if (!campaigns.length) {
    grid.innerHTML = '<div class="empty-state"><h2>No shared campaigns yet</h2><p>Create one above or press Refresh from Tools to import campaign names from Session Console, Encounter Forge, NPC Forge, Loot Forge, and Magic Item Forge.</p></div>';
    return;
  }
  grid.innerHTML = campaigns.map((campaign) => {
    const counts = store.counts(campaign.id);
    const isActive = active?.id === campaign.id;
    const rulesets = campaign.rulesets?.length ? campaign.rulesets.join(', ') : 'Not specified';
    const sources = campaign.sources?.length ? campaign.sources.join(', ') : 'Campaign Hub';
    return `<article class="campaign-card ${isActive ? 'active' : ''}"><span class="status ${isActive ? 'active' : ''}">${isActive ? 'ACTIVE' : 'CAMPAIGN'}</span><h3>${esc(campaign.name)}</h3><p><b>Rules:</b> ${esc(rulesets)}</p><p class="source-list"><b>Found in:</b> ${esc(sources)}</p><div class="count-grid"><div><b>${counts.sessions}</b>Sessions</div><div><b>${counts.encounters}</b>Encounters</div><div><b>${counts.npcs}</b>NPCs</div><div><b>${counts.loot}</b>Loot</div><div><b>${counts.magicItems}</b>Items</div><div><b>${counts.healingRooms}</b>Boxes</div></div><div class="card-actions"><button class="btn gold" type="button" data-active="${esc(campaign.id)}">Make Active</button><a class="btn light" href="${campaignLink('campaign-search.html', campaign.name)}">Search</a><a class="btn light" href="${campaignLink('session-console.html', campaign.name)}">Sessions</a><a class="btn light" href="${campaignLink('encounter-forge.html', campaign.name)}">Encounters</a><a class="btn light" href="${campaignLink('npc-forge.html', campaign.name)}">NPCs</a><a class="btn light" href="${campaignLink('loot-forge.html', campaign.name)}">Loot</a><a class="btn light" href="${campaignLink('magic-items.html', campaign.name)}">Items</a></div></article>`;
  }).join('');
  document.querySelectorAll('[data-active]').forEach((button) => { button.onclick = () => { store.setActiveCampaign(button.dataset.active); render(); }; });
}

function render() { renderActive(); renderCampaigns(); }
function createCampaign(event) {
  event.preventDefault();
  const input = document.getElementById('campaignName');
  const name = input.value.trim();
  if (!name) return;
  store.ensureCampaign(name, { source: 'campaign-hub', ruleset: document.getElementById('campaignRuleset').value });
  store.setActiveCampaign(name);
  input.value = '';
  render();
}
function exportSummary() {
  const blob = new Blob([JSON.stringify({ product: 'DM Forge Campaign Hub', exportedAt: new Date().toISOString(), sharedStore: store.snapshot() }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'dm-forge-shared-campaign-summary.json'; anchor.click(); URL.revokeObjectURL(url);
}

document.getElementById('campaignForm').addEventListener('submit', createCampaign);
document.getElementById('refreshSources').onclick = refreshFromTools;
document.getElementById('exportSummary').onclick = exportSummary;
window.addEventListener('dmforge:store-changed', render);
window.addEventListener('storage', (event) => {
  if ([store.STORAGE_KEY, 'dmforge-session-console-v1', 'dmforge-magic-items-v2', 'dmforge-encounter-forge-v1', 'dmforge-npc-forge-v1', 'dmforge-loot-forge-v1'].includes(event.key) || event.key?.startsWith('cleric-box-')) refreshFromTools();
});

refreshFromTools();
