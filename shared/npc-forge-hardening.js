(function hardenNpcForge() {
  'use strict';

  function blankPrep() {
    return { opening: '', scenes: '', secrets: '', npcs: '', locations: '', rewards: '', notes: '' };
  }

  blankNpc = function createTrulyBlankNpc() {
    editingId = null;
    for (const element of form.elements) {
      if (!element.name) continue;
      if (element.tagName === 'SELECT') element.selectedIndex = 0;
      else element.value = '';
    }
    form.elements.campaign.value = store?.getActiveCampaign()?.name || 'My Campaign';
    form.elements.status.value = 'Unknown';
    form.elements.icon.value = '🧑';
    form.elements.ruleset.value = 'Homebrew';
    previewMode = 'player';
    document.getElementById('saveState').textContent = 'Unsaved draft';
    document.getElementById('saveState').classList.remove('saved');
    renderPreview();
    renderContext();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  sendToSession = function sendNpcSafelyToSession(id) {
    const npc = library.find((entry) => entry.id === id);
    if (!npc) return;
    let state = readJson(SESSION_KEY, null);
    if (!state?.campaigns?.length) {
      const campaign = { id: uid(), name: npc.campaign || 'Unsorted', roster: [], session: blankSession(), archives: [] };
      state = { version: 1, activeCampaignId: campaign.id, campaigns: [campaign], activeTab: 'prep' };
    }
    const campaign = ensureSessionCampaign(state, npc.campaign || 'Unsorted');
    campaign.session ||= blankSession();
    campaign.session.prep ||= blankPrep();
    const summary = `${npc.name} — ${npc.role || 'NPC'}${npc.faction ? `, ${npc.faction}` : ''}. Mannerism: ${npc.mannerism || 'not set'}. Motive: ${npc.motive || 'not set'}.`;
    campaign.session.prep.npcs = [campaign.session.prep.npcs, summary].filter(Boolean).join('\n');
    campaign.session.updatedAt = new Date().toISOString();
    localStorage.setItem(SESSION_KEY, JSON.stringify(state));
    store?.syncSessionConsole(state);
    toast(`${npc.name} added to ${campaign.name} NPCs & Motives.`);
  };

  document.getElementById('newNpc').onclick = blankNpc;
})();
