import { renderCardFront, renderCombatBack } from './cardEngine.js';
import { safeRender } from './logger.js';

export function renderStarterPrintSheet(monster) {
  return safeRender('renderStarterPrintSheet failed', '<p>Print sheet failed.</p>', () => `<div class="starter-print-sheet">
    <div class="fold-unit">
      <div class="crop crop-tl"></div><div class="crop crop-tr"></div><div class="crop crop-bl"></div><div class="crop crop-br"></div>
      ${renderCardFront(monster)}
      <div class="spine-mark">FOLD SPINE</div>
      ${renderCombatBack(monster)}
    </div>
    <div class="legend-card">
      <h3>Legend</h3>
      <p>🛡 AC · ❤️ HP · 👣 Speed · 👁 Senses · PP Passive Perception</p>
      <p>⚔ Melee · 🏹 Ranged · BA Bonus Action · RX Reaction · TR Trait · LA Legendary Action</p>
      <p>S Slashing · P Piercing · B Bludgeoning · A Acid · F Fire · C Cold · N Necrotic</p>
      <p class="tiny"><b>Print:</b> 100% actual size. Cut outside edge. Fold on spine. Laminate if desired.</p>
    </div>
  </div>`);
}

export function renderPrintChecklist() {
  return `<div class="details-panel print-checklist"><h3>Print Checklist</h3><ol><li>Use cardstock.</li><li>Printer scale: 100% / Actual Size.</li><li>Do not use Fit to Page.</li><li>Cut on crop marks.</li><li>Fold on spine mark.</li><li>Laminate after folding if desired.</li></ol></div>`;
}
