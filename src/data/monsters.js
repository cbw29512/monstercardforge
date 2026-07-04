export const monsters = [
  {
    id: 'goblin-2014', ruleset: '5e-2014', source: 'SRD sample', name: 'Goblin', cr: '1/4', type: 'humanoid', size: 'Small', layoutHint: 'standard',
    ac: '15', hp: '7 (2d6)', speed: '30 ft.',
    abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
    saves: [], skills: ['Stealth +6'], senses: 'darkvision 60 ft., PP 9', languages: 'Common, Goblin',
    resistances: [], immunities: [], conditionImmunities: [],
    traits: [],
    actions: [
      { name: 'Scimitar', type: 'melee', hit: '+4', reach: "5'", damage: '5 (1d6+2) S', text: 'Melee weapon attack.' },
      { name: 'Shortbow', type: 'ranged', hit: '+4', reach: '80/320', damage: '5 (1d6+2) P', text: 'Ranged weapon attack.' }
    ],
    bonusActions: [{ name: 'Nimble Escape', text: 'Disengage or Hide.' }],
    reactions: [], legendaryActions: [], spellcasting: null, lairActions: [], regionalEffects: []
  },
  {
    id: 'adult-black-dragon-2014', ruleset: '5e-2014', source: 'SRD sample', name: 'Adult Black Dragon', cr: '14', type: 'dragon', size: 'Huge', layoutHint: 'accordion',
    ac: '19', hp: '195 (17d12+85)', speed: '40 ft., fly 80 ft., swim 40 ft.',
    abilities: { str: 23, dex: 14, con: 21, int: 14, wis: 13, cha: 17 },
    saves: ['Dex +7', 'Con +10', 'Wis +6', 'Cha +8'], skills: ['Perception +11', 'Stealth +7'], senses: 'blindsight 60 ft., darkvision 120 ft., PP 21', languages: 'Common, Draconic',
    resistances: [], immunities: ['acid'], conditionImmunities: [],
    traits: [{ name: 'Amphibious', text: 'Can breathe air and water.' }, { name: 'Legendary Resistance (3/day)', text: 'If the dragon fails a saving throw, it can choose to succeed instead.' }],
    actions: [
      { name: 'Multiattack', text: 'Frightful Presence, then one Bite and two Claw attacks.' },
      { name: 'Bite', hit: '+11', reach: "10'", damage: '17 (2d10+6) P + 4 (1d8) acid' },
      { name: 'Claw', hit: '+11', reach: "5'", damage: '13 (2d6+6) S' },
      { name: 'Tail', hit: '+11', reach: "15'", damage: '15 (2d8+6) B' },
      { name: 'Acid Breath', text: 'Recharge 5-6. 60 ft. line, Dex save, acid damage.' }
    ],
    bonusActions: [], reactions: [],
    legendaryActions: [
      { name: 'Detect', text: 'Makes a Wisdom (Perception) check.' },
      { name: 'Tail Attack', text: 'Makes a tail attack.' },
      { name: 'Wing Attack (2 actions)', text: 'Creatures nearby save or take damage and fall prone; dragon flies up to half speed.' }
    ],
    spellcasting: null,
    lairActions: [{ name: 'Mire', text: 'Pools of water become grasping sludge.' }, { name: 'Darkness', text: 'Magical darkness spreads from a point.' }], regionalEffects: []
  },
  {
    id: 'lich-2014', ruleset: '5e-2014', source: 'SRD sample', name: 'Lich', cr: '21', type: 'undead', size: 'Medium', layoutHint: 'accordion',
    ac: '17', hp: '135 (18d8+54)', speed: '30 ft.',
    abilities: { str: 11, dex: 16, con: 16, int: 20, wis: 14, cha: 16 },
    saves: ['Con +10', 'Int +12', 'Wis +9'], skills: ['Arcana +18', 'History +12', 'Insight +9', 'Perception +9'], senses: 'truesight 120 ft., PP 19', languages: 'Common + five languages',
    resistances: ['cold', 'lightning', 'necrotic'], immunities: ['poison', 'B/P/S from nonmagical attacks'], conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'poisoned'],
    traits: [
      { name: 'Legendary Resistance (3/day)', text: 'If the lich fails a saving throw, it can choose to succeed instead.' },
      { name: 'Rejuvenation', text: 'If it has a phylactery, a destroyed lich gains a new body in 1d10 days.' },
      { name: 'Turn Resistance', text: 'Advantage on saving throws against effects that turn undead.' }
    ],
    actions: [
      { name: 'Paralyzing Touch', hit: '+12', reach: "5'", damage: '10 (3d6) cold', text: 'Target must save or be paralyzed.' }
    ],
    bonusActions: [], reactions: [],
    legendaryActions: [
      { name: 'Cantrip', text: 'Casts a cantrip.' },
      { name: 'Paralyzing Touch (2)', text: 'Uses Paralyzing Touch.' },
      { name: 'Frightening Gaze (2)', text: 'One creature must save or become frightened.' },
      { name: 'Disrupt Life (3)', text: 'Creatures nearby save or take necrotic damage.' }
    ],
    spellcasting: {
      header: 'Spellcasting. DC 20, spell attack +12.',
      levels: {
        'At will': ['mage hand', 'prestidigitation', 'ray of frost'],
        '1st': ['detect magic', 'magic missile', 'shield', 'thunderwave'],
        '2nd': ['detect thoughts', 'invisibility', 'mirror image', 'Melf\'s acid arrow'],
        '3rd': ['animate dead', 'counterspell', 'dispel magic', 'fireball'],
        '4th': ['blight', 'dimension door'],
        '5th': ['cloudkill', 'scrying'],
        '6th': ['disintegrate', 'globe of invulnerability'],
        '7th': ['finger of death', 'plane shift'],
        '8th': ['dominate monster', 'power word stun'],
        '9th': ['power word kill']
      }
    },
    lairActions: [{ name: 'Necrotic Tether', text: 'A spirit effect drains life.' }, { name: 'Arcane Surge', text: 'Magical energy disrupts intruders.' }], regionalEffects: []
  }
];

export const homebrewExample = {
  id: 'frost-troll-homebrew', ruleset: 'homebrew', source: 'Homebrew example', name: 'Frost Troll', cr: '8', type: 'giant', size: 'Large', layoutHint: 'auto',
  ac: '15', hp: '136 (16d10+48)', speed: '30 ft.',
  abilities: { str: 20, dex: 13, con: 18, int: 7, wis: 10, cha: 7 },
  saves: ['Con +7'], skills: ['Perception +3'], senses: 'darkvision 60 ft., PP 13', languages: 'Giant',
  resistances: ['cold'], immunities: [], conditionImmunities: [],
  traits: [{ name: 'Regeneration', text: 'Regains 10 HP at start of turn unless damaged by fire.' }],
  actions: [{ name: 'Multiattack', text: 'Makes one Bite and two Claw attacks.' }, { name: 'Claw', hit: '+8', reach: "5'", damage: '12 (2d6+5) S' }],
  bonusActions: [], reactions: [], legendaryActions: [], spellcasting: null, lairActions: [], regionalEffects: []
};
