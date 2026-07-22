import { expect } from '@playwright/test';

const monsterCatalogFixture = {
  schemaVersion: 1,
  generatedBy: 'playwright-fixture',
  recordCount: 2,
  sources: [
    {
      edition: 'srd-5.1-2014', version: '5.1', pdfUrl: 'https://example.test/srd-5.1.pdf',
      sha256: 'a'.repeat(64), attribution: 'SRD 5.1 Creative Commons Attribution 4.0.', monsterCount: 1, license: 'CC BY 4.0'
    },
    {
      edition: 'srd-5.2.1-2024', version: '5.2.1', pdfUrl: 'https://example.test/srd-5.2.1.pdf',
      sha256: 'b'.repeat(64), attribution: 'SRD 5.2.1 Creative Commons Attribution 4.0.', monsterCount: 1, license: 'CC BY 4.0'
    }
  ],
  monsters: [
    {
      id: 'srd-5.1-2014-monster-aboleth', ruleset: '2014', edition: 'srd-5.1-2014', sourceVersion: '5.1',
      name: 'Aboleth', size: 'Large', type: 'aberration', alignment: 'lawful evil', armorClass: 17,
      armorClassText: '17 (natural armor)', hitPoints: 135, hitPointsText: '135 (18d10 + 36)', speed: '10 ft., swim 40 ft.',
      challengeRating: '10', xp: 5900, dexterity: 9, dexterityModifier: -1, legendary: true,
      sourcePage: 261, sourceReference: 'SRD 5.1 p. 261'
    },
    {
      id: 'srd-5.2.1-2024-monster-adult-black-dragon', ruleset: '2024', edition: 'srd-5.2.1-2024', sourceVersion: '5.2.1',
      name: 'Adult Black Dragon', size: 'Huge', type: 'dragon', alignment: 'chaotic evil', armorClass: 19,
      armorClassText: '19', hitPoints: 195, hitPointsText: '195 (17d12 + 85)', speed: '40 ft., Fly 80 ft., Swim 40 ft.',
      challengeRating: '14', xp: 11500, dexterity: 14, dexterityModifier: 2, legendary: true,
      sourcePage: 274, sourceReference: 'SRD 5.2.1 p. 274'
    }
  ]
};

export function siteRoute(path = 'index.html') {
  const normalized = String(path || 'index.html').replace(/^\/+/, '');
  return normalized || 'index.html';
}

export async function preparePage(page) {
  await page.addInitScript(() => {
    class FakeConnection {
      constructor() {
        this.open = true;
        this.handlers = new Map();
        queueMicrotask(() => this.emit('open'));
      }
      on(name, callback) {
        const listeners = this.handlers.get(name) || [];
        listeners.push(callback);
        this.handlers.set(name, listeners);
        return this;
      }
      emit(name, ...args) {
        for (const callback of this.handlers.get(name) || []) callback(...args);
      }
      send() {}
      close() { this.open = false; this.emit('close'); }
    }

    class FakePeer {
      constructor(id) {
        this.id = id || `test-peer-${Math.random().toString(16).slice(2)}`;
        this.handlers = new Map();
        queueMicrotask(() => this.emit('open', this.id));
      }
      on(name, callback) {
        const listeners = this.handlers.get(name) || [];
        listeners.push(callback);
        this.handlers.set(name, listeners);
        return this;
      }
      emit(name, ...args) {
        for (const callback of this.handlers.get(name) || []) callback(...args);
      }
      connect() { return new FakeConnection(); }
      destroy() { this.emit('close'); }
    }

    globalThis.Peer = globalThis.Peer || FakePeer;
  });

  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
  await page.route('https://cdn.jsdelivr.net/npm/peerjs@*/dist/peerjs.min.js', (route) => route.fulfill({
    status: 200,
    contentType: 'text/javascript; charset=utf-8',
    body: '/* PeerJS is replaced by the deterministic Playwright test double. */'
  }));

  if (process.env.DM_FORGE_LIVE_COMPANIONS !== '1') {
    await page.route('https://cbw29512.github.io/DungeonCards/dm-forge/srd-monster-summaries.json*', (route) => route.fulfill({
      status: 200,
      contentType: 'application/json; charset=utf-8',
      body: JSON.stringify(monsterCatalogFixture)
    }));
  }
}

export function watchRuntimeErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (/favicon|ERR_FAILED|Failed to load resource/i.test(text)) return;
    errors.push(`console: ${text}`);
  });
  return errors;
}

export async function clearDmForgeStorage(page) {
  await page.goto(siteRoute('index.html'));
  await page.evaluate(() => localStorage.clear());
}

export async function createCampaign(page, name = 'Production Gate', ruleset = '2024') {
  await page.goto(siteRoute('campaigns.html'));
  await page.locator('#campaignName').fill(name);
  await page.locator('#campaignRuleset').selectOption(ruleset);
  await page.locator('#campaignForm').getByRole('button', { name: 'Create and Make Active' }).click();
  await expect(page.locator('#activeCampaignName')).toHaveText(name);
}

export async function expectNoRuntimeErrors(errors) {
  await expect.poll(() => errors, { message: errors.join('\n') }).toEqual([]);
}
