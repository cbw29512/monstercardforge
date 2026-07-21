(function initializeDMForgeStore(root) {
  'use strict';

  const STORAGE_KEY = 'dmforge-shared-v1';
  const SCHEMA_VERSION = 1;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function now() {
    return new Date().toISOString();
  }

  function uid(prefix = 'id') {
    const random = root.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return `${prefix}-${random}`;
  }

  function cleanText(value, fallback = '', maximum = 160) {
    const text = String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim();
    return (text || fallback).slice(0, maximum);
  }

  function campaignKey(name) {
    return cleanText(name, 'Untitled Campaign').toLocaleLowerCase().replace(/\s+/g, ' ');
  }

  function emptyStore() {
    return {
      schemaVersion: SCHEMA_VERSION,
      updatedAt: now(),
      activeCampaignId: null,
      campaigns: [],
      magicItems: [],
      sessions: [],
      encounters: [],
      npcs: [],
      loot: [],
      healingRooms: [],
      settings: {}
    };
  }

  function normalizeStore(raw) {
    const base = emptyStore();
    if (!raw || typeof raw !== 'object') return base;
    for (const collection of ['campaigns', 'magicItems', 'sessions', 'encounters', 'npcs', 'loot', 'healingRooms']) {
      base[collection] = Array.isArray(raw[collection]) ? raw[collection] : [];
    }
    base.activeCampaignId = typeof raw.activeCampaignId === 'string' ? raw.activeCampaignId : null;
    base.settings = raw.settings && typeof raw.settings === 'object' ? raw.settings : {};
    base.updatedAt = raw.updatedAt || now();
    return base;
  }

  function read() {
    try {
      return normalizeStore(JSON.parse(root.localStorage?.getItem(STORAGE_KEY) || 'null'));
    } catch (error) {
      console.error('[DMForgeStore] Failed to read shared store', error);
      return emptyStore();
    }
  }

  function write(store) {
    const normalized = normalizeStore(store);
    normalized.updatedAt = now();
    root.localStorage?.setItem(STORAGE_KEY, JSON.stringify(normalized));
    root.dispatchEvent?.(new CustomEvent('dmforge:store-changed', { detail: clone(normalized) }));
    return normalized;
  }

  function mutate(callback) {
    const store = read();
    callback(store);
    return write(store);
  }

  function ensureCampaignIn(store, name, metadata = {}) {
    const safeName = cleanText(name, 'Untitled Campaign', 100);
    const key = campaignKey(safeName);
    let campaign = store.campaigns.find((entry) => campaignKey(entry.name) === key);
    if (!campaign) {
      campaign = {
        id: uid('campaign'),
        name: safeName,
        createdAt: now(),
        updatedAt: now(),
        sources: [],
        rulesets: []
      };
      store.campaigns.push(campaign);
    }
    campaign.name = safeName;
    campaign.updatedAt = now();
    if (metadata.source && !campaign.sources.includes(metadata.source)) campaign.sources.push(metadata.source);
    if (metadata.ruleset && !campaign.rulesets.includes(String(metadata.ruleset))) campaign.rulesets.push(String(metadata.ruleset));
    if (!store.activeCampaignId) store.activeCampaignId = campaign.id;
    return campaign;
  }

  function ensureCampaign(name, metadata = {}) {
    let result;
    mutate((store) => { result = ensureCampaignIn(store, name, metadata); });
    return clone(result);
  }

  function setActiveCampaign(reference) {
    let selected = null;
    mutate((store) => {
      selected = store.campaigns.find((campaign) => campaign.id === reference || campaignKey(campaign.name) === campaignKey(reference));
      if (selected) store.activeCampaignId = selected.id;
    });
    return selected ? clone(selected) : null;
  }

  function getActiveCampaign() {
    const store = read();
    return clone(store.campaigns.find((campaign) => campaign.id === store.activeCampaignId) || store.campaigns[0] || null);
  }

  function listCampaigns() {
    return clone(read().campaigns.sort((a, b) => a.name.localeCompare(b.name)));
  }

  function syncSessionConsole(legacyState) {
    if (!legacyState || !Array.isArray(legacyState.campaigns)) return read();
    return mutate((store) => {
      store.sessions = store.sessions.filter((entry) => entry.source !== 'session-console');
      for (const legacyCampaign of legacyState.campaigns) {
        const campaign = ensureCampaignIn(store, legacyCampaign.name, { source: 'session-console' });
        const working = legacyCampaign.session;
        if (working) {
          store.sessions.push({
            id: `session-console-working-${cleanText(working.id || uid(), '', 100)}`,
            source: 'session-console',
            sourceId: cleanText(working.id || '', '', 100),
            campaignId: campaign.id,
            title: cleanText(working.title, 'Current Session', 160),
            date: cleanText(working.date, '', 20),
            status: 'working',
            logCount: Array.isArray(working.log) ? working.log.length : 0,
            combatantCount: Array.isArray(working.initiative?.combatants) ? working.initiative.combatants.length : 0,
            updatedAt: working.updatedAt || now()
          });
        }
        for (const archived of Array.isArray(legacyCampaign.archives) ? legacyCampaign.archives : []) {
          store.sessions.push({
            id: `session-console-archive-${cleanText(archived.id || uid(), '', 100)}`,
            source: 'session-console',
            sourceId: cleanText(archived.id || '', '', 100),
            campaignId: campaign.id,
            title: cleanText(archived.title, 'Archived Session', 160),
            date: cleanText(archived.date, '', 20),
            status: 'archived',
            logCount: Array.isArray(archived.log) ? archived.log.length : 0,
            combatantCount: Array.isArray(archived.initiative?.combatants) ? archived.initiative.combatants.length : 0,
            updatedAt: archived.archivedAt || archived.updatedAt || now()
          });
        }
      }
    });
  }

  function syncMagicItems(items) {
    if (!Array.isArray(items)) return read();
    return mutate((store) => {
      store.magicItems = store.magicItems.filter((entry) => entry.source !== 'magic-items');
      for (const item of items) {
        const campaign = ensureCampaignIn(store, item.campaign || 'Unsorted', { source: 'magic-items', ruleset: item.ruleset });
        store.magicItems.push({
          id: `magic-item-${cleanText(item.id || uid(), '', 100)}`,
          source: 'magic-items',
          sourceId: cleanText(item.id || '', '', 100),
          campaignId: campaign.id,
          name: cleanText(item.name, 'Unnamed Magic Item', 160),
          category: cleanText(item.category, 'Magic Item', 80),
          rarity: cleanText(item.rarity, 'Homebrew', 80),
          owner: cleanText(item.owner, '', 100),
          identification: cleanText(item.identification, 'identified', 30),
          stage: cleanText(item.stage, 'none', 30),
          ruleset: cleanText(item.ruleset, 'Homebrew', 40),
          updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : now()
        });
      }
    });
  }

  function syncEncounters(encounters) {
    if (!Array.isArray(encounters)) return read();
    return mutate((store) => {
      store.encounters = store.encounters.filter((entry) => entry.source !== 'encounter-forge');
      for (const encounter of encounters) {
        const campaign = ensureCampaignIn(store, encounter.campaign || 'Unsorted', { source: 'encounter-forge', ruleset: encounter.ruleset });
        store.encounters.push({
          id: `encounter-${cleanText(encounter.id || uid(), '', 100)}`,
          source: 'encounter-forge',
          sourceId: cleanText(encounter.id || '', '', 100),
          campaignId: campaign.id,
          name: cleanText(encounter.name, 'Untitled Encounter', 160),
          environment: cleanText(encounter.environment, 'Other', 60),
          ruleset: cleanText(encounter.ruleset, '2024', 20),
          difficulty: cleanText(encounter.result?.difficulty, 'Unrated', 30),
          rawXp: Math.max(0, Number(encounter.result?.rawXp) || 0),
          adjustedXp: Math.max(0, Number(encounter.result?.adjustedXp) || 0),
          monsterCount: Math.max(0, Number(encounter.result?.monsterCount) || 0),
          statBlockCount: Array.isArray(encounter.monsters) ? encounter.monsters.length : 0,
          updatedAt: encounter.updatedAt || now()
        });
      }
    });
  }

  function syncHealingRoom(roomCode, roomState) {
    if (!roomState || !roomCode) return read();
    return mutate((store) => {
      const campaign = ensureCampaignIn(store, roomState.campaign || 'My Campaign', { source: 'cleric-in-a-box', ruleset: roomState.ruleset });
      store.healingRooms = store.healingRooms.filter((entry) => entry.roomCode !== String(roomCode).toUpperCase());
      store.healingRooms.push({
        id: `healing-room-${String(roomCode).toUpperCase()}`,
        source: 'cleric-in-a-box',
        roomCode: String(roomCode).toUpperCase(),
        campaignId: campaign.id,
        level: Number(roomState.level) || 1,
        ruleset: String(roomState.ruleset || 2014),
        remainingCharges: Array.isArray(roomState.charges) ? roomState.charges.filter((charge) => !charge.spent).length : 0,
        updatedAt: now()
      });
    });
  }

  function counts(campaignId) {
    const store = read();
    const count = (collection) => store[collection].filter((entry) => entry.campaignId === campaignId).length;
    return {
      magicItems: count('magicItems'),
      sessions: count('sessions'),
      encounters: count('encounters'),
      npcs: count('npcs'),
      loot: count('loot'),
      healingRooms: count('healingRooms')
    };
  }

  function snapshot() {
    return clone(read());
  }

  root.DMForgeStore = Object.freeze({
    STORAGE_KEY,
    SCHEMA_VERSION,
    snapshot,
    listCampaigns,
    ensureCampaign,
    setActiveCampaign,
    getActiveCampaign,
    syncSessionConsole,
    syncMagicItems,
    syncEncounters,
    syncHealingRoom,
    counts
  });
})(globalThis);
