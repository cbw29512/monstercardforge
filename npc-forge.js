'use strict';

const STORAGE_KEY = 'dmforge-npc-forge-v1';
const SESSION_KEY = 'dmforge-session-console-v1';
const form = document.getElementById('npcForm');
const preview = document.getElementById('preview');
const fitStatus = document.getElementById('fitStatus');
const libraryGrid = document.getElementById('libraryGrid');
const campaignFilter = document.getElementById('campaignFilter');
const npcSearch = document.getElementById('npcSearch');
const printSheet = document.getElementById('printSheet');
const store = globalThis.DMForgeStore;
let library = loadLibrary();
let editingId = null;
let previewMode = 'player';

const NAMES_FIRST = ['Alden','Branna','Corvin','Dessa','Edrin','Fenna','Garrick','Halia','Iven','Jora','Kael','Lysa','Marek','Nella','Orin','Petra','Quill','Rinna','Soren','Tamsin','Ulric','Veya','Wren','Ysra','Zorin'];
const NAMES_LAST = ['Ashford','Blackbriar','Cinderfell','Dawnmere','Emberlain','Frostward','Glenhaven','Hollowbrook','Ironwood','Jadebrook','Kingswell','Lightfoot','Moonfall','Nightbloom','Oakshield','Pyrewick','Quickwater','Ravencrest','Stonewake','Thornfield','Umbermoor','Vale','Wintermere','Yarrow','Zephyr'];
const ROLES = ['apothecary','bounty hunter','caravan master','disgraced knight','dock clerk','hedge mage','innkeeper','local priest','mercenary captain','retired thief','scribe','street performer','tax collector','undertaker','village elder'];
const MANNERISMS = ['answers every question with another question','avoids eye contact while telling the truth','collects tiny carved animals','laughs whenever frightened','never removes one stained glove','speaks softly but stands too close','writes down every promise','treats all strangers as old friends'];
const MOTIVES = ['protect a younger sibling','erase evidence of an old crime','earn enough to leave town','expose a corrupt official','find a missing mentor','keep a dangerous relic hidden','repay a debt nobody else remembers','win back the trust of an old friend'];
const PERSONALITIES = ['earnest but suspicious of authority','cheerful until money is mentioned','patient with mistakes and ruthless with lies','brilliant, distracted, and deeply lonely','formal in public and mischievous in private','practical, loyal, and slow to forgive','warm toward strangers but cold toward family','quietly competitive about everything'];
const FEARS = ['being recognized by a former enemy','failing someone who depends on them','losing control of a hidden power','public humiliation','the return of a recurring nightmare','that their secret has already been discovered'];
const SECRETS = ['is secretly working for a rival faction','possesses a map to a sealed ruin','was present when the missing noble vanished','has been receiving messages from a dead relative','is using a false name','knows the local monster is protecting something worse'];
const VOICES = ['measured and formal','rapid whispers with sudden pauses','warm and theatrical','flat, precise, and humorless','softly amused even when threatened','booming confidence that occasionally cracks'];
const APPEARANCES = ['wears a spotless coat despite the muddy road','has one silver eye and one brown eye','carries a bundle of color-coded keys','keeps their hair braided with tiny bells','wears old military boots with civilian clothes','has ink-stained fingers and a carefully repaired cloak'];
const FACTIONS = ['Independent','Local Guild','Temple Wardens','Merchant Compact','Crown Office','Free Company','Hidden Circle'];
const ICONS = ['🧑','🧙','🛡️','🗡️','👑','🧪','📚','⛪','⚓','🎭'];

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[character]);
}

function uid() {
  return crypto.randomUUID ? `npc-${crypto.randomUUID()}` : `npc-${Date.now()}`;
}

function randomInt(maximum) {
  const limit = Math.floor(0x100000000 / maximum) * maximum;
  const value = new Uint32Array(1);
  do crypto.getRandomValues(value); while (value[0] >= limit);
  return value[0] % maximum;
}

function pick(list) {
  return list[randomInt(list.length)];
}

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch (error) { console.error(`[NPCForge] Could not read ${key}`, error); return fallback; }
}

function loadLibrary() {
  const stored = readJson(STORAGE_KEY, { version: 1, npcs: [] });
  return Array.isArray(stored) ? stored.map(normalize) : Array.isArray(stored.npcs) ? stored.npcs.map(normalize) : [];
}

function normalize(npc) {
  return {
    id: npc.id || uid(), name: npc.name || 'Unnamed NPC', campaign: npc.campaign || 'Unsorted', pronouns: npc.pronouns || '', ancestry: npc.ancestry || '', role: npc.role || '', faction: npc.faction || '', status: npc.status || 'Unknown', icon: npc.icon || '🧑',
    appearance: npc.appearance || '', publicNotes: npc.publicNotes || '', voice: npc.voice || '', mannerism: npc.mannerism || '', personality: npc.personality || '', motive: npc.motive || '', fear: npc.fear || '', leverage: npc.leverage || '', secret: npc.secret || '', lie: npc.lie || '', relationships: npc.relationships || '', location: npc.location || '', nextScene: npc.nextScene || '', tags: npc.tags || '', ruleset: npc.ruleset || 'Homebrew', ac: npc.ac || '', hp: npc.hp || '', passive: npc.passive || '', combatDc: npc.combatDc || '', combatNotes: npc.combatNotes || '', updatedAt: npc.updatedAt || new Date().toISOString()
  };
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, npcs: library }));
  store?.syncNpcs?.(library);
}

function values() {
  return normalize({ ...Object.fromEntries(new FormData(form).entries()), id: editingId || uid(), updatedAt: new Date().toISOString() });
}

function textBlock(value, empty = 'Not recorded.') {
  return value ? `<p>${esc(value)}</p>` : `<p class="empty-copy">${empty}</p>`;
}

function tags(value) {
  return String(value || '').split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 12);
}

function relationshipHtml(value) {
  const entries = String(value || '').split(/\n+/).map((line) => line.trim()).filter(Boolean);
  return entries.length ? entries.map((line) => `<p>${esc(line)}</p>`).join('') : '<p class="empty-copy">No relationships recorded.</p>';
}

function footer(npc) {
  return `<div class="npc-footer"><span>${esc(npc.ruleset)}</span><span>${esc(npc.campaign)}</span></div>`;
}

function playerCardHtml(npc) {
  const tagList = tags(npc.tags);
  return `<article class="npc-card player"><div class="npc-header"><h2 class="npc-name">${esc(npc.name)}</h2><p class="npc-meta">${esc(npc.pronouns)}${npc.pronouns && npc.ancestry ? ' · ' : ''}${esc(npc.ancestry)}${(npc.pronouns || npc.ancestry) && npc.role ? ' · ' : ''}${esc(npc.role)}</p><p class="npc-meta">${esc(npc.status)}${npc.faction ? ` · ${esc(npc.faction)}` : ''}</p></div><div class="portrait">${esc(npc.icon)}</div><section class="npc-section"><h3>Appearance</h3>${textBlock(npc.appearance)}</section><section class="npc-section"><h3>What the Characters Know</h3>${textBlock(npc.publicNotes, 'Nothing reliable is known yet.')}</section>${npc.location ? `<section class="npc-section"><h3>Usually Found</h3><p>${esc(npc.location)}</p></section>` : ''}${tagList.length ? `<div class="npc-chip-row">${tagList.map((tag) => `<span class="npc-chip">${esc(tag)}</span>`).join('')}</div>` : ''}${footer(npc)}</article>`;
}

function dmCardHtml(npc) {
  return `<article class="npc-card dm"><div class="npc-header"><h2 class="npc-name">${esc(npc.name)}</h2><p class="npc-meta">${esc(npc.role)}${npc.faction ? ` · ${esc(npc.faction)}` : ''} · ${esc(npc.status)}</p></div><div class="npc-grid"><section class="npc-section"><h3>Voice</h3>${textBlock(npc.voice)}</section><section class="npc-section"><h3>Mannerism</h3>${textBlock(npc.mannerism)}</section></div><section class="npc-section"><h3>Personality</h3>${textBlock(npc.personality)}</section><section class="npc-section"><h3>Wants</h3>${textBlock(npc.motive)}</section><div class="npc-grid"><section class="npc-section"><h3>Fear</h3>${textBlock(npc.fear)}</section><section class="npc-section"><h3>Leverage</h3>${textBlock(npc.leverage)}</section></div><section class="npc-section secret"><h3>Secret</h3>${textBlock(npc.secret)}</section><section class="npc-section"><h3>Lie or Misconception</h3>${textBlock(npc.lie)}</section><section class="npc-section"><h3>Relationships</h3>${relationshipHtml(npc.relationships)}</section><div class="npc-grid"><section class="npc-section"><h3>Next Scene</h3>${textBlock(npc.nextScene)}</section><section class="npc-section"><h3>Combat</h3><p>AC ${esc(npc.ac || '—')} · HP ${esc(npc.hp || '—')} · PP ${esc(npc.passive || '—')}</p>${npc.combatDc ? `<p>${esc(npc.combatDc)}</p>` : ''}${npc.combatNotes ? `<p>${esc(npc.combatNotes)}</p>` : ''}</section></div>${footer(npc)}</article>`;
}

function cardHtml(npc, mode = previewMode) {
  return mode === 'dm' ? dmCardHtml(npc) : playerCardHtml(npc);
}

function cardOverflows(card) {
  return Boolean(card && (card.scrollHeight > card.clientHeight + 1 || card.scrollWidth > card.clientWidth + 1));
}

function measure(npc, mode) {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;left:-10000px;top:0;width:5in;visibility:hidden;pointer-events:none';
  probe.innerHTML = cardHtml(npc, mode);
  document.body.append(probe);
  const overflow = cardOverflows(probe.querySelector('.npc-card'));
  probe.remove();
  return overflow;
}

function updateFit(npc) {
  const overflow = measure(npc, previewMode);
  fitStatus.classList.toggle('warning', overflow);
  fitStatus.textContent = overflow ? 'This card is full. Printing will add a continuation page so no NPC information is lost.' : 'Everything fits on this 5×7 card.';
}

function renderPreview() {
  const npc = values();
  preview.innerHTML = cardHtml(npc);
  document.getElementById('previewModeLabel').textContent = previewMode === 'dm' ? 'Private DM Card' : 'Player-Safe Card';
  document.getElementById('saveState').textContent = editingId ? 'Editing saved NPC' : 'Unsaved draft';
  document.getElementById('saveState').classList.toggle('saved', Boolean(editingId));
  requestAnimationFrame(() => updateFit(npc));
}

function fillForm(npc) {
  const normalized = normalize(npc);
  editingId = normalized.id;
  [...form.elements].forEach((element) => { if (element.name && normalized[element.name] !== undefined) element.value = normalized[element.name]; });
  renderPreview();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveNpc() {
  const npc = values();
  const index = library.findIndex((entry) => entry.id === npc.id);
  if (index >= 0) library[index] = npc;
  else library.unshift(npc);
  editingId = npc.id;
  persist();
  refreshLibrary();
  renderPreview();
  toast('NPC saved to this browser.');
}

function blankNpc() {
  editingId = null;
  form.reset();
  form.elements.campaign.value = store?.getActiveCampaign()?.name || 'My Campaign';
  form.elements.status.value = 'Unknown';
  form.elements.icon.value = '🧑';
  form.elements.ruleset.value = 'Homebrew';
  renderPreview();
}

function generatedName() {
  return `${pick(NAMES_FIRST)} ${pick(NAMES_LAST)}`;
}

function randomizeName() {
  form.elements.name.value = generatedName();
  renderPreview();
}

function randomizeRoleplay() {
  form.elements.voice.value = pick(VOICES);
  form.elements.mannerism.value = pick(MANNERISMS);
  form.elements.personality.value = pick(PERSONALITIES);
  form.elements.motive.value = pick(MOTIVES);
  form.elements.fear.value = pick(FEARS);
  renderPreview();
}

function generateNpc() {
  const campaign = form.elements.campaign.value || store?.getActiveCampaign()?.name || 'My Campaign';
  const ruleset = form.elements.ruleset.value || 'Homebrew';
  const role = pick(ROLES);
  form.elements.name.value = generatedName();
  form.elements.campaign.value = campaign;
  form.elements.pronouns.value = pick(['she/her','he/him','they/them']);
  form.elements.ancestry.value = pick(['Human','Elf','Dwarf','Halfling','Gnome','Dragonborn','Tiefling','Orc','Goblin','Mixed ancestry']);
  form.elements.role.value = role;
  form.elements.faction.value = pick(FACTIONS);
  form.elements.status.value = pick(['Unknown','Neutral','Ally','Rival']);
  form.elements.icon.value = pick(ICONS);
  form.elements.appearance.value = `This ${role} ${pick(APPEARANCES)}.`;
  form.elements.publicNotes.value = `Known locally as a ${role} who keeps careful track of favors and unfinished business.`;
  form.elements.voice.value = pick(VOICES);
  form.elements.mannerism.value = pick(MANNERISMS);
  form.elements.personality.value = pick(PERSONALITIES);
  form.elements.motive.value = pick(MOTIVES);
  form.elements.fear.value = pick(FEARS);
  form.elements.leverage.value = pick(['needs safe passage','needs an introduction to a powerful official','needs evidence destroyed','needs a rare ingredient','needs protection for one night','needs someone followed discreetly']);
  form.elements.secret.value = pick(SECRETS);
  form.elements.lie.value = pick(['claims not to recognize a familiar symbol','pretends to have no family nearby','insists the debt has already been paid','says the missing witness left town willingly','believes an innocent person is responsible']);
  form.elements.relationships.value = `${generatedName()}: trusted contact\n${generatedName()}: unresolved grudge`;
  form.elements.location.value = pick(['The market square','A riverside inn','The old temple district','A rented workshop','The north gate','A quiet archive']);
  form.elements.nextScene.value = pick(['offers a dangerous favor','arrives with urgent evidence','asks the party to protect a witness','appears where they should not be','admits part of the truth','brings news of a betrayal']);
  form.elements.tags.value = `${role}, ${pick(['informant','merchant','rival','patron','witness','suspect'])}`;
  form.elements.ruleset.value = ruleset;
  renderPreview();
}

function campaigns() {
  return [...new Set([...library.map((npc) => npc.campaign || 'Unsorted'), ...(store?.listCampaigns().map((campaign) => campaign.name) || [])])].sort((a, b) => a.localeCompare(b));
}

function refreshCampaigns() {
  const selected = campaignFilter.value;
  const names = campaigns();
  campaignFilter.innerHTML = '<option value="all">All campaigns</option>' + names.map((name) => `<option value="${esc(name)}">${esc(name)}</option>`).join('');
  if (names.includes(selected)) campaignFilter.value = selected;
  document.getElementById('campaignNames').innerHTML = names.map((name) => `<option value="${esc(name)}"></option>`).join('');
}

function visibleNpcs() {
  const campaign = campaignFilter.value || 'all';
  const query = npcSearch.value.trim().toLocaleLowerCase();
  return library.filter((npc) => (campaign === 'all' || npc.campaign === campaign) && (!query || `${npc.name} ${npc.role} ${npc.faction} ${npc.tags} ${npc.status}`.toLocaleLowerCase().includes(query)));
}

function renderLibrary() {
  const visible = visibleNpcs();
  libraryGrid.innerHTML = visible.length ? visible.map((npc) => `<article class="library-item"><label class="select-row"><input type="checkbox" data-select-npc="${esc(npc.id)}"><b>Select for printing</b></label><h3>${esc(npc.name)}</h3><div class="library-meta">${esc(npc.campaign)} · ${esc(npc.role || 'No role')} · ${esc(npc.faction || 'No faction')} · ${esc(npc.status)}</div><div class="library-actions"><button class="btn light" data-send-npc="${esc(npc.id)}" type="button">Send to Session NPCs</button><button class="btn light" data-edit-npc="${esc(npc.id)}" type="button">Edit</button><button class="btn light" data-copy-npc="${esc(npc.id)}" type="button">Duplicate</button><button class="btn danger" data-delete-npc="${esc(npc.id)}" type="button">Delete</button></div></article>`).join('') : '<p class="empty-copy">No NPCs match this campaign and search.</p>';
  document.querySelectorAll('[data-edit-npc]').forEach((button) => button.onclick = () => fillForm(library.find((npc) => npc.id === button.dataset.editNpc)));
  document.querySelectorAll('[data-copy-npc]').forEach((button) => button.onclick = () => duplicateNpc(button.dataset.copyNpc));
  document.querySelectorAll('[data-delete-npc]').forEach((button) => button.onclick = () => deleteNpc(button.dataset.deleteNpc));
  document.querySelectorAll('[data-send-npc]').forEach((button) => button.onclick = () => sendToSession(button.dataset.sendNpc));
}

function refreshLibrary() {
  refreshCampaigns();
  renderLibrary();
  store?.syncNpcs?.(library);
  renderContext();
}

function duplicateNpc(id) {
  const npc = library.find((entry) => entry.id === id);
  if (!npc) return;
  library.unshift({ ...npc, id: uid(), name: `${npc.name} — Copy`, updatedAt: new Date().toISOString() });
  persist();
  refreshLibrary();
}

function deleteNpc(id) {
  if (!confirm('Delete this NPC from the local library?')) return;
  library = library.filter((npc) => npc.id !== id);
  if (editingId === id) editingId = null;
  persist();
  refreshLibrary();
  renderPreview();
}

function blankSession() {
  return { id: uid(), title: '', date: new Date().toISOString().slice(0, 10), prep: { opening: '', scenes: '', secrets: '', npcs: '', locations: '', rewards: '', notes: '' }, log: [], initiative: { combatants: [], round: 1, turnIndex: 0, active: false, log: [] }, diceHistory: [], generatorHistory: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

function ensureSessionCampaign(state, name) {
  const key = String(name || '').trim().toLocaleLowerCase();
  let campaign = state.campaigns.find((entry) => String(entry.name || '').trim().toLocaleLowerCase() === key);
  if (!campaign) {
    campaign = { id: uid(), name, roster: [], session: blankSession(), archives: [] };
    state.campaigns.push(campaign);
  }
  return campaign;
}

function sendToSession(id) {
  const npc = library.find((entry) => entry.id === id);
  if (!npc) return;
  let state = readJson(SESSION_KEY, null);
  if (!state?.campaigns?.length) {
    const campaign = { id: uid(), name: npc.campaign || 'Unsorted', roster: [], session: blankSession(), archives: [] };
    state = { version: 1, activeCampaignId: campaign.id, campaigns: [campaign], activeTab: 'prep' };
  }
  const campaign = ensureSessionCampaign(state, npc.campaign || 'Unsorted');
  const summary = `${npc.name} — ${npc.role || 'NPC'}${npc.faction ? `, ${npc.faction}` : ''}. Mannerism: ${npc.mannerism || 'not set'}. Motive: ${npc.motive || 'not set'}.`;
  campaign.session.prep.npcs = [campaign.session.prep.npcs, summary].filter(Boolean).join('\n');
  campaign.session.updatedAt = new Date().toISOString();
  localStorage.setItem(SESSION_KEY, JSON.stringify(state));
  store?.syncSessionConsole(state);
  toast(`${npc.name} added to ${campaign.name} NPCs & Motives.`);
}

function continuationHtml(npc, mode) {
  if (mode === 'player') return `<section class="npc-continuation"><h1>${esc(npc.name)}</h1><h2>Player-Safe NPC Reference</h2><p><b>${esc(npc.pronouns)} · ${esc(npc.ancestry)} · ${esc(npc.role)}</b></p><h2>Appearance</h2>${textBlock(npc.appearance)}<h2>What the Characters Know</h2>${textBlock(npc.publicNotes)}<h2>Usually Found</h2>${textBlock(npc.location)}<p><b>Campaign:</b> ${esc(npc.campaign)}</p></section>`;
  return `<section class="npc-continuation"><h1>${esc(npc.name)}</h1><h2>Private DM Reference</h2><p><b>Voice:</b> ${esc(npc.voice)}</p><p><b>Mannerism:</b> ${esc(npc.mannerism)}</p><p><b>Personality:</b> ${esc(npc.personality)}</p><p><b>Motive:</b> ${esc(npc.motive)}</p><p><b>Fear:</b> ${esc(npc.fear)}</p><p><b>Leverage:</b> ${esc(npc.leverage)}</p><h2>Secret</h2>${textBlock(npc.secret)}<h2>Lie or Misconception</h2>${textBlock(npc.lie)}<h2>Relationships</h2>${relationshipHtml(npc.relationships)}<p><b>Location:</b> ${esc(npc.location)}</p><p><b>Next scene:</b> ${esc(npc.nextScene)}</p><p><b>Combat:</b> AC ${esc(npc.ac || '—')} · HP ${esc(npc.hp || '—')} · PP ${esc(npc.passive || '—')} · ${esc(npc.combatDc)}</p>${textBlock(npc.combatNotes)}<p><b>Campaign:</b> ${esc(npc.campaign)}</p></section>`;
}

function printNpcs(npcs, mode) {
  if (!npcs.length) return toast('Select at least one NPC first.');
  const pages = [];
  npcs.forEach((npc) => {
    pages.push(`<section class="npc-print-page">${cardHtml(npc, mode)}</section>`);
    if (measure(npc, mode)) pages.push(continuationHtml(npc, mode));
  });
  printSheet.innerHTML = pages.join('');
  window.print();
}

function selectedNpcs() {
  return [...document.querySelectorAll('[data-select-npc]:checked')].map((box) => library.find((npc) => npc.id === box.dataset.selectNpc)).filter(Boolean);
}

function exportNpcs() {
  const blob = new Blob([JSON.stringify({ product: 'DM Forge NPC Forge', version: 1, exportedAt: new Date().toISOString(), npcs: library }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'dm-forge-npcs.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

function importNpcs(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const incoming = Array.isArray(parsed) ? parsed : parsed.npcs;
      if (!Array.isArray(incoming)) throw new Error('No NPC list found.');
      const map = new Map(library.map((npc) => [npc.id, npc]));
      incoming.map(normalize).forEach((npc) => map.set(npc.id, npc));
      library = [...map.values()];
      persist();
      refreshLibrary();
      toast('NPC library imported.');
    } catch (error) { alert(`Import failed: ${error.message}`); }
  };
  reader.readAsText(file);
}

function renderContext() {
  const active = store?.getActiveCampaign();
  const campaign = form.elements.campaign.value.trim() || active?.name || 'My Campaign';
  const record = store?.listCampaigns().find((entry) => entry.name.toLocaleLowerCase() === campaign.toLocaleLowerCase());
  const counts = record ? store.counts(record.id) : { npcs: 0, sessions: 0 };
  document.getElementById('sharedContext').innerHTML = `<div><b>Shared Campaign:</b> ${esc(active?.name || campaign)}<span>${esc(campaign)} · ${counts.npcs} NPC${counts.npcs === 1 ? '' : 's'} · ${counts.sessions} session record${counts.sessions === 1 ? '' : 's'}</span></div><div class="actions compact"><button class="btn light" id="useActiveCampaign" type="button">Use Active Campaign</button><button class="btn light" id="makeNpcCampaignActive" type="button">Use ${esc(campaign)} Everywhere</button><a class="btn light" href="campaigns.html">Campaign Hub</a></div>`;
  document.getElementById('useActiveCampaign').onclick = () => { if (active) { form.elements.campaign.value = active.name; renderPreview(); renderContext(); } };
  document.getElementById('makeNpcCampaignActive').onclick = () => { store?.ensureCampaign(campaign, { source: 'npc-forge', ruleset: form.elements.ruleset.value }); store?.setActiveCampaign(campaign); renderContext(); };
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
document.getElementById('saveNpc').onclick = saveNpc;
document.getElementById('newNpc').onclick = blankNpc;
document.getElementById('generateNpc').onclick = generateNpc;
document.getElementById('randomizeName').onclick = randomizeName;
document.getElementById('randomizeRoleplay').onclick = randomizeRoleplay;
document.getElementById('playerCard').onclick = () => { previewMode = 'player'; renderPreview(); };
document.getElementById('dmCard').onclick = () => { previewMode = 'dm'; renderPreview(); };
document.getElementById('printCurrent').onclick = () => printNpcs([values()], previewMode);
document.getElementById('printSelectedPlayer').onclick = () => printNpcs(selectedNpcs(), 'player');
document.getElementById('printSelectedDm').onclick = () => printNpcs(selectedNpcs(), 'dm');
document.getElementById('exportNpcs').onclick = exportNpcs;
document.getElementById('importNpcs').onchange = (event) => event.target.files[0] && importNpcs(event.target.files[0]);
campaignFilter.onchange = renderLibrary;
npcSearch.oninput = renderLibrary;
window.addEventListener('storage', (event) => { if ([store?.STORAGE_KEY, SESSION_KEY].includes(event.key)) { refreshLibrary(); renderContext(); } });
window.addEventListener('dmforge:store-changed', renderContext);

applyCampaignContext();
refreshLibrary();
renderPreview();
renderContext();
