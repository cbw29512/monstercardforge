(function connectSessionConsole(root) {
  'use strict';

  const LEGACY_KEY = 'dmforge-session-console-v1';
  let syncTimer = null;

  function uid() {
    return root.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function dateOnly() {
    return new Date().toISOString().slice(0, 10);
  }

  function blankSession() {
    return {
      id: uid(),
      title: '',
      date: dateOnly(),
      prep: { opening: '', scenes: '', secrets: '', npcs: '', locations: '', rewards: '', notes: '' },
      log: [],
      initiative: { combatants: [], round: 1, turnIndex: 0, active: false, log: [] },
      diceHistory: [],
      generatorHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function readLegacy() {
    try {
      return JSON.parse(root.localStorage?.getItem(LEGACY_KEY) || 'null');
    } catch (error) {
      console.error('[SessionConsoleAdapter] Could not read Session Console data', error);
      return null;
    }
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

  function useCampaignLocally(name) {
    const safeName = String(name || '').trim().slice(0, 100);
    if (!safeName) return;
    const legacy = readLegacy();
    if (!legacy?.campaigns?.length) return;
    let campaign = findCampaign(legacy, safeName);
    if (!campaign) {
      campaign = { id: uid(), name: safeName, roster: [], session: blankSession(), archives: [] };
      legacy.campaigns.push(campaign);
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

  function renderContext(legacy) {
    const store = root.DMForgeStore;
    if (!store) return;
    let bar = document.getElementById('dmforgeSharedContext');
    if (!bar) {
      bar = document.createElement('section');
      bar.id = 'dmforgeSharedContext';
      bar.className = 'shared-context no-print';
      const main = document.querySelector('main');
      if (main) main.prepend(bar);
    }

    const localName = currentCampaignName(legacy);
    const active = store.getActiveCampaign();
    const localCampaign = store.listCampaigns().find((campaign) => campaign.name.toLocaleLowerCase() === localName.toLocaleLowerCase());
    const counts = localCampaign ? store.counts(localCampaign.id) : { magicItems: 0, sessions: 0 };

    bar.innerHTML = `<div><b>Shared Campaign:</b> ${escapeHtml(active?.name || 'None selected')}<span>${escapeHtml(localName)} · ${counts.sessions} session record${counts.sessions === 1 ? '' : 's'} · ${counts.magicItems} magic item${counts.magicItems === 1 ? '' : 's'}</span></div><div class="shared-context-actions">${active && active.name.toLocaleLowerCase() !== localName.toLocaleLowerCase() ? '<button type="button" class="btn light" id="useSharedCampaignHere">Use Active Here</button>' : ''}<button type="button" class="btn light" id="makeSessionCampaignActive">Use ${escapeHtml(localName)} Everywhere</button><a class="btn light" href="campaigns.html">Campaign Hub</a></div>`;

    const useHere = document.getElementById('useSharedCampaignHere');
    if (useHere) useHere.onclick = () => useCampaignLocally(store.getActiveCampaign()?.name);

    const makeActive = document.getElementById('makeSessionCampaignActive');
    if (makeActive) makeActive.onclick = () => {
      store.ensureCampaign(localName, { source: 'session-console' });
      store.setActiveCampaign(localName);
      renderContext(readLegacy());
    };
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
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

  function scheduleSync() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(sync, 350);
  }

  document.addEventListener('input', scheduleSync, true);
  document.addEventListener('change', scheduleSync, true);
  document.addEventListener('click', scheduleSync, true);
  root.addEventListener('storage', (event) => {
    if (event.key === LEGACY_KEY || event.key === root.DMForgeStore?.STORAGE_KEY) scheduleSync();
  });
  root.addEventListener('dmforge:store-changed', () => renderContext(readLegacy()));
  root.setInterval(sync, 5000);
  root.setTimeout(() => {
    applyRequestedCampaign();
    sync();
  }, 0);
})(globalThis);
