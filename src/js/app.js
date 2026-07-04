import { monsters, homebrewExample } from '../data/monsters.js';

const state = {
  tab: 'library',
  ruleset: '5e-2014',
  selectedId: 'goblin-2014',
  type: 'all',
  homebrew: structuredClone(homebrewExample),
};

const $ = (id) => document.getElementById(id);

function logError(context, error) {
  console.error(`[MonsterCardForge] ${context}`, error);
}

function abilityMod(score) {
  try {
    const mod = Math.floor((Number(score) - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  } catch (error) {
    logError('abilityMod failed', error);
    return '+0';
  }
}

function typeClass(type) {
  return String(type || '').toLowerCase().replace(/[^a-z]/g, '') || 'humanoid';
}

function getSelectedMonster() {
  try {
    return monsters.find((m) => m.id === state.selectedId) || monsters[0];
  } catch (error) {
    logError('getSelectedMonster failed', error);
    return monsters[0];
  }
}

function layoutFor(monster) {
  try {
    const score = [monster.traits, monster.actions, monster.legendaryActions, monster.lairActions].flat().length + (monster.spellcasting ? 8 : 0);
    if (monster.layoutHint === 'accordion' || score > 8) return 'accordion-3x2';
    return 'standard';
  } catch (error) {
    logError('layoutFor failed', error);
    return 'standard';
  }
}

function cardFront(monster) {
  return `<div class="card ${typeClass(monster.type)}">
    <div class="art"><span>${monster.type.toUpperCase()} ART SLOT</span></div>
    <div class="badge">CR ${monster.cr}</div>
    <div class="card-title"><strong>${monster.name}</strong><span>${monster.size} ${monster.type}</span></div>
  </div>`;
}

function list(items) {
  if (!items || !items.length) return '—';
  return items.join(', ');
}

function renderItems(items) {
  if (!items || !items.length) return '<div class="item">—</div>';
  return items.map((x) => `<div class="item"><b>${x.name || ''}</b>${x.hit ? ` ${x.hit} | ${x.reach || ''} | ${x.damage || ''}` : ''}${x.text ? ` — ${x.text}` : ''}</div>`).join('');
}

function combatBack(monster) {
  const a = monster.abilities || {};
  return `<div class="card back-card ${typeClass(monster.type)}">
    <div class="stat-row"><span>🛡 ${monster.ac}</span><span>❤️ ${monster.hp}</span><span>👣 ${monster.speed}</span></div>
    <div class="ability-grid">
      ${['str','dex','con','int','wis','cha'].map((k)=>`<div class="ability"><b>${k.toUpperCase()}</b>${a[k] ?? 10}<br>${abilityMod(a[k] ?? 10)}</div>`).join('')}
    </div>
    <div class="section"><h4>Combat</h4><div><b>Saves:</b> ${list(monster.saves)}</div><div><b>Skills:</b> ${list(monster.skills)}</div><div><b>Senses:</b> ${monster.senses}</div><div><b>Res:</b> ${list(monster.resistances)} | <b>Imm:</b> ${list(monster.immunities)}</div></div>
    <div class="section actions"><h4>Actions</h4>${renderItems(monster.actions)}</div>
    <div class="section"><h4>Bonus / Reaction</h4><b>BA:</b> ${renderItems(monster.bonusActions)} <b>RX:</b> ${renderItems(monster.reactions)}</div>
    <div class="section traits"><h4>Traits</h4>${renderItems(monster.traits).slice(0, 520)}</div>
    <div class="section legend"><h4>Legendary</h4>${renderItems(monster.legendaryActions).slice(0, 520)}</div>
  </div>`;
}

function spellPanel(monster) {
  if (!monster.spellcasting) return '<p class="tiny">No spellcasting.</p>';
  const rows = Object.entries(monster.spellcasting.levels || {}).map(([level, spells]) => `<div><b>${level}:</b> ${spells.join(', ')}</div>`).join('');
  return `<p class="tiny"><b>${monster.spellcasting.header}</b></p><div class="tiny">${rows}</div>`;
}

function accordionPreview(monster) {
  return `<div class="accordion-sheet">
    <div class="face">${cardFront(monster)}</div>
    <div class="face">${combatBack(monster)}</div>
    <div class="face"><h3>Actions</h3><div class="tiny">${renderItems(monster.actions)}</div></div>
    <div class="face"><h3>Traits & Reactions</h3><div class="tiny">${renderItems(monster.traits)}${renderItems(monster.reactions)}</div></div>
    <div class="face"><h3>Legendary / Lair</h3><div class="tiny">${renderItems(monster.legendaryActions)}${renderItems(monster.lairActions)}</div></div>
    <div class="face"><h3>Spellcasting / Notes</h3>${spellPanel(monster)}<p class="tiny"><b>Source:</b> ${monster.source} · ${monster.ruleset}</p></div>
  </div><p class="fold-note">Accordion mode: three connected cards, six faces total. Print at 100%, cut outer edge, fold on spines, laminate.</p>`;
}

function monsterDetails(monster) {
  return `<div class="details-panel">
    <h3>${monster.name}</h3>
    <span class="pill">${monster.ruleset}</span><span class="pill">${monster.type}</span><span class="pill">Layout: ${layoutFor(monster)}</span>
    <p><b>Source:</b> ${monster.source}</p>
    <p><b>Completeness:</b> combat summary, actions, traits, legendary/lair/spells when present.</p>
    <button class="tab print-hide" onclick="window.print()">Print Preview</button>
  </div>`;
}

function renderLibrary() {
  try {
    const filtered = monsters.filter((m) => (state.ruleset === 'all' || m.ruleset === state.ruleset) && (state.type === 'all' || m.type === state.type));
    $('monsterList').innerHTML = filtered.map((m)=>`<button class="monster-button ${m.id===state.selectedId?'active':''}" data-id="${m.id}"><b>${m.name}</b><span class="monster-meta">CR ${m.cr} · ${m.type} · ${m.ruleset}</span></button>`).join('');
    document.querySelectorAll('.monster-button').forEach(btn => btn.addEventListener('click', () => { state.selectedId = btn.dataset.id; render(); }));
    const monster = getSelectedMonster();
    $('stage').innerHTML = `<h2>Monster Card Preview</h2><div class="card-workbench"><div>${cardFront(monster)}<br>${combatBack(monster)}</div>${monsterDetails(monster)}</div><h2>Print Layout</h2>${layoutFor(monster)==='accordion-3x2'?accordionPreview(monster):'<div class="card-workbench">'+cardFront(monster)+combatBack(monster)+'</div>'}`;
  } catch (error) { logError('renderLibrary failed', error); }
}

function renderHomebrew() {
  try {
    const m = state.homebrew;
    $('stage').innerHTML = `<h2>Homebrew Forge</h2><div class="homebrew-grid">
      <form id="homebrewForm" class="details-panel">
        <h3>Build Your Monster</h3>
        <p class="help">Use the example as a guide. Each field updates the printable card preview.</p>
        <div class="filter"><label>Monster Name</label><input name="name" value="${m.name}"><p class="help">Example: Frost Troll, Grave Knight, Ember Hag.</p></div>
        <div class="filter"><label>Challenge Rating</label><input name="cr" value="${m.cr}"><p class="help">Example: 8. This appears on the front cover badge.</p></div>
        <div class="filter"><label>Creature Type</label><select name="type"><option>giant</option><option>undead</option><option>dragon</option><option>humanoid</option><option>beast</option></select><p class="help">This controls the border color and filters.</p></div>
        <div class="filter"><label>AC</label><input name="ac" value="${m.ac}"><p class="help">Example: 15 or 18 (natural armor).</p></div>
        <div class="filter"><label>HP</label><input name="hp" value="${m.hp}"><p class="help">Example: 136 (16d10+48). Include dice formula if known.</p></div>
        <div class="filter"><label>Speed</label><input name="speed" value="${m.speed}"><p class="help">Example: 30 ft., fly 60 ft.</p></div>
        <div class="form-section"><button class="tab" type="button" id="loadExample">Reload Example Monster</button></div>
      </form>
      <div><h3>Live Printable Preview</h3><div class="card-workbench">${cardFront(m)}${combatBack(m)}</div>${accordionPreview(m)}</div>
    </div>`;
    $('homebrewForm').addEventListener('input', (event) => { const fd = new FormData(event.currentTarget); Object.assign(state.homebrew, Object.fromEntries(fd.entries())); renderHomebrew(); });
    $('loadExample').addEventListener('click', () => { state.homebrew = structuredClone(homebrewExample); renderHomebrew(); });
  } catch(error) { logError('renderHomebrew failed', error); }
}

function renderFreeSample() {
  try {
    const monster = monsters.find((m) => m.id === 'goblin-2014') || monsters[0];
    $('stage').innerHTML = `<section class="hero-sample">
      <div>
        <p class="eyebrow">Free printable sample</p>
        <h2>Print the Goblin card in under 30 seconds.</h2>
        <p class="hero-copy">This sample proves the core Monster Card Forge promise: beautiful front art, fast combat stats, clear print instructions, and licensing attribution included.</p>
        <div class="cta-row"><button class="tab active" onclick="window.print()">Print / Save PDF</button><button class="tab" id="viewGoblin">View Interactive Goblin</button></div>
        <div class="details-panel sample-includes"><h3>Included in the free sample</h3><ul><li>Goblin front card</li><li>Goblin combat back</li><li>Legend card</li><li>Fold-over assembly guide</li><li>Legal attribution reminder</li></ul></div>
      </div>
      <div class="sample-stack">${cardFront(monster)}${combatBack(monster)}</div>
    </section>
    <h2>Free Goblin Starter Pack Print Sheet</h2>
    <div class="starter-print-sheet">
      <div class="fold-unit"><div class="fold-label">FRONT</div>${cardFront(monster)}<div class="spine-mark">FOLD SPINE</div>${combatBack(monster)}<div class="fold-label">BACK</div></div>
      <div class="legend-card"><h3>Legend</h3><p>🛡 AC · ❤️ HP · 👣 Speed · 👁 Senses · PP Passive Perception</p><p>⚔ Melee · 🏹 Ranged · BA Bonus Action · RX Reaction · TR Trait · LA Legendary Action</p><p>S Slashing · P Piercing · B Bludgeoning · A Acid · F Fire · C Cold · N Necrotic</p><p class="tiny"><b>Print:</b> 100% actual size. Cut outside edge. Fold on spine. Laminate if desired.</p></div>
    </div>
    <div class="details-panel attribution-box"><h3>Attribution Notice</h3><p>Monster Card Forge is independent and unaffiliated with Wizards of the Coast. SRD/open-license content must retain required attribution in exports and public pages.</p></div>`;
    const btn = document.getElementById('viewGoblin');
    if (btn) btn.addEventListener('click', () => { state.tab='library'; state.selectedId='goblin-2014'; render(); });
  } catch(error) { logError('renderFreeSample failed', error); }
}

function renderLegal() {
  $('stage').innerHTML = `<h2>Legal & Attribution</h2><div class="details-panel"><p>Monster Card Forge is an independent 5E-compatible tool. It is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC.</p><p>SRD rules content must be kept separated by ruleset and used only under the correct open-license terms. Exports should include ruleset, source, and attribution information.</p><p><b>Publishing rule:</b> only SRD/open content, original Monster Card Forge content, or user-created homebrew may be published or sold through this site.</p></div>`;
}

function renderSide() {
  $('side').innerHTML = `<h2>Filters</h2><div class="filter"><label>Ruleset</label><select id="ruleset"><option value="5e-2014">5E 2014</option><option value="5e-2024">5E 2024</option><option value="all">All / Explicit Mix</option></select></div><div class="filter"><label>Creature Type</label><select id="type"><option value="all">All Types</option><option value="humanoid">Humanoid</option><option value="dragon">Dragon</option><option value="undead">Undead</option><option value="giant">Giant</option></select></div><div id="monsterList" class="monster-list"></div>`;
  $('ruleset').value = state.ruleset; $('type').value = state.type;
  $('ruleset').addEventListener('change', (e)=>{state.ruleset=e.target.value; render();});
  $('type').addEventListener('change', (e)=>{state.type=e.target.value; render();});
}

function render() {
  try {
    document.querySelectorAll('.tab[data-tab]').forEach((tab)=>tab.classList.toggle('active', tab.dataset.tab===state.tab));
    renderSide();
    if (state.tab === 'homebrew') renderHomebrew();
    else if (state.tab === 'free') renderFreeSample();
    else if (state.tab === 'legal') renderLegal();
    else renderLibrary();
  } catch(error) { logError('render failed', error); }
}

document.querySelectorAll('.tab[data-tab]').forEach((tab)=>tab.addEventListener('click', ()=>{state.tab=tab.dataset.tab; render();}));
render();
