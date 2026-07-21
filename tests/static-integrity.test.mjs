import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'monster-cards.html', 'magic-items.html', 'session-console.html'];

function localAssetReferences(html) {
  const references = [];
  for (const pattern of [/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi, /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi]) {
    for (const match of html.matchAll(pattern)) references.push(match[1]);
  }
  return references.filter((reference) => {
    const value = reference.trim();
    return value && !/^(?:https?:|data:|mailto:|tel:|#|\/\/)/i.test(value);
  });
}

function javascriptFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    if (['.git', 'node_modules'].includes(entry)) continue;
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) files.push(...javascriptFiles(fullPath));
    else if (entry.endsWith('.js')) files.push(fullPath);
  }
  return files;
}

test('all primary pages and their local JS/CSS assets exist', () => {
  for (const page of pages) {
    const pagePath = join(root, page);
    assert.equal(existsSync(pagePath), true, `Missing ${page}`);
    const html = readFileSync(pagePath, 'utf8');
    for (const reference of localAssetReferences(html)) {
      const cleanReference = reference.split(/[?#]/, 1)[0];
      const assetPath = normalize(join(dirname(pagePath), cleanReference));
      assert.equal(existsSync(assetPath), true, `${page} references missing local asset ${reference}`);
    }
  }
});

test('every production JavaScript file parses successfully', () => {
  const failures = [];
  for (const file of javascriptFiles(root)) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) failures.push(`${relative(root, file)}\n${result.stderr || result.stdout}`);
  }
  assert.deepEqual(failures, []);
});

test('Magic Item Forge retains overflow detection and continuation printing', () => {
  const script = readFileSync(join(root, 'magic-items.js'), 'utf8');
  const html = readFileSync(join(root, 'magic-items.html'), 'utf8');
  const css = readFileSync(join(root, 'magic-items.css'), 'utf8');

  for (const requirement of ['function cardOverflows', 'function measureFace', 'function continuationHtml', 'function overflowContinuations']) {
    assert.equal(script.includes(requirement), true, `Missing ${requirement}`);
  }
  assert.equal(html.includes('id="fitStatus"'), true);
  assert.equal(html.includes('aria-live="polite"'), true);
  assert.equal(css.includes('.continuation-page'), true);
  assert.equal(css.includes('.fit-status.warning'), true);
});

test('DM Forge homepage links every live tool', () => {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  for (const route of ['session-console.html', 'monster-cards.html', 'magic-items.html', 'https://cbw29512.github.io/healingbox/']) {
    assert.equal(html.includes(route), true, `Homepage is missing ${route}`);
  }
});
