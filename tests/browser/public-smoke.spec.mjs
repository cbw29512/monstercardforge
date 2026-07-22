import { test, expect } from '@playwright/test';
import { expectNoRuntimeErrors, preparePage, watchRuntimeErrors } from './helpers.mjs';

const pages = [
  ['/', 'DM Forge'],
  ['/about.html', 'Rules, Privacy'],
  ['/community.html', 'DM Forge Community'],
  ['/campaigns.html', 'Campaign Hub'],
  ['/campaign-search.html', 'Campaign Search'],
  ['/session-console.html', 'Session Console'],
  ['/encounter-forge.html', 'Encounter Forge'],
  ['/player-display.html', 'Player Display'],
  ['/monster-cards.html', 'Monster Card Forge'],
  ['/magic-items.html', 'Magic Item Forge'],
  ['/npc-forge.html', 'NPC Forge'],
  ['/loot-forge.html', 'Loot Forge'],
  ['/backup-center.html', 'Backup & Storage Center']
];

test.beforeEach(async ({ page }) => preparePage(page));

for (const [route, heading] of pages) {
  test(`${route} loads without runtime errors`, async ({ page }) => {
    const errors = watchRuntimeErrors(page);
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1').first()).toContainText(heading);
    await expect(page.locator('body')).toBeVisible();
    await expectNoRuntimeErrors(errors);
  });
}
