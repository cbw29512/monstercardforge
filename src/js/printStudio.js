import { renderAccordion, renderCardFront, renderCombatBack, renderPanel, PANEL_TYPES } from './cardEngine.js';
import { safeRender } from './logger.js';
import { safeDomToken } from './security.js';

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
    <div class="details-panel"><h3>Cut-and-Fold Card</h3><p>Finished size is 2.5" × 3.5". The unfolded piece is exactly 5" × 3.5". The front and back touch edge-to-edge with only a dotted fold line between them.</p></div>
    <div class="print-page letter-page standard-card-page">
      <div class="sheet-note"><b>MCF-001:</b> cut outer crop marks only. Fold on the dotted seam. No spacer. No hinge.</div>
      <div class="fold-unit standard-fold-unit edge-touch-fold">
        <div class="crop crop-tl"></div><div class="crop crop-tr"></div><div class="crop crop-bl"></div><div class="crop crop-br"></div>
        <div class="fold-panel front-panel">${renderCardFront(monster)}</div>
        <div class="fold-score-line" aria-hidden="true"><span>FOLD</span></div>
        <div class="fold-panel back-panel">${renderCombatBack(monster)}</div>
      </div>
      <div class="finished-size-note">Unfolded: 5" × 3.5" · Folded: 2.5" × 3.5" · Fits standard sleeves and 9-pocket binder pages.</div>
    </div>
  </div>`);
}

export function renderDuplexSheet(monster) {
  return safeRender('renderDuplexSheet failed', '<p>Duplex print sheet failed.</p>', () => `<div class="print-card-option print-pane duplex-pane">
    <div class="details-panel"><h3>Duplex Front/Back</h3><p>Use this only if your printer supports accurate double-sided printing. Each card is finished at 2.5" × 3.5".</p></div>
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
  return safeRender('renderStarterPrintSheet failed', '<p>Print sheet failed.</p>', () => {
    const token = safeDomToken(monster.id, 'monster');
    return `<div class="print-choice-panel standard-print-choice">
      <h3>Choose Your Print Method</h3>
      <p>Cut-and-fold is recommended: one 5" × 3.5" connected piece folds into one standard 2.5" × 3.5" card.</p>
      <input class="print-mode-radio" type="radio" name="standard-print-${token}" id="fold-${token}" checked>
      <input class="print-mode-radio" type="radio" name="standard-print-${token}" id="duplex-${token}">
      <div class="print-choice-tabs">
        <label class="print-choice-tab" for="fold-${token}">Cut-and-Fold</label>
        <label class="print-choice-tab" for="duplex-${token}">Duplex Front/Back</label>
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
    </div>`;
  });
}

export function renderBossFolioSheet(monster) {
  return safeRender('renderBossFolioSheet failed', '<p>Boss folio failed.</p>', () => `<div class="boss-folio-wrap print-pane folio-pane">
    <div class="details-panel"><h3>Boss Folio Print Mode</h3><p>High-CR accordion cards use edge-touching panels. Every fold is a dotted seam where two 2.5" × 3.5" panels touch.</p></div>
    <div class="print-page letter-page boss-page edge-touch-boss-page">
      <div class="boss-strip edge-touch-boss-strip">
        <div class="boss-panel cover-panel">${renderCardFront(monster)}</div>
        <div class="boss-fold-score"><span>FOLD</span></div>
        <div class="boss-panel combat-panel">${renderCombatBack(monster)}</div>
        <div class="boss-fold-score"><span>FOLD</span></div>
        <div class="boss-panel action-panel">${renderPanel(PANEL_TYPES.ACTIONS, monster)}</div>
      </div>
      <div class="boss-strip edge-touch-boss-strip">
        <div class="boss-panel trait-panel">${renderPanel(PANEL_TYPES.TRAITS, monster)}</div>
        <div class="boss-fold-score"><span>FOLD</span></div>
        <div class="boss-panel legendary-panel">${renderPanel(PANEL_TYPES.LEGENDARY, monster)}</div>
        <div class="boss-fold-score"><span>FOLD</span></div>
        <div class="boss-panel spell-panel">${monster.spellcasting ? renderPanel(PANEL_TYPES.SPELLS, monster) : renderPanel(PANEL_TYPES.NOTES, monster)}</div>
      </div>
    </div>
  </div>`);
}

export function renderBossDeckletSheet(monster) {
  return safeRender('renderBossDeckletSheet failed', '<p>Boss decklet failed.</p>', () => `<div class="boss-folio-wrap print-pane decklet-pane">
    <div class="details-panel"><h3>Boss Decklet</h3><p>Three separate cut-and-fold cards. Each unfolded piece is 5" × 3.5" and folds to 2.5" × 3.5".</p></div>
    <div class="decklet-grid">
      <div class="fold-unit standard-fold-unit edge-touch-fold">${renderCardFront(monster)}<div class="fold-score-line"><span>FOLD</span></div>${renderCombatBack(monster)}</div>
      <div class="fold-unit standard-fold-unit edge-touch-fold">${renderPanel(PANEL_TYPES.ACTIONS, monster)}<div class="fold-score-line"><span>FOLD</span></div>${renderPanel(PANEL_TYPES.TRAITS, monster)}</div>
      <div class="fold-unit standard-fold-unit edge-touch-fold">${renderPanel(PANEL_TYPES.LEGENDARY, monster)}<div class="fold-score-line"><span>FOLD</span></div>${monster.spellcasting ? renderPanel(PANEL_TYPES.SPELLS, monster) : renderPanel(PANEL_TYPES.NOTES, monster)}</div>
    </div>
  </div>`);
}

export function renderBossPrintChoice(monster) {
  return safeRender('renderBossPrintChoice failed', '<p>Boss print choice failed.</p>', () => {
    const token = safeDomToken(monster.id, 'boss');
    return `<div class="print-choice-panel boss-print-choice">
      <h3>Choose Your Boss Print Method</h3>
      <p>Boss Folio keeps everything attached as a fold-out reference. Boss Decklet makes multiple sleeve-ready cards.</p>
      <input class="print-mode-radio" type="radio" name="boss-print-${token}" id="folio-${token}" checked>
      <input class="print-mode-radio" type="radio" name="boss-print-${token}" id="decklet-${token}">
      <div class="print-choice-tabs">
        <label class="print-choice-tab" for="folio-${token}">Boss Folio</label>
        <label class="print-choice-tab" for="decklet-${token}">Boss Decklet</label>
      </div>
      ${renderBossFolioSheet(monster)}
      ${renderBossDeckletSheet(monster)}
    </div>`;
  });
}

export function renderPrintChecklist() {
  return `<div class="details-panel print-checklist"><h3>Home Printer Checklist</h3><ol><li>Use letter-size cardstock.</li><li>Printer scale: 100% / Actual Size.</li><li>Do not use Fit to Page.</li><li>For cut-and-fold, cut one 5" × 3.5" connected piece.</li><li>Fold on the dotted seam where both card edges touch.</li><li>Finished card must be 2.5" × 3.5" and fit a standard sleeve.</li></ol></div>`;
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
