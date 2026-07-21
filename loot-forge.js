'use strict';

const STORAGE_KEY = 'dmforge-loot-forge-v1';
const SESSION_KEY = 'dmforge-session-console-v1';
const MAGIC_KEY = 'dmforge-magic-items-v2';
const form = document.getElementById('lootForm');
const preview = document.getElementById('preview');
const libraryGrid = document.getElementById('libraryGrid');
const campaignFilter = document.getElementById('campaignFilter');
const statusFilter = document.getElementById('statusFilter');
const lootSearch = document.getElementById('lootSearch');
const printSheet = document.getElementById('printSheet');
const store = globalThis.DMForgeStore;
let library = loadLibrary();
let editingId = null;
let previewMode = 'player';

const VALUABLES = [
  'A velvet pouch containing three cloudy moonstones',
  'A chased-silver cup bearing a scratched-out family crest',
  'A lacquered box of rare red incense',
  'Six trade bars stamped by a distant river guild',
  'A miniature portrait framed in green enamel',
  'A string of black pearls knotted with blue silk',
  'A bundle of saffron, cinnamon, and dried citrus peel',
  'An ivory game set missing one crowned piece',
  'A brass astrolabe with a concealed compartment',
  'A folded length of shimmering ceremonial cloth'
];
const MUNDANE = [
  'A waterproof map case', 'A coil of fine silk rope', 'Three sealed healer’s kits', 'A brass key with no obvious lock',
  'A collapsible ten-foot pole', 'A set of marked playing cards', 'A traveler’s cloak with hidden pockets', 'A small crowbar etched with tally marks',
  'Two hooded lanterns and four flasks of oil', 'A leather journal written in shorthand', 'A bundle of climbing pitons', 'A silvered signal whistle'
];
const CLUES = [
  'A shipping manifest names a buyer who should not be involved.',
  'A coded letter refers to a meeting beneath the old bridge.',
  'A broken seal matches one carried by a local official.',
  'A child’s drawing shows a hidden entrance behind a shrine.',
  'A receipt proves the parcel changed hands three times in one night.',
  'A map marks a safe house that burned down years ago.',
  'A witness list includes one person believed to be dead.',
  'A prayer card contains a route written in invisible ink.'
];
const MAGIC_NAMES = [
  'Lantern of the Last Ferry', 'Ashen Compass', 'Ring of Quiet Footsteps', 'Stormglass Vial', 'The Wayfarer’s Red Thread',
  'Moonwake Buckler', 'Candle of Remembered Voices', 'The Locksmith’s Mercy', 'Hearth-Spark Charm', 'Mirror of the Second Answer',
  'Gravebell Token', 'Wand of the Patient Thorn', 'Cloak of Borrowed Starlight', 'The Cartographer’s Needle', 'Winter-Sleep Brooch'
];
const PLAYER_NOTES = [
  'The parcel is wrapped in oilcloth and marked with three crossed-out destination labels.',
  'Everything inside smells faintly of cedar smoke and salt water.',
  'The container is old but recently repaired with expensive brass fittings.',
  'Several objects have been carefully cleaned, but dark residue remains in the seams.',
  'A handwritten inventory has one line deliberately cut away.'
];

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[character]);
}

function uid(prefix = 'loot') {
  return crypto.randomUUID ? `${prefix}-${crypto.randomUUID()}` : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function secureInt(maximum) {
  const limit = Math.floor(0x100000000 / maximum) * maximum;
  const value = new Uint32Array(1);
  do crypto.getRandomValues(value); while (value[0] >= limit);
  return value[0] % maximum;
}

function pick(list) {
  return list[secureInt(list.length)];
}

function roll(count, sides) {
  let total = 0;
  for (let index = 0; index < count; index += 1) total += secureInt(sides) + 1;
  return total;
}

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch (error) { console.error(`[LootForge] Could not read ${key}`, error); return fallback; }
}

function loadLibrary() {
  const stored = readJson(STORAGE_KEY, { version: 1, parcels: [] });
  return Array.isArray(stored) ? stored.map(normalize) : Array.isArray(stored.parcels) ? stored.parcels.map(normalize) : [];
}

function number(value) {
  return Math.max(0, Math.floor(Number(value) || 0));
}

function normalize(parcel) {
  return {
    id: parcel.id || uid(), title: parcel.title || 'Untitled Treasure Parcel', campaign: parcel.campaign || 'Unsorted', source: parcel.source || '', status: parcel.status || 'Planned', tier: parcel.tier || 'Minor', assignedTo: parcel.assignedTo || '', ruleset: parcel.ruleset || 'Homebrew', foundDate: parcel.foundDate || '',
    cp: number(parcel.cp), sp: number(parcel.sp), ep: number(parcel.ep), gp: number(parcel.gp), pp: number(parcel.pp),
    valuables: parcel.valuables || '', mundaneItems: parcel.mundaneItems || '', magicItems: parcel.magicItems || '', clues: parcel.clues || '', playerNotes: parcel.playerNotes || '', dmNotes: parcel.dmNotes || '', updatedAt: parcel.updatedAt || new Date().toISOString()
  };
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, parcels: library }));
  store?.syncLoot?.(library);
}

function values() {
  return normalize({ ...Object.fromEntries(new FormData(form).entries()), id: editingId || uid(), updatedAt: new Date().toISOString() });
}

function lines(value) {
  return String(value || '').split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

function listHtml(value, empty = 'None recorded.') {
  const entries = lines(value);
  return entries.length ? entries.map((entry) => `<p>${esc(entry)}</p>`).join('') : `<p class="empty-copy">${empty}</p>`;
}

function coinHtml(parcel) {
  return ['cp','sp','ep','gp','pp'].map((coin) => `<div class="coin"><b>${number(parcel[coin]).toLocaleString()}</b>${coin.toUpperCase()}</div>`).join('');
}

function playerSheet(parcel) {
  return `<article class="loot-sheet player"><div class="loot-header"><h2 class="loot-title">${esc(parcel.title)}</h2><p class="loot-meta">${esc(parcel.source || 'Treasure parcel')} · <span class="status-chip">${esc(parcel.status)}</span></p></div><div class="coin-display">${coinHtml(parcel)}</div><div class="loot-grid"><section class="loot-section"><h3>Valuables & Trade Goods</h3>${listHtml(parcel.valuables)}</section><section class="loot-section"><h3>Gear & Curios</h3>${listHtml(parcel.mundaneItems)}</section><section class="loot-section"><h3>Unusual or Magical Items</h3>${listHtml(parcel.magicItems, 'No unusual items identified.')}</section><section class="loot-section"><h3>Documents & Discoveries</h3>${listHtml(parcel.clues, 'No documents or discoveries recorded.')}</section></div><section class="loot-section"><h3>What the Party Sees</h3>${listHtml(parcel.playerNotes, 'No additional description.')}</section>${parcel.assignedTo ? `<section class="loot-section"><h3>Assigned To</h3><p>${esc(parcel.assignedTo)}</p></section>` : ''}<div class="loot-footer"><span>${esc(parcel.ruleset)}</span><span>${esc(parcel.campaign)}</span></div></article>`;
}

function dmSheet(parcel) {
  return `<article class="loot-sheet dm"><div class="loot-header"><h2 class="loot-title">${esc(parcel.title)}</h2><p class="loot-meta">${esc(parcel.tier)} parcel · ${esc(parcel.source || 'No source')} · <span class="status-chip">${esc(parcel.status)}</span></p></div><div class="coin-display">${coinHtml(parcel)}</div><div class="loot-grid"><section class="loot-section"><h3>Valuables</h3>${listHtml(parcel.valuables)}</section><section class="loot-section"><h3>Mundane Items</h3>${listHtml(parcel.mundaneItems)}</section><section class="loot-section"><h3>Magic Candidates</h3>${listHtml(parcel.magicItems)}</section><section class="loot-section"><h3>Clues & Story Rewards</h3>${listHtml(parcel.clues)}</section></div><section class="loot-section"><h3>Player Note</h3>${listHtml(parcel.playerNotes)}</section><section class="loot-section dm-secret"><h3>Private Notes</h3>${listHtml(parcel.dmNotes, 'No private notes.')}</section><div class="loot-footer"><span>${esc(parcel.ruleset)} · ${esc(parcel.foundDate || 'Date not set')}</span><span>${parcel.assignedTo ? `Assigned: ${esc(parcel.assignedTo)}` : esc(parcel.campaign)}</span></div></article>`;
}

function sheetHtml(parcel, mode = previewMode) {
  return mode === 'dm' ? dmSheet(parcel) : playerSheet(parcel);
}

function renderPreview() {
  preview.innerHTML = sheetHtml(values());
  document.getElementById('previewModeLabel').textContent = previewMode === 'dm' ? 'Private DM Parcel' : 'Player Handout';
  document.getElementById('saveState').textContent = editingId ? 'Editing saved parcel' : 'Unsaved draft';
  document.getElementById('saveState').classList.toggle('saved', Boolean(editingId));
}

function fillForm(parcel) {
  const normalized = normalize(parcel);
  editingId = normalized.id;
  [...form.elements].forEach((element) => { if (element.name && normalized[element.name] !== undefined) element.value = normalized[element.name]; });
  renderPreview();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveParcel() {
  const parcel = values();
  const index = library.findIndex((entry) => entry.id === parcel.id);
  if (index >= 0) library[index] = parcel;
  else library.unshift(parcel);
  editingId = parcel.id;
  persist();
  refreshLibrary();
  renderPreview();
  toast('Treasure parcel saved.');
}

function blankParcel() {
  editingId = null;
  for (const element of form.elements) {
    if (!element.name) continue;
    if (element.tagName === 'SELECT') element.selectedIndex = 0;
    else element.value = '';
  }
  form.elements.campaign.value = store?.getActiveCampaign()?.name || 'My Campaign';
  form.elements.status.value = 'Planned';
  form.elements.tier.value = 'Minor';
  form.elements.ruleset.value = 'Homebrew';
  previewMode = 'player';
  renderPreview();
  renderContext();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generatedCoins(tier) {
  if (tier === 'Minor') return { cp: roll(2, 6) * 10, sp: roll(2, 6) * 5, ep: 0, gp: roll(1, 6), pp: 0 };
  if (tier === 'Moderate') return { cp: 0, sp: roll(3, 6) * 10, ep: roll(1, 6) * 5, gp: roll(4, 6) * 10, pp: 0 };
  if (tier === 'Major') return { cp: 0, sp: 0, ep: roll(2, 6) * 10, gp: roll(6, 8) * 25, pp: roll(2, 6) * 5 };
  return { cp: 0, sp: 0, ep: 0, gp: roll(8, 10) * 50, pp: roll(4, 8) * 10 };
}

function generateParcel() {
  const tier = form.elements.tier.value || 'Moderate';
  const campaign = form.elements.campaign.value || store?.getActiveCampaign()?.name || 'My Campaign';
  const coins = generatedCoins(tier);
  const valuableCount = tier === 'Minor' ? 1 : tier === 'Moderate' ? 2 : tier === 'Major' ? 3 : 4;
  const mundaneCount = tier === 'Minor' ? 2 : tier === 'Moderate' ? 3 : 4;
  const magicCount = tier === 'Minor' ? secureInt(2) : tier === 'Moderate' ? 1 : tier === 'Major' ? 2 : 3;
  const unique = (source, count) => {
    const copy = [...source];
    const result = [];
    while (copy.length && result.length < count) result.push(copy.splice(secureInt(copy.length), 1)[0]);
    return result;
  };
  form.elements.title.value = `${pick(['Hidden','Forgotten','Sealed','Stolen','Recovered','Forsaken'])} ${pick(['Lockbox','Strongbox','Satchel','Reliquary','Pay Chest','Cache'])}`;
  form.elements.campaign.value = campaign;
  form.elements.source.value = pick(['Behind a false wall','Beneath a collapsed shrine','Carried by a missing courier','Inside a flooded cellar','Recovered from an abandoned wagon','Hidden in a magistrate’s archive']);
  form.elements.status.value = 'Planned';
  form.elements.assignedTo.value = '';
  form.elements.foundDate.value = '';
  for (const [coin, amount] of Object.entries(coins)) form.elements[coin].value = amount;
  form.elements.valuables.value = unique(VALUABLES, valuableCount).join('\n');
  form.elements.mundaneItems.value = unique(MUNDANE, mundaneCount).join('\n');
  form.elements.magicItems.value = magicCount ? unique(MAGIC_NAMES, magicCount).join('\n') : '';
  form.elements.clues.value = pick(CLUES);
  form.elements.playerNotes.value = pick(PLAYER_NOTES);
  form.elements.dmNotes.value = pick(['One object is recognized by a rival faction.','The parcel was planted to implicate an innocent ally.','A hidden mark reveals the original owner.','Opening the parcel alerts someone watching through a mundane signal system.','The most ordinary-looking item is the key to a later location.']);
  renderPreview();
}

function campaigns() {
  return [...new Set([...library.map((parcel) => parcel.campaign || 'Unsorted'), ...(store?.listCampaigns().map((campaign) => campaign.name) || [])])].sort((a, b) => a.localeCompare(b));
}

function refreshCampaigns() {
  const selected = campaignFilter.value;
  const names = campaigns();
  campaignFilter.innerHTML = '<option value="all">All campaigns</option>' + names.map((name) => `<option value="${esc(name)}">${esc(name)}</option>`).join('');
  if (names.includes(selected)) campaignFilter.value = selected;
  document.getElementById('campaignNames').innerHTML = names.map((name) => `<option value="${esc(name)}"></option>`).join('');
}

function visibleParcels() {
  const campaign = campaignFilter.value || 'all';
  const status = statusFilter.value || 'all';
  const query = lootSearch.value.trim().toLocaleLowerCase();
  return library.filter((parcel) => (campaign === 'all' || parcel.campaign === campaign) && (status === 'all' || parcel.status === status) && (!query || `${parcel.title} ${parcel.source} ${parcel.assignedTo} ${parcel.valuables} ${parcel.mundaneItems} ${parcel.magicItems}`.toLocaleLowerCase().includes(query)));
}

function itemCount(parcel) {
  return lines(parcel.valuables).length + lines(parcel.mundaneItems).length + lines(parcel.magicItems).length;
}

function coinSummary(parcel) {
  return ['pp','gp','ep','sp','cp'].filter((coin) => number(parcel[coin]) > 0).map((coin) => `${number(parcel[coin]).toLocaleString()} ${coin.toUpperCase()}`).join(', ') || 'No coins';
}

function renderLibrary() {
  const visible = visibleParcels();
  libraryGrid.innerHTML = visible.length ? visible.map((parcel) => `<article class="library-item"><label class="select-row"><input type="checkbox" data-select-loot="${esc(parcel.id)}"><b>Select for printing</b></label><h3>${esc(parcel.title)}</h3><div class="library-meta">${esc(parcel.campaign)} · ${esc(parcel.status)} · ${esc(parcel.tier)}${parcel.assignedTo ? ` · ${esc(parcel.assignedTo)}` : ''}</div><div class="library-stats"><div><b>${esc(coinSummary(parcel))}</b>Coins</div><div><b>${itemCount(parcel)}</b>Items</div><div><b>${lines(parcel.magicItems).length}</b>Magic</div></div><label>Status<select data-loot-status="${esc(parcel.id)}">${['Planned','Found','Distributed','Sold','Lost','Returned'].map((status) => `<option ${parcel.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select></label><div class="library-actions"><button class="btn light" data-session-loot="${esc(parcel.id)}" type="button">Send to Session</button><button class="btn light" data-magic-loot="${esc(parcel.id)}" type="button">Send Magic Items</button><button class="btn light" data-edit-loot="${esc(parcel.id)}" type="button">Edit</button><button class="btn light" data-copy-loot="${esc(parcel.id)}" type="button">Duplicate</button><button class="btn danger" data-delete-loot="${esc(parcel.id)}" type="button">Delete</button></div></article>`).join('') : '<p class="empty-copy">No treasure parcels match these filters.</p>';
  document.querySelectorAll('[data-edit-loot]').forEach((button) => button.onclick = () => fillForm(library.find((parcel) => parcel.id === button.dataset.editLoot)));
  document.querySelectorAll('[data-copy-loot]').forEach((button) => button.onclick = () => duplicateParcel(button.dataset.copyLoot));
  document.querySelectorAll('[data-delete-loot]').forEach((button) => button.onclick = () => deleteParcel(button.dataset.deleteLoot));
  document.querySelectorAll('[data-session-loot]').forEach((button) => button.onclick = () => sendToSession(library.find((parcel) => parcel.id === button.dataset.sessionLoot)));
  document.querySelectorAll('[data-magic-loot]').forEach((button) => button.onclick = () => sendMagicItems(library.find((parcel) => parcel.id === button.dataset.magicLoot)));
  document.querySelectorAll('[data-loot-status]').forEach((select) => select.onchange = () => {
    const parcel = library.find((entry) => entry.id === select.dataset.lootStatus);
    if (!parcel) return;
    parcel.status = select.value;
    parcel.updatedAt = new Date().toISOString();
    persist();
    refreshLibrary();
  });
}

function refreshLibrary() {
  refreshCampaigns();
  renderLibrary();
  store?.syncLoot?.(library);
  renderContext();
}

function duplicateParcel(id) {
  const parcel = library.find((entry) => entry.id === id);
  if (!parcel) return;
  library.unshift({ ...parcel, id: uid(), title: `${parcel.title} — Copy`, status: 'Planned', updatedAt: new Date().toISOString() });
  persist();
  refreshLibrary();
}

function deleteParcel(id) {
  if (!confirm('Delete this treasure parcel?')) return;
  library = library.filter((parcel) => parcel.id !== id);
  if (editingId === id) editingId = null;
  persist();
  refreshLibrary();
  renderPreview();
}

function blankSession() {
  return { id: uid('session'), title: '', date: new Date().toISOString().slice(0, 10), prep: { opening: '', scenes: '', secrets: '', npcs: '', locations: '', rewards: '', notes: '' }, log: [], initiative: { combatants: [], round: 1, turnIndex: 0, active: false, log: [] }, diceHistory: [], generatorHistory: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

function ensureSessionCampaign(state, name) {
  const key = String(name || '').trim().toLocaleLowerCase();
  let campaign = state.campaigns.find((entry) => String(entry.name || '').trim().toLocaleLowerCase() === key);
  if (!campaign) {
    campaign = { id: uid('campaign'), name, roster: [], session: blankSession(), archives: [] };
    state.campaigns.push(campaign);
  }
  campaign.session ||= blankSession();
  campaign.session.prep ||= blankSession().prep;
  return campaign;
}

function sessionSummary(parcel) {
  const sections = [
    `Loot: ${parcel.title} — ${coinSummary(parcel)}.`,
    lines(parcel.valuables).length ? `Valuables: ${lines(parcel.valuables).join('; ')}.` : '',
    lines(parcel.mundaneItems).length ? `Gear: ${lines(parcel.mundaneItems).join('; ')}.` : '',
    lines(parcel.magicItems).length ? `Magic candidates: ${lines(parcel.magicItems).join('; ')}.` : '',
    lines(parcel.clues).length ? `Discoveries: ${lines(parcel.clues).join('; ')}.` : '',
    parcel.assignedTo ? `Assigned to: ${parcel.assignedTo}.` : ''
  ];
  return sections.filter(Boolean).join(' ');
}

function sendToSession(parcel) {
  if (!parcel) return;
  let state = readJson(SESSION_KEY, null);
  if (!state?.campaigns?.length) {
    const campaign = { id: uid('campaign'), name: parcel.campaign || 'Unsorted', roster: [], session: blankSession(), archives: [] };
    state = { version: 1, activeCampaignId: campaign.id, campaigns: [campaign], activeTab: 'prep' };
  }
  const campaign = ensureSessionCampaign(state, parcel.campaign || 'Unsorted');
  campaign.session.prep.rewards = [campaign.session.prep.rewards, sessionSummary(parcel)].filter(Boolean).join('\n');
  campaign.session.updatedAt = new Date().toISOString();
  localStorage.setItem(SESSION_KEY, JSON.stringify(state));
  store?.syncSessionConsole(state);
  toast(`${parcel.title} added to ${campaign.name} Rewards & Discoveries.`);
}

function inferredCategory(name) {
  const text = name.toLocaleLowerCase();
  if (text.includes('ring')) return 'Ring';
  if (text.includes('wand')) return 'Wand';
  if (text.includes('staff')) return 'Staff';
  if (text.includes('sword') || text.includes('blade') || text.includes('axe') || text.includes('bow')) return 'Weapon';
  if (text.includes('shield') || text.includes('buckler')) return 'Shield';
  if (text.includes('armor') || text.includes('mail')) return 'Armor';
  if (text.includes('potion') || text.includes('vial')) return 'Potion';
  if (text.includes('scroll')) return 'Scroll';
  return 'Wondrous Item';
}

function placeholderRarity(tier) {
  return { Minor: 'Common', Moderate: 'Uncommon', Major: 'Rare', Legendary: 'Very Rare' }[tier] || 'Uncommon';
}

function placeholderItem(parcel, name, index) {
  const category = inferredCategory(name);
  return {
    id: `loot-item-${parcel.id}-${index + 1}`, name, template: 'detailed', category, rarity: placeholderRarity(parcel.tier), attunement: 'No attunement required', ruleset: 'Homebrew', campaign: parcel.campaign, owner: parcel.assignedTo || '',
    identification: 'unidentified', unidentifiedName: `Unidentified ${category}`, unidentifiedText: `An unidentified item recovered from ${parcel.title}.`, partialProperties: '', stage: 'none', dormantProperties: '', awakenedProperties: '', exaltedProperties: '', artData: '', icon: '✨',
    appearance: `An unidentified item recovered from ${parcel.title}.`, description: 'Placeholder imported from Loot Forge. Complete its appearance and rules before revealing it.', properties: '', activation: '', charges: '', recharge: '', damage: '', save: '', backText: `Recovered from ${parcel.title}.`, secret: 'Loot Forge placeholder: rules and hidden properties have not been defined yet.', updatedAt: Date.now()
  };
}

function sendMagicItems(parcel) {
  if (!parcel) return;
  const names = lines(parcel.magicItems);
  if (!names.length) return toast('This parcel has no magic-item candidates to send.');
  const current = readJson(MAGIC_KEY, []);
  const items = Array.isArray(current) ? current : [];
  const map = new Map(items.map((item) => [item.id, item]));
  names.forEach((name, index) => map.set(`loot-item-${parcel.id}-${index + 1}`, placeholderItem(parcel, name, index)));
  const updated = [...map.values()];
  localStorage.setItem(MAGIC_KEY, JSON.stringify(updated));
  store?.syncMagicItems(updated);
  toast(`${names.length} unidentified placeholder${names.length === 1 ? '' : 's'} sent to Magic Item Forge.`);
}

function selectedParcels() {
  return [...document.querySelectorAll('[data-select-loot]:checked')].map((box) => library.find((parcel) => parcel.id === box.dataset.selectLoot)).filter(Boolean);
}

function printParcels(parcels, mode) {
  if (!parcels.length) return toast('Select at least one parcel first.');
  printSheet.innerHTML = parcels.map((parcel) => `<section class="loot-print-page">${sheetHtml(parcel, mode)}</section>`).join('');
  window.print();
}

function printLedger() {
  const campaign = campaignFilter.value === 'all' ? store?.getActiveCampaign()?.name : campaignFilter.value;
  const parcels = library.filter((parcel) => !campaign || parcel.campaign === campaign);
  if (!parcels.length) return toast('No parcels are available for that campaign ledger.');
  const rows = parcels.map((parcel) => `<tr><td>${esc(parcel.title)}</td><td>${esc(parcel.status)}</td><td>${esc(coinSummary(parcel))}</td><td>${itemCount(parcel)}</td><td>${lines(parcel.magicItems).length}</td><td>${esc(parcel.assignedTo || 'Unassigned')}</td></tr>`).join('');
  printSheet.innerHTML = `<section class="ledger-page"><h1>${esc(campaign || 'All Campaigns')} — Party Loot Ledger</h1><table class="party-ledger"><thead><tr><th>Parcel</th><th>Status</th><th>Coins</th><th>Items</th><th>Magic</th><th>Assigned</th></tr></thead><tbody>${rows}</tbody></table></section>`;
  window.print();
}

function exportLoot() {
  const blob = new Blob([JSON.stringify({ product: 'DM Forge Loot Forge', version: 1, exportedAt: new Date().toISOString(), parcels: library }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'dm-forge-loot.json'; anchor.click(); URL.revokeObjectURL(url);
}

function importLoot(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const incoming = Array.isArray(parsed) ? parsed : parsed.parcels;
      if (!Array.isArray(incoming)) throw new Error('No treasure parcel list found.');
      const map = new Map(library.map((parcel) => [parcel.id, parcel]));
      incoming.map(normalize).forEach((parcel) => map.set(parcel.id, parcel));
      library = [...map.values()];
      persist();
      refreshLibrary();
      toast('Loot library imported.');
    } catch (error) { alert(`Import failed: ${error.message}`); }
  };
  reader.readAsText(file);
}

function renderContext() {
  const active = store?.getActiveCampaign();
  const campaign = form.elements.campaign.value.trim() || active?.name || 'My Campaign';
  const record = store?.listCampaigns().find((entry) => entry.name.toLocaleLowerCase() === campaign.toLocaleLowerCase());
  const counts = record ? store.counts(record.id) : { loot: 0, magicItems: 0, sessions: 0 };
  document.getElementById('sharedContext').innerHTML = `<div><b>Shared Campaign:</b> ${esc(active?.name || campaign)}<span>${esc(campaign)} · ${counts.loot} loot parcel${counts.loot === 1 ? '' : 's'} · ${counts.magicItems} magic item${counts.magicItems === 1 ? '' : 's'} · ${counts.sessions} session record${counts.sessions === 1 ? '' : 's'}</span></div><div class="actions compact"><button class="btn light" id="useActiveCampaign" type="button">Use Active Campaign</button><button class="btn light" id="makeLootCampaignActive" type="button">Use ${esc(campaign)} Everywhere</button><a class="btn light" href="campaigns.html">Campaign Hub</a></div>`;
  document.getElementById('useActiveCampaign').onclick = () => { if (active) { form.elements.campaign.value = active.name; renderPreview(); renderContext(); } };
  document.getElementById('makeLootCampaignActive').onclick = () => { store?.ensureCampaign(campaign, { source: 'loot-forge', ruleset: form.elements.ruleset.value }); store?.setActiveCampaign(campaign); renderContext(); };
}

function applyCampaignContext() {
  const requested = new URLSearchParams(location.search).get('campaign');
  const name = requested || store?.getActiveCampaign()?.name;
  if (name) form.elements.campaign.value = name.slice(0, 100);
}

function toast(message) {
  const element = document.createElement('div');
  element.textContent = message;
  element.setAttribute('role', 'status');
  element.style = 'position:fixed;z-index:120;left:50%;bottom:20px;transform:translateX(-50%);background:#281713;color:#fff4ce;padding:12px 18px;border:1px solid #d4a64c;border-radius:8px;max-width:90vw;box-shadow:0 8px 30px #0008';
  document.body.append(element);
  setTimeout(() => element.remove(), 3000);
}

form.addEventListener('input', () => { if (editingId) document.getElementById('saveState').textContent = 'Edited — save changes'; renderPreview(); renderContext(); });
document.getElementById('saveParcel').onclick = saveParcel;
document.getElementById('newParcel').onclick = blankParcel;
document.getElementById('generateParcel').onclick = generateParcel;
document.getElementById('sendCurrentSession').onclick = () => sendToSession(values());
document.getElementById('sendCurrentMagic').onclick = () => sendMagicItems(values());
document.getElementById('playerView').onclick = () => { previewMode = 'player'; renderPreview(); };
document.getElementById('dmView').onclick = () => { previewMode = 'dm'; renderPreview(); };
document.getElementById('printCurrent').onclick = () => printParcels([values()], previewMode);
document.getElementById('printSelectedPlayer').onclick = () => printParcels(selectedParcels(), 'player');
document.getElementById('printSelectedDm').onclick = () => printParcels(selectedParcels(), 'dm');
document.getElementById('printLedger').onclick = printLedger;
document.getElementById('exportLoot').onclick = exportLoot;
document.getElementById('importLoot').onchange = (event) => event.target.files[0] && importLoot(event.target.files[0]);
campaignFilter.onchange = renderLibrary;
statusFilter.onchange = renderLibrary;
lootSearch.oninput = renderLibrary;
window.addEventListener('storage', (event) => { if ([store?.STORAGE_KEY, SESSION_KEY, MAGIC_KEY].includes(event.key)) { refreshLibrary(); renderContext(); } });
window.addEventListener('dmforge:store-changed', renderContext);

applyCampaignContext();
refreshLibrary();
renderPreview();
renderContext();
