import { homebrewExample } from '../data/monsters.js';

const copy = (value) => JSON.parse(JSON.stringify(value));

export const state = {
  tab: 'free',
  ruleset: '5e-2014',
  selectedId: 'goblin-2014',
  type: 'all',
  homebrew: copy(homebrewExample)
};

export function setTab(value) { state.tab = value; }
export function setRuleset(value) { state.ruleset = value; }
export function setType(value) { state.type = value; }
export function setSelectedMonster(value) { state.selectedId = value; }
export function updateHomebrew(values) { state.homebrew = { ...state.homebrew, ...values }; }
export function resetHomebrew() { state.homebrew = copy(homebrewExample); }
