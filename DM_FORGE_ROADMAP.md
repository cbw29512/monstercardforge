# DM Forge Product Roadmap

## Product promise

Every DM Forge tool must be:

- Fast enough to use during a live session.
- Attractive enough to hand directly to a player.
- Readable when printed on an ordinary home printer.
- Clear about ruleset, source, licensing, and homebrew status.
- Able to expand for complicated content instead of shrinking text until it becomes unreadable.

## Current release

### DM Forge hub

- Umbrella homepage for all toolkit modules.
- Responsive tool-card navigation.
- Clear live-versus-planned status.

### Monster Card Forge

- Preserved as a working standalone module.
- Free sample, card library, and homebrew creator remain intact.
- Existing monster data and print layouts remain the source of truth.

### Magic Item Forge MVP

- Simple card template.
- Detailed card template.
- Artifact card template.
- Live preview.
- Player-facing version.
- DM version with hidden property or curse.
- Local browser library.
- Edit, duplicate, and delete.
- JSON export and import.
- Single-card and selected-card printing.

### Cleric in a Box

- Linked as a separate full-screen live table application.
- Multiple independent campaign rooms.
- Laptop host with phone and tablet participants.

## Phase 2 — Magic Item Forge production polish

- Upload and crop item artwork.
- Card backs and true duplex-print alignment.
- Standard poker-card cut guides.
- Large artifact handout and booklet layouts.
- Player knowledge states: unidentified, partially identified, fully identified.
- Evolving item stages and revealed properties.
- Campaign folders and tags.
- Search, filter, and sort.
- Starter item templates.
- Cleric in a Box artifact-card example.
- Validation and completeness warnings.
- Improved print-sheet packing by card size.

## Phase 3 — Running the session

### Encounter Forge

- Encounter composition and difficulty estimates.
- Initiative and round tracking.
- Conditions, concentration, and recharge tracking.
- Direct Monster Card Forge integration.
- Printable encounter packets.

### NPC Forge

- Player-safe and DM-only card faces.
- Appearance, voice, mannerism, motive, fear, and secret.
- Relationships and faction links.
- Quick NPC generation.
- Printable roleplay cards.

### Loot Forge

- Treasure parcels and reward tables.
- Party loot ledger.
- Direct Magic Item Forge handoff.
- Player-facing loot handouts.

## Phase 4 — Campaign library

- Multiple campaign workspaces.
- Shared monster, item, NPC, encounter, and loot collections.
- Optional accounts and cloud synchronization.
- Player handout links.
- Campaign import and export.
- Versioned backups.

## Architecture rule

Each tool must remain usable on its own. Shared systems—campaign library, printing, storage, ruleset metadata, and legal attribution—should be reusable modules rather than duplicated implementations.

## Current repository routes

- `/` — DM Forge hub
- `/monster-cards.html` — Monster Card Forge
- `/magic-items.html` — Magic Item Forge
- External `/healingbox/` application — Cleric in a Box
