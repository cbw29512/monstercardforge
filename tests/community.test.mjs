import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

const communityFiles = [
  'community.html',
  'CODE_OF_CONDUCT.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'docs/COMMUNITY_GOVERNANCE.md',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/ISSUE_TEMPLATE/bug_report.yml',
  '.github/ISSUE_TEMPLATE/feature_request.yml',
  '.github/ISSUE_TEMPLATE/new_tool_request.yml',
  '.github/ISSUE_TEMPLATE/rules_correction.yml'
];

const requestTemplates = [
  'bug_report.yml',
  'feature_request.yml',
  'new_tool_request.yml',
  'rules_correction.yml'
];

test('community governance and request files exist', () => {
  for (const file of communityFiles) assert.equal(existsSync(join(root, file)), true, `Missing ${file}`);
});

test('community page is public, discoverable, and connected to the canonical design system', () => {
  const page = read('community.html');
  const sitemap = read('sitemap.xml');
  assert.match(page, /<title>DM Forge Community Forum and Requests<\/title>/);
  assert.match(page, /<meta name="description" content="[^"]{70,180}">/);
  assert.equal(page.includes('<link rel="canonical" href="https://cbw29512.github.io/monstercardforge/community.html">'), true);
  assert.equal(page.includes('shared/design-system.css'), true);
  assert.match(page, /<h1>DM Forge Community<\/h1>/);
  assert.equal(page.includes('https://github.com/cbw29512/monstercardforge/discussions'), true);
  assert.equal(sitemap.includes('<loc>https://cbw29512.github.io/monstercardforge/community.html</loc>'), true);
});

test('community page exposes every structured request path', () => {
  const page = read('community.html');
  for (const template of requestTemplates) {
    assert.equal(page.includes(`issues/new?template=${template}`), true, `Community page is missing ${template}`);
  }
  for (const phrase of ['Feature Request', 'New Tool Proposal', 'Bug Report', 'Rules Correction', 'How an idea becomes part of DM Forge']) {
    assert.equal(page.includes(phrase), true, `Community page is missing ${phrase}`);
  }
});

test('issue chooser routes conversation to the forum and blocks unstructured blank issues', () => {
  const config = read('.github/ISSUE_TEMPLATE/config.yml');
  assert.match(config, /blank_issues_enabled:\s*false/);
  assert.equal(config.includes('monstercardforge/discussions'), true);
  assert.equal(config.includes('community.html'), true);
  assert.equal(config.includes('about.html'), true);
});

test('structured issue forms collect actionable information and conduct agreement', () => {
  for (const template of requestTemplates) {
    const form = read(`.github/ISSUE_TEMPLATE/${template}`);
    assert.match(form, /^name:/m, `${template} lacks a name`);
    assert.match(form, /^description:/m, `${template} lacks a description`);
    assert.match(form, /^body:/m, `${template} lacks a body`);
    assert.equal(form.includes('required: true'), true, `${template} has no required fields`);
    assert.equal(form.includes('Code of Conduct'), true, `${template} lacks conduct agreement`);
  }
  const rules = read('.github/ISSUE_TEMPLATE/rules_correction.yml');
  assert.equal(rules.includes('Official source URL'), true);
  assert.equal(rules.includes('exact edition'), true);
  assert.equal(rules.includes('primary official or licensed SRD source'), true);
});

test('homepage promotes community, methodology, maintainer identity, and current analytics decision', () => {
  const page = read('index.html');
  assert.equal(page.includes('community.html'), true);
  assert.equal(page.includes('about.html'), true);
  assert.equal(page.includes('Maintained by'), true);
  assert.equal(page.includes('cbw29512'), true);
  assert.equal(page.includes('No analytics currently installed'), true);
});

test('no analytics provider is installed on the public homepage or community page', () => {
  const publicMarkup = `${read('index.html')}\n${read('community.html')}`.toLowerCase();
  for (const marker of ['googletagmanager', 'google-analytics', 'plausible.io/js', 'umami.is/script', 'cloudflareinsights']) {
    assert.equal(publicMarkup.includes(marker), false, `Unexpected analytics marker ${marker}`);
  }
});
