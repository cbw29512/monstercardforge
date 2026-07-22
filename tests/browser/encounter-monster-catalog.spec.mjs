import { test, expect } from '@playwright/test';
import { clearDmForgeStorage, expectNoRuntimeErrors, preparePage, siteRoute, watchRuntimeErrors } from './helpers.mjs';

const expectedCount = process.env.DM_FORGE_LIVE_COMPANIONS === '1' ? 642 : 2;

test.beforeEach(async ({ page }) => {
  await preparePage(page);
  await clearDmForgeStorage(page);
});

test('Encounter Forge loads, filters, and sources the DungeonCards SRD catalog', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.goto(siteRoute('encounter-forge.html'));
  await expect(page.locator('#catalogSourceStatus')).toContainText(`${expectedCount} verified SRD monsters loaded`);
  await expect(page.locator('#catalogSourceStatus')).toContainText('SRD 5.1');
  await expect(page.locator('#catalogSourceStatus')).toContainText('SRD 5.2.1');

  await page.locator('#monsterRulesFilter').selectOption('5e-2014');
  await page.locator('#monsterSearch').fill('Aboleth');
  const card = page.locator('.monster-option').filter({ hasText: 'Aboleth' }).filter({ hasText: 'SRD 5.1 p. 261' });
  await expect(card).toHaveCount(1);
  await expect(card).toContainText('CC BY 4.0');
  await expect(card).toContainText('AC 17');
  await expect(card).toContainText('HP 135');
  await expect(card).toContainText('Dex 9');
  await card.getByRole('button', { name: 'Add to Encounter' }).click();
  await expect(page.locator('#encounterRoster')).toContainText('SRD 5.1 p. 261');
  await expectNoRuntimeErrors(errors);
});

test('catalog rendering is capped while search still reaches exact records', async ({ page }) => {
  test.skip(process.env.DM_FORGE_LIVE_COMPANIONS !== '1', 'Large-catalog cap is validated against the deployed 642-record export.');
  await page.goto(siteRoute('encounter-forge.html'));
  await expect(page.locator('#catalogSourceStatus')).toContainText('642 verified SRD monsters loaded');
  await expect(page.locator('#catalogResultSummary')).toContainText('Showing the first 120 of');
  await expect(page.locator('.monster-option')).toHaveCount(120);

  await page.locator('#monsterSearch').fill('Adult Black Dragon');
  await page.locator('#monsterRulesFilter').selectOption('5e-2024');
  await expect(page.locator('.monster-option').filter({ hasText: 'Adult Black Dragon' })).toHaveCount(1);
});
