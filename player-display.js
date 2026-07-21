'use strict';

const $ = (selector) => document.querySelector(selector);
let peer = null;
let hostConnection = null;
let roomCode = '';
let reconnectTimer = null;
let wakeLock = null;
let keepAwakeRequested = false;
let manualDisconnect = false;

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[character]);
}

function hostId(code) {
  return `dmforge-player-display-${String(code).toLocaleLowerCase()}`;
}

function normalizeCode(value) {
  return String(value || '').toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g, '').slice(0, 6);
}

function setStatus(text, online = false) {
  $('#connectionText').textContent = text;
  $('#dot').className = `dot ${online ? 'online' : ''}`;
}

function renderSetup() {
  $('#setup').classList.remove('hidden');
  $('#display').classList.add('hidden');
  $('#roomCode').value = roomCode;
}

function renderState(state) {
  $('#setup').classList.add('hidden');
  $('#display').classList.remove('hidden');
  $('#campaignName').textContent = state.campaign || 'DM Forge Campaign';
  $('#sessionTitle').textContent = state.sessionTitle || 'Current Encounter';
  $('#roundNumber').textContent = state.round || 1;
  const current = state.combatants?.find((combatant) => combatant.id === state.currentId);
  $('#turnName').textContent = state.active ? (current?.name || 'Turn order active') : 'Combat has not started';
  const list = $('#initiativeList');
  if (!state.combatants?.length) {
    list.innerHTML = '<div class="empty">The DM has not added combatants yet.</div>';
    return;
  }
  list.innerHTML = state.combatants.map((combatant) => `<article class="combatant ${combatant.id === state.currentId && state.active ? 'current' : ''}"><div class="initiative-number">${Number(combatant.initiative) || 0}</div><div><div class="combatant-name">${esc(combatant.name)}</div><span class="type">${esc(combatant.type)}</span></div><div class="conditions">${combatant.conditions?.length ? combatant.conditions.map((condition) => `<span class="condition">${esc(condition)}</span>`).join('') : '<span class="type">No public conditions</span>'}</div></article>`).join('');
  document.title = current && state.active ? `${current.name}'s Turn | DM Forge` : 'Player Display | DM Forge';
}

function teardownConnection() {
  clearTimeout(reconnectTimer);
  try { hostConnection?.close(); } catch (error) { console.error(error); }
  try { peer?.destroy(); } catch (error) { console.error(error); }
  hostConnection = null;
  peer = null;
}

function connect(code) {
  roomCode = normalizeCode(code);
  if (roomCode.length !== 6) {
    setStatus('Enter the six-character room code.');
    renderSetup();
    return;
  }
  manualDisconnect = true;
  teardownConnection();
  manualDisconnect = false;
  setStatus('Connecting…');
  if (!window.Peer) {
    setStatus('Network library unavailable. Reload while online.');
    renderSetup();
    return;
  }
  peer = new Peer();
  peer.on('open', () => {
    hostConnection = peer.connect(hostId(roomCode), { reliable: true });
    hostConnection.on('open', () => {
      setStatus(`Connected · Room ${roomCode}`, true);
      hostConnection.send({ type: 'hello', client: 'player-display' });
    });
    hostConnection.on('data', (message) => {
      if (message?.type === 'public-state' && message.state) renderState(message.state);
    });
    hostConnection.on('close', () => disconnected());
    hostConnection.on('error', () => disconnected());
  });
  peer.on('error', (error) => {
    console.error('[PlayerDisplay]', error);
    disconnected(error.type === 'peer-unavailable' ? 'Waiting for the DM host…' : 'Connection interrupted…');
  });
}

function disconnected(message = 'DM host disconnected. Retrying…') {
  if (manualDisconnect) return;
  clearTimeout(reconnectTimer);
  setStatus(message, false);
  reconnectTimer = setTimeout(() => connect(roomCode), 3000);
}

async function requestWakeLock() {
  if (!keepAwakeRequested || !('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      wakeLock = null;
      if (keepAwakeRequested && document.visibilityState === 'visible') setTimeout(requestWakeLock, 250);
    });
  } catch (error) {
    console.error(error);
    wakeLock = null;
  }
}

async function toggleWakeLock() {
  const button = $('#wakeLock');
  if (!('wakeLock' in navigator)) {
    button.textContent = 'Wake Lock Unsupported';
    button.disabled = true;
    return;
  }
  keepAwakeRequested = !keepAwakeRequested;
  if (keepAwakeRequested) {
    await requestWakeLock();
    button.textContent = wakeLock ? 'Allow Screen Sleep' : 'Wake Lock Unavailable';
  } else {
    try { await wakeLock?.release(); } catch (error) { console.error(error); }
    wakeLock = null;
    button.textContent = 'Keep Screen Awake';
  }
}

function enterFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  else $('#fullscreen').textContent = 'Full Screen Unsupported';
}

$('#joinForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const code = normalizeCode($('#roomCode').value);
  const url = new URL(location.href);
  url.searchParams.set('join', code);
  history.replaceState({}, '', url);
  connect(code);
});
$('#roomCode').addEventListener('input', (event) => { event.target.value = normalizeCode(event.target.value); });
$('#changeRoom').onclick = () => {
  manualDisconnect = true;
  teardownConnection();
  roomCode = '';
  const url = new URL(location.href);
  url.searchParams.delete('join');
  history.replaceState({}, '', url);
  renderSetup();
  setStatus('Not connected');
};
$('#wakeLock').onclick = toggleWakeLock;
$('#fullscreen').onclick = enterFullscreen;
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && keepAwakeRequested && !wakeLock) requestWakeLock();
});
window.addEventListener('beforeunload', () => { manualDisconnect = true; teardownConnection(); });

const requested = new URLSearchParams(location.search).get('join');
if (requested) connect(requested);
else renderSetup();
