import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateEncounter, multiplier2014, partyBudgets2024, partyThresholds2014, xpForCr } from '../encounter-rules.js';

const party = (count, level) => Array.from({ length: count }, (_, index) => ({ name: `P${index + 1}`, level }));
const monster = (name, cr, quantity = 1, sourceId = name) => ({ name, cr, xp: xpForCr(cr), quantity, sourceId });

test('official per-character budgets aggregate correctly', () => {
  assert.deepEqual(partyThresholds2014(party(4, 1)), [100, 200, 300, 400]);
  assert.deepEqual(partyBudgets2024(party(4, 1)), [200, 300, 400]);
});

test('2014 applies monster-count and party-size multipliers', () => {
  assert.equal(multiplier2014(2, 4), 1.5);
  assert.equal(multiplier2014(1, 2), 1.5);
  assert.equal(multiplier2014(1, 6), 0.5);
  const result = evaluateEncounter({ ruleset: '2014', characters: party(4, 1), monsters: [monster('Goblin Boss', '1', 2)] });
  assert.equal(result.rawXp, 400);
  assert.equal(result.adjustedXp, 600);
  assert.equal(result.difficulty, 'Deadly');
});

test('2024 spends raw XP without a multiple-monster multiplier', () => {
  const result = evaluateEncounter({ ruleset: '2024', characters: party(4, 1), monsters: [monster('Goblin Boss', '1', 2)] });
  assert.equal(result.rawXp, 400);
  assert.equal(result.adjustedXp, 400);
  assert.equal(result.multiplier, 1);
  assert.equal(result.difficulty, 'High');
});

test('2024 emits official operational cautions', () => {
  const result = evaluateEncounter({ ruleset: '2024', characters: party(2, 3), monsters: [
    monster('A', '1', 2, 'a'), monster('B', '1', 2, 'b'), monster('C', '1', 1, 'c'), monster('D', '4', 1, 'd')
  ] });
  assert.equal(result.warnings.some((warning) => warning.includes('more than two creatures per character')), true);
  assert.equal(result.warnings.some((warning) => warning.includes('different stat blocks')), true);
  assert.equal(result.warnings.some((warning) => warning.includes('CR above')), true);
});

test('CR-to-XP values match the official table', () => {
  assert.equal(xpForCr('1/4'), 50);
  assert.equal(xpForCr('5'), 1800);
  assert.equal(xpForCr('14'), 11500);
  assert.equal(xpForCr('30'), 155000);
});
