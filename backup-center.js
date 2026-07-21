'use strict';

const META_KEY = 'dmforge-backup-meta-v1';
const EXCLUDED_KEYS = new Set([META_KEY, 'dmforge-pending-encounter-v1']);
const MAX_IMPORT_BYTES = 50 * 1024 * 1024;

const TOOLS = [
  {
    key: 'dmforge-shared-v1', label: 'Campaign Hub', route: 'campaigns.html',
    description: 'Shared campaign names and privacy-safe cross-tool summaries.',
    summarize: (data) => ({ count: data?.campaigns?.length || 0, text: `${data?.campaigns?.length || 0} campaign${data?.campaigns?.length === 1 ? '' : 's'}` })
  },
  {
    key: 'dmforge-session-console-v1', label: 'Session Console', route: 'session-console.html',
    description: 'Campaign prep, session logs, archives, rosters, initiative, dice, and generators.',
    summarize: (data) => {
      const campaigns = Array.isArray(data?.campaigns) ? data.campaigns : [];
      const archives = campaigns.reduce((sum, campaign) => sum + (campaign.archives?.length || 0), 0);
      return { count: campaigns.length + archives, text: `${campaigns.length} campaign${campaigns.length === 1 ? '' : 's'} · ${archives} archive${archives === 1 ? '' : 's'}` };
    }
  },
  {
    key: 'dmforge-encounter-forge-v1', label: 'Encounter Forge', route: 'encounter-forge.html',
    description: 'Party profiles, saved encounters, and custom monster records.',
    summarize: (data) => ({ count: (data?.encounters?.length || 0) + (data?.profiles?.length || 0), text: `${data?.encounters?.length || 0} encounter${data?.encounters?.length === 1 ? '' : 's'} · ${data?.profiles?.length || 0} party profile${data?.profiles?.length === 1 ? '' : 's'}` })
  },
  {
    key: 'dmforge-npc-forge-v1', label: 'NPC Forge', route: 'npc-forge.html',
    description: 'Public NPC identities, private motives, secrets, relationships, and combat notes.',
    summarize: (data) => {
      const list = Array.isArray(data) ? data : Array.isArray(data?.npcs) ? data.npcs : [];
      return { count: list.length, text: `${list.length} NPC${list.length === 1 ? '' : 's'}` };
    }
  },
  {
    key: 'dmforge-loot-forge-v1', label: 'Loot Forge', route: 'loot-forge.html',
    description: 'Treasure parcels, distribution status, private notes, and magic-item candidates.',
    summarize: (data) => {
      const list = Array.isArray(data) ? data : Array.isArray(data?.parcels) ? data.parcels : [];
      return { count: list.length, text: `${list.length} treasure parcel${list.length === 1 ? '' : 's'}` };
    }
  },
  {
    key: 'dmforge-magic-items-v2', label: 'Magic Item Forge', route: 'magic-items.html',
    description: 'Magic-item cards, hidden properties, artwork, identification, and evolving stages.',
    summarize: (data) => {
      const list = Array.isArray(data) ? data : [];
      return { count: list.length, text: `${list.length} magic item${list.length === 1 ? '' : 's'}` };
    }
  },
  {
    key: 'dmforge-player-display-rooms-v1', label: 'Player Display', route: 'player-display.html',
    description: 'Remembered display-room codes by Session Console campaign.',
    summarize: (data) => {
      const count = data && typeof data === 'object' ? Object.keys(data).length : 0;
      return { count, text: `${count} remembered room${count === 1 ? '' : 's'}` };
    }
  }
];

const $ = (selector) => document.querySelector(selector);
let pendingImport = null;

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[character]);
}

function bytesOf(value) {
  return new TextEncoder().encode(String(value ?? '')).byteLength;
}

function humanBytes(bytes) {
  const value = Number(bytes) || 0;
  if (value < 1024) return `${value} B`;
  const units = ['KB', 'MB', 'GB'];
  let amount = value / 1024;
  let unit = units[0];
  for (let index = 1; index < units.length && amount >= 1024; index += 1) {
    amount /= 1024;
    unit = units[index];
  }
  return `${amount.toFixed(amount >= 10 ? 1 : 2)} ${unit}`;
}

function readMeta() {
  try { return JSON.parse(localStorage.getItem(META_KEY) || 'null') || {}; }
  catch { return {}; }
}

function writeMeta(patch) {
  localStorage.setItem(META_KEY, JSON.stringify({ ...readMeta(), ...patch }));
}

function acceptedKey(key) {
  return !EXCLUDED_KEYS.has(key) && (/^dmforge-[a-z0-9-]+$/i.test(key) || /^cleric-box-[a-z0-9]+$/i.test(key));
}

function allBackupKeys() {
  const keys = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && acceptedKey(key)) keys.push(key);
  }
  return keys.sort();
}

function parseRecord(raw) {
  if (raw == null) return { exists: false, valid: true, data: null, error: '' };
  try { return { exists: true, valid: true, data: JSON.parse(raw), error: '' }; }
  catch (error) { return { exists: true, valid: false, data: null, error: error.message }; }
}

function newestTimestamp(value, newest = null) {
  if (Array.isArray(value)) {
    value.forEach((entry) => { newest = newestTimestamp(entry, newest); });
    return newest;
  }
  if (!value || typeof value !== 'object') return newest;
  for (const [key, entry] of Object.entries(value)) {
    if (/^(updatedAt|archivedAt|createdAt|exportedAt)$/i.test(key) && typeof entry === 'string') {
      const time = Date.parse(entry);
      if (Number.isFinite(time) && (!newest || time > newest)) newest = time;
    } else if (entry && typeof entry === 'object') newest = newestTimestamp(entry, newest);
  }
  return newest;
}

function formatDate(value) {
  if (!value) return 'No timestamp';
  return new Date(value).toLocaleString([], { year:'numeric', month:'short', day:'numeric', hour:'numeric', minute:'2-digit' });
}

function clericRecord() {
  const keys = allBackupKeys().filter((key) => key.startsWith('cleric-box-'));
  const raws = keys.map((key) => localStorage.getItem(key) || '');
  const parsed = raws.map(parseRecord);
  const valid = parsed.every((entry) => entry.valid);
  const newest = parsed.reduce((time, entry) => entry.valid ? newestTimestamp(entry.data, time) : time, null);
  return {
    label: 'Cleric in a Box', route: 'https://cbw29512.github.io/healingbox/',
    description: 'Hosted artifact rooms, charges, settings, and activity history.', keys,
    bytes: raws.reduce((sum, raw) => sum + bytesOf(raw), 0), count: keys.length,
    summary: `${keys.length} saved artifact room${keys.length === 1 ? '' : 's'}`, valid, newest,
    error: valid ? '' : 'One or more room records contain invalid JSON.'
  };
}

function unknownRecord() {
  const known = new Set(TOOLS.map((tool) => tool.key));
  const keys = allBackupKeys().filter((key) => key.startsWith('dmforge-') && !known.has(key));
  const raws = keys.map((key) => localStorage.getItem(key) || '');
  const parsed = raws.map(parseRecord);
  return {
    label: 'Other DM Forge Data', route: '',
    description: 'Additional versioned records recognized by the DM Forge prefix.', keys,
    bytes: raws.reduce((sum, raw) => sum + bytesOf(raw), 0), count: keys.length,
    summary: `${keys.length} additional record${keys.length === 1 ? '' : 's'}`,
    valid: parsed.every((entry) => entry.valid), newest: parsed.reduce((time, entry) => entry.valid ? newestTimestamp(entry.data, time) : time, null),
    error: parsed.every((entry) => entry.valid) ? '' : 'One or more additional records contain invalid JSON.'
  };
}

function toolRecords() {
  const records = TOOLS.map((tool) => {
    const raw = localStorage.getItem(tool.key);
    const parsed = parseRecord(raw);
    let summary = { count: 0, text: 'No saved data yet' };
    if (parsed.exists && parsed.valid) {
      try { summary = tool.summarize(parsed.data); }
      catch (error) { parsed.valid = false; parsed.error = error.message; }
    }
    return {
      ...tool, keys: [tool.key], bytes: raw == null ? 0 : bytesOf(raw), count: summary.count,
      summary: summary.text, valid: parsed.valid, exists: parsed.exists,
      newest: parsed.valid ? newestTimestamp(parsed.data) : null, error: parsed.error
    };
  });
  const cleric = clericRecord();
  const unknown = unknownRecord();
  records.push({ ...cleric, exists: cleric.keys.length > 0 });
  if (unknown.keys.length) records.push({ ...unknown, exists: true });
  return records;
}

function statusFor(record) {
  if (!record.valid) return { className: 'bad', text: 'Needs recovery' };
  if (!record.exists) return { className: 'warning', text: 'No local data' };
  return { className: '', text: 'Valid local data' };
}

function renderStorage(records) {
  $('#storageGrid').innerHTML = records.map((record) => {
    const status = statusFor(record);
    const classes = ['storage-card', !record.valid ? 'invalid' : '', !record.exists ? 'empty' : ''].filter(Boolean).join(' ');
    const action = record.route ? `<a class="btn light" href="${esc(record.route)}"${record.route.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>Open Tool</a>` : '';
    return `<article class="${classes}"><span class="status-pill ${status.className}">${status.text}</span><h3>${esc(record.label)}</h3><p>${esc(record.description)}</p><div class="storage-meta"><div><b>${esc(record.summary)}</b><span>Saved records</span></div><div><b>${humanBytes(record.bytes)}</b><span>Local size</span></div><div><b>${formatDate(record.newest)}</b><span>Newest record</span></div><div><b>${record.keys.length}</b><span>Storage key${record.keys.length === 1 ? '' : 's'}</span></div></div>${record.error ? `<p class="status-pill bad">${esc(record.error)}</p>` : ''}<div class="actions">${action}</div></article>`;
  }).join('');
}

async function renderQuota() {
  if (!navigator.storage?.estimate) return;
  try {
    const estimate = await navigator.storage.estimate();
    $('#quotaUsed').textContent = humanBytes(estimate.usage || 0);
    $('#quotaTotal').textContent = estimate.quota ? `of approximately ${humanBytes(estimate.quota)} available to this origin` : 'Browser did not report a quota.';
  } catch (error) {
    console.error('[BackupCenter] Storage estimate failed', error);
  }
}

function renderMeta() {
  const meta = readMeta();
  if (!meta.lastBackupAt) return;
  const time = Date.parse(meta.lastBackupAt);
  $('#lastBackup').textContent = formatDate(time);
  const days = Math.floor((Date.now() - time) / 86400000);
  $('#backupAge').textContent = days <= 0 ? 'Backed up today.' : `${days} day${days === 1 ? '' : 's'} since the last full backup.`;
}

async function scan() {
  const records = toolRecords();
  renderStorage(records);
  const keys = allBackupKeys();
  const totalBytes = keys.reduce((sum, key) => sum + bytesOf(localStorage.getItem(key) || ''), 0);
  const totalRecords = records.reduce((sum, record) => sum + (record.count || 0), 0);
  const invalid = records.filter((record) => !record.valid);
  $('#totalBytes').textContent = humanBytes(totalBytes);
  $('#recordCount').textContent = `${keys.length} storage key${keys.length === 1 ? '' : 's'} · ${totalRecords} summarized record${totalRecords === 1 ? '' : 's'}`;
  $('#backupHeadline').textContent = keys.length ? `${humanBytes(totalBytes)} of DM Forge campaign data is saved here.` : 'No DM Forge campaign data is saved on this browser yet.';
  $('#backupSummary').textContent = keys.length ? 'Download a full backup before clearing browser data, switching computers, or making major campaign changes.' : 'Create records in the tools, then return here to protect them with one export.';
  $('#recoveryStatus').textContent = invalid.length ? 'Attention needed' : 'Healthy';
  $('#recoveryMessage').textContent = invalid.length ? `${invalid.length} data set${invalid.length === 1 ? '' : 's'} could not be parsed as valid JSON.` : 'All recognized saved records can be parsed.';
  await renderQuota();
  renderMeta();
}

async function sha256(text) {
  if (!crypto.subtle) return '';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function buildBackup() {
  const entries = {};
  for (const key of allBackupKeys()) {
    const value = localStorage.getItem(key);
    if (typeof value !== 'string') continue;
    entries[key] = { value, bytes: bytesOf(value), sha256: await sha256(value) };
  }
  return {
    product: 'DM Forge Full Local Backup', version: 1,
    exportedAt: new Date().toISOString(), origin: location.origin,
    entryCount: Object.keys(entries).length, entries
  };
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

async function downloadBackup() {
  const button = $('#downloadBackup');
  button.disabled = true; button.textContent = 'Building Backup…';
  try {
    const backup = await buildBackup();
    const stamp = new Date().toISOString().slice(0, 10);
    downloadJson(backup, `dm-forge-full-backup-${stamp}.json`);
    writeMeta({ lastBackupAt: backup.exportedAt, lastBackupEntries: backup.entryCount });
    toast(`Full backup downloaded with ${backup.entryCount} local record${backup.entryCount === 1 ? '' : 's'}.`);
    scan();
  } catch (error) {
    console.error(error); alert(`Backup failed: ${error.message}`);
  } finally {
    button.disabled = false; button.textContent = 'Download Full Backup';
  }
}

async function validateBackup(parsed) {
  if (parsed?.product !== 'DM Forge Full Local Backup' || parsed?.version !== 1 || !parsed.entries || typeof parsed.entries !== 'object') throw new Error('This is not a supported DM Forge full backup.');
  const entries = [];
  for (const [key, record] of Object.entries(parsed.entries)) {
    if (!acceptedKey(key)) throw new Error(`Backup contains an unsupported key: ${key}`);
    if (!record || typeof record.value !== 'string') throw new Error(`Backup entry ${key} is malformed.`);
    if (record.value.length > MAX_IMPORT_BYTES) throw new Error(`Backup entry ${key} is too large.`);
    if (record.sha256) {
      const actual = await sha256(record.value);
      if (actual && actual !== record.sha256) throw new Error(`Integrity check failed for ${key}.`);
    }
    entries.push({ key, value: record.value, bytes: bytesOf(record.value) });
  }
  if (!entries.length) throw new Error('The backup contains no restorable records.');
  return entries;
}

function showImport(entries, metadata) {
  pendingImport = { entries, metadata };
  $('#importSummary').innerHTML = `<div class="import-row"><b>Backup created</b><span>${esc(formatDate(Date.parse(metadata.exportedAt)))}</span></div><div class="import-row"><b>Records to restore</b><span>${entries.length}</span></div><div class="import-row"><b>Backup size</b><span>${humanBytes(entries.reduce((sum, entry) => sum + entry.bytes, 0))}</span></div>` + entries.map((entry) => `<div class="import-row"><code>${esc(entry.key)}</code><span>${humanBytes(entry.bytes)}</span></div>`).join('');
  $('#confirmRestore').checked = false;
  $('#applyImport').disabled = true;
  $('#importPanel').hidden = false;
  $('#importPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function importFile(file) {
  if (!file) return;
  if (file.size > MAX_IMPORT_BYTES) return alert('That backup file is larger than the 50 MB safety limit.');
  try {
    const parsed = JSON.parse(await file.text());
    const entries = await validateBackup(parsed);
    showImport(entries, parsed);
  } catch (error) {
    console.error(error); alert(`Restore preview failed: ${error.message}`);
  } finally {
    $('#importBackup').value = '';
  }
}

function cancelImport() {
  pendingImport = null;
  $('#importPanel').hidden = true;
  $('#confirmRestore').checked = false;
  $('#applyImport').disabled = true;
}

function applyImport() {
  if (!pendingImport || !$('#confirmRestore').checked) return;
  try {
    for (const entry of pendingImport.entries) localStorage.setItem(entry.key, entry.value);
    writeMeta({ lastRestoreAt: new Date().toISOString(), restoredFrom: pendingImport.metadata.exportedAt || '' });
    const count = pendingImport.entries.length;
    cancelImport();
    alert(`${count} DM Forge record${count === 1 ? '' : 's'} restored. The page will reload so every tool can see the recovered data.`);
    location.reload();
  } catch (error) {
    console.error(error); alert(`Restore failed: ${error.message}`);
  }
}

function toast(message) {
  const element = document.createElement('div');
  element.textContent = message; element.setAttribute('role', 'status');
  element.style = 'position:fixed;z-index:150;left:50%;bottom:20px;transform:translateX(-50%);background:#281713;color:#fff4ce;padding:12px 18px;border:1px solid #d4a64c;border-radius:8px;max-width:90vw;box-shadow:0 8px 30px #0008';
  document.body.append(element); setTimeout(() => element.remove(), 3500);
}

$('#refreshScan').onclick = scan;
$('#downloadBackup').onclick = downloadBackup;
$('#importBackup').onchange = (event) => importFile(event.target.files?.[0]);
$('#cancelImport').onclick = cancelImport;
$('#confirmRestore').onchange = (event) => { $('#applyImport').disabled = !event.target.checked; };
$('#applyImport').onclick = applyImport;
window.addEventListener('storage', scan);
scan();
