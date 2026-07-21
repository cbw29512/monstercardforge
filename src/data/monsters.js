export const monsters = [
  {
    id: 'goblin-2014', ruleset: '5e-2014', source: 'SRD 5.1', sourceId: 'srd-5-1', sourceUrl: 'https://www.dndbeyond.com/srd', license: 'CC-BY-4.0', verifiedAt: '2026-07-21',
    name: 'Goblin', cr: '1/4', xp: 50, type: 'humanoid', size: 'Small', alignment: 'neutral evil', layoutHint: 'standard',
    ac: '15 (leather armor, shield)', hp: '7 (2d6)', speed: '30 ft.',
    abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
    saves: [], skills: ['Stealth +6'], senses: 'darkvision 60 ft., passive Perception 9', languages: 'Common, Goblin',
    resistances: [], immunities: [], conditionImmunities: [],
    traits: [],
    actions: [
      { name: 'Scimitar', type: 'melee', hit: '+4', reach: '5 ft.', target: 'one target', damage: '5 (1d6 + 2) slashing', text: 'Melee Weapon Attack.' },
      { name: 'Shortbow', type: 'ranged', hit: '+4', reach: '80/320 ft.', target: 'one target', damage: '5 (1d6 + 2) piercing', text: 'Ranged Weapon Attack.' }
    ],
    bonusActions: [{ name: 'Nimble Escape', text: 'The goblin takes the Disengage or Hide action.' }],
    reactions: [], legendaryActions: [], spellcasting: null, lairActions: [], regionalEffects: []
  },
  {
    id: 'adult-black-dragon-2014', ruleset: '5e-2014', source: 'SRD 5.1', sourceId: 'srd-5-1', sourceUrl: 'https://www.dndbeyond.com/srd', license: 'CC-BY-4.0', verifiedAt: '2026-07-21',
    name: 'Adult Black Dragon', cr: '14', xp: 11500, type: 'dragon', size: 'Huge', alignment: 'chaotic evil', layoutHint: 'accordion',
    ac: '19 (natural armor)', hp: '195 (17d12 + 85)', speed: '40 ft., fly 80 ft., swim 40 ft.',
    abilities: { str: 23, dex: 14, con: 21, int: 14, wis: 13, cha: 17 },
    saves: ['Dex +7', 'Con +10', 'Wis +6', 'Cha +8'], skills: ['Perception +11', 'Stealth +7'], senses: 'blindsight 60 ft., darkvision 120 ft., passive Perception 21', languages: 'Common, Draconic',
    resistances: [], immunities: ['acid'], conditionImmunities: [],
    traits: [
      { name: 'Amphibious', text: 'The dragon can breathe air and water.' },
      { name: 'Legendary Resistance (3/Day)', text: 'If the dragon fails a saving throw, it can choose to succeed instead.' }
    ],
    actions: [
      { name: 'Multiattack', text: 'The dragon can use Frightful Presence. It then makes three attacks: one with its Bite and two with its Claws.' },
      { name: 'Bite', type: 'melee', hit: '+11', reach: '10 ft.', target: 'one target', damage: '17 (2d10 + 6) piercing plus 4 (1d8) acid', text: 'Melee Weapon Attack.' },
      { name: 'Claw', type: 'melee', hit: '+11', reach: '5 ft.', target: 'one target', damage: '13 (2d6 + 6) slashing', text: 'Melee Weapon Attack.' },
      { name: 'Tail', type: 'melee', hit: '+11', reach: '15 ft.', target: 'one target', damage: '15 (2d8 + 6) bludgeoning', text: 'Melee Weapon Attack.' },
      { name: 'Frightful Presence', text: 'Each creature of the dragon’s choice within 120 feet that is aware of it must succeed on a DC 16 Wisdom saving throw or be frightened for 1 minute. A frightened target repeats the save at the end of each of its turns, ending the effect on a success. A creature that succeeds or ends the effect is immune to this dragon’s Frightful Presence for 24 hours.' },
      { name: 'Acid Breath (Recharge 5–6)', text: 'The dragon exhales acid in a 60-foot-long, 5-foot-wide line. Each creature in the line makes a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save or half as much on a successful one.' }
    ],
    bonusActions: [], reactions: [],
    legendaryActions: [
      { name: 'Legendary Actions', text: 'The dragon can take 3 legendary actions, one at a time at the end of another creature’s turn, and regains spent actions at the start of its turn.' },
      { name: 'Detect', cost: 1, text: 'The dragon makes a Wisdom (Perception) check.' },
      { name: 'Tail Attack', cost: 1, text: 'The dragon makes a Tail attack.' },
      { name: 'Wing Attack', cost: 2, text: 'Each creature within 10 feet makes a DC 19 Dexterity saving throw. On a failure, it takes 13 (2d6 + 6) bludgeoning damage and is knocked prone. The dragon can then fly up to half its flying speed.' }
    ],
    spellcasting: null,
    lairActions: [], regionalEffects: [],
    scopeNote: 'Complete base SRD stat block. Optional lair actions and regional effects are intentionally excluded until separately sourced and verified.'
  },
  {
    id: 'lich-2014', ruleset: '5e-2014', source: 'SRD 5.1', sourceId: 'srd-5-1', sourceUrl: 'https://www.dndbeyond.com/srd', license: 'CC-BY-4.0', verifiedAt: '2026-07-21',
    name: 'Lich', cr: '21', xp: 33000, type: 'undead', size: 'Medium', alignment: 'any evil alignment', layoutHint: 'accordion',
    ac: '17 (natural armor)', hp: '135 (18d8 + 54)', speed: '30 ft.',
    abilities: { str: 11, dex: 16, con: 16, int: 20, wis: 14, cha: 16 },
    saves: ['Con +10', 'Int +12', 'Wis +9'], skills: ['Arcana +19', 'History +12', 'Insight +9', 'Perception +9'], senses: 'truesight 120 ft., passive Perception 19', languages: 'Common plus up to five other languages',
    resistances: ['cold', 'lightning', 'necrotic'], immunities: ['poison', 'bludgeoning, piercing, and slashing from nonmagical attacks'], conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'poisoned'],
    traits: [
      { name: 'Legendary Resistance (3/Day)', text: 'If the lich fails a saving throw, it can choose to succeed instead.' },
      { name: 'Rejuvenation', text: 'If it has a phylactery, a destroyed lich gains a new body in 1d10 days, regains all its hit points, and becomes active again. The body appears within 5 feet of the phylactery.' },
      { name: 'Turn Resistance', text: 'The lich has advantage on saving throws against any effect that turns undead.' }
    ],
    actions: [
      { name: 'Paralyzing Touch', type: 'melee spell', hit: '+12', reach: '5 ft.', target: 'one creature', damage: '10 (3d6) cold', text: 'On a hit, the target must succeed on a DC 18 Constitution saving throw or be paralyzed for 1 minute. It repeats the save at the end of each of its turns, ending the effect on a success.' }
    ],
    bonusActions: [], reactions: [],
    legendaryActions: [
      { name: 'Legendary Actions', text: 'The lich can take 3 legendary actions, one at a time at the end of another creature’s turn, and regains spent actions at the start of its turn.' },
      { name: 'Cantrip', cost: 1, text: 'The lich casts a cantrip.' },
      { name: 'Paralyzing Touch', cost: 2, text: 'The lich uses Paralyzing Touch.' },
      { name: 'Frightening Gaze', cost: 2, text: 'One creature the lich can see within 10 feet makes a DC 18 Wisdom saving throw. On a failure, it is frightened for 1 minute and repeats the save at the end of each turn. After succeeding or ending the effect, it is immune to this gaze for 24 hours.' },
      { name: 'Disrupt Life', cost: 3, text: 'Each non-undead creature within 20 feet makes a DC 18 Constitution saving throw, taking 21 (6d6) necrotic damage on a failure or half as much on a success.' }
    ],
    spellcasting: {
      header: '18th-level spellcaster. Intelligence; spell save DC 20, +12 to hit with spell attacks.',
      levels: {
        'Cantrips (at will)': ['mage hand', 'prestidigitation', 'ray of frost'],
        '1st level (4 slots)': ['detect magic', 'magic missile', 'shield', 'thunderwave'],
        '2nd level (3 slots)': ['detect thoughts', 'invisibility', 'Melf’s acid arrow', 'mirror image'],
        '3rd level (3 slots)': ['animate dead', 'counterspell', 'dispel magic', 'fireball'],
        '4th level (3 slots)': ['blight', 'dimension door'],
        '5th level (3 slots)': ['cloudkill', 'scrying'],
        '6th level (1 slot)': ['disintegrate', 'globe of invulnerability'],
        '7th level (1 slot)': ['finger of death', 'plane shift'],
        '8th level (1 slot)': ['dominate monster', 'power word stun'],
        '9th level (1 slot)': ['power word kill']
      }
    },
    lairActions: [], regionalEffects: [],
    scopeNote: 'Complete base SRD stat block. Optional lair actions and regional effects are intentionally excluded until separately sourced and verified.'
  }
];

export const homebrewExample = {
  id: 'frost-troll-homebrew', ruleset: 'homebrew', source: 'DM Forge Original Homebrew', sourceId: 'dmforge-original', license: 'Project original', verifiedAt: '2026-07-21',
  name: 'Frost Troll', cr: '8', xp: 3900, type: 'giant', size: 'Large', alignment: 'unaligned', layoutHint: 'auto',
  ac: '15', hp: '136 (16d10 + 48)', speed: '30 ft.',
  abilities: { str: 20, dex: 13, con: 18, int: 7, wis: 10, cha: 7 },
  saves: ['Con +7'], skills: ['Perception +3'], senses: 'darkvision 60 ft., passive Perception 13', languages: 'Giant',
  resistances: ['cold'], immunities: [], conditionImmunities: [],
  traits: [{ name: 'Regeneration', text: 'The troll regains 10 HP at the start of its turn unless it took fire damage since the end of its previous turn.' }],
  actions: [
    { name: 'Multiattack', text: 'The troll makes one Bite attack and two Claw attacks.' },
    { name: 'Bite', type: 'melee', hit: '+8', reach: '5 ft.', target: 'one target', damage: '10 (1d10 + 5) piercing plus 4 (1d8) cold', text: 'Homebrew melee attack.' },
    { name: 'Claw', type: 'melee', hit: '+8', reach: '5 ft.', target: 'one target', damage: '12 (2d6 + 5) slashing', text: 'Homebrew melee attack.' }
  ],
  bonusActions: [], reactions: [], legendaryActions: [], spellcasting: null, lairActions: [], regionalEffects: [],
  scopeNote: 'Original homebrew example for layout testing; not an official D&D monster.'
};
