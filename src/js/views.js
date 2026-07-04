import { monsters, homebrewExample } from '../data/monsters.js';
import { estimateComplexity, renderAccordion, renderCardFront, renderCombatBack, renderStandardPair, renderItems } from './cardEngine.js';
import { homebrewChecklist, homebrewSections } from './homebrewSchema.js';
import { renderPrintChecklist, renderStarterPrintSheet } from './printStudio.js';
import { safeRender } from './logger.js';

export function renderMonsterDetails(monster) {
  return safeRender('renderMonsterDetails failed', '', () => {
    const complexity = estimateComplexity(monster);
    return `<div class="details-panel">
      <h3>${monster.name}</h3>
      <span class="pill">${monster.ruleset}</span><span class="pill">${monster.type}</span><span class="pill">${complexity.stars}</span><span class="pill">${complexity.layout}</span>
      <p><b>Source:</b> ${monster.source}</p>
      <p><b>Layout reason:</b> The engine selects the smallest readable card format based on actions, traits, legendary options, spellcasting, and lair content.</p>
      <button class="tab print-hide" onclick="window.print()">Print Preview</button>
    </div>`;
  });
}

export function renderLibraryView(state, onSelect) {
  return safeRender('renderLibraryView failed', '', () => {
    const filtered = monsters.filter((monster) => (state.ruleset === 'all' || monster.ruleset === state.ruleset) && (state.type === 'all' || monster.type === state.type));
    const selected = monsters.find((monster) => monster.id === state.selectedId) || filtered[0] || monsters[0];
    const buttons = filtered.map((monster) => `<button class="monster-button ${monster.id === selected.id ? 'active' : ''}" data-id="${monster.id}"><b>${monster.name}</b><span class="monster-meta">CR ${monster.cr} · ${monster.type} · ${monster.ruleset}</span></button>`).join('');
    const layout = estimateComplexity(selected).layout;
    const printPreview = layout === 'standard' ? renderStandardPair(selected) : renderAccordion(selected);
    return {
      sideList: buttons,
      stage: `<h2>Monster Card Preview</h2><div class="card-workbench"><div>${renderCardFront(selected)}<br>${renderCombatBack(selected)}</div>${renderMonsterDetails(selected)}</div><h2>Print Layout</h2>${printPreview}`,
      attach() {
        document.querySelectorAll('.monster-button').forEach((button) => button.addEventListener('click', () => onSelect(button.dataset.id)));
      }
    };
  });
}

export function renderFreeSampleView(onViewGoblin) {
  return safeRender('renderFreeSampleView failed', '', () => {
    const monster = monsters.find((item) => item.id === 'goblin-2014') || monsters[0];
    return {
      stage: `<section class="hero-sample"><div><p class="eyebrow">Free printable sample</p><h2>Print the Goblin card in under 30 seconds.</h2><p class="hero-copy">This free starter sample demonstrates the whole promise: clean front cover, fast combat back, legend card, fold guide, and attribution notice.</p><div class="cta-row"><button class="tab active" onclick="window.print()">Print / Save PDF</button><button class="tab" id="viewGoblin">View Interactive Goblin</button></div><div class="details-panel sample-includes"><h3>Included</h3><ul><li>Goblin front card</li><li>Goblin combat back</li><li>Legend card</li><li>Fold-over assembly guide</li><li>Legal attribution reminder</li></ul></div></div><div class="sample-stack">${renderCardFront(monster)}${renderCombatBack(monster)}</div></section><h2>Free Goblin Starter Pack Print Sheet</h2>${renderStarterPrintSheet(monster)}${renderPrintChecklist()}<div class="details-panel attribution-box"><h3>Attribution Notice</h3><p>Monster Card Forge is independent and unaffiliated with Wizards of the Coast. SRD/open-license content must retain required attribution in exports and public pages.</p></div>`,
      attach() {
        const button = document.getElementById('viewGoblin');
        if (button) button.addEventListener('click', onViewGoblin);
      }
    };
  });
}

export function renderHomebrewView(state, updateHomebrew, reloadExample) {
  return safeRender('renderHomebrewView failed', '', () => {
    const monster = state.homebrew;
    const warnings = homebrewChecklist(monster);
    const fields = homebrewSections.map((section) => `<fieldset class="homebrew-section"><legend>${section.title}</legend><p class="help">${section.help}</p>${section.fields.map((field) => `<div class="filter"><label>${field.label}</label><input name="${field.key}" value="${monster[field.key] || ''}"><p class="help">Example: ${field.example}</p></div>`).join('')}</fieldset>`).join('');
    const actionExample = `<fieldset class="homebrew-section"><legend>3. Example Actions</legend><p class="help">Actions are structured so the card renderer can format attacks consistently. Full editing comes next; this shows the target format.</p><div class="example-code">${renderItems(monster.actions)}</div></fieldset>`;
    const warningHtml = warnings.length ? `<div class="details-panel warning"><h3>Completeness Warnings</h3><ul>${warnings.map((warning) => `<li>${warning}</li>`).join('')}</ul></div>` : `<div class="details-panel ready"><h3>Ready to Print</h3><p>The sample has the minimum combat information needed for a first print test.</p></div>`;
    return {
      stage: `<h2>Homebrew Forge</h2><div class="homebrew-grid"><form id="homebrewForm" class="details-panel"><h3>Build Your Monster</h3><p class="help">Follow each section. The live preview uses the same templates as official cards.</p>${fields}${actionExample}<div class="form-section"><button class="tab" type="button" id="loadExample">Reload Example Monster</button></div></form><div><h3>Live Printable Preview</h3>${warningHtml}<div class="card-workbench">${renderCardFront(monster)}${renderCombatBack(monster)}</div>${renderAccordion(monster)}</div></div>`,
      attach() {
        const form = document.getElementById('homebrewForm');
        if (form) form.addEventListener('input', (event) => updateHomebrew(Object.fromEntries(new FormData(event.currentTarget).entries())));
        const exampleButton = document.getElementById('loadExample');
        if (exampleButton) exampleButton.addEventListener('click', reloadExample);
      }
    };
  });
}

export function renderLegalView() {
  return { stage: `<h2>Legal & Attribution</h2><div class="details-panel"><p>Monster Card Forge is an independent 5E-compatible tool. It is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC.</p><p>SRD rules content must be kept separated by ruleset and used only under the correct open-license terms. Exports should include ruleset, source, and attribution information.</p><p><b>Publishing rule:</b> only SRD/open content, original Monster Card Forge content, or user-created homebrew may be published or sold through this site.</p></div>`, attach() {} };
}
