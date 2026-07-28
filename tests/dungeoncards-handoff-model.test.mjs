import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_HANDOFF_AGE_MS,
  MAX_HANDOFF_CLOCK_SKEW_MS,
  selectOrCreateEditionProfile,
  validateDungeonCardsHandoff
} from '../shared/dungeoncards-handoff-model.js';

const now = Date.parse('2026-07-28T20:00:00.000Z');
const payload = (overrides = {}) => ({
  version: 1,
  createdAt: new Date(now - 1000).toISOString(),
  campaign: 'Crooked Moon',
  ruleset: '2014',
  monsters: [{ sourceRecordId: 'srd51-goblin', name: 'Goblin', ruleset: '2014', quantity: 3 }],
  ...overrides
});

test('accepts a complete exact-edition handoff', () => {
  assert.deepEqual(validateDungeonCardsHandoff(payload(), now), { valid: true, issue: '' });
});

test('rejects crossed-edition monster records', () => {
  const result = validateDungeonCardsHandoff(payload({
    monsters: [{ sourceRecordId: 'srd521-goblin', name: 'Goblin', ruleset: '2024', quantity: 1 }]
  }), now);
  assert.equal(result.valid, false);
  assert.match(result.issue, /edition boundary/i);
});

test('rejects expired and implausibly future-dated handoffs', () => {
  assert.equal(validateDungeonCardsHandoff(payload({
    createdAt: new Date(now - MAX_HANDOFF_AGE_MS - 1).toISOString()
  }), now).valid, false);
  assert.equal(validateDungeonCardsHandoff(payload({
    createdAt: new Date(now + MAX_HANDOFF_CLOCK_SKEW_MS + 1).toISOString()
  }), now).valid, false);
});

test('rejects malformed quantities and more than 100 combatants', () => {
  assert.equal(validateDungeonCardsHandoff(payload({
    monsters: [{ sourceRecordId: 'srd51-goblin', name: 'Goblin', ruleset: '2014', quantity: 1.5 }]
  }), now).valid, false);
  assert.equal(validateDungeonCardsHandoff(payload({
    monsters: [
      { sourceRecordId: 'srd51-goblin', name: 'Goblin', ruleset: '2014', quantity: 99 },
      { sourceRecordId: 'srd51-ogre', name: 'Ogre', ruleset: '2014', quantity: 2 }
    ]
  }), now).valid, false);
});

test('reuses an exact campaign and edition profile without creating a duplicate', () => {
  const profile = {
    id: 'profile-2014', campaign: 'Crooked Moon', name: 'Core Party', ruleset: '2014',
    characters: [{ id: 'hero-1', name: 'Aria', level: 8 }], updatedAt: 'old'
  };
  const state = { profiles: [profile], activeProfileId: profile.id };
  const result = selectOrCreateEditionProfile(state, 'crooked moon', '2014', {
    createId: () => 'unused', createCharacterId: () => 'unused-character', updatedAt: 'new'
  });
  assert.equal(result.created, false);
  assert.equal(result.profile, profile);
  assert.equal(state.profiles.length, 1);
  assert.equal(profile.updatedAt, 'new');
});

test('creates an edition-specific copy instead of rewriting an existing campaign profile', () => {
  const original = {
    id: 'profile-2014', campaign: 'Crooked Moon', name: 'Core Party', ruleset: '2014',
    characters: [{ id: 'hero-1', name: 'Aria', level: 8 }], updatedAt: 'old'
  };
  const state = { profiles: [original], activeProfileId: original.id };
  const result = selectOrCreateEditionProfile(state, 'Crooked Moon', '2024', {
    createId: () => 'profile-2024', createCharacterId: () => 'new-character', updatedAt: 'new'
  });

  assert.equal(result.created, true);
  assert.equal(state.profiles.length, 2);
  assert.equal(state.activeProfileId, 'profile-2024');
  assert.equal(result.profile.ruleset, '2024');
  assert.equal(result.profile.campaign, 'Crooked Moon');
  assert.deepEqual(result.profile.characters, original.characters);
  assert.notEqual(result.profile.characters, original.characters);
  assert.equal(original.ruleset, '2014');
  assert.equal(original.updatedAt, 'old');
});
