import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function idsFromHtml(html) {
  return new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
}

function referencedIds(script) {
  return new Set([...script.matchAll(/getElementById\(["']([^"']+)["']\)/g)].map((match) => match[1]));
}

for (const tool of [
  { name: 'NPC Forge', html: 'npc-forge.html', scripts: ['npc-forge.js', 'shared/npc-forge-hardening.js'] },
  { name: 'Loot Forge', html: 'loot-forge.html', scripts: ['loot-forge.js'] }
]) {
  test(`${tool.name} JavaScript IDs exist in its HTML`, () => {
    const html = readFileSync(join(root, tool.html), 'utf8');
    const ids = idsFromHtml(html);
    const missing = [];
    for (const scriptPath of tool.scripts) {
      const script = readFileSync(join(root, scriptPath), 'utf8');
      for (const id of referencedIds(script)) if (!ids.has(id)) missing.push(`${scriptPath}: #${id}`);
    }
    assert.deepEqual(missing, []);
  });
}

test('new tool forms retain every named field used by their data models', () => {
  const npcHtml = readFileSync(join(root, 'npc-forge.html'), 'utf8');
  const lootHtml = readFileSync(join(root, 'loot-forge.html'), 'utf8');
  for (const name of ['name','campaign','role','faction','mannerism','motive','secret','relationships','combatNotes']) assert.match(npcHtml, new RegExp(`name=["']${name}["']`), `NPC Forge is missing ${name}`);
  for (const name of ['title','campaign','status','tier','cp','sp','ep','gp','pp','valuables','mundaneItems','magicItems','clues','dmNotes']) assert.match(lootHtml, new RegExp(`name=["']${name}["']`), `Loot Forge is missing ${name}`);
});
