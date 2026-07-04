export const homebrewSections = [
  {
    id: 'identity',
    title: '1. Identity',
    help: 'These fields create the front cover and basic card filters.',
    fields: [
      { key: 'name', label: 'Monster Name', example: 'Frost Troll' },
      { key: 'cr', label: 'Challenge Rating', example: '8' },
      { key: 'type', label: 'Creature Type', example: 'giant' },
      { key: 'size', label: 'Size', example: 'Large' }
    ]
  },
  {
    id: 'combat',
    title: '2. Combat Summary',
    help: 'These are the numbers a DM checks constantly during combat.',
    fields: [
      { key: 'ac', label: 'Armor Class', example: '15 or 18 (natural armor)' },
      { key: 'hp', label: 'Hit Points', example: '136 (16d10+48)' },
      { key: 'speed', label: 'Speed', example: '30 ft., fly 60 ft.' },
      { key: 'senses', label: 'Senses', example: 'darkvision 60 ft., PP 13' },
      { key: 'languages', label: 'Languages', example: 'Common, Giant' }
    ]
  }
];

export function homebrewChecklist(monster) {
  const warnings = [];
  if (!monster.name) warnings.push('Missing monster name.');
  if (!monster.cr) warnings.push('Missing challenge rating.');
  if (!monster.ac) warnings.push('Missing armor class.');
  if (!monster.hp) warnings.push('Missing hit points.');
  if (!monster.actions || monster.actions.length === 0) warnings.push('Add at least one action so the monster can be run in combat.');
  return warnings;
}
