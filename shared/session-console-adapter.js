(function connectSessionConsole(root) {
  'use strict';

  const LEGACY_KEY = 'dmforge-session-console-v1';
  let syncTimer = null;

  function readLegacy() {
    try {
      return JSON.parse(root.localStorage?.getItem(LEGACY_KEY) || 'null');
    } catch (error) {
      console.error('[SessionConsoleAdapter] Could not read Session Console data', error);
      return null;
    }
  }

  function currentCampaignName(legacy) {
    if (!legacy?.campaigns?.length) return 'My Campaign';
    const active = legacy.campaigns.find((campaign) => campaign.id === legacy.activeCampaignId) || legacy.campaigns[0];
    return active?.name || 'My Campaign';
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

    bar.innerHTML = `<div><b>Shared Campaign:</b> ${escapeHtml(active?.name || 'None selected')}<span>${escapeHtml(localName)} · ${counts.sessions} session record${counts.sessions === 1 ? '' : 's'} · ${counts.magicItems} magic item${counts.magicItems === 1 ? '' : 's'}</span></div><div class="shared-context-actions"><button type="button" class="btn light" id="makeSessionCampaignActive">Use ${escapeHtml(localName)} Everywhere</button><a class="btn light" href="campaigns.html">Campaign Hub</a></div>`;

    const button = document.getElementById('makeSessionCampaignActive');
    if (button) button.onclick = () => {
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
  root.setTimeout(sync, 0);
})(globalThis);
