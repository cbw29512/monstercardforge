import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

const requiredFiles = [
  'playwright.config.mjs',
  'tests/browser/server.mjs',
  'tests/browser/helpers.mjs',
  'tests/browser/production-workflows.spec.mjs',
  'tests/browser/cross-tool-privacy.spec.mjs',
  'tests/browser/public-smoke.spec.mjs',
  'tests/browser/accessibility.spec.mjs',
  'shared/recovery-manager.js',
  '.github/workflows/production-readiness.yml',
  '.github/workflows/live-site-readiness.yml',
  'docs/PRODUCTION_READINESS_GATE.md'
];

test('production-readiness gate files remain present', () => {
  for (const file of requiredFiles) assert.equal(existsSync(join(root, file)), true, `Missing production gate file ${file}`);
});

test('package scripts and browser dependencies remain exact and explicit', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['test:static'], 'node --test tests/*.test.mjs');
  assert.equal(pkg.scripts['test:browser'], 'playwright test');
  assert.equal(pkg.scripts['test:production'], 'npm run test:static && npm run test:browser');
  assert.match(pkg.devDependencies['@playwright/test'], /^\d+\.\d+\.\d+$/);
  assert.match(pkg.devDependencies['@axe-core/playwright'], /^\d+\.\d+\.\d+$/);
});

test('browser configuration retains desktop, Android, and iPhone coverage with failure evidence', () => {
  const config = read('playwright.config.mjs');
  for (const requirement of ['Desktop Chrome', 'Pixel 7', 'iPhone 15', "trace: 'retain-on-failure'", "screenshot: 'only-on-failure'", "video: 'retain-on-failure'"]) {
    assert.equal(config.includes(requirement), true, `Playwright config lost ${requirement}`);
  }
});

test('production workflow is blocking and preserves diagnostic artifacts', () => {
  const workflow = read('.github/workflows/production-readiness.yml');
  for (const requirement of ['npm run test:static', 'playwright install --with-deps chromium webkit', 'npm run test:browser', 'actions/upload-artifact@v4', 'playwright-report/', 'test-results/']) {
    assert.equal(workflow.includes(requirement), true, `Production workflow lost ${requirement}`);
  }
  assert.equal(workflow.includes('continue-on-error: true'), false, 'Production workflow must not silently pass browser failures');
});

test('real user workflows and privacy boundaries remain covered', () => {
  const workflows = read('tests/browser/production-workflows.spec.mjs');
  const privacy = read('tests/browser/cross-tool-privacy.spec.mjs');
  for (const phrase of ['campaign creation persists', 'Encounter Forge launches', 'autosaves prep', 'Magic Item handoff', 'local recovery points restore', 'Safety Copy download']) {
    assert.equal(workflows.includes(phrase), true, `Workflow suite lost ${phrase}`);
  }
  for (const phrase of ['NPC Forge sends useful roleplay context', 'Loot Forge transfers rewards', 'NPC-PRIVATE-SECRET-MARKER', 'LOOT-PRIVATE-DM-MARKER', 'DM EDIT PRESERVED']) {
    assert.equal(privacy.includes(phrase), true, `Privacy suite lost ${phrase}`);
  }
});
