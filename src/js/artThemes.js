export const artThemes = {
  humanoid: {
    icon: '☠',
    title: 'GOBLIN AMBUSH',
    layers: ['moon', 'dagger', 'forest'],
  },
  dragon: {
    icon: '◆',
    title: 'ACID DRAGON',
    layers: ['moon', 'wings', 'acid'],
  },
  undead: {
    icon: '✦',
    title: 'LICH TOME',
    layers: ['moon', 'crown', 'runes'],
  },
  giant: {
    icon: '▲',
    title: 'FROST GIANT',
    layers: ['mountain', 'axe', 'snow'],
  },
  beast: {
    icon: '●',
    title: 'WILD BEAST',
    layers: ['forest', 'claw', 'moon'],
  },
};

export function artThemeFor(type) {
  return artThemes[String(type || '').toLowerCase()] || artThemes.humanoid;
}
