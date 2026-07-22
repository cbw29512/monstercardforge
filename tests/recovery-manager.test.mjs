import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

const manager = read('shared/recovery-manager.js');
const store = read('shared/dmforge-store.js');
const page = read('backup-center.html');
const application = read('backup-center.js');

test('automatic recovery uses browser IndexedDB and retains a bounded history', () => {
  assert.match(manager, /indexedDB\.open\(DATABASE_NAME/);
  assert.match(manager, /const MAX_SNAPSHOTS = 8/);
  assert.match(manager, /const MAX_SNAPSHOT_BYTES = 25 \* 1024 \* 1024/);
  assert.match(manager, /store\.delete\(record\.id\)/);
  assert.match(manager, /setInterval\(automatic, AUTO_INTERVAL_MS\)/);
});

test('automatic recovery includes only recognized DM Forge and Cleric in a Box records', () => {
  assert.match(manager, /\^dmforge-/);
  assert.match(manager, /\^cleric-box-/);
  assert.match(manager, /dmforge-backup-meta-v1/);
  assert.match(manager, /dmforge-pending-encounter-v1/);
});

test('restoring a recovery point preserves the current version first', () => {
  assert.match(manager, /create\('Before restoring an earlier version', \{ force: true \}\)/);
  assert.match(manager, /localStorage\.removeItem\(key\)/);
  assert.match(manager, /localStorage\.setItem\(key, value\)/);
});

test('connected tools load the shared recovery manager', () => {
  assert.match(store, /shared\/recovery-manager\.js/);
  assert.match(store, /data-dmforge-recovery|dataset\.dmforgeRecovery/);
});

test('Protect My Campaign uses plain-language controls and hides technical details behind Advanced', () => {
  for (const phrase of ['Protect My Campaign', 'Save Recovery Point', 'Download Safety Copy', 'Restore Safety Copy', 'Advanced storage details']) {
    assert.equal(page.includes(phrase), true, `Missing plain-language protection phrase: ${phrase}`);
  }
  assert.match(page, /<details class="panel advanced-panel">/);
  assert.equal(page.includes('Download Full Backup'), false);
  assert.equal(page.includes('Restore Full Backup'), false);
});

test('Safety Copy restore creates a local recovery point before replacing records', () => {
  assert.match(application, /Before restoring a Safety Copy/);
  assert.match(application, /DMForgeRecovery\.create/);
  assert.match(application, /displayName:'DM Forge Safety Copy'/);
});
