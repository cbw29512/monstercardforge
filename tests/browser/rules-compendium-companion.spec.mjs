import { test, expect } from '@playwright/test';
import { preparePage, siteRoute } from './helpers.mjs';

test.beforeEach(async ({ page }) => preparePage(page));

test('Rules Compendium gateway exposes every supported D&D workspace', async ({ page }) => {
  await page.goto(siteRoute('rules-compendium.html'));
  for (const destination of [
    'Search the Full Compendium',
    'Open Rules Guide',
    'Open Player Cards',
    'Open DM Cards',
    'Open Encounter Cards',
    'Build a Roll Card',
    'Build a Monster'
  ]) {
    await expect(page.getByRole('link', { name: destination })).toHaveAttribute('href', /DungeonCards\/\?system=dnd&page=/);
  }
  await expect(page.getByText('Reference-complete does not automatically mean roll-automated.')).toBeVisible();
});

test('live DungeonCards deep link opens the D&D Compendium and returns to DM Forge', async ({ page }) => {
  test.skip(process.env.DM_FORGE_LIVE_COMPANIONS !== '1', 'Cross-repository companion validation only runs against deployed sites.');
  const companion = process.env.DUNGEON_CARDS_URL || 'https://cbw29512.github.io/DungeonCards/';
  const url = new URL(companion);
  url.searchParams.set('system', 'dnd');
  url.searchParams.set('page', 'compendium');
  await page.goto(url.toString());

  await expect(page.getByRole('link', { name: 'DM Forge' })).toHaveAttribute('href', 'https://cbw29512.github.io/monstercardforge/');
  await expect(page.locator('.product-lockup span')).toHaveText('Rules Compendium & Roll Cards');
  await expect(page.getByRole('button', { name: 'Compendium' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: /SRD Compendium/i })).toBeVisible();
});

test('live DungeonCards My Encounter transfers verified SRD monsters into Encounter Forge', async ({ page }) => {
  test.skip(process.env.DM_FORGE_LIVE_COMPANIONS !== '1', 'Cross-repository companion validation only runs against deployed sites.');
  const companion = process.env.DUNGEON_CARDS_URL || 'https://cbw29512.github.io/DungeonCards/';
  const url = new URL(companion);
  url.searchParams.set('system', 'dnd');
  url.searchParams.set('page', 'monster');
  await page.goto(url.toString());
  await page.evaluate(() => {
    localStorage.removeItem('dmforge-dungeoncards-encounter-handoff-v1');
    localStorage.removeItem('dungeon-cards:workspace:monster');
  });
  await page.reload();

  await page.getByRole('button', { name: 'Open Monster Library' }).click();
  await page.getByLabel('Search monsters').fill('Goblin');
  const goblin = page.locator('.monster-reference').filter({ hasText: /^Goblin/ }).first();
  await expect(goblin).toBeVisible();
  await goblin.getByRole('button', { name: 'Add to My Encounter' }).click();
  await page.getByRole('button', { name: 'My Encounter' }).click();
  await expect(page.getByRole('button', { name: 'Send My Encounter to DM Forge' })).toBeVisible();

  await page.getByRole('button', { name: 'Send My Encounter to DM Forge' }).click();
  await page.waitForURL(/monstercardforge\/encounter-forge\.html/);
  await expect(page.locator('#encounterName')).toHaveValue('DungeonCards Encounter');
  await expect(page.locator('#encounterRoster')).toContainText('Goblin');
  await expect(page.locator('#encounterRoster')).toContainText('SRD');
  await expect(page.locator('#difficultyBadge')).not.toHaveText('Empty');
});
