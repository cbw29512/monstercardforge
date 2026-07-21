(function connectMagicItems(root) {
  'use strict';

  const ITEMS_KEY = 'dmforge-magic-items-v2';
  let syncTimer = null;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function readItems() {
    try {
      const items = JSON.parse(root.localStorage?.getItem(ITEMS_KEY) || '[]');
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error('[MagicItemsAdapter] Could not read Magic Item Forge data', error);
      return [];
    }
  }

  function mergeCampaignNames() {
    const datalist = document.getElementById('campaignNames');
    if (!datalist || !root.DMForgeStore) return;
    const localNames = readItems().map((item) => item.campaign || 'Unsorted');
    const sharedNames = root.DMForgeStore.listCampaigns().map((campaign) => campaign.name);
    const names = [...new Set([...localNames, ...sharedNames])].sort((a, b) => a.localeCompare(b));
    datalist.innerHTML = names.map((name) => `<option value="${escapeHtml(name)}"></option>`).join('');
  }

  function currentEditorCampaign() {
    return document.querySelector('[name="campaign"]')?.value?.trim() || root.DMForgeStore?.getActiveCampaign()?.name || 'Unsorted';
  }

  function renderContext() {
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

    const active = store.getActiveCampaign();
    const editorCampaign = currentEditorCampaign();
    const sharedCampaign = store.listCampaigns().find((campaign) => campaign.name.toLocaleLowerCase() === editorCampaign.toLocaleLowerCase());
    const counts = sharedCampaign ? store.counts(sharedCampaign.id) : { magicItems: 0, sessions: 0 };

    bar.innerHTML = `<div><b>Shared Campaign:</b> ${escapeHtml(active?.name || 'None selected')}<span>${escapeHtml(editorCampaign)} · ${counts.magicItems} magic item${counts.magicItems === 1 ? '' : 's'} · ${counts.sessions} session record${counts.sessions === 1 ? '' : 's'}</span></div><div class="shared-context-actions"><button type="button" class="btn light" id="useActiveCampaign">Use Active Campaign</button><button type="button" class="btn light" id="makeItemCampaignActive">Use ${escapeHtml(editorCampaign)} Everywhere</button><a class="btn light" href="campaigns.html">Campaign Hub</a></div>`;

    const useActive = document.getElementById('useActiveCampaign');
    if (useActive) useActive.onclick = () => {
      const currentActive = store.getActiveCampaign();
      const input = document.querySelector('[name="campaign"]');
      if (currentActive && input) {
        input.value = currentActive.name;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        renderContext();
      }
    };

    const makeActive = document.getElementById('makeItemCampaignActive');
    if (makeActive) makeActive.onclick = () => {
      store.ensureCampaign(editorCampaign, { source: 'magic-items' });
      store.setActiveCampaign(editorCampaign);
      renderContext();
    };
  }

  function applyQueryCampaign() {
    const requested = new URLSearchParams(location.search).get('campaign');
    if (!requested) return;
    const input = document.querySelector('[name="campaign"]');
    if (input && input.value !== requested) {
      input.value = requested.slice(0, 100);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function sync() {
    const store = root.DMForgeStore;
    if (!store) return;
    const items = readItems();
    store.syncMagicItems(items);
    const campaign = currentEditorCampaign();
    store.ensureCampaign(campaign, { source: 'magic-items' });
    if (!store.getActiveCampaign()) store.setActiveCampaign(campaign);
    mergeCampaignNames();
    renderContext();
  }

  function scheduleSync() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(sync, 350);
  }

  document.addEventListener('input', scheduleSync, true);
  document.addEventListener('change', scheduleSync, true);
  document.addEventListener('click', scheduleSync, true);
  root.addEventListener('storage', (event) => {
    if (event.key === ITEMS_KEY || event.key === root.DMForgeStore?.STORAGE_KEY) scheduleSync();
  });
  root.addEventListener('dmforge:store-changed', () => {
    mergeCampaignNames();
    renderContext();
  });
  root.setInterval(sync, 5000);
  root.setTimeout(() => {
    applyQueryCampaign();
    sync();
  }, 0);
})(globalThis);
