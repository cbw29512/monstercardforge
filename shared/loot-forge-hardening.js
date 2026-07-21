(function hardenLootForge() {
  'use strict';

  let draftId = uid('loot-draft');

  values = function stableLootValues() {
    return normalize({ ...Object.fromEntries(new FormData(form).entries()), id: editingId || draftId, updatedAt: new Date().toISOString() });
  };

  const originalBlankParcel = blankParcel;
  blankParcel = function resetLootDraft() {
    draftId = uid('loot-draft');
    originalBlankParcel();
  };

  sendMagicItems = function sendMissingMagicPlaceholders(parcel) {
    if (!parcel) return;
    const names = lines(parcel.magicItems);
    if (!names.length) return toast('This parcel has no magic-item candidates to send.');
    const current = readJson(MAGIC_KEY, []);
    const items = Array.isArray(current) ? current : [];
    const map = new Map(items.map((item) => [item.id, item]));
    let added = 0;
    names.forEach((name, index) => {
      const itemId = `loot-item-${parcel.id}-${index + 1}`;
      if (map.has(itemId)) return;
      map.set(itemId, placeholderItem(parcel, name, index));
      added += 1;
    });
    if (!added) return toast('Those Loot Forge placeholders already exist. Existing Magic Item edits were preserved.');
    const updated = [...map.values()];
    localStorage.setItem(MAGIC_KEY, JSON.stringify(updated));
    store?.syncMagicItems(updated);
    toast(`${added} unidentified placeholder${added === 1 ? '' : 's'} sent to Magic Item Forge.`);
  };

  document.getElementById('newParcel').onclick = blankParcel;
})();
