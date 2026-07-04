import { state, resetHomebrew, setRuleset, setSelectedMonster, setTab, setType, updateHomebrew } from './appState.js';
import { renderFreeSampleView, renderHomebrewView, renderLegalView, renderLibraryView } from './views.js';
import { safeRender } from './logger.js';

const side = document.getElementById('side');
const stage = document.getElementById('stage');

function renderCustomerGuide() {
  side.innerHTML = `<h2>Start Here</h2>
    <div class="details-panel"><h3>1. Print the sample</h3><p>Try the Goblin card first. No account. No setup.</p></div>
    <div class="details-panel"><h3>2. Browse cards</h3><p>Compare simple, boss, and accordion layouts.</p></div>
    <div class="details-panel"><h3>3. Create homebrew</h3><p>Use guided fields and live preview to make your own card.</p></div>`;
}

function renderFilterShell() {
  side.innerHTML = `<h2>Find Cards</h2>
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

    if (state.tab === 'free') {
      renderCustomerGuide();
      mountView(renderFreeSampleView(() => { setTab('library'); setSelectedMonster('goblin-2014'); render(); }));
      return;
    }

    renderFilterShell();

    if (state.tab === 'homebrew') {
      mountView(renderHomebrewView(state, (values) => { updateHomebrew(values); render(); }, () => { resetHomebrew(); render(); }));
      return;
    }

    if (state.tab === 'legal') {
      mountView(renderLegalView());
      return;
    }

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
