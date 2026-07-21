import { safeRender } from './logger.js';
import { artThemeFor } from './artThemes.js';
import { escapeHtml } from './security.js';

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
    return items.map((item) => escapeHtml(item)).join(', ');
  });
}

export function rulesLabel(value) {
  if (value === '5e-2014') return '5e (2014)';
  if (value === '5e-2024') return '5.5e (2024)';
  if (value === 'homebrew') return 'Homebrew';
  return String(value || 'Rules not specified');
}

export function sourceLine(monster) {
  return safeRender('sourceLine failed', '', () => {
    const parts = [monster.source, monster.license, monster.verifiedAt ? `verified ${monster.verifiedAt}` : ''].filter(Boolean);
    return parts.join(' · ');
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
    const visible = items.slice(0, limit);
    const rendered = visible.map((item) => {
      const cost = Number(item.cost) > 1 ? ` <span class="action-cost">(${Number(item.cost)} actions)</span>` : '';
      const attackBits = [item.hit, item.reach, item.target, item.damage].filter(Boolean);
      const attackLine = attackBits.length
        ? ` <span class="attack-line">${attackBits.map((value) => escapeHtml(value)).join(' | ')}</span>`
        : '';
      const body = item.text ? ` <span class="item-text">— ${escapeHtml(item.text)}</span>` : '';
      return `<div class="item"><b>${escapeHtml(item.name || 'Unnamed')}</b>${cost}${attackLine}${body}</div>`;
    }).join('');
    const omitted = items.length - visible.length;
    return `${rendered}${omitted > 0 ? `<div class="item continuation-note"><b>${omitted} more ${omitted === 1 ? 'entry' : 'entries'}:</b> see the dedicated panel in the recommended print layout.</div>` : ''}`;
  });
}

function renderArt(monster) {
  return safeRender('renderArt failed', '<div class="art"><span>ART</span></div>', () => {
    const theme = artThemeFor(monster.type);
    const monsterClass = typeClass(monster.type);
    return `<div class="art art-${monsterClass}">
      <div class="art-glow"></div>
      <div class="art-moon"></div>
      <div class="art-sigil">${escapeHtml(theme.icon)}</div>
      <div class="art-ground"></div>
      <div class="art-label">${escapeHtml(theme.title)}</div>
    </div>`;
  });
}

export function renderCardFront(monster) {
  return safeRender('renderCardFront failed', '<div class="card">Card failed</div>', () => `<div class="card ${typeClass(monster.type)}" data-card-face="front">
    ${renderArt(monster)}
    <div class="badge">CR ${escapeHtml(monster.cr)}${monster.xp != null ? ` · ${Number(monster.xp).toLocaleString()} XP` : ''}</div>
    <div class="type-chip">${escapeHtml(monster.type)}</div>
    <div class="card-title"><strong>${escapeHtml(monster.name)}</strong><span>${escapeHtml(monster.size)} ${escapeHtml(monster.type)}${monster.alignment ? `, ${escapeHtml(monster.alignment)}` : ''}</span></div>
  </div>`);
}

export function renderCombatBack(monster) {
  return safeRender('renderCombatBack failed', '<div class="card back-card">Combat failed</div>', () => {
    const a = monster.abilities || {};
    return `<div class="card back-card ${typeClass(monster.type)}" data-card-face="combat">
      <div class="stat-row"><span>🛡 ${escapeHtml(monster.ac)}</span><span>❤️ ${escapeHtml(monster.hp)}</span><span>👣 ${escapeHtml(monster.speed)}</span></div>
      <div class="ability-grid">
        ${['str','dex','con','int','wis','cha'].map((key) => `<div class="ability"><b>${key.toUpperCase()}</b>${escapeHtml(a[key] ?? 10)}<br>${abilityMod(a[key] ?? 10)}</div>`).join('')}
      </div>
      <div class="section"><h4>Combat</h4><div><b>Saves:</b> ${listText(monster.saves)}</div><div><b>Skills:</b> ${listText(monster.skills)}</div><div><b>Senses:</b> ${escapeHtml(monster.senses || '—')}</div><div><b>Res:</b> ${listText(monster.resistances)} | <b>Imm:</b> ${listText(monster.immunities)}</div><div><b>Condition Imm:</b> ${listText(monster.conditionImmunities)}</div><div><b>Languages:</b> ${escapeHtml(monster.languages || '—')}</div></div>
      <div class="section actions"><h4>Actions</h4>${renderItems(monster.actions, { limit: monster.layoutHint === 'accordion' ? 4 : 5 })}</div>
      <div class="section"><h4>Bonus / Reaction</h4><b>BA:</b> ${renderItems(monster.bonusActions, { limit: 2 })} <b>RX:</b> ${renderItems(monster.reactions, { limit: 2 })}</div>
      <div class="section traits"><h4>Traits</h4>${renderItems(monster.traits, { limit: 3 })}</div>
      <div class="section legend"><h4>Legendary</h4>${renderItems(monster.legendaryActions, { limit: 3 })}</div>
      <div class="source-footer">${escapeHtml(rulesLabel(monster.ruleset))} · ${escapeHtml(sourceLine(monster))}</div>
    </div>`;
  });
}

export function renderSpellPanel(monster) {
  return safeRender('renderSpellPanel failed', '<p class="tiny">Spell panel failed.</p>', () => {
    if (!monster.spellcasting) return '<p class="tiny">No spellcasting.</p>';
    const rows = Object.entries(monster.spellcasting.levels || {})
      .map(([level, spells]) => `<div><b>${escapeHtml(level)}:</b> ${(spells || []).map((spell) => escapeHtml(spell)).join(', ')}</div>`)
      .join('');
    return `<p class="tiny"><b>${escapeHtml(monster.spellcasting.header)}</b></p><div class="tiny spell-list">${rows}</div><p class="tiny source-footer">${escapeHtml(sourceLine(monster))}</p>`;
  });
}

function renderSourcePanel(monster) {
  return `<div class="face"><h3>Source / Scope</h3><p class="tiny"><b>Ruleset:</b> ${escapeHtml(rulesLabel(monster.ruleset))}</p><p class="tiny"><b>Source:</b> ${escapeHtml(monster.source || 'Not specified')}</p><p class="tiny"><b>License:</b> ${escapeHtml(monster.license || 'Not specified')}</p>${monster.sourceUrl ? `<p class="tiny"><b>Source URL:</b> ${escapeHtml(monster.sourceUrl)}</p>` : ''}${monster.verifiedAt ? `<p class="tiny"><b>Verified:</b> ${escapeHtml(monster.verifiedAt)}</p>` : ''}${monster.scopeNote ? `<p class="tiny"><b>Scope:</b> ${escapeHtml(monster.scopeNote)}</p>` : ''}</div>`;
}

export function renderPanel(panelType, monster) {
  return safeRender('renderPanel failed', '<div class="face">Panel failed</div>', () => {
    if (panelType === PANEL_TYPES.FRONT) return `<div class="face no-pad">${renderCardFront(monster)}</div>`;
    if (panelType === PANEL_TYPES.COMBAT) return `<div class="face no-pad">${renderCombatBack(monster)}</div>`;
    if (panelType === PANEL_TYPES.ACTIONS) return `<div class="face"><h3>Actions</h3><div class="tiny">${renderItems(monster.actions)}</div></div>`;
    if (panelType === PANEL_TYPES.TRAITS) return `<div class="face"><h3>Traits / Reactions</h3><div class="tiny">${renderItems(monster.traits)}${renderItems(monster.reactions)}</div></div>`;
    if (panelType === PANEL_TYPES.LEGENDARY) return `<div class="face"><h3>Legendary Actions</h3><div class="tiny">${renderItems(monster.legendaryActions)}</div></div>`;
    if (panelType === PANEL_TYPES.SPELLS) return `<div class="face"><h3>Spellcasting</h3>${renderSpellPanel(monster)}</div>`;
    return renderSourcePanel(monster);
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
