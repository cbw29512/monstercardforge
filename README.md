# DM Forge

DM Forge is a print-first toolkit and live session companion for Dungeon Masters. It combines campaign preparation, combat management, improvisation, printable cards, and shared table tools without requiring an account for local use.

## Live tools

### Session Console

- Multiple locally saved campaigns
- Current-session prep sheet
- Opening beat, likely scenes, secrets, NPCs, locations, rewards, and loose notes
- Timestamped session log
- Initiative sorting with Dexterity tiebreaks
- Round and current-turn tracking
- Enemy and NPC HP, AC, and conditions
- Players remain responsible for their own HP
- Persistent campaign player roster
- Combat chronicle
- Secure dice tray using `crypto.getRandomValues`
- Advantage and disadvantage rolls
- NPC, inn, rumor, weather, treasure, complication, and name generators
- One-click transfer of generated details into session notes
- Archived sessions
- Printable session packets
- JSON backup and import

Routes:

- `session-console.html`
- `session-console.css`
- `session-console.js`

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
- Dormant, Awakened, and Exalted evolving-item stages
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

- `magic-items.html`
- `magic-items.css`
- `magic-items.js`

### Cleric in a Box

A linked multiplayer table tool for exact-level divine charges, healing potions, and cleric scrolls.

Live application: https://cbw29512.github.io/healingbox/

## Next modules

### Encounter Forge

- 2014 and 2024 difficulty models
- Party profiles and encounter budgets
- Environment, type, CR, size, and source filtering
- Saved encounter history
- Monster Card Forge imports
- Direct launch into Session Console

### Later priorities

- Shared phone/tablet initiative display
- NPC Forge and relationship tracker
- Loot Forge and magic-item handoff
- Shared campaign library
- Optional cloud synchronization
- Maps and player handouts

## Product principles

Every tool should be:

1. Fast enough to use during a live session.
2. Attractive enough to hand directly to a player.
3. Readable when printed on an ordinary home printer.
4. Clear about ruleset, source, licensing, and homebrew status.
5. Persistent without trapping the user in an account.
6. Able to move information directly between related tools.
7. Able to expand for complicated content instead of shrinking text until it becomes unreadable.

## Running locally

Open `index.html` in a browser. DM Forge uses static HTML, CSS, and JavaScript and requires no build step.

Session Console and Magic Item Forge data are stored in browser local storage. Use each tool's JSON export function to create backups or move data between computers.

## Project structure

- `index.html` — DM Forge toolkit homepage
- `session-console.html` — live campaign and session companion
- `session-console.css` — responsive Session Console styling and print packet layout
- `session-console.js` — campaigns, prep, initiative, dice, generators, archives, and backups
- `monster-cards.html` — preserved Monster Card Forge application
- `magic-items.html` — production Magic Item Forge editor
- `magic-items.css` — responsive card and duplex print layouts
- `magic-items.js` — Magic Item Forge logic and local library
- `src/` — monster-card data, rendering, styles, and print engine
- `COMPETITIVE_RESEARCH.md` — reviewed products, lessons, and priority gaps
- `ROADMAP.md` — staged product roadmap

## Licensing

DM Forge is an independent tabletop utility. Only open-license content, original DM Forge content, or user-created homebrew should be published or distributed. Rulesets, sources, and required attribution must remain clear in public pages and exports.
