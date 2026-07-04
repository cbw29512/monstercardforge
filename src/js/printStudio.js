import { renderAccordion, renderCardFront, renderCombatBack, renderPanel, PANEL_TYPES } from './cardEngine.js';
import { safeRender } from './logger.js';

export function renderStarterPrintSheet(monster) {
  return safeRender('renderStarterPrintSheet failed', '<p>Print sheet failed.</p>', () => `<div class="print-page letter-page">
    <div class="sheet-note"><b>Home Printer Mode:</b> print at 100% on cardstock, cut outside the dashed edge, fold on the spine, then laminate.</div>
    <div class="starter-print-sheet">
      <div class="fold-unit standard-fold-unit">
        <div class="crop crop-tl"></div><div class="crop crop-tr"></div><div class="crop crop-bl"></div><div class="crop crop-br"></div>
        ${renderCardFront(monster)}
        <div class="spine-mark">FOLD</div>
        ${renderCombatBack(monster)}
      </div>
      <div class="legend-card">
        <h3>Legend</h3>
        <p>🛡 AC · ❤️ HP · 👣 Speed · 👁 Senses · PP Passive Perception</p>
        <p>⚔ Melee · 🏹 Ranged · BA Bonus Action · RX Reaction · TR Trait · LA Legendary Action</p>
        <p>S Slashing · P Piercing · B Bludgeoning · A Acid · F Fire · C Cold · N Necrotic</p>
        <p class="tiny"><b>Print:</b> 100% actual size. Cut outside edge. Fold on spine. Laminate if desired.</p>
      </div>
    </div>
  </div>`);
}

export function renderBossFolioSheet(monster) {
  return safeRender('renderBossFolioSheet failed', '<p>Boss folio failed.</p>', () => `<div class="boss-folio-wrap">
    <div class="details-panel"><h3>Boss Folio Print Mode</h3><p>This is for monsters like liches and adult dragons. Print on standard letter cardstock at 100%, cut the outer dashed edge, accordion-fold on each spine, then laminate as one folded reference card.</p></div>
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

export function renderPrintChecklist() {
  return `<div class="details-panel print-checklist"><h3>Home Printer Checklist</h3><ol><li>Use letter-size cardstock.</li><li>Printer scale: 100% / Actual Size.</li><li>Do not use Fit to Page.</li><li>Cut on the outside dashed boundary.</li><li>Fold on every spine mark before laminating.</li><li>Laminate after folding if you want one reusable folded reference.</li></ol></div>`;
}

export function renderPrintModePreview(monster) {
  return safeRender('renderPrintModePreview failed', '<p>Print preview failed.</p>', () => `<div class="print-mode-grid"><div><h3>Table View</h3>${renderAccordion(monster)}</div><div><h3>Home Printer Boss Folio</h3>${renderBossFolioSheet(monster)}</div></div>`);
}
