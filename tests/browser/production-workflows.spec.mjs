import { test, expect } from '@playwright/test';
import { clearDmForgeStorage, createCampaign, expectNoRuntimeErrors, preparePage, siteRoute, watchRuntimeErrors } from './helpers.mjs';

const CAMPAIGN = 'Production Gate';

test.beforeEach(async ({ page }) => {
  await preparePage(page);
  await clearDmForgeStorage(page);
});

test('campaign creation persists and campaign-aware links stay scoped', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await createCampaign(page, CAMPAIGN, '2024');

  await expect(page.locator('#openSessionConsole')).toHaveAttribute('href', /session-console\.html\?campaign=Production\+Gate/);
  await expect(page.locator('#openEncounterForge')).toHaveAttribute('href', /encounter-forge\.html\?campaign=Production\+Gate/);

  await page.reload();
  await expect(page.locator('#activeCampaignName')).toHaveText(CAMPAIGN);
  await expect(page.locator('.campaign-card.active')).toContainText(CAMPAIGN);
  await expectNoRuntimeErrors(errors);
});

test('Encounter Forge launches a complete enemy into Session Console and survives reload', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await createCampaign(page, CAMPAIGN, '2024');
  await page.goto(siteRoute(`encounter-forge.html?campaign=${encodeURIComponent(CAMPAIGN)}`));

  await expect(page.locator('#sharedContext')).toContainText(CAMPAIGN);
  await page.locator('#monsterCatalog').getByRole('button', { name: 'Add to Encounter' }).first().click();
  await page.locator('#encounterName').fill('Gate Goblin Ambush');
  await page.locator('#objective').fill('Verify the full encounter handoff.');
  await page.locator('#initiativeMode').selectOption('zero');
  await expect(page.locator('#encounterRoster')).toContainText('Goblin');

  await page.getByRole('button', { name: 'Launch in Session Console' }).click();
  await page.waitForURL(/session-console\.html/);
  await expect(page.locator('#campaignSelect')).toContainText(CAMPAIGN);

  await page.getByRole('button', { name: 'Initiative' }).click();
  await expect(page.locator('#initiativeList')).toContainText('Goblin');
  await expect(page.locator('#initiativeList')).toContainText('15');
  await expect(page.locator('#initiativeList')).toContainText('7');

  await page.reload();
  await page.getByRole('button', { name: 'Initiative' }).click();
  await expect(page.locator('#initiativeList')).toContainText('Goblin');
  await expectNoRuntimeErrors(errors);
});

test('Session Console autosaves prep and restores it after a refresh', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.goto(siteRoute(`session-console.html?campaign=${encodeURIComponent(CAMPAIGN)}`));
  await expect(page.locator('#campaignSelect')).toContainText(CAMPAIGN);

  await page.getByRole('button', { name: 'Session Prep' }).click();
  await page.locator('#sessionTitle').fill('Production Gate Session');
  await page.locator('[data-prep="opening"]').fill('The test begins at the shattered gate.');
  await page.locator('[data-prep="notes"]').fill('Persistence marker: DMFORGE-GATE-001');
  await expect(page.locator('#saveState')).toContainText(/Saved|Saving/);
  await page.waitForTimeout(700);

  await page.reload();
  await page.getByRole('button', { name: 'Session Prep' }).click();
  await expect(page.locator('#sessionTitle')).toHaveValue('Production Gate Session');
  await expect(page.locator('[data-prep="opening"]')).toHaveValue('The test begins at the shattered gate.');
  await expect(page.locator('[data-prep="notes"]')).toHaveValue('Persistence marker: DMFORGE-GATE-001');
  await expectNoRuntimeErrors(errors);
});

test('Magic Item handoff adds a safe reward summary without copying the DM secret', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await createCampaign(page, CAMPAIGN, '2024');
  await page.goto(siteRoute(`magic-items.html?campaign=${encodeURIComponent(CAMPAIGN)}`));

  await page.locator('[name="name"]').fill('Gate Lantern');
  await page.locator('[name="campaign"]').fill(CAMPAIGN);
  await page.locator('[name="owner"]').fill('Wendy');
  await page.locator('[name="secret"]').fill('PRIVATE-GATE-CURSE-DO-NOT-SHARE');
  await page.getByRole('button', { name: 'Save to Library' }).click();

  const card = page.locator('.library-item').filter({ hasText: 'Gate Lantern' });
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: 'Send to Session Rewards' }).click();

  const rewards = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('dmforge-session-console-v1') || 'null');
    return state?.campaigns?.find((campaign) => campaign.name === 'Production Gate')?.session?.prep?.rewards || '';
  });
  expect(rewards).toContain('Gate Lantern');
  expect(rewards).toContain('Wendy');
  expect(rewards).not.toContain('PRIVATE-GATE-CURSE-DO-NOT-SHARE');

  await page.goto(siteRoute(`session-console.html?campaign=${encodeURIComponent(CAMPAIGN)}`));
  await page.getByRole('button', { name: 'Session Prep' }).click();
  await expect(page.locator('[data-prep="rewards"]')).toHaveValue(/Gate Lantern/);
  await expect(page.locator('[data-prep="rewards"]')).not.toHaveValue(/PRIVATE-GATE-CURSE-DO-NOT-SHARE/);
  await expectNoRuntimeErrors(errors);
});

test('local recovery points restore an earlier campaign version and preserve the current version first', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await createCampaign(page, CAMPAIGN, '2024');
  await page.goto(siteRoute('backup-center.html'));
  await expect(page.locator('#recoveryStatus')).toHaveText('Healthy');
  await expect.poll(() => page.locator('.recovery-card').count()).toBeGreaterThanOrEqual(1);
  const automaticCount = await page.locator('.recovery-card').count();

  await page.getByRole('button', { name: 'Save Recovery Point' }).click();
  await expect.poll(() => page.locator('.recovery-card').count()).toBeGreaterThanOrEqual(automaticCount + 1);
  await expect(page.locator('.recovery-card').first()).toContainText('Manual recovery point');

  await page.evaluate(() => {
    const store = JSON.parse(localStorage.getItem('dmforge-shared-v1'));
    store.campaigns[0].name = 'Changed After Recovery Point';
    localStorage.setItem('dmforge-shared-v1', JSON.stringify(store));
  });

  page.on('dialog', (dialog) => dialog.accept());
  await Promise.all([
    page.waitForNavigation(),
    page.locator('.recovery-card').first().getByRole('button', { name: 'Restore' }).click()
  ]);

  const restoredName = await page.evaluate(() => JSON.parse(localStorage.getItem('dmforge-shared-v1')).campaigns[0].name);
  expect(restoredName).toBe(CAMPAIGN);
  await expect(page.locator('.recovery-card').filter({ hasText: 'Before restoring an earlier version' })).toHaveCount(1);
  await expectNoRuntimeErrors(errors);
});

test('Safety Copy download, validation, and restore recover recognized campaign data', async ({ page }, testInfo) => {
  const errors = watchRuntimeErrors(page);
  await createCampaign(page, CAMPAIGN, '2024');
  await page.goto(siteRoute('backup-center.html'));
  await expect(page.locator('#recoveryStatus')).toHaveText('Healthy');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download Safety Copy' }).click()
  ]);
  const backupPath = testInfo.outputPath('dm-forge-safety-copy.json');
  await download.saveAs(backupPath);

  await page.evaluate(() => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('dmforge-') || key.startsWith('cleric-box-')) localStorage.removeItem(key);
    }
  });
  await page.reload();
  await expect(page.locator('#backupHeadline')).toContainText('No DM Forge campaign data');

  await page.locator('#importBackup').setInputFiles(backupPath);
  await expect(page.locator('#importPanel')).toBeVisible();
  await page.locator('#confirmRestore').check();
  await expect(page.locator('#applyImport')).toBeEnabled();
  page.on('dialog', (dialog) => dialog.accept());
  await Promise.all([
    page.waitForNavigation(),
    page.locator('#applyImport').click()
  ]);

  await expect.poll(() => page.evaluate(() => Boolean(localStorage.getItem('dmforge-shared-v1')))).toBe(true);
  await page.goto(siteRoute('campaigns.html'));
  await expect(page.locator('#activeCampaignName')).toHaveText(CAMPAIGN);
  await expectNoRuntimeErrors(errors);
});
