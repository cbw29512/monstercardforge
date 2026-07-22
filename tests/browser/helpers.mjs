import { expect } from '@playwright/test';

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
