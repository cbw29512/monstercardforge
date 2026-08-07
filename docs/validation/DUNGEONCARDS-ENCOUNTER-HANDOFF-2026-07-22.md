# DungeonCards → Encounter Forge Validation — 2026-07-22

This validation branch verifies the first direct cross-repository workflow in DM Forge.

## Workflow under test

1. Open the deployed DungeonCards Monster Encounter workspace.
2. Add a verified SRD monster to **My Encounter**.
3. Send the selection to DM Forge.
4. Resolve authoritative combat values from the validated DungeonCards export.
5. Open a calculated Encounter Forge record with the active campaign and party profile.
6. Preserve source references and prevent incomplete homebrew or mixed-edition transfers.

## Safety boundaries

- Handoff version is fixed at `1`.
- Handoffs expire after fifteen minutes.
- Maximum selection is 100 unique records.
- Only one edition may be transferred at a time.
- Homebrew transfer remains disabled until a complete versioned schema exists.
- Transferred payloads do not provide trusted AC, HP, Dexterity, XP, or license values.
- Encounter Forge resolves those values from its validated DungeonCards catalog.

## Required validation

- DungeonCards TypeScript tests and production build
- DM Forge static and browser gates
- Desktop Chromium, Android Chromium, and iPhone WebKit
- Exact deployed GitHub Pages routes
- Live cross-repository Goblin transfer
- Encounter calculation and visible source information

A green result confirms the exact deployed companion workflow, not merely the presence of links or source files.
