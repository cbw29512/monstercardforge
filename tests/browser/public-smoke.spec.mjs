import { test, expect } from '@playwright/test';
import { expectNoRuntimeErrors, preparePage, siteRoute, watchRuntimeErrors } from './helpers.mjs';

const pages = [
  ['index.html', 'DM Forge'],
  ['about.html', 'About DM Forge'],
  ['community.html', 'DM Forge Community'],
  ['campaigns.html', 'Campaign Hub'],
  ['campaign-search.html', 'Campaign Search'],
  ['rules-compendium.html', 'Rules Compendium & Roll Cards'],
  ['session-console.html', 'Session Console'],
  ['encounter-forge.html', 'Encounter Forge'],
  ['player-display.html', 'Player Display'],
  ['monster-cards.html', 'Monster Card Forge'],
  ['magic-items.html', 'Magic Item Forge'],
  ['npc-forge.html', 'NPC Forge'],
  ['loot-forge.html', 'Loot Forge'],
  ['backup-center.html', 'Protect My Campaign']
];

test.beforeEach(async ({ page }) => preparePage(page));

for (const [route, heading] of pages) {
  test(`${route} loads without runtime errors`, async ({ page }) => {
    const errors = watchRuntimeErrors(page);
    const response = await page.goto(siteRoute(route));
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1').first()).toContainText(heading);
    await expect(page.locator('body')).toBeVisible();
    await expectNoRuntimeErrors(errors);
  });
}
