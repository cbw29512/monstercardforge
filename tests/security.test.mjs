import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, safeDomToken } from '../src/js/security.js';
import { renderCardFront, renderCombatBack, renderItems, renderSpellPanel } from '../src/js/cardEngine.js';

test('escapeHtml neutralizes markup and quotes', () => {
  assert.equal(
    escapeHtml('<img src=x onerror="alert(1)">\'&'),
    '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&#39;&amp;'
  );
});

test('safeDomToken strips unsafe identifier characters', () => {
  assert.equal(safeDomToken(' lich"><script> '), 'lich-script');
  assert.equal(safeDomToken('', 'monster'), 'monster');
});

test('monster renderers treat hostile homebrew text as text', () => {
  const hostile = '<img src=x onerror="globalThis.pwned=1">';
  const monster = {
    id: hostile,
    name: hostile,
    type: hostile,
    size: hostile,
    cr: hostile,
    ac: hostile,
    hp: hostile,
    speed: hostile,
    abilities: {},
    saves: [hostile],
    skills: [hostile],
    senses: hostile,
    resistances: [hostile],
    immunities: [hostile],
    actions: [{ name: hostile, hit: hostile, reach: hostile, damage: hostile, text: hostile }],
    bonusActions: [],
    reactions: [],
    traits: [],
    legendaryActions: [],
    spellcasting: { header: hostile, levels: { '1st': [hostile] } }
  };

  const output = [
    renderCardFront(monster),
    renderCombatBack(monster),
    renderItems(monster.actions),
    renderSpellPanel(monster)
  ].join('\n');

  assert.equal(output.includes('<img src=x'), false);
  assert.equal(output.includes('&lt;img src=x'), true);
});
