# DM Forge

DM Forge is a growing, print-first toolkit for Dungeon Masters. The project began as Monster Card Forge and now serves as the umbrella site for printable cards, live table tools, and campaign utilities.

## Live tools

### Monster Card Forge

- Readable monster reference cards
- Simple fold-over cards
- Boss folio and accordion layouts
- Separate 5E 2014 and 5E 2024 content
- Guided homebrew monster builder

Route: `monster-cards.html`

### Magic Item Forge

- Simple 2.5×3.5 cards, detailed cards, and full 5×7 artifact cards
- Player-front, player-back, and private DM-back previews
- Unidentified, partially identified, and fully identified player handouts
- Dormant, awakened, and exalted evolving-item stages
- Uploaded artwork with automatic browser-side resizing
- Campaign folders, owner assignments, and campaign filtering
- Browser-saved magic item library
- Duplicate, edit, and delete saved cards
- Export and import JSON backups
- Nine-card letter-size print sheets with cut guides
- Mirrored duplex backs for long-edge printing
- Full-size artifact front/back printing
- Finished Cleric in a Box Unique Artifact showcase

Routes:

- `magic-items.html` — editor and library
- `magic-items.css` — responsive and print layouts
- `magic-items.js` — card model, storage, artwork, identification, evolution, and printing

### Cleric in a Box

A linked multiplayer table tool for exact-level divine charges, healing potions, and cleric scrolls.

Live application: https://cbw29512.github.io/healingbox/

## Planned modules

- Encounter Forge
- Initiative and condition tracking
- NPC Forge
- Loot Forge
- Shared campaign libraries
- Player handouts and optional cloud synchronization

## Product principles

Every tool should be:

1. Fast enough to use during a live session.
2. Attractive enough to hand directly to a player.
3. Readable when printed on an ordinary home printer.
4. Clear about ruleset, source, licensing, and homebrew status.
5. Able to expand for complicated content instead of shrinking text until it becomes unreadable.

## Running locally

Open `index.html` in a browser. The toolkit currently uses static HTML, CSS, and JavaScript and requires no build step.

The Magic Item Forge library and resized artwork are stored in browser local storage. Use its JSON export function to create backups or move the library between computers.

## Project structure

- `index.html` — DM Forge toolkit homepage
- `monster-cards.html` — preserved Monster Card Forge application
- `magic-items.html` — production Magic Item Forge editor
- `magic-items.css` — responsive card and duplex print layouts
- `magic-items.js` — Magic Item Forge logic and local library
- `src/` — existing monster-card data, rendering, styles, and print engine
- `ROADMAP.md` — staged product roadmap

## Licensing

DM Forge is an independent tabletop utility. Only open-license content, original DM Forge content, or user-created homebrew should be published or distributed. Rulesets, sources, and required attribution must remain clear in public pages and exports.
