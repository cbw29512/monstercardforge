import test from 'node:test';
import assert from 'node:assert/strict';
import { monsters, homebrewExample } from '../src/data/monsters.js';
import { panelPlan, renderCombatBack, renderItems, renderPanel, renderSpellPanel, rulesLabel, sourceLine } from '../src/js/cardEngine.js';

const byId = (id) => monsters.find((monster) => monster.id === id);

function action(monster, name) {
  return monster.actions.find((entry) => entry.name === name);
}

function legendary(monster, name) {
  return monster.legendaryActions.find((entry) => entry.name === name);
}

test('every published monster sample has traceable source, license, XP, and verification metadata', () => {
  for (const monster of monsters) {
    assert.equal(monster.source, 'SRD 5.1');
    assert.equal(monster.sourceId, 'srd-5-1');
    assert.equal(monster.license, 'CC-BY-4.0');
    assert.equal(monster.sourceUrl, 'https://www.dndbeyond.com/srd');
    assert.equal(monster.verifiedAt, '2026-07-21');
    assert.equal(Number.isFinite(monster.xp), true);
    assert.ok(monster.xp > 0);
  }
});

test('Goblin sample retains complete displayed combat fields', () => {
  const goblin = byId('goblin-2014');
  assert.equal(goblin.xp, 50);
  assert.equal(goblin.ac, '15 (leather armor, shield)');
  assert.equal(action(goblin, 'Scimitar').hit, '+4');
  assert.equal(action(goblin, 'Scimitar').damage, '5 (1d6 + 2) slashing');
  assert.equal(action(goblin, 'Shortbow').reach, '80/320 ft.');
  assert.match(goblin.bonusActions[0].text, /Disengage or Hide/);
});

test('Adult Black Dragon base stat block preserves encounter-critical DCs and damage', () => {
  const dragon = byId('adult-black-dragon-2014');
  assert.equal(dragon.xp, 11500);
  assert.match(action(dragon, 'Frightful Presence').text, /DC 16 Wisdom/);
  assert.match(action(dragon, 'Acid Breath (Recharge 5–6)').text, /DC 18 Dexterity/);
  assert.match(action(dragon, 'Acid Breath (Recharge 5–6)').text, /54 \(12d8\) acid/);
  assert.equal(legendary(dragon, 'Wing Attack').cost, 2);
  assert.match(legendary(dragon, 'Wing Attack').text, /DC 19 Dexterity/);
  assert.match(legendary(dragon, 'Wing Attack').text, /13 \(2d6 \+ 6\)/);
  assert.deepEqual(dragon.lairActions, []);
  assert.match(dragon.scopeNote, /Optional lair actions and regional effects are intentionally excluded/);
});

test('Lich base stat block preserves corrected skills, spell slots, DCs, and legendary damage', () => {
  const lich = byId('lich-2014');
  assert.equal(lich.xp, 33000);
  assert.equal(lich.skills.includes('Arcana +19'), true);
  assert.match(action(lich, 'Paralyzing Touch').text, /DC 18 Constitution/);
  assert.match(legendary(lich, 'Frightening Gaze').text, /DC 18 Wisdom/);
  assert.match(legendary(lich, 'Disrupt Life').text, /21 \(6d6\) necrotic/);
  assert.ok(lich.spellcasting.levels['1st level (4 slots)']);
  assert.ok(lich.spellcasting.levels['5th level (3 slots)']);
  assert.ok(lich.spellcasting.levels['9th level (1 slot)']);
  assert.deepEqual(lich.lairActions, []);
  assert.match(lich.scopeNote, /Optional lair actions and regional effects are intentionally excluded/);
});

test('published boss records contain no vague action placeholders', () => {
  const vaguePatterns = [
    /save or take damage/i,
    /creatures nearby save/i,
    /spirit effect drains life/i,
    /magical energy disrupts intruders/i,
    /acid damage\.$/i
  ];
  for (const monster of monsters) {
    const text = JSON.stringify({ actions: monster.actions, legendaryActions: monster.legendaryActions, lairActions: monster.lairActions });
    for (const pattern of vaguePatterns) assert.doesNotMatch(text, pattern, `${monster.name} contains vague text: ${pattern}`);
  }
});

test('renderer preserves targets, legendary costs, source metadata, and spell slot labels', () => {
  const dragon = byId('adult-black-dragon-2014');
  const lich = byId('lich-2014');
  const bite = renderItems([action(dragon, 'Bite')]);
  assert.match(bite, /one target/);
  const wing = renderItems([legendary(dragon, 'Wing Attack')]);
  assert.match(wing, /2 actions/);
  assert.match(renderCombatBack(dragon), /SRD 5\.1/);
  assert.match(renderCombatBack(dragon), /CC-BY-4\.0/);
  assert.match(renderSpellPanel(lich), /1st level \(4 slots\)/);
  assert.match(renderSpellPanel(lich), /9th level \(1 slot\)/);
  assert.match(sourceLine(lich), /verified 2026-07-21/);
  assert.equal(rulesLabel('5e-2014'), '5e (2014)');
  assert.equal(rulesLabel('5e-2024'), '5.5e (2024)');
  assert.equal(panelPlan(lich).includes('spellcasting'), true);
  assert.match(renderPanel('spellcasting', lich), /Spellcasting/);
});

test('homebrew sample is explicitly original and not represented as licensed D&D rules', () => {
  assert.equal(homebrewExample.ruleset, 'homebrew');
  assert.equal(homebrewExample.source, 'DM Forge Original Homebrew');
  assert.equal(homebrewExample.license, 'Project original');
  assert.match(homebrewExample.scopeNote, /not an official D&D monster/i);
});
