import test from 'node:test';
import assert from 'node:assert/strict';

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
  clear() { this.values.clear(); }
}

globalThis.localStorage = new MemoryStorage();
globalThis.CustomEvent = class CustomEvent {
  constructor(type, init = {}) { this.type = type; this.detail = init.detail; }
};
globalThis.dispatchEvent = () => true;

await import('../shared/dmforge-store.js');
const store = globalThis.DMForgeStore;

test('shared store starts with a versioned empty schema', () => {
  const snapshot = store.snapshot();
  assert.equal(snapshot.schemaVersion, 1);
  assert.deepEqual(snapshot.campaigns, []);
  assert.deepEqual(snapshot.magicItems, []);
  assert.deepEqual(snapshot.sessions, []);
});

test('campaign names deduplicate across tools', () => {
  localStorage.clear();
  store.ensureCampaign('Curse of the Crooked Moon', { source: 'session-console' });
  store.ensureCampaign('  curse   of the crooked moon  ', { source: 'magic-items' });
  const campaigns = store.listCampaigns();
  assert.equal(campaigns.length, 1);
  assert.deepEqual(campaigns[0].sources.sort(), ['magic-items', 'session-console']);
});

test('magic item sync keeps only safe summary fields', () => {
  localStorage.clear();
  store.syncMagicItems([{ id: 'item-1', name: 'Moon Blade', campaign: 'Night Watch', rarity: 'Rare', category: 'Weapon', secret: 'Hidden curse', artData: 'very-large-image' }]);
  const item = store.snapshot().magicItems[0];
  assert.equal(item.name, 'Moon Blade');
  assert.equal('secret' in item, false);
  assert.equal('artData' in item, false);
  assert.equal('properties' in item, false);
});

test('session sync stores counts rather than private prep text', () => {
  localStorage.clear();
  store.syncSessionConsole({
    campaigns: [{
      name: 'Night Watch',
      session: {
        id: 'session-1', title: 'The Broken Bell', date: '2026-07-22',
        prep: { secrets: 'Private revelation' },
        log: [{ text: 'Private log' }],
        initiative: { combatants: [{ name: 'Goblin' }] }
      },
      archives: []
    }]
  });
  const session = store.snapshot().sessions[0];
  assert.equal(session.logCount, 1);
  assert.equal(session.combatantCount, 1);
  assert.equal('prep' in session, false);
  assert.equal('log' in session, false);
});
