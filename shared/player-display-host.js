(function hostPlayerDisplay(root) {
  'use strict';

  const SESSION_KEY = 'dmforge-session-console-v1';
  const ROOM_KEY = 'dmforge-player-display-rooms-v1';
  const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let peer = null;
  let connections = [];
  let roomCode = '';
  let lastSnapshot = '';
  let online = false;
  let starting = false;
  let hostedCampaignId = '';

  function readJson(key, fallback) {
    try { return JSON.parse(root.localStorage?.getItem(key) || 'null') ?? fallback; }
    catch (error) { console.error(`[PlayerDisplayHost] Could not read ${key}`, error); return fallback; }
  }

  function writeJson(key, value) {
    root.localStorage?.setItem(key, JSON.stringify(value));
  }

  function secureIndex(maximum) {
    const limit = Math.floor(0x100000000 / maximum) * maximum;
    const value = new Uint32Array(1);
    do root.crypto.getRandomValues(value); while (value[0] >= limit);
    return value[0] % maximum;
  }

  function randomCode() {
    return Array.from({ length: 6 }, () => ALPHABET[secureIndex(ALPHABET.length)]).join('');
  }

  function hostId(code) {
    return `dmforge-player-display-${String(code).toLocaleLowerCase()}`;
  }

  function sessionState() {
    return readJson(SESSION_KEY, null);
  }

  function currentCampaignRecord() {
    const state = sessionState();
    if (!state?.campaigns?.length) return null;
    return state.campaigns.find((campaign) => campaign.id === state.activeCampaignId) || state.campaigns[0];
  }

  function publicState() {
    const campaign = currentCampaignRecord();
    const session = campaign?.session;
    const initiative = session?.initiative;
    const combatants = Array.isArray(initiative?.combatants) ? initiative.combatants.slice() : [];
    const current = combatants[Number(initiative?.turnIndex) || 0] || null;
    combatants.sort((a, b) => Number(b.initiative) - Number(a.initiative) || Number(b.dex) - Number(a.dex) || String(a.name).localeCompare(String(b.name)));
    return {
      version: 1,
      campaign: String(campaign?.name || 'DM Forge Campaign').slice(0, 100),
      sessionTitle: String(session?.title || 'Current Encounter').slice(0, 140),
      round: Math.max(1, Number(initiative?.round) || 1),
      active: Boolean(initiative?.active),
      currentId: current?.id || null,
      combatants: combatants.map((combatant) => ({
        id: String(combatant.id || ''),
        name: String(combatant.name || 'Combatant').slice(0, 100),
        type: ['player', 'ally', 'enemy'].includes(combatant.type) ? combatant.type : 'enemy',
        initiative: Number(combatant.initiative) || 0,
        conditions: Array.isArray(combatant.conditions) ? combatant.conditions.map((condition) => String(condition).slice(0, 40)).slice(0, 12) : []
      }))
    };
  }

  function campaignRoom() {
    const campaign = currentCampaignRecord();
    if (!campaign) return '';
    return readJson(ROOM_KEY, {})[campaign.id] || '';
  }

  function rememberRoom(code) {
    const campaign = currentCampaignRecord();
    if (!campaign) return;
    const rooms = readJson(ROOM_KEY, {});
    rooms[campaign.id] = code;
    writeJson(ROOM_KEY, rooms);
  }

  function playerUrl() {
    const url = new URL('player-display.html', location.href);
    url.searchParams.set('join', roomCode);
    return url.toString();
  }

  function renderPanel() {
    let panel = document.getElementById('playerDisplayHostPanel');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'playerDisplayHostPanel';
      panel.className = 'panel no-print';
      const controls = document.querySelector('#initiativeTab .combat-controls');
      controls?.parentNode?.insertBefore(panel, controls);
    }
    if (!panel) return;
    const status = online ? `Live · ${connections.filter((connection) => connection.open).length} connected` : starting ? 'Starting…' : 'Not broadcasting';
    panel.innerHTML = `<div class="section-head compact"><div><h2>Player Display</h2><p>Share round, current turn, initiative order, and public conditions. Enemy HP, AC, Dexterity, combat logs, and DM notes never leave this browser.</p></div><span class="save-state ${online ? 'saved' : ''}" id="playerDisplayStatus">${status}</span></div><div class="actions"><button class="btn ${online ? 'danger' : 'gold'}" id="togglePlayerDisplay" type="button" ${starting ? 'disabled' : ''}>${online ? 'Stop Player Display' : starting ? 'Starting…' : 'Start Player Display'}</button>${roomCode ? `<span class="room-code">${roomCode}</span><button class="btn light" id="copyPlayerDisplayLink" type="button">Copy Player Link</button><a class="btn light" href="${playerUrl()}" target="_blank" rel="noopener">Open Player View</a>` : ''}</div>`;
    document.getElementById('togglePlayerDisplay').onclick = online ? stop : start;
    document.getElementById('copyPlayerDisplayLink')?.addEventListener('click', copyLink);
  }

  function broadcast(force = false) {
    if (!online) return;
    const campaign = currentCampaignRecord();
    if (hostedCampaignId && campaign?.id !== hostedCampaignId) {
      stop();
      roomCode = campaignRoom();
      renderPanel();
      toast('Player Display stopped because the active campaign changed.');
      return;
    }
    const state = publicState();
    const snapshot = JSON.stringify(state);
    if (!force && snapshot === lastSnapshot) return;
    lastSnapshot = snapshot;
    connections.filter((connection) => connection.open).forEach((connection) => connection.send({ type: 'public-state', state }));
    renderPanel();
  }

  function openPeer(code) {
    if (!root.Peer) {
      starting = false;
      renderPanel();
      toast('The player-display network library did not load. Check the internet connection and reload.');
      return;
    }
    starting = true;
    roomCode = code || randomCode();
    hostedCampaignId = currentCampaignRecord()?.id || '';
    rememberRoom(roomCode);
    renderPanel();
    peer = new root.Peer(hostId(roomCode));
    peer.on('open', () => {
      starting = false;
      online = true;
      connections = [];
      lastSnapshot = '';
      renderPanel();
      broadcast(true);
    });
    peer.on('connection', (connection) => {
      connections.push(connection);
      connection.on('open', () => { connection.send({ type: 'public-state', state: publicState() }); renderPanel(); });
      connection.on('data', () => {});
      connection.on('close', () => { connections = connections.filter((entry) => entry !== connection); renderPanel(); });
      connection.on('error', () => { connections = connections.filter((entry) => entry !== connection); renderPanel(); });
    });
    peer.on('error', (error) => {
      console.error('[PlayerDisplayHost]', error);
      if (error.type === 'unavailable-id') {
        try { peer.destroy(); } catch (destroyError) { console.error(destroyError); }
        openPeer(randomCode());
        return;
      }
      starting = false;
      online = false;
      renderPanel();
      toast(`Player Display error: ${error.type || 'connection failed'}`);
    });
    peer.on('close', () => { starting = false; online = false; connections = []; renderPanel(); });
  }

  function start() {
    if (online || starting) return;
    openPeer(campaignRoom() || randomCode());
  }

  function stop() {
    starting = false;
    online = false;
    connections.forEach((connection) => { try { connection.close(); } catch (error) { console.error(error); } });
    connections = [];
    try { peer?.destroy(); } catch (error) { console.error(error); }
    peer = null;
    hostedCampaignId = '';
    renderPanel();
  }

  function copyLink() {
    const url = playerUrl();
    root.navigator.clipboard?.writeText(url).then(() => toast('Player Display link copied.')).catch(() => root.prompt('Copy this player link:', url));
  }

  function toast(message) {
    const element = document.createElement('div');
    element.textContent = message;
    element.setAttribute('role', 'status');
    element.style = 'position:fixed;z-index:130;left:50%;bottom:20px;transform:translateX(-50%);background:#281713;color:#fff4ce;padding:12px 18px;border:1px solid #d4a64c;border-radius:8px;max-width:90vw;box-shadow:0 8px 30px #0008';
    document.body.append(element);
    setTimeout(() => element.remove(), 3000);
  }

  document.addEventListener('click', () => root.setTimeout(() => broadcast(), 80), true);
  document.addEventListener('change', () => root.setTimeout(() => broadcast(), 80), true);
  root.addEventListener('storage', (event) => { if (event.key === SESSION_KEY) broadcast(true); });
  root.setInterval(() => broadcast(), 750);
  root.addEventListener('beforeunload', stop);
  root.setTimeout(() => { roomCode = campaignRoom(); renderPanel(); }, 0);
})(globalThis);
