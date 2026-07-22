# Live Encounter Catalog Validation — 2026-07-22

This pull request validates the exact `main` commit that connects Encounter Forge to the authoritative DungeonCards SRD monster export.

## Required deployed evidence

- GitHub Pages reports the exact current `main` commit as built.
- All DM Forge HTTPS routes respond.
- The DungeonCards D&D Compendium responds.
- The deployed monster export reports schema 1.
- The export contains exactly 642 records.
- Source counts are exactly 314 SRD 5.1 and 328 SRD 5.2.1.
- Both sources retain SHA-256 PDF digests and CC BY 4.0 labels.
- Encounter Forge displays the verified catalog status.
- Search reaches records beyond the initial 120-card rendering cap.
- A sourced SRD 5.1 Aboleth transfers into Session Console with AC 17 and HP 135.
- Existing campaign, NPC, loot, magic-item, recovery, privacy, mobile, and accessibility workflows remain green.

This validates the automated and deployed-browser portions of the feature. Physical devices, screen readers, and printer output remain separate acceptance evidence.
