import { safeRender } from './logger.js';
import { artThemeFor } from './artThemes.js';

export const DAMAGE_TYPES = {
  S: 'Slashing',
  P: 'Piercing',
  B: 'Bludgeoning',
  A: 'Acid',
  C: 'Cold',
  F: 'Fire',
  L: 'Lightning',
  N: 'Necrotic',
  R: 'Radiant',
  PO: 'Poison',
  PS: 'Psychic',
  TH: 'Thunder',
  FO: 'Force',
};

export const PANEL_TYPES = {
  FRONT: 'front',
  COMBAT: 'combat-summary',
  ACTIONS: 'actions',
  TRAITS: 'traits',
  LEGENDARY: 'legendary',
  SPELLS: 'spellcasting',
  LAIR: 'lair-regional',
  NOTES: 'notes',
};

export function abilityMod(score) {
  return safeRender('abilityMod failed', '+0', () => {
    const mod = Math.floor((Number(score) - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  });
}

export function typeClass(type) {
  return safeRender('typeClass failed', 'humanoid', () => String(type || '').toLowerCase().replace(/[^a-z]/g, '') || 'humanoid');
}

export function listText(items) {
  return safeRender('listText failed', '—', () => {
    if (!items || !items.length) return '—';
    return items.join(', ');
  });
}

export function estimateComplexity(monster) {
  return safeRender('estimateComplexity failed', { score: 1, stars: '⭐', layout: 'standard' }, () => {
    const counts = [monster.traits, monster.actions, monster.bonusActions, monster.reactions, monster.legendaryActions, monster.lairActions, monster.regionalEffects]
      .map((section) => Array.isArray(section) ? section.length : 0)
      .reduce((total, count) => total + count, 0);

    const spellWeight = monster.spellcasting ? 8 + Object.values(monster.spellcasting.levels || {}).flat().length / 3 : 0;
    const score = Math.ceil(counts + spellWeight);

    if (monster.layoutHint === 'accordion') return { score, stars: '⭐⭐⭐⭐', layout: 'accordion-3x2' };
    if (score <= 5) return { score, stars: '⭐', layout: 'standard' };
    if (score <= 10) return { score, stars: '⭐⭐', layout: 'fold-over' };
    if (score <= 18) return { score, stars: '⭐⭐⭐', layout: 'accordion-3x2' };
    return { score, stars: '⭐⭐⭐⭐', layout: 'accordion-3x2' };
  });
}

export function renderItems(items, options = {}) {
  return safeRender('renderItems failed', '<div class="item">—</div>', () => {
    if (!items || !items.length) return '<div class="item">—</div>';
    const limit = options.limit ?? items.length;
    return items.slice(0, limit).map((item) => {
      const attackLine = item.hit ? ` <span class="attack-line">${item.hit} | ${item.reach || ''} | ${item.damage || ''}</span>` : '';
      const body = item.text ? ` <span class="item-text">— ${item.text}</span>` : '';
      return `<div class="item"><b>${item.name || 'Unnamed'}</b>${attackLine}${body}</div>`;
    }).join('');
  });
}

function renderArt(monster) {
  return safeRender('renderArt failed', '<div class="art"><span>ART</span></div>', () => {
    const theme = artThemeFor(monster.type);
    const monsterClass = typeClass(monster.type);
    return `<div class="art art-${monsterClass}">
      <div class="art-glow"></div>
      <div class="art-moon"></div>
      <div class="art-sigil">${theme.icon}</div>
      <div class="art-ground"></div>
      <div class="art-label">${theme.title}</div>
    </div>`;
  });
}

export function renderCardFront(monster) {
  return safeRender('renderCardFront failed', '<div class="card">Card failed</div>', () => `<div class="card ${typeClass(monster.type)}" data-card-face="front">
    ${renderArt(monster)}
    <div class="badge">CR ${monster.cr}</div>
    <div class="type-chip">${monster.type}</div>
    <div class="card-title"><strong>${monster.name}</strong><span>${monster.size} ${monster.type}</span></div>
  </div>`);
}

export function renderCombatBack(monster) {
  return safeRender('renderCombatBack failed', '<div class="card back-card">Combat failed</div>', () => {
    const a = monster.abilities || {};
    return `<div class="card back-card ${typeClass(monster.type)}" data-card-face="combat">
      <div class="stat-row"><span>🛡 ${monster.ac}</span><span>❤️ ${monster.hp}</span><span>👣 ${monster.speed}</span></div>
      <div class="ability-grid">
        ${['str','dex','con','int','wis','cha'].map((key) => `<div class="ability"><b>${key.toUpperCase()}</b>${a[key] ?? 10}<br>${abilityMod(a[key] ?? 10)}</div>`).join('')}
      </div>
      <div class="section"><h4>Combat</h4><div><b>Saves:</b> ${listText(monster.saves)}</div><div><b>Skills:</b> ${listText(monster.skills)}</div><div><b>Senses:</b> ${monster.senses || '—'}</div><div><b>Res:</b> ${listText(monster.resistances)} | <b>Imm:</b> ${listText(monster.immunities)}</div></div>
      <div class="section actions"><h4>Actions</h4>${renderItems(monster.actions, { limit: 5 })}</div>
      <div class="section"><h4>Bonus / Reaction</h4><b>BA:</b> ${renderItems(monster.bonusActions, { limit: 2 })} <b>RX:</b> ${renderItems(monster.reactions, { limit: 2 })}</div>
      <div class="section traits"><h4>Traits</h4>${renderItems(monster.traits, { limit: 3 })}</div>
      <div class="section legend"><h4>Legendary</h4>${renderItems(monster.legendaryActions, { limit: 3 })}</div>
    </div>`;
  });
}

export function renderSpellPanel(monster) {
  return safeRender('renderSpellPanel failed', '<p class="tiny">Spell panel failed.</p>', () => {
    if (!monster.spellcasting) return '<p class="tiny">No spellcasting.</p>';
    const rows = Object.entries(monster.spellcasting.levels || {})
      .map(([level, spells]) => `<div><b>${level}:</b> ${spells.join(', ')}</div>`)
      .join('');
    return `<p class="tiny"><b>${monster.spellcasting.header}</b></p><div class="tiny spell-list">${rows}</div>`;
  });
}

export function renderPanel(panelType, monster) {
  return safeRender('renderPanel failed', '<div class="face">Panel failed</div>', () => {
    if (panelType === PANEL_TYPES.FRONT) return `<div class="face no-pad">${renderCardFront(monster)}</div>`;
    if (panelType === PANEL_TYPES.COMBAT) return `<div class="face no-pad">${renderCombatBack(monster)}</div>`;
    if (panelType === PANEL_TYPES.ACTIONS) return `<div class="face"><h3>Actions</h3><div class="tiny">${renderItems(monster.actions)}</div></div>`;
    if (panelType === PANEL_TYPES.TRAITS) return `<div class="face"><h3>Traits / Reactions</h3><div class="tiny">${renderItems(monster.traits)}${renderItems(monster.reactions)}</div></div>`;
    if (panelType === PANEL_TYPES.LEGENDARY) return `<div class="face"><h3>Legendary / Lair</h3><div class="tiny">${renderItems(monster.legendaryActions)}${renderItems(monster.lairActions)}</div></div>`;
    if (panelType === PANEL_TYPES.SPELLS) return `<div class="face"><h3>Spellcasting</h3>${renderSpellPanel(monster)}</div>`;
    return `<div class="face"><h3>Source / Notes</h3><p class="tiny"><b>Source:</b> ${monster.source}</p><p class="tiny"><b>Ruleset:</b> ${monster.ruleset}</p><p class="tiny">Use this panel for DM notes, QR code, and attribution in exported packs.</p></div>`;
  });
}

export function panelPlan(monster) {
  return safeRender('panelPlan failed', [PANEL_TYPES.FRONT, PANEL_TYPES.COMBAT], () => {
    const layout = estimateComplexity(monster).layout;
    if (layout === 'standard') return [PANEL_TYPES.FRONT, PANEL_TYPES.COMBAT];
    return [PANEL_TYPES.FRONT, PANEL_TYPES.COMBAT, PANEL_TYPES.ACTIONS, PANEL_TYPES.TRAITS, PANEL_TYPES.LEGENDARY, monster.spellcasting ? PANEL_TYPES.SPELLS : PANEL_TYPES.NOTES];
  });
}

export function renderAccordion(monster) {
  return safeRender('renderAccordion failed', '<p>Accordion failed.</p>', () => `<div class="accordion-sheet">${panelPlan(monster).map((panel) => renderPanel(panel, monster)).join('')}</div><p class="fold-note">Accordion mode: three connected cards, six faces total. Print at 100%, cut outer edge, fold on spines, laminate.</p>`);
}

export function renderStandardPair(monster) {
  return safeRender('renderStandardPair failed', '<p>Card pair failed.</p>', () => `<div class="card-workbench standard-pair">${renderCardFront(monster)}${renderCombatBack(monster)}</div>`);
}
