(function connectMagicItems(root) {
  'use strict';

  const ITEMS_KEY = 'dmforge-magic-items-v2';
  const SESSIONS_KEY = 'dmforge-session-console-v1';
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

  function blankSession() {
    const timestamp = new Date().toISOString();
    return {
      id: uid(), title: '', date: timestamp.slice(0, 10),
      prep: { opening: '', scenes: '', secrets: '', npcs: '', locations: '', rewards: '', notes: '' },
      log: [], initiative: { combatants: [], round: 1, turnIndex: 0, active: false, log: [] },
      diceHistory: [], generatorHistory: [], createdAt: timestamp, updatedAt: timestamp
    };
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function readJson(key, fallback) {
    try {
      const parsed = JSON.parse(root.localStorage?.getItem(key) || 'null');
      return parsed ?? fallback;
    } catch (error) {
      console.error(`[MagicItemsAdapter] Could not read ${key}`, error);
      return fallback;
    }
  }

  function readItems() {
    const items = readJson(ITEMS_KEY, []);
    return Array.isArray(items) ? items : [];
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
    ensureStyles();
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

  function ensureSessionCampaign(state, name) {
    const key = String(name || 'Unsorted').trim().toLocaleLowerCase();
    let campaign = state.campaigns.find((entry) => String(entry.name || '').trim().toLocaleLowerCase() === key);
    if (!campaign) {
      campaign = { id: uid(), name: name || 'Unsorted', roster: [], session: blankSession(), archives: [] };
      state.campaigns.push(campaign);
    }
    return campaign;
  }

  function sendItemToSession(itemId) {
    const item = readItems().find((entry) => entry.id === itemId);
    if (!item) return;
    let sessionState = readJson(SESSIONS_KEY, null);
    if (!sessionState?.campaigns?.length) {
      const firstCampaign = { id: uid(), name: item.campaign || 'Unsorted', roster: [], session: blankSession(), archives: [] };
      sessionState = { version: 1, activeCampaignId: firstCampaign.id, campaigns: [firstCampaign], activeTab: 'prep' };
    }
    const campaign = ensureSessionCampaign(sessionState, item.campaign || 'Unsorted');
    const owner = item.owner ? ` — intended for ${item.owner}` : '';
    const reward = `Magic item reward: ${item.name || 'Unnamed Magic Item'} (${item.rarity || 'Homebrew'} ${item.category || 'item'})${owner}.`;
    campaign.session.prep.rewards = [campaign.session.prep.rewards, reward].filter(Boolean).join('\n');
    campaign.session.updatedAt = new Date().toISOString();
    root.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessionState));
    root.DMForgeStore?.syncSessionConsole(sessionState);
    toast(`${item.name || 'Magic item'} added to ${campaign.name} Session Rewards.`);
  }

  function enhanceLibrary() {
    document.querySelectorAll('.library-item').forEach((card) => {
      const editButton = card.querySelector('[data-edit]');
      const actions = card.querySelector('.library-actions');
      const itemId = editButton?.dataset.edit;
      if (!itemId || !actions || actions.querySelector('[data-send-reward]')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn light';
      button.dataset.sendReward = itemId;
      button.textContent = 'Send to Session Rewards';
      button.onclick = () => sendItemToSession(itemId);
      actions.prepend(button);
    });
  }

  function toast(message) {
    const element = document.createElement('div');
    element.textContent = message;
    element.setAttribute('role', 'status');
    element.style = 'position:fixed;z-index:110;left:50%;bottom:20px;transform:translateX(-50%);background:#281713;color:#fff4ce;padding:12px 18px;border:1px solid #d4a64c;border-radius:8px;max-width:90vw;box-shadow:0 8px 30px #0008';
    document.body.append(element);
    setTimeout(() => element.remove(), 3000);
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
    enhanceLibrary();
  }

  function scheduleSync() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(sync, 350);
  }

  document.addEventListener('input', scheduleSync, true);
  document.addEventListener('change', scheduleSync, true);
  document.addEventListener('click', scheduleSync, true);
  root.addEventListener('storage', (event) => {
    if ([ITEMS_KEY, SESSIONS_KEY, root.DMForgeStore?.STORAGE_KEY].includes(event.key)) scheduleSync();
  });
  root.addEventListener('dmforge:store-changed', () => {
    mergeCampaignNames();
    renderContext();
    enhanceLibrary();
  });
  const library = document.getElementById('libraryGrid');
  if (library) new MutationObserver(enhanceLibrary).observe(library, { childList: true, subtree: true });
  root.setInterval(sync, 5000);
  root.setTimeout(() => {
    applyQueryCampaign();
    sync();
  }, 0);
})(globalThis);
