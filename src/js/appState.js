import { homebrewExample } from '../data/monsters.js';

export const state = {
  tab: 'library',
  ruleset: '5e-2014',
  selectedId: 'goblin-2014',
  type: 'all',
  homebrew: JSON.parse(JSON.stringify(homebrewExample)),
};

export function setTab(tab) {
  state.tab = tab;
}

export function setRuleset(ruleset) {
  state.ruleset = ruleset;
}

export function setType(type) {
  state.type = type;
}

export function setSelectedMonster(id) {
  state.selectedId = id;
}

export function updateHomebrew(values) {
  state.homebrew = { ...state.homebrew, ...values };
}

export function resetHomebrew() {
  state.homebrew = JSON.parse(JSON.stringify(homebrewExample));
}
