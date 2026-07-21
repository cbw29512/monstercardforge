export const CR_XP = Object.freeze({
  '0': 10, '1/8': 25, '1/4': 50, '1/2': 100,
  '1': 200, '2': 450, '3': 700, '4': 1100, '5': 1800,
  '6': 2300, '7': 2900, '8': 3900, '9': 5000, '10': 5900,
  '11': 7200, '12': 8400, '13': 10000, '14': 11500, '15': 13000,
  '16': 15000, '17': 18000, '18': 20000, '19': 22000, '20': 25000,
  '21': 33000, '22': 41000, '23': 50000, '24': 62000, '25': 75000,
  '26': 90000, '27': 105000, '28': 120000, '29': 135000, '30': 155000
});

export const CR_OPTIONS = Object.freeze(Object.keys(CR_XP));

export const THRESHOLDS_2014 = Object.freeze({
  1:[25,50,75,100],2:[50,100,150,200],3:[75,150,225,400],4:[125,250,375,500],
  5:[250,500,750,1100],6:[300,600,900,1400],7:[350,750,1100,1700],8:[450,900,1400,2100],
  9:[550,1100,1600,2400],10:[600,1200,1900,2800],11:[800,1600,2400,3600],12:[1000,2000,3000,4500],
  13:[1100,2200,3400,5100],14:[1250,2500,3800,5700],15:[1400,2800,4300,6400],16:[1600,3200,4800,7200],
  17:[2000,3900,5900,8800],18:[2100,4200,6300,9500],19:[2400,4900,7300,10900],20:[2800,5700,8500,12700]
});

export const BUDGETS_2024 = Object.freeze({
  1:[50,75,100],2:[100,150,200],3:[150,225,400],4:[250,375,500],5:[500,750,1100],
  6:[600,1000,1400],7:[750,1300,1700],8:[1000,1700,2100],9:[1300,2000,2600],10:[1600,2300,3100],
  11:[1900,2900,4100],12:[2200,3700,4700],13:[2600,4200,5400],14:[2900,4900,6200],15:[3300,5400,7800],
  16:[3800,6100,9800],17:[4500,7200,11700],18:[5000,8700,14200],19:[5500,10700,17200],20:[6400,13200,22000]
});

const MULTIPLIERS = Object.freeze([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]);

export function normalizeLevel(value) {
  return Math.max(1, Math.min(20, Number(value) || 1));
}

export function numericCr(value) {
  const text = String(value ?? '0').trim();
  if (text.includes('/')) {
    const [numerator, denominator] = text.split('/').map(Number);
    return denominator ? numerator / denominator : 0;
  }
  return Number(text) || 0;
}

export function xpForCr(cr) {
  return CR_XP[String(cr)] ?? 0;
}

export function totalMonsterCount(monsters = []) {
  return monsters.reduce((total, monster) => total + Math.max(0, Number(monster.quantity) || 0), 0);
}

export function rawMonsterXp(monsters = []) {
  return monsters.reduce((total, monster) => total + (Math.max(0, Number(monster.quantity) || 0) * Math.max(0, Number(monster.xp) || xpForCr(monster.cr))), 0);
}

export function multiplier2014(monsterCount, partySize) {
  let index;
  if (monsterCount <= 0) return 1;
  if (monsterCount === 1) index = 1;
  else if (monsterCount === 2) index = 2;
  else if (monsterCount <= 6) index = 3;
  else if (monsterCount <= 10) index = 4;
  else if (monsterCount <= 14) index = 5;
  else index = 6;
  if (partySize < 3) index += 1;
  else if (partySize >= 6) index -= 1;
  return MULTIPLIERS[Math.max(0, Math.min(MULTIPLIERS.length - 1, index))];
}

export function partyThresholds2014(characters = []) {
  return characters.reduce((totals, character) => {
    const row = THRESHOLDS_2014[normalizeLevel(character.level)];
    return totals.map((value, index) => value + row[index]);
  }, [0, 0, 0, 0]);
}

export function partyBudgets2024(characters = []) {
  return characters.reduce((totals, character) => {
    const row = BUDGETS_2024[normalizeLevel(character.level)];
    return totals.map((value, index) => value + row[index]);
  }, [0, 0, 0]);
}

export function averagePartyLevel(characters = []) {
  if (!characters.length) return 0;
  return characters.reduce((sum, character) => sum + normalizeLevel(character.level), 0) / characters.length;
}

export function difficulty2014(adjustedXp, thresholds) {
  const [easy, medium, hard, deadly] = thresholds;
  if (adjustedXp <= 0) return 'Empty';
  if (adjustedXp < easy) return 'Trivial';
  if (adjustedXp < medium) return 'Easy';
  if (adjustedXp < hard) return 'Medium';
  if (adjustedXp < deadly) return 'Hard';
  return 'Deadly';
}

export function difficulty2024(rawXp, budgets) {
  const [low, moderate, high] = budgets;
  if (rawXp <= 0) return 'Empty';
  if (rawXp < low) return 'Below Low';
  if (rawXp < moderate) return 'Low';
  if (rawXp < high) return 'Moderate';
  return 'High';
}

function crWarnings(characters, monsters) {
  if (!characters.length || !monsters.length) return [];
  const average = averagePartyLevel(characters);
  const dangerous = monsters.filter((monster) => Number(monster.quantity) > 0 && numericCr(monster.cr) > average);
  if (!dangerous.length) return [];
  return [`${dangerous.map((monster) => monster.name).join(', ')} ${dangerous.length === 1 ? 'has' : 'have'} a CR above the party's average level (${average.toFixed(1)}). A single action may overwhelm a weaker character.`];
}

export function evaluateEncounter({ ruleset = '2024', characters = [], monsters = [] } = {}) {
  const party = characters.filter((character) => character && Number(character.level) >= 1);
  const roster = monsters.filter((monster) => monster && Number(monster.quantity) > 0);
  const monsterCount = totalMonsterCount(roster);
  const rawXp = rawMonsterXp(roster);
  const warnings = [];
  if (!party.length) warnings.push('Add at least one character before trusting the difficulty result.');
  if (!roster.length) warnings.push('Add at least one monster to build an encounter.');
  warnings.push(...crWarnings(party, roster));

  if (String(ruleset) === '2014') {
    const thresholds = partyThresholds2014(party);
    const multiplier = multiplier2014(monsterCount, party.length);
    const adjustedXp = Math.round(rawXp * multiplier);
    const crValues = roster.map((monster) => numericCr(monster.cr));
    if (crValues.length > 1 && Math.max(...crValues) - Math.min(...crValues) >= 5) {
      warnings.push('The 2014 rules allow the DM to ignore creatures far below the group’s average CR when those creatures do not materially affect the fight. Encounter Forge currently counts every creature.');
    }
    return {
      ruleset: '2014', labels: ['Easy', 'Medium', 'Hard', 'Deadly'], thresholds,
      rawXp, adjustedXp, multiplier, monsterCount,
      difficulty: difficulty2014(adjustedXp, thresholds), warnings,
      remaining: {
        easy: thresholds[0] - adjustedXp,
        medium: thresholds[1] - adjustedXp,
        hard: thresholds[2] - adjustedXp,
        deadly: thresholds[3] - adjustedXp
      }
    };
  }

  const thresholds = partyBudgets2024(party);
  const uniqueStatBlocks = new Set(roster.map((monster) => monster.sourceId || `${monster.name}|${monster.cr}`)).size;
  if (party.length && monsterCount > party.length * 2) warnings.push('This encounter has more than two creatures per character. The 2024 guidance recommends using fragile creatures that can be defeated quickly.');
  if (uniqueStatBlocks > 3) warnings.push(`This encounter uses ${uniqueStatBlocks} different stat blocks. The 2024 guidance warns that more than two or three complex stat blocks can be difficult to run.`);
  return {
    ruleset: '2024', labels: ['Low', 'Moderate', 'High'], thresholds,
    rawXp, adjustedXp: rawXp, multiplier: 1, monsterCount,
    difficulty: difficulty2024(rawXp, thresholds), warnings,
    remaining: { low: thresholds[0] - rawXp, moderate: thresholds[1] - rawXp, high: thresholds[2] - rawXp }
  };
}

export const RULES_VERIFICATION = Object.freeze({
  verifiedAt: '2026-07-22',
  sources: {
    '2014': 'D&D Beyond Basic Rules (2014), Building Combat Encounters',
    '2024': 'D&D Beyond Basic Rules (2024), DM’s Toolbox',
    xp: 'D&D Beyond Basic Rules, Experience Points by Challenge Rating'
  }
});
