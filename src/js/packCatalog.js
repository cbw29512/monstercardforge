export const packTypes = [
  {
    id: 'single-card',
    name: 'Single Card',
    description: 'One printable monster card or accordion card.',
  },
  {
    id: 'type-pack',
    name: 'Creature Type Pack',
    description: 'Cards grouped by creature type such as Undead, Dragons, Fiends, or Beasts.',
  },
  {
    id: 'cr-pack',
    name: 'CR Range Pack',
    description: 'Cards grouped by challenge rating range for encounter prep.',
  },
  {
    id: 'environment-pack',
    name: 'Environment / Lair Pack',
    description: 'Cards grouped by where the encounter happens, such as dungeon, swamp, city, graveyard, or dragon lair.',
  },
  {
    id: 'complete-set',
    name: 'Complete Ruleset Set',
    description: 'A full ruleset-specific SRD card set with source attribution.',
  },
];

export const launchPacks = [
  { id: 'free-goblin', title: 'Free Goblin Starter Card', ruleset: '5e-2014', type: 'single-card', priceTier: 'free', seoSlug: '/free-goblin-card' },
  { id: 'undead-2014', title: 'Undead Card Pack', ruleset: '5e-2014', type: 'type-pack', priceTier: 'paid', seoSlug: '/packs/2014/type/undead' },
  { id: 'dragons-2014', title: 'Dragon Card Pack', ruleset: '5e-2014', type: 'type-pack', priceTier: 'paid', seoSlug: '/packs/2014/type/dragons' },
  { id: 'cr-0-1-2014', title: 'CR 0-1 Starter Threats', ruleset: '5e-2014', type: 'cr-pack', priceTier: 'paid', seoSlug: '/packs/2014/cr/0-1' },
  { id: 'boss-accordion-2014', title: 'Boss Accordion Card Pack', ruleset: '5e-2014', type: 'environment-pack', priceTier: 'paid', seoSlug: '/packs/2014/boss-accordion' },
];
