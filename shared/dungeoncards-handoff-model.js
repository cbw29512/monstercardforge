export const MAX_HANDOFF_AGE_MS = 15 * 60 * 1000;
export const MAX_HANDOFF_CLOCK_SKEW_MS = 5 * 60 * 1000;
export const MAX_HANDOFF_COMBATANTS = 100;

const cleanText = (value, maximum = 160) => String(value ?? '')
  .replace(/[\u0000-\u001f\u007f]/g, '')
  .trim()
  .slice(0, maximum);

const validRuleset = (value) => value === '2014' || value === '2024';

export function validateDungeonCardsHandoff(payload, now = Date.now()) {
  if (!payload || payload.version !== 1) return { valid: false, issue: 'Unsupported or missing handoff version.' };
  if (!validRuleset(String(payload.ruleset))) return { valid: false, issue: 'The encounter ruleset is invalid.' };
  if (!Array.isArray(payload.monsters) || payload.monsters.length === 0) {
    return { valid: false, issue: 'The encounter contains no monsters.' };
  }
  if (payload.monsters.length > MAX_HANDOFF_COMBATANTS) {
    return { valid: false, issue: 'The encounter contains too many distinct monster records.' };
  }

  const createdAt = Date.parse(payload.createdAt);
  if (!Number.isFinite(createdAt)) return { valid: false, issue: 'The handoff timestamp is invalid.' };
  const age = now - createdAt;
  if (age > MAX_HANDOFF_AGE_MS) return { valid: false, issue: 'The handoff expired.' };
  if (age < -MAX_HANDOFF_CLOCK_SKEW_MS) return { valid: false, issue: 'The handoff timestamp is too far in the future.' };

  let totalCombatants = 0;
  for (const monster of payload.monsters) {
    if (!monster || typeof monster !== 'object') return { valid: false, issue: 'A monster record is malformed.' };
    if (String(monster.ruleset) !== String(payload.ruleset)) {
      return { valid: false, issue: 'A monster record crosses the encounter edition boundary.' };
    }
    if (!cleanText(monster.sourceRecordId, 180) || !cleanText(monster.name, 160)) {
      return { valid: false, issue: 'A monster record is missing source identity.' };
    }
    const quantity = Number(monster.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return { valid: false, issue: 'A monster quantity is invalid.' };
    }
    totalCombatants += quantity;
    if (totalCombatants > MAX_HANDOFF_COMBATANTS) {
      return { valid: false, issue: 'The encounter exceeds the combatant transfer limit.' };
    }
  }

  return { valid: true, issue: '' };
}

const campaignKey = (value) => cleanText(value, 100).toLocaleLowerCase();

export function selectOrCreateEditionProfile(state, campaign, ruleset, options) {
  const profiles = Array.isArray(state?.profiles) ? state.profiles : [];
  const exact = profiles.find((entry) => (
    campaignKey(entry?.campaign) === campaignKey(campaign)
    && String(entry?.ruleset) === String(ruleset)
  ));
  if (exact) {
    exact.campaign = cleanText(campaign, 100) || 'My Campaign';
    exact.updatedAt = options.updatedAt;
    state.activeProfileId = exact.id;
    return { profile: exact, created: false };
  }

  const template = profiles.find((entry) => campaignKey(entry?.campaign) === campaignKey(campaign))
    || profiles.find((entry) => entry?.id === state?.activeProfileId)
    || profiles[0];
  if (!template || !Array.isArray(template.characters) || template.characters.length === 0) {
    throw new Error('Encounter Forge has no complete party profile available for this import.');
  }

  const baseName = cleanText(template.name, 80) || 'Party';
  const created = {
    ...template,
    id: options.createId(),
    campaign: cleanText(campaign, 100) || 'My Campaign',
    name: `${baseName} · ${ruleset}`.slice(0, 120),
    ruleset,
    characters: template.characters.map((character, index) => ({
      ...character,
      id: cleanText(character?.id, 120) || options.createCharacterId(index),
      name: cleanText(character?.name, 80) || `Character ${index + 1}`,
      level: Math.min(20, Math.max(1, Math.trunc(Number(character?.level) || 1)))
    })),
    updatedAt: options.updatedAt
  };
  profiles.push(created);
  state.profiles = profiles;
  state.activeProfileId = created.id;
  return { profile: created, created: true };
}