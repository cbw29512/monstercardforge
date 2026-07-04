import { state, resetHomebrew, setRuleset, setSelectedMonster, setTab, setType, updateHomebrew } from './appState.js';
import { renderFreeSampleView, renderHomebrewView, renderLegalView, renderLibraryView } from './views.js';
import { safeRender } from './logger.js';

const side = document.getElementById('side');
const stage = document.getElementById('stage');

function renderSideShell() {
  side.innerHTML = `<h2>Filters</h2>
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

function mountView(view) {
  stage.innerHTML = view.stage;
  if (typeof view.attach === 'function') view.attach();
}

function render() {
  safeRender('app render failed', null, () => {
    document.querySelectorAll('.tab[data-tab]').forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === state.tab));
    renderSideShell();

    if (state.tab === 'homebrew') {
      mountView(renderHomebrewView(state, (values) => { updateHomebrew(values); render(); }, () => { resetHomebrew(); render(); }));
      return;
    }

    if (state.tab === 'free') {
      mountView(renderFreeSampleView(() => { setTab('library'); setSelectedMonster('goblin-2014'); render(); }));
      return;
    }

    if (state.tab === 'legal') {
      mountView(renderLegalView());
      return;
    }

    const view = renderLibraryView(state, (id) => { setSelectedMonster(id); render(); });
    document.getElementById('monsterList').innerHTML = view.sideList;
    mountView(view);
  });
}

document.querySelectorAll('.tab[data-tab]').forEach((tab) => tab.addEventListener('click', () => {
  setTab(tab.dataset.tab);
  render();
}));

render();
