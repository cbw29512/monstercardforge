import { renderAccordion, renderCardFront, renderCombatBack, renderPanel, PANEL_TYPES } from './cardEngine.js';
import { safeRender } from './logger.js';

export const PRINT_MODES = {
  FOLD_OVER: 'fold-over',
  DUPLEX: 'duplex',
  BOSS_FOLIO: 'boss-folio',
  BOSS_DECKLET: 'boss-decklet',
};

export function recommendedPrintMode(monster) {
  return safeRender('recommendedPrintMode failed', PRINT_MODES.FOLD_OVER, () => {
    if (monster.spellcasting || (monster.legendaryActions || []).length > 0 || (monster.lairActions || []).length > 0) {
      return PRINT_MODES.BOSS_FOLIO;
    }
    return PRINT_MODES.FOLD_OVER;
  });
}

export function renderFoldOverSheet(monster) {
  return safeRender('renderFoldOverSheet failed', '<p>Fold-over print sheet failed.</p>', () => `<div class="print-card-option print-pane fold-pane">
    <div class="details-panel"><h3>Cut-and-Fold Card</h3><p>Works on any normal printer. Print on cardstock, cut the whole connected rectangle, fold on the middle spine, then laminate so it becomes one thick card.</p></div>
    <div class="print-page letter-page">
      <div class="sheet-note"><b>Cut-and-Fold:</b> front and back stay attached. Cut one piece. Fold in the middle.</div>
      <div class="starter-print-sheet">
        <div class="fold-unit standard-fold-unit">
          <div class="crop crop-tl"></div><div class="crop crop-tr"></div><div class="crop crop-bl"></div><div class="crop crop-br"></div>
          ${renderCardFront(monster)}
          <div class="spine-mark">FOLD SPINE</div>
          ${renderCombatBack(monster)}
        </div>
      </div>
    </div>
  </div>`);
}

export function renderDuplexSheet(monster) {
  return safeRender('renderDuplexSheet failed', '<p>Duplex print sheet failed.</p>', () => `<div class="print-card-option print-pane duplex-pane">
    <div class="details-panel"><h3>Duplex Front/Back</h3><p>Use this only if your printer supports accurate double-sided printing. Print the front page, then the back page on the reverse side at 100% scale.</p></div>
    <div class="duplex-pages">
      <div class="print-page letter-page duplex-page">
        <div class="sheet-note"><b>Duplex Page 1:</b> card front.</div>
        <div class="duplex-card-slot">${renderCardFront(monster)}</div>
      </div>
      <div class="print-page letter-page duplex-page">
        <div class="sheet-note"><b>Duplex Page 2:</b> matching card back. Print on reverse side.</div>
        <div class="duplex-card-slot">${renderCombatBack(monster)}</div>
      </div>
    </div>
  </div>`);
}

export function renderStarterPrintSheet(monster) {
  return safeRender('renderStarterPrintSheet failed', '<p>Print sheet failed.</p>', () => `<div class="print-choice-panel standard-print-choice">
    <h3>Choose Your Print Method</h3>
    <p>Most users should choose cut-and-fold. Duplex is optional for printers that align front and back accurately.</p>
    <input class="print-mode-radio" type="radio" name="standard-print-${monster.id}" id="fold-${monster.id}" checked>
    <input class="print-mode-radio" type="radio" name="standard-print-${monster.id}" id="duplex-${monster.id}">
    <div class="print-choice-tabs">
      <label class="print-choice-tab" for="fold-${monster.id}">Cut-and-Fold</label>
      <label class="print-choice-tab" for="duplex-${monster.id}">Duplex Front/Back</label>
    </div>
    ${renderFoldOverSheet(monster)}
    ${renderDuplexSheet(monster)}
    <div class="legend-card print-legend-card">
      <h3>Legend</h3>
      <p>AC · HP · Speed · Senses · PP Passive Perception</p>
      <p>Melee · Ranged · BA Bonus Action · RX Reaction · TR Trait · LA Legendary Action</p>
      <p>S Slashing · P Piercing · B Bludgeoning · A Acid · F Fire · C Cold · N Necrotic</p>
      <p class="tiny"><b>Print:</b> 100% actual size. Do not use fit to page.</p>
    </div>
  </div>`);
}

export function renderBossFolioSheet(monster) {
  return safeRender('renderBossFolioSheet failed', '<p>Boss folio failed.</p>', () => `<div class="boss-folio-wrap print-pane folio-pane">
    <div class="details-panel"><h3>Boss Folio Print Mode</h3><p>Best for legendary monsters, spellcasters, and bosses. Print on standard letter cardstock at 100%, cut the outer dashed edge, accordion-fold on every spine mark, then laminate as a folded reference card.</p></div>
    <div class="print-page letter-page boss-page">
      <div class="boss-strip">
        <div class="boss-panel cover-panel">${renderCardFront(monster)}</div>
        <div class="spine-mark boss-spine">FOLD</div>
        <div class="boss-panel combat-panel">${renderCombatBack(monster)}</div>
        <div class="spine-mark boss-spine">FOLD</div>
        ${renderPanel(PANEL_TYPES.ACTIONS, monster)}
      </div>
      <div class="boss-strip">
        ${renderPanel(PANEL_TYPES.TRAITS, monster)}
        <div class="spine-mark boss-spine">FOLD</div>
        ${renderPanel(PANEL_TYPES.LEGENDARY, monster)}
        <div class="spine-mark boss-spine">FOLD</div>
        ${monster.spellcasting ? renderPanel(PANEL_TYPES.SPELLS, monster) : renderPanel(PANEL_TYPES.NOTES, monster)}
      </div>
    </div>
  </div>`);
}

export function renderBossDeckletSheet(monster) {
  return safeRender('renderBossDeckletSheet failed', '<p>Boss decklet failed.</p>', () => `<div class="boss-folio-wrap print-pane decklet-pane">
    <div class="details-panel"><h3>Boss Decklet</h3><p>If accordion lamination feels bulky, print three separate cut-and-fold cards and sleeve them together as a boss mini-deck.</p></div>
    <div class="decklet-grid">
      <div class="fold-unit standard-fold-unit">${renderCardFront(monster)}<div class="spine-mark">FOLD</div>${renderCombatBack(monster)}</div>
      <div class="fold-unit standard-fold-unit">${renderPanel(PANEL_TYPES.ACTIONS, monster)}<div class="spine-mark">FOLD</div>${renderPanel(PANEL_TYPES.TRAITS, monster)}</div>
      <div class="fold-unit standard-fold-unit">${renderPanel(PANEL_TYPES.LEGENDARY, monster)}<div class="spine-mark">FOLD</div>${monster.spellcasting ? renderPanel(PANEL_TYPES.SPELLS, monster) : renderPanel(PANEL_TYPES.NOTES, monster)}</div>
    </div>
  </div>`);
}

export function renderBossPrintChoice(monster) {
  return safeRender('renderBossPrintChoice failed', '<p>Boss print choice failed.</p>', () => `<div class="print-choice-panel boss-print-choice">
    <h3>Choose Your Boss Print Method</h3>
    <p>Boss Folio keeps everything attached as one fold-out reference. Boss Decklet creates separate fold-over cards that are easier to laminate.</p>
    <input class="print-mode-radio" type="radio" name="boss-print-${monster.id}" id="folio-${monster.id}" checked>
    <input class="print-mode-radio" type="radio" name="boss-print-${monster.id}" id="decklet-${monster.id}">
    <div class="print-choice-tabs">
      <label class="print-choice-tab" for="folio-${monster.id}">Boss Folio</label>
      <label class="print-choice-tab" for="decklet-${monster.id}">Boss Decklet</label>
    </div>
    ${renderBossFolioSheet(monster)}
    ${renderBossDeckletSheet(monster)}
  </div>`);
}

export function renderPrintChecklist() {
  return `<div class="details-panel print-checklist"><h3>Home Printer Checklist</h3><ol><li>Use letter-size cardstock.</li><li>Printer scale: 100% / Actual Size.</li><li>Do not use Fit to Page.</li><li>For cut-and-fold, cut front/back together as one connected piece.</li><li>Fold on the center spine so the front and back match.</li><li>Laminate after folding if you want one reusable thick card.</li></ol></div>`;
}

export function renderPrintModePreview(monster) {
  return safeRender('renderPrintModePreview failed', '<p>Print preview failed.</p>', () => {
    const mode = recommendedPrintMode(monster);
    if (mode === PRINT_MODES.FOLD_OVER) {
      return `<div class="print-mode-grid"><div><h3>Recommended for This Monster</h3>${renderStarterPrintSheet(monster)}</div></div>`;
    }
    return `<div class="print-mode-grid"><div><h3>Table View</h3>${renderAccordion(monster)}</div><div>${renderBossPrintChoice(monster)}</div></div>`;
  });
}
