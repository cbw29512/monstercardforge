import { test, expect } from '@playwright/test';
import { clearDmForgeStorage, createCampaign, expectNoRuntimeErrors, preparePage, watchRuntimeErrors } from './helpers.mjs';

const CAMPAIGN = 'Privacy Gate';

test.beforeEach(async ({ page }) => {
  await preparePage(page);
  await clearDmForgeStorage(page);
  await createCampaign(page, CAMPAIGN, '2024');
});

test('NPC Forge sends useful roleplay context without copying secrets into Session Console or shared summaries', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.goto(`/npc-forge.html?campaign=${encodeURIComponent(CAMPAIGN)}`);
  await page.locator('[name="name"]').fill('Keeper Sable');
  await page.locator('[name="campaign"]').fill(CAMPAIGN);
  await page.locator('[name="role"]').fill('Gate archivist');
  await page.locator('[name="mannerism"]').fill('Counts every spoken promise');
  await page.locator('[name="motive"]').fill('Protect the sealed registry');
  await page.locator('[name="secret"]').fill('NPC-PRIVATE-SECRET-MARKER');
  await page.locator('[name="lie"]').fill('NPC-PRIVATE-LIE-MARKER');
  await page.locator('[name="combatNotes"]').fill('NPC-PRIVATE-COMBAT-MARKER');
  await page.getByRole('button', { name: 'Save NPC' }).click();

  const card = page.locator('.library-item').filter({ hasText: 'Keeper Sable' });
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: 'Send to Session NPCs' }).click();

  const result = await page.evaluate(() => {
    const sessions = JSON.parse(localStorage.getItem('dmforge-session-console-v1') || 'null');
    const shared = localStorage.getItem('dmforge-shared-v1') || '';
    const campaign = sessions?.campaigns?.find((entry) => entry.name === 'Privacy Gate');
    return { npcPrep: campaign?.session?.prep?.npcs || '', shared };
  });

  expect(result.npcPrep).toContain('Keeper Sable');
  expect(result.npcPrep).toContain('Counts every spoken promise');
  expect(result.npcPrep).toContain('Protect the sealed registry');
  expect(result.npcPrep).not.toContain('NPC-PRIVATE-SECRET-MARKER');
  expect(result.npcPrep).not.toContain('NPC-PRIVATE-LIE-MARKER');
  expect(result.npcPrep).not.toContain('NPC-PRIVATE-COMBAT-MARKER');
  expect(result.shared).not.toContain('NPC-PRIVATE-SECRET-MARKER');
  expect(result.shared).not.toContain('Protect the sealed registry');
  await expectNoRuntimeErrors(errors);
});

test('Loot Forge transfers rewards and unidentified placeholders without leaking DM notes or overwriting edited items', async ({ page }) => {
  const errors = watchRuntimeErrors(page);
  await page.goto(`/loot-forge.html?campaign=${encodeURIComponent(CAMPAIGN)}`);
  await page.locator('[name="title"]').fill('Privacy Gate Cache');
  await page.locator('[name="campaign"]').fill(CAMPAIGN);
  await page.locator('[name="valuables"]').fill('One moonstone brooch');
  await page.locator('[name="mundaneItems"]').fill('A brass key');
  await page.locator('[name="magicItems"]').fill('Lantern of the Quiet Gate');
  await page.locator('[name="clues"]').fill('The seal matches the old archive.');
  await page.locator('[name="dmNotes"]').fill('LOOT-PRIVATE-DM-MARKER');
  await page.getByRole('button', { name: 'Save Parcel' }).click();
  await page.getByRole('button', { name: 'Send to Session Rewards' }).click();
  await page.getByRole('button', { name: 'Send Magic Items to Forge' }).click();

  let snapshot = await page.evaluate(() => ({
    sessions: localStorage.getItem('dmforge-session-console-v1') || '',
    items: JSON.parse(localStorage.getItem('dmforge-magic-items-v2') || '[]'),
    shared: localStorage.getItem('dmforge-shared-v1') || ''
  }));
  const placeholder = snapshot.items.find((item) => item.name === 'Lantern of the Quiet Gate');

  expect(snapshot.sessions).toContain('Privacy Gate Cache');
  expect(snapshot.sessions).toContain('Lantern of the Quiet Gate');
  expect(snapshot.sessions).not.toContain('LOOT-PRIVATE-DM-MARKER');
  expect(snapshot.shared).not.toContain('LOOT-PRIVATE-DM-MARKER');
  expect(placeholder?.identification).toBe('unidentified');
  expect(placeholder?.properties).toBe('');
  expect(placeholder?.secret).not.toContain('LOOT-PRIVATE-DM-MARKER');

  await page.evaluate((id) => {
    const items = JSON.parse(localStorage.getItem('dmforge-magic-items-v2') || '[]');
    const item = items.find((entry) => entry.id === id);
    item.properties = 'DM EDIT PRESERVED';
    item.secret = 'DM SECRET PRESERVED';
    localStorage.setItem('dmforge-magic-items-v2', JSON.stringify(items));
  }, placeholder.id);
  await page.getByRole('button', { name: 'Send Magic Items to Forge' }).click();

  snapshot = await page.evaluate(() => JSON.parse(localStorage.getItem('dmforge-magic-items-v2') || '[]'));
  const preserved = snapshot.find((item) => item.name === 'Lantern of the Quiet Gate');
  expect(preserved.properties).toBe('DM EDIT PRESERVED');
  expect(preserved.secret).toBe('DM SECRET PRESERVED');
  await expectNoRuntimeErrors(errors);
});
