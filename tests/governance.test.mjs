import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const baseUrl = 'https://cbw29512.github.io/monstercardforge/';
const publicPages = [
  'index.html',
  'about.html',
  'campaigns.html',
  'campaign-search.html',
  'session-console.html',
  'encounter-forge.html',
  'player-display.html',
  'monster-cards.html',
  'magic-items.html',
  'npc-forge.html',
  'loot-forge.html',
  'backup-center.html'
];

function content(path) {
  return readFileSync(join(root, path), 'utf8');
}

function capture(html, pattern, label) {
  const match = html.match(pattern);
  assert.ok(match?.[1]?.trim(), `Missing ${label}`);
  return match[1].trim();
}

function canonicalFor(page) {
  return page === 'index.html' ? baseUrl : `${baseUrl}${page}`;
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
}

function luminance(hex) {
  const channels = hexToRgb(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('every public page has unique search metadata and a stable canonical URL', () => {
  const titles = new Set();
  const descriptions = new Set();

  for (const page of publicPages) {
    const html = content(page);
    const title = capture(html, /<title>([^<]+)<\/title>/i, `${page} title`);
    const description = capture(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i, `${page} description`);
    const canonical = capture(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i, `${page} canonical`);
    assert.match(html, /<meta\s+name=["']robots["']/i, `${page} lacks a robots directive`);
    assert.match(html, /<h1(?:\s|>)/i, `${page} lacks an H1`);
    assert.equal(canonical, canonicalFor(page), `${page} has an unexpected canonical URL`);
    assert.ok(title.length <= 65, `${page} title is longer than 65 characters`);
    assert.ok(description.length >= 70 && description.length <= 180, `${page} description should be 70–180 characters`);
    assert.equal(titles.has(title), false, `Duplicate title: ${title}`);
    assert.equal(descriptions.has(description), false, `Duplicate description: ${description}`);
    titles.add(title);
    descriptions.add(description);
  }
});

test('sitemap and robots cover every public route', () => {
  const sitemap = content('sitemap.xml');
  const robots = content('robots.txt');
  for (const page of publicPages) assert.equal(sitemap.includes(`<loc>${canonicalFor(page)}</loc>`), true, `Sitemap missing ${page}`);
  assert.equal(robots.includes(`${baseUrl}sitemap.xml`), true);
});

test('every public page receives the canonical design system', () => {
  for (const page of publicPages) {
    const html = content(page);
    const direct = html.includes('shared/design-system.css');
    const throughStore = html.includes('shared/dmforge-store.js');
    assert.equal(direct || throughStore, true, `${page} does not load the design system`);
  }
});

test('design system retains canonical type, control, focus, and motion contracts', () => {
  const css = content('shared/design-system.css');
  for (const requirement of [
    '--font-display:', '--font-ui:', '--font-editorial:', '--dm-bg:', '--dm-surface:', '--dm-text:',
    '--dm-brand:', '--dm-gold:', '--dm-info:', '--dm-success:', '--dm-focus:', 'min-height: 44px',
    ':focus-visible', 'prefers-reduced-motion', 'safe-area-inset-left', 'family=Cinzel'
  ]) assert.equal(css.includes(requirement), true, `Design system missing ${requirement}`);
});

test('canonical text/background pairs meet WCAG AA contrast', () => {
  const pairs = [
    ['#24170f', '#fff9e8', 4.5],
    ['#665346', '#fff9e8', 4.5],
    ['#fff8e7', '#7b2e25', 4.5],
    ['#fff8e7', '#315c72', 4.5],
    ['#fff8e7', '#446a45', 4.5],
    ['#24170f', '#b98935', 4.5],
    ['#fff8e7', '#8a2e26', 4.5]
  ];
  for (const [foreground, background, minimum] of pairs) {
    assert.ok(contrast(foreground, background) >= minimum, `${foreground} on ${background} fails ${minimum}:1`);
  }
});

test('rules ledger references known primary sources and valid verification dates', () => {
  const ledger = JSON.parse(content('rules/rules-sources.json'));
  assert.equal(ledger.schemaVersion, 1);
  const sourceIds = new Set(Object.keys(ledger.sources));
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  for (const component of ledger.components) {
    assert.ok(component.id, 'Rules component lacks an id');
    assert.ok(component.status, `${component.id} lacks a status`);
    for (const sourceId of component.sourceIds || []) assert.equal(sourceIds.has(sourceId), true, `${component.id} uses unknown source ${sourceId}`);
    if (component.status.startsWith('verified')) {
      assert.ok(component.verifiedAt, `${component.id} is verified without a date`);
      assert.ok((component.sourceIds || []).length > 0, `${component.id} is verified without a source`);
    }
    if (component.verifiedAt) {
      const date = new Date(`${component.verifiedAt}T23:59:59Z`);
      assert.equal(Number.isNaN(date.getTime()), false, `${component.id} has an invalid verification date`);
      assert.ok(date <= today, `${component.id} has a future verification date`);
    }
  }
});

test('verified rules components declare scope rather than implying total coverage', () => {
  const ledger = JSON.parse(content('rules/rules-sources.json'));
  const monsters = ledger.components.find((component) => component.id === 'monster-card-samples');
  const cleric = ledger.components.find((component) => component.id === 'cleric-automatic-effects');
  assert.match(monsters.notes.join(' '), /base SRD stat-block/i);
  assert.match(monsters.notes.join(' '), /lair actions and regional effects are deliberately excluded/i);
  assert.match(cleric.notes.join(' '), /currently represented/i);
  assert.match(cleric.notes.join(' '), /base level/i);
});

test('methodology page exposes rules, privacy, accessibility, and limitations', () => {
  const page = content('about.html');
  for (const phrase of ['Rules methodology', 'Privacy model', 'Design and accessibility', 'Testing and change control', 'Known boundaries']) {
    assert.equal(page.includes(phrase), true, `About page is missing ${phrase}`);
  }
  assert.equal(page.includes('not an official Wizards of the Coast product'), true);
});

test('governance and rollback documents exist', () => {
  for (const file of [
    'docs/DESIGN_SYSTEM.md',
    'docs/SEO_GROWTH_STANDARD.md',
    'docs/RULES_VERIFICATION_LEDGER.md',
    'docs/CHANGE_CONTROL.md',
    'docs/DECISIONS.md',
    'rules/rules-sources.json'
  ]) assert.equal(existsSync(join(root, file)), true, `Missing governance file ${file}`);
});
