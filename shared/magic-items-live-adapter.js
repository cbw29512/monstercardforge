(function adoptExternalMagicItems(root) {
  'use strict';

  const ITEMS_KEY = 'dmforge-magic-items-v2';

  root.addEventListener('storage', (event) => {
    if (event.key !== ITEMS_KEY) return;
    try {
      const incoming = JSON.parse(event.newValue || '[]');
      if (!Array.isArray(incoming)) return;
      library = incoming.map(normalize);
      refreshLibrary();
      toast('Magic Item library updated from another DM Forge tool.');
    } catch (error) {
      console.error('[MagicItemsLiveAdapter] Could not adopt external items', error);
    }
  });
})(globalThis);
