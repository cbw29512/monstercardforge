import { monsters } from '../data/monsters.js';
import { estimateComplexity, renderCardFront, renderCombatBack, renderItems } from './cardEngine.js';
import { homebrewChecklist, homebrewSections } from './homebrewSchema.js';
import { renderBossFolioSheet, renderPrintChecklist, renderPrintModePreview, renderStarterPrintSheet } from './printStudio.js';
import { safeRender } from './logger.js';

export function renderMonsterDetails(monster) {
  return safeRender('renderMonsterDetails failed', '', () => {
    const complexity = estimateComplexity(monster);
    return `<div class="details-panel">
      <h3>${monster.name}</h3>
      <span class="pill">${monster.ruleset}</span><span class="pill">${monster.type}</span><span class="pill">${complexity.stars}</span><span class="pill">${complexity.layout}</span>
      <p><b>Best print mode:</b> Simple monsters use fold-over cards. Legendary, spellcasting, and boss monsters use Boss Folio layouts so text stays readable.</p>
      <button class="tab print-hide" onclick="window.print()">Print This Layout</button>
    </div>`;
  });
}

export function renderLibraryView(state, onSelect) {
  return safeRender('renderLibraryView failed', '', () => {
    const filtered = monsters.filter((monster) => (state.ruleset === 'all' || monster.ruleset === state.ruleset) && (state.type === 'all' || monster.type === state.type));
    const selected = monsters.find((monster) => monster.id === state.selectedId) || filtered[0] || monsters[0];
    const buttons = filtered.map((monster) => `<button class="monster-button ${monster.id === selected.id ? 'active' : ''}" data-id="${monster.id}"><b>${monster.name}</b><span class="monster-meta">CR ${monster.cr} · ${monster.type} · ${monster.ruleset}</span></button>`).join('');
    const printPreview = renderPrintModePreview(selected);
    return {
      sideList: buttons,
      stage: `<section class="page-intro"><p class="eyebrow">Browse printable cards</p><h2>Choose a monster, then print the layout the engine recommends.</h2><p>Every monster shows a table preview and a home-printer layout. Boss monsters get extra space instead of tiny unreadable text.</p></section><div class="card-workbench"><div>${renderCardFront(selected)}<br>${renderCombatBack(selected)}</div>${renderMonsterDetails(selected)}</div><h2>Home Printer Layout</h2>${printPreview}${renderPrintChecklist()}`,
      attach() {
        document.querySelectorAll('.monster-button').forEach((button) => button.addEventListener('click', () => onSelect(button.dataset.id)));
      }
    };
  });
}

export function renderFreeSampleView(onViewGoblin) {
  return safeRender('renderFreeSampleView failed', '', () => {
    const goblin = monsters.find((item) => item.id === 'goblin-2014') || monsters[0];
    const dragon = monsters.find((item) => item.id === 'adult-black-dragon-2014');
    const lich = monsters.find((item) => item.id === 'lich-2014');
    return {
      stage: `<section class="hero-sample hero-problem"><div><p class="eyebrow">Built for busy Game Masters</p><h2>Stop flipping books in combat. Print the monster card and run the encounter faster.</h2><p class="hero-copy">Monster Card Forge turns monster stats into clear, reusable, table-ready cards. Simple monsters fold into one card. Boss monsters unfold into readable folios with actions, traits, spells, and legendary options.</p><div class="cta-row"><button class="tab active" onclick="window.print()">Print Free Goblin Card</button><button class="tab" id="viewGoblin">Browse Dragon & Lich Examples</button></div><div class="value-grid"><div><b>Problem</b><span>Stats are scattered across books, tabs, and notes.</span></div><div><b>Fix</b><span>One printable card with the combat info in the right order.</span></div><div><b>Result</b><span>Less searching. Faster turns. Cleaner table.</span></div></div></div><div class="sample-stack hero-cards">${renderCardFront(goblin)}${renderCombatBack(goblin)}</div></section><section class="how-it-works"><h2>How it works</h2><div class="step-grid"><div><b>1. Pick a monster</b><p>Start with the free Goblin or browse boss examples.</p></div><div><b>2. Choose the print layout</b><p>Fold-over for simple monsters. Boss Folio for complex monsters.</p></div><div><b>3. Print, cut, fold, laminate</b><p>Designed for regular letter-size cardstock at 100% scale.</p></div></div></section><h2>Free Goblin Starter Print Sheet</h2>${renderStarterPrintSheet(goblin)}<h2>See how complex monsters scale</h2><p class="section-copy">The Adult Black Dragon and Lich prove the layout expands instead of shrinking text.</p><div class="boss-example-grid">${dragon ? renderBossFolioSheet(dragon) : ''}${lich ? renderBossFolioSheet(lich) : ''}</div>${renderPrintChecklist()}<div class="details-panel attribution-box"><h3>Attribution Notice</h3><p>Monster Card Forge is independent. Open-license rules content must retain required attribution in exports and public pages.</p></div>`,
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
      stage: `<section class="page-intro"><p class="eyebrow">Create your own monster</p><h2>Fill in guided fields. The card updates automatically.</h2><p>Each section explains what to enter and shows an example so homebrew creators do not have to guess the format.</p></section><div class="homebrew-grid"><form id="homebrewForm" class="details-panel"><h3>Build Your Monster</h3><p class="help">Follow each section. The live preview uses the same templates as official cards.</p>${fields}${actionExample}<div class="form-section"><button class="tab" type="button" id="loadExample">Reload Example Monster</button></div></form><div><h3>Live Printable Preview</h3>${warningHtml}<div class="card-workbench">${renderCardFront(monster)}${renderCombatBack(monster)}</div>${renderBossFolioSheet(monster)}</div></div>`,
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
  return { stage: `<section class="page-intro"><p class="eyebrow">Legal clarity</p><h2>Rulesets, sources, and attribution stay separated.</h2><p>Before sales go live, every export must clearly identify what ruleset and source it uses.</p></section><div class="details-panel"><p>Monster Card Forge is an independent 5E-compatible tool. SRD rules content must be kept separated by ruleset and used only under the correct open-license terms. Exports should include ruleset, source, and attribution information.</p><p><b>Publishing rule:</b> only SRD/open content, original Monster Card Forge content, or user-created homebrew may be published or sold through this site.</p></div>`, attach() {} };
}
