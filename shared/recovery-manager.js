(function initializeDMForgeRecovery(root) {
  'use strict';

  if (root.DMForgeRecovery) return;

  const DATABASE_NAME = 'dmforge-recovery-v1';
  const DATABASE_VERSION = 1;
  const STORE_NAME = 'snapshots';
  const MAX_SNAPSHOTS = 8;
  const MAX_SNAPSHOT_BYTES = 25 * 1024 * 1024;
  const AUTO_INTERVAL_MS = 15 * 60 * 1000;
  const AUTO_MIN_AGE_MS = 5 * 60 * 1000;
  const EXCLUDED_KEYS = new Set(['dmforge-backup-meta-v1', 'dmforge-pending-encounter-v1']);
  let creating = null;

  function acceptedKey(key) {
    return !EXCLUDED_KEYS.has(key) && (/^dmforge-[a-z0-9-]+$/i.test(key) || /^cleric-box-[a-z0-9]+$/i.test(key));
  }

  function bytesOf(value) {
    return new TextEncoder().encode(String(value ?? '')).byteLength;
  }

  function uid() {
    return root.crypto?.randomUUID?.() || `recovery-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      if (!root.indexedDB) return reject(new Error('This browser does not support automatic recovery history.'));
      const request = root.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt');
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Could not open campaign recovery history.'));
    });
  }

  async function withStore(mode, callback) {
    const database = await openDatabase();
    try {
      return await new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        let result;
        try { result = callback(store, transaction); }
        catch (error) { reject(error); return; }
        transaction.oncomplete = () => resolve(result);
        transaction.onerror = () => reject(transaction.error || new Error('Campaign recovery operation failed.'));
        transaction.onabort = () => reject(transaction.error || new Error('Campaign recovery operation was cancelled.'));
      });
    } finally {
      database.close();
    }
  }

  function collectEntries() {
    const entries = {};
    let bytes = 0;
    for (let index = 0; index < root.localStorage.length; index += 1) {
      const key = root.localStorage.key(index);
      if (!key || !acceptedKey(key)) continue;
      const value = root.localStorage.getItem(key);
      if (typeof value !== 'string') continue;
      entries[key] = value;
      bytes += bytesOf(value);
    }
    return { entries, bytes };
  }

  async function sha256(text) {
    if (!root.crypto?.subtle) return `${text.length}:${text.slice(0, 64)}:${text.slice(-64)}`;
    const digest = await root.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Campaign recovery request failed.'));
    });
  }

  async function list() {
    const records = await withStore('readonly', (store) => requestResult(store.getAll()));
    return (records || []).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  async function latest() {
    return (await list())[0] || null;
  }

  async function cleanup() {
    const records = await list();
    const remove = records.slice(MAX_SNAPSHOTS);
    if (!remove.length) return;
    await withStore('readwrite', (store) => {
      for (const record of remove) store.delete(record.id);
    });
  }

  async function create(reason = 'Automatic recovery point', options = {}) {
    if (creating) return creating;
    creating = (async () => {
      const collected = collectEntries();
      const entryCount = Object.keys(collected.entries).length;
      if (!entryCount) return null;
      if (collected.bytes > MAX_SNAPSHOT_BYTES) throw new Error('This campaign is too large for automatic browser recovery. Download a Safety Copy instead.');

      const canonical = JSON.stringify(Object.fromEntries(Object.entries(collected.entries).sort(([a], [b]) => a.localeCompare(b))));
      const hash = await sha256(canonical);
      const previous = await latest();
      const age = previous ? Date.now() - Date.parse(previous.createdAt) : Infinity;
      if (!options.force && previous?.hash === hash) return previous;
      if (!options.force && options.automatic && age < AUTO_MIN_AGE_MS) return previous;

      const record = {
        id: uid(),
        createdAt: new Date().toISOString(),
        reason: String(reason || 'Recovery point').slice(0, 120),
        entryCount,
        bytes: collected.bytes,
        hash,
        entries: collected.entries
      };
      await withStore('readwrite', (store) => { store.put(record); });
      await cleanup();
      root.dispatchEvent?.(new CustomEvent('dmforge:recovery-changed', { detail: { id: record.id, action: 'created' } }));
      return record;
    })();

    try { return await creating; }
    finally { creating = null; }
  }

  async function get(id) {
    return withStore('readonly', (store) => requestResult(store.get(String(id))));
  }

  async function restore(id) {
    const record = await get(id);
    if (!record?.entries) throw new Error('That recovery point is no longer available.');
    await create('Before restoring an earlier version', { force: true });

    const currentKeys = [];
    for (let index = 0; index < root.localStorage.length; index += 1) {
      const key = root.localStorage.key(index);
      if (key && acceptedKey(key)) currentKeys.push(key);
    }
    for (const key of currentKeys) root.localStorage.removeItem(key);
    for (const [key, value] of Object.entries(record.entries)) {
      if (acceptedKey(key) && typeof value === 'string') root.localStorage.setItem(key, value);
    }
    root.dispatchEvent?.(new CustomEvent('dmforge:recovery-changed', { detail: { id: record.id, action: 'restored' } }));
    return record;
  }

  async function remove(id) {
    await withStore('readwrite', (store) => { store.delete(String(id)); });
    root.dispatchEvent?.(new CustomEvent('dmforge:recovery-changed', { detail: { id: String(id), action: 'removed' } }));
  }

  async function clear() {
    await withStore('readwrite', (store) => { store.clear(); });
    root.dispatchEvent?.(new CustomEvent('dmforge:recovery-changed', { detail: { action: 'cleared' } }));
  }

  function schedule() {
    const automatic = () => create('Automatic recovery point', { automatic: true }).catch((error) => console.warn('[DMForgeRecovery]', error.message));
    root.setTimeout(automatic, 2500);
    root.setInterval(automatic, AUTO_INTERVAL_MS);
    root.document?.addEventListener('visibilitychange', () => {
      if (root.document.visibilityState === 'hidden') automatic();
    });
  }

  root.DMForgeRecovery = Object.freeze({
    DATABASE_NAME,
    MAX_SNAPSHOTS,
    MAX_SNAPSHOT_BYTES,
    create,
    list,
    latest,
    get,
    restore,
    remove,
    clear
  });

  schedule();
})(globalThis);
