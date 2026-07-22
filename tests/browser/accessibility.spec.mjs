import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { preparePage } from './helpers.mjs';

const pages = [
  '/',
  '/community.html',
  '/campaigns.html',
  '/session-console.html',
  '/encounter-forge.html',
  '/magic-items.html',
  '/backup-center.html'
];

test.beforeEach(async ({ page }) => preparePage(page));

for (const route of pages) {
  test(`${route} has no serious or critical automated accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
    const details = blocking.map((violation) => `${violation.id}: ${violation.help}\n${violation.nodes.map((node) => node.target.join(' ')).join('\n')}`).join('\n\n');
    expect(blocking, details).toEqual([]);
  });
}
