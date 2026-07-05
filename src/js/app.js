import { state, resetHomebrew, setRuleset, setSelectedMonster, setTab, setType, updateHomebrew } from './appState.js';
import { renderFreeSampleView, renderHomebrewView, renderLegalView, renderLibraryView } from './views.js';
import { safeRender } from './logger.js';

const side = document.getElementById('side');
const stage = document.getElementById('stage');

function renderCustomerGuide() {
  side.innerHTML = `<h2>Quick Path</h2>
    <button class="side-action primary" data-jump="free">Print free sample</button>
    <button class="side-action" data-jump="library">Browse card examples</button>
    <button class="side-action" data-jump="homebrew">Create homebrew</button>
    <div class="details-panel"><h3>What this fixes</h3><p>No more flipping through books during combat. Print one reference and keep the encounter moving.</p></div>
    <div class="details-panel"><h3>Best first step</h3><p>Print the Goblin sample. If the size and fold feel right, test the Lich Boss Folio next.</p></div>`;
  attachSideActions();
}

function renderFilterShell() {
  side.innerHTML = `<h2>Find Cards</h2>
    <div class="details-panel"><h3>What do you need tonight?</h3><p>Pick a ruleset and type, then choose a monster. The site recommends the print format.</p></div>
    <div class="filter"><label>Ruleset</label><select id="ruleset"><option value="5e-2014">5E 2014</option><option value="5e-2024">5E 2024</option><option value="all">All / Explicit Mix</option></select></div>
    <div class="filter"><label>Creature Type</label><select id="type"><option value="all">All Types</option><option value="humanoid">Humanoid</option><option value="dragon">Dragon</option><option value="undead">Undead</option><option value="giant">Giant</option></select></div>
    <div id="monsterList" class="monster-list"></div>`;

  document.getElementById('ruleset').value = state.ruleset;
  document.getElementById('type').value = state.type;

  document.getElementById('ruleset').addEventListener('change', (event) => {
    setRuleset(event.target.value);
    render();
  });

  document.getElementById('type').addEventListener('change', (event) => {
    setType(event.target.value);
    render();
  });
}

function renderHomebrewGuide() {
  side.innerHTML = `<h2>Create a Card</h2>
    <button class="side-action" data-jump="free">See sample first</button>
    <button class="side-action primary" data-jump="homebrew">Edit example monster</button>
    <button class="side-action" data-jump="library">Compare to official examples</button>
    <div class="details-panel"><h3>How it works</h3><p>Use the example monster, replace fields, then print the live preview.</p></div>
    <div class="details-panel"><h3>Rule</h3><p>If the monster gets complex, the engine expands the layout instead of shrinking text.</p></div>`;
  attachSideActions();
}

function renderLegalGuide() {
  side.innerHTML = `<h2>Trust & Licensing</h2>
    <button class="side-action" data-jump="free">Back to sample</button>
    <div class="details-panel"><h3>Customer promise</h3><p>Rulesets, sources, and attribution must stay clear before anything is sold.</p></div>
    <div class="details-panel"><h3>Product rule</h3><p>Only open-license, original, or user-created homebrew content can be published.</p></div>`;
  attachSideActions();
}

function attachSideActions() {
  document.querySelectorAll('[data-jump]').forEach((button) => button.addEventListener('click', () => {
    setTab(button.dataset.jump);
    render();
  }));
}

function mountView(view) {
  stage.innerHTML = view.stage;
  if (typeof view.attach === 'function') view.attach();
}

function render() {
  safeRender('app render failed', null, () => {
    document.querySelectorAll('.tab[data-tab]').forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === state.tab));

    if (state.tab === 'free') {
      renderCustomerGuide();
      mountView(renderFreeSampleView(() => { setTab('library'); setSelectedMonster('goblin-2014'); render(); }));
      return;
    }

    if (state.tab === 'homebrew') {
      renderHomebrewGuide();
      mountView(renderHomebrewView(state, (values) => { updateHomebrew(values); render(); }, () => { resetHomebrew(); render(); }));
      return;
    }

    if (state.tab === 'legal') {
      renderLegalGuide();
      mountView(renderLegalView());
      return;
    }

    renderFilterShell();
    const view = renderLibraryView(state, (id) => { setSelectedMonster(id); render(); });
    const monsterList = document.getElementById('monsterList');
    if (monsterList) monsterList.innerHTML = view.sideList;
    mountView(view);
  });
}

document.querySelectorAll('.tab[data-tab]').forEach((tab) => tab.addEventListener('click', () => {
  setTab(tab.dataset.tab);
  render();
}));

render();
