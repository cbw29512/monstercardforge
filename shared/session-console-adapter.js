(function connectSessionConsole(root) {
  'use strict';

  const LEGACY_KEY = 'dmforge-session-console-v1';
  const PENDING_ENCOUNTER_KEY = 'dmforge-pending-encounter-v1';
  let syncTimer = null;

  function ensureStyles() {
    if (document.getElementById('dmforgeSharedContextStyles')) return;
    const link = document.createElement('link');
    link.id = 'dmforgeSharedContextStyles';
    link.rel = 'stylesheet';
    link.href = 'shared/shared-context.css';
    document.head.append(link);
  }

  function uid() {
    return root.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function dateOnly() {
    return new Date().toISOString().slice(0, 10);
  }

  function blankSession() {
    return {
      id: uid(), title: '', date: dateOnly(),
      prep: { opening: '', scenes: '', secrets: '', npcs: '', locations: '', rewards: '', notes: '' },
      log: [], initiative: { combatants: [], round: 1, turnIndex: 0, active: false, log: [] },
      diceHistory: [], generatorHistory: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
  }

  function readLegacy() {
    try { return JSON.parse(root.localStorage?.getItem(LEGACY_KEY) || 'null'); }
    catch (error) { console.error('[SessionConsoleAdapter] Could not read Session Console data', error); return null; }
  }

  function writeLegacy(value) {
    root.localStorage?.setItem(LEGACY_KEY, JSON.stringify(value));
  }

  function currentCampaign(legacy) {
    if (!legacy?.campaigns?.length) return null;
    return legacy.campaigns.find((campaign) => campaign.id === legacy.activeCampaignId) || legacy.campaigns[0];
  }

  function currentCampaignName(legacy) {
    return currentCampaign(legacy)?.name || 'My Campaign';
  }

  function findCampaign(legacy, name) {
    const key = String(name || '').trim().toLocaleLowerCase();
    return legacy?.campaigns?.find((campaign) => String(campaign.name || '').trim().toLocaleLowerCase() === key) || null;
  }

  function ensureCampaign(legacy, name) {
    let campaign = findCampaign(legacy, name);
    if (!campaign) {
      campaign = { id: uid(), name: String(name || 'My Campaign').trim().slice(0, 100), roster: [], session: blankSession(), archives: [] };
      legacy.campaigns.push(campaign);
    }
    return campaign;
  }

  function useCampaignLocally(name) {
    const safeName = String(name || '').trim().slice(0, 100);
    if (!safeName) return;
    let legacy = readLegacy();
    if (!legacy?.campaigns?.length) {
      const campaign = { id: uid(), name: safeName, roster: [], session: blankSession(), archives: [] };
      legacy = { version: 1, activeCampaignId: campaign.id, campaigns: [campaign], activeTab: 'prep' };
      writeLegacy(legacy);
      root.DMForgeStore?.syncSessionConsole(legacy);
      location.reload();
      return;
    }
    const campaign = ensureCampaign(legacy, safeName);
    if (legacy.activeCampaignId !== campaign.id) {
      legacy.activeCampaignId = campaign.id;
      writeLegacy(legacy);
      location.reload();
      return;
    }
    const select = document.getElementById('campaignSelect');
    if (select && select.value !== campaign.id) {
      select.value = campaign.id;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function applyRequestedCampaign() {
    const requested = new URLSearchParams(location.search).get('campaign');
    if (requested) useCampaignLocally(requested);
  }

  function consumePendingEncounter() {
    let payload;
    try { payload = JSON.parse(root.localStorage?.getItem(PENDING_ENCOUNTER_KEY) || 'null'); }
    catch (error) { console.error('[SessionConsoleAdapter] Could not read pending encounter', error); root.localStorage?.removeItem(PENDING_ENCOUNTER_KEY); return false; }
    if (!payload?.campaign || !Array.isArray(payload.combatants) || !payload.combatants.length) return false;

    let legacy = readLegacy();
    if (!legacy?.campaigns?.length) {
      const campaign = { id: uid(), name: payload.campaign, roster: [], session: blankSession(), archives: [] };
      legacy = { version: 1, activeCampaignId: campaign.id, campaigns: [campaign], activeTab: 'initiative' };
    }
    const campaign = ensureCampaign(legacy, payload.campaign);
    campaign.session ||= blankSession();
    campaign.session.initiative ||= { combatants: [], round: 1, turnIndex: 0, active: false, log: [] };
    const existing = new Set(campaign.session.initiative.combatants.map((entry) => entry.id));
    payload.combatants.filter((entry) => !existing.has(entry.id)).forEach((entry) => campaign.session.initiative.combatants.push({
      id: String(entry.id || uid()), name: String(entry.name || 'Enemy').slice(0, 100), type: 'enemy',
      initiative: Number(entry.initiative) || 0, dex: Number(entry.dex) || 0,
      ac: entry.ac == null ? null : Number(entry.ac), maxHp: entry.maxHp == null ? null : Number(entry.maxHp),
      currentHp: entry.currentHp == null ? null : Number(entry.currentHp), conditions: []
    }));
    campaign.session.initiative.combatants.sort((a, b) => Number(b.initiative) - Number(a.initiative) || Number(b.dex) - Number(a.dex) || a.name.localeCompare(b.name));
    campaign.session.initiative.log.push({ id: uid(), time: new Date().toISOString(), text: `${payload.name || 'Encounter'} imported from Encounter Forge with ${payload.combatants.length} enemies.` });
    campaign.session.prep.notes = [campaign.session.prep.notes, payload.objective ? `Encounter objective: ${payload.objective}` : '', payload.notes ? `Encounter notes: ${payload.notes}` : ''].filter(Boolean).join('\n');
    campaign.session.updatedAt = new Date().toISOString();
    legacy.activeCampaignId = campaign.id;
    legacy.activeTab = 'initiative';
    writeLegacy(legacy);
    root.localStorage?.removeItem(PENDING_ENCOUNTER_KEY);
    root.DMForgeStore?.syncSessionConsole(legacy);

    const url = new URL(location.href);
    url.searchParams.delete('importEncounter');
    url.searchParams.set('encounterImported', '1');
    location.replace(`${url.pathname}?${url.searchParams}`);
    return true;
  }

  function adoptExternalPrep(serializedState) {
    try {
      const external = JSON.parse(serializedState || 'null');
      const selectedId = document.getElementById('campaignSelect')?.value;
      const externalCampaign = external?.campaigns?.find((campaign) => campaign.id === selectedId);
      if (!externalCampaign?.session?.prep) return;
      const updates = [
        { key: 'rewards', label: 'Rewards & Discoveries' },
        { key: 'npcs', label: 'NPCs & Motives' }
      ];
      const changed = [];
      for (const update of updates) {
        const field = document.querySelector(`[data-prep="${update.key}"]`);
        const incoming = externalCampaign.session.prep[update.key];
        if (field && typeof incoming === 'string' && field.value !== incoming) {
          field.value = incoming;
          field.dispatchEvent(new Event('input', { bubbles: true }));
          changed.push(update.label);
        }
      }
      if (changed.length) toast(`${changed.join(' and ')} updated from another DM Forge tool.`);
    } catch (error) { console.error('[SessionConsoleAdapter] Could not apply external prep', error); }
  }

  function renderContext(legacy) {
    const store = root.DMForgeStore;
    if (!store) return;
    ensureStyles();
    let bar = document.getElementById('dmforgeSharedContext');
    if (!bar) {
      bar = document.createElement('section');
      bar.id = 'dmforgeSharedContext';
      bar.className = 'shared-context no-print';
      document.querySelector('main')?.prepend(bar);
    }
    const localName = currentCampaignName(legacy);
    const active = store.getActiveCampaign();
    const localCampaign = store.listCampaigns().find((campaign) => campaign.name.toLocaleLowerCase() === localName.toLocaleLowerCase());
    const counts = localCampaign ? store.counts(localCampaign.id) : { magicItems: 0, sessions: 0, encounters: 0, npcs: 0 };
    bar.innerHTML = `<div><b>Shared Campaign:</b> ${escapeHtml(active?.name || 'None selected')}<span>${escapeHtml(localName)} · ${counts.sessions} session record${counts.sessions === 1 ? '' : 's'} · ${counts.encounters} encounter${counts.encounters === 1 ? '' : 's'} · ${counts.npcs} NPC${counts.npcs === 1 ? '' : 's'} · ${counts.magicItems} magic item${counts.magicItems === 1 ? '' : 's'}</span></div><div class="shared-context-actions">${active && active.name.toLocaleLowerCase() !== localName.toLocaleLowerCase() ? '<button type="button" class="btn light" id="useSharedCampaignHere">Use Active Here</button>' : ''}<button type="button" class="btn light" id="makeSessionCampaignActive">Use ${escapeHtml(localName)} Everywhere</button><a class="btn light" href="campaigns.html">Campaign Hub</a></div>`;
    document.getElementById('useSharedCampaignHere')?.addEventListener('click', () => useCampaignLocally(store.getActiveCampaign()?.name));
    document.getElementById('makeSessionCampaignActive')?.addEventListener('click', () => { store.ensureCampaign(localName, { source: 'session-console' }); store.setActiveCampaign(localName); renderContext(readLegacy()); });
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[character]);
  }

  function toast(message) {
    const element = document.createElement('div'); element.textContent = message; element.setAttribute('role', 'status');
    element.style = 'position:fixed;z-index:110;left:50%;bottom:20px;transform:translateX(-50%);background:#281713;color:#fff4ce;padding:12px 18px;border:1px solid #d4a64c;border-radius:8px;max-width:90vw;box-shadow:0 8px 30px #0008';
    document.body.append(element); setTimeout(() => element.remove(), 3000);
  }

  function sync() {
    const store = root.DMForgeStore;
    if (!store) return;
    const legacy = readLegacy();
    if (!legacy?.campaigns?.length) return;
    store.syncSessionConsole(legacy);
    const name = currentCampaignName(legacy);
    store.ensureCampaign(name, { source: 'session-console' });
    if (!store.getActiveCampaign()) store.setActiveCampaign(name);
    renderContext(legacy);
  }

  function scheduleSync() { clearTimeout(syncTimer); syncTimer = setTimeout(sync, 350); }

  document.addEventListener('input', scheduleSync, true);
  document.addEventListener('change', scheduleSync, true);
  document.addEventListener('click', scheduleSync, true);
  root.addEventListener('storage', (event) => {
    if (event.key === LEGACY_KEY) adoptExternalPrep(event.newValue);
    if (event.key === LEGACY_KEY || event.key === root.DMForgeStore?.STORAGE_KEY) scheduleSync();
  });
  root.addEventListener('dmforge:store-changed', () => renderContext(readLegacy()));
  root.setInterval(sync, 5000);
  root.setTimeout(() => {
    if (consumePendingEncounter()) return;
    applyRequestedCampaign();
    sync();
    if (new URLSearchParams(location.search).get('encounterImported') === '1') toast('Encounter imported. Open the Initiative tab to begin.');
  }, 0);
})(globalThis);
