# DM Forge

DM Forge is a print-first toolkit and live session companion for Dungeon Masters. It combines campaign preparation, combat management, improvisation, printable cards, and shared table tools without requiring an account for local use.

## Live tools

### Campaign Hub

The Campaign Hub is the shared front door for the toolkit.

- Discovers campaign names from Session Console, Magic Item Forge, and Cleric in a Box
- Maintains one active campaign across connected tools
- Shows safe counts for sessions, magic items, encounters, NPCs, loot, and saved artifact rooms
- Opens Session Console and Magic Item Forge in the selected campaign context
- Exports a portable shared summary
- Does not copy private session prep, logs, item rules, hidden curses, or artwork into the shared layer

Routes:

- `campaigns.html`
- `campaigns.css`
- `campaigns.js`
- `shared/dmforge-store.js`

### Session Console

- Multiple locally saved campaigns
- Shared Campaign Hub context and campaign handoff
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
- Receives safe magic-item reward summaries from Magic Item Forge
- Archived sessions
- Printable session packets
- JSON backup and import

Routes:

- `session-console.html`
- `session-console.css`
- `session-console.js`
- `shared/session-console-adapter.js`

### Monster Card Forge

- Readable monster reference cards
- Simple fold-over cards
- Boss folio and accordion layouts
- Separate 5E 2014 and 5E 2024 content
- Guided homebrew monster builder
- Shared HTML escaping for user-created content
- Hostile-input regression tests

Route: `monster-cards.html`

### Magic Item Forge

- Simple 2.5×3.5 cards, detailed cards, and full 5×7 artifact cards
- Player-front, player-back, and private DM-back previews
- Unidentified, partially identified, and fully identified player handouts
- Dormant, Awakened, and Exalted evolving-item stages
- Uploaded artwork with automatic browser-side resizing
- Shared Campaign Hub folders and active-campaign handoff
- Browser-saved magic item library
- Duplicate, edit, and delete saved cards
- Safe **Send to Session Rewards** handoff
- Export and import JSON backups
- Nine-card letter-size print sheets with cut guides
- Mirrored duplex backs for long-edge printing
- Full-size artifact front/back printing
- Live overflow detection and automatic continuation sheets
- Finished Cleric in a Box Unique Artifact showcase

Routes:

- `magic-items.html`
- `magic-items.css`
- `magic-items.js`
- `shared/magic-items-adapter.js`

### Cleric in a Box

A linked multiplayer table tool for exact-level divine charges, healing potions, and cleric scrolls.

- Versioned 2014 and 2024 Cleric rules data
- Explicit DM-controlled Wisdom modifier, spell save DC, and spell attack bonus
- Host-origin authorization for reset, undo, and settings
- Saved room summaries synchronize to Campaign Hub
- Players continue to track their own HP

Live application: https://cbw29512.github.io/healingbox/

## Shared campaign architecture

The shared store uses the browser key `dmforge-shared-v1` and contains versioned safe summaries:

```text
DMForgeStore
├── schemaVersion
├── campaigns[]
├── activeCampaignId
├── magicItems[]
├── sessions[]
├── encounters[]
├── npcs[]
├── loot[]
├── healingRooms[]
└── settings
```

Detailed records remain inside their source applications. The shared layer deliberately excludes:

- Session prep text and session-log bodies
- Magic-item rules, curses, secrets, and artwork
- Full combat records
- Cleric in a Box history and deity information

## Next module

### Encounter Forge

- 2014 and 2024 difficulty models
- Party profiles and encounter budgets
- Environment, type, CR, size, and source filtering
- Saved encounter history
- Monster Card Forge imports
- Shared Campaign Hub records
- Direct launch into Session Console

### Later priorities

- Shared phone/tablet initiative display
- NPC Forge and relationship tracker
- Loot Forge and magic-item handoff
- Browser-level accessibility and print-regression tests
- Optional cloud synchronization
- Maps and player handouts

## Product principles

Every tool should be:

1. Fast enough to use during a live session.
2. Attractive enough to hand directly to a player.
3. Readable when printed on an ordinary home printer.
4. Clear about ruleset, source, licensing, and homebrew status.
5. Persistent without trapping the user in an account.
6. Able to move safe information directly between related tools.
7. Able to expand for complicated content instead of silently hiding text.

## Testing

Run the zero-dependency safety suite with:

```bash
npm test
```

The test suite checks:

- Hostile homebrew input escaping
- JavaScript syntax
- Local page assets and links
- Magic Item overflow safeguards
- Campaign Hub and adapter loading
- Shared-store privacy boundaries
- Safe reward handoff behavior
- Homepage live-tool routes

GitHub Actions runs the suite on every push and pull request.

## Running locally

Open `index.html` in a browser. DM Forge uses static HTML, CSS, and JavaScript and requires no build step.

Session Console and Magic Item Forge data are stored in browser local storage. Use each tool's JSON export function to create backups or move data between computers. The Campaign Hub exports a separate safe shared summary.

## Project structure

- `index.html` — DM Forge toolkit homepage
- `campaigns.html` — shared Campaign Hub
- `campaigns.css` — responsive Campaign Hub styling
- `campaigns.js` — shared-source discovery, active campaign, counts, and export
- `shared/dmforge-store.js` — versioned shared campaign store
- `shared/session-console-adapter.js` — Session Console synchronization and live reward updates
- `shared/magic-items-adapter.js` — Magic Item synchronization and reward handoff
- `shared/shared-context.css` — shared campaign status bars
- `session-console.*` — live campaign and session companion
- `monster-cards.html` and `src/` — Monster Card Forge
- `magic-items.*` — production Magic Item Forge
- `COMPETITIVE_RESEARCH.md` — reviewed products, lessons, and priority gaps
- `AUDIT-2026-07-21.md` — whole-site audit
- `PROGRESS-2026-07-22.md` — remediation and implementation ledger
- `ROADMAP.md` — staged product roadmap

## Licensing

DM Forge is an independent tabletop utility. Only open-license content, original DM Forge content, or user-created homebrew should be published or distributed. Rulesets, sources, and required attribution must remain clear in public pages and exports.
