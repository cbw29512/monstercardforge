# DM Forge

DM Forge is a print-first toolkit and live session companion for Dungeon Masters. It combines campaign organization, encounter building, reusable NPCs, combat management, player-facing initiative, improvisation, printable cards, and shared table tools without requiring an account for local use.

## Live tools

### Campaign Hub

- One active campaign across connected tools
- Discovers locally saved sessions, encounters, NPCs, magic items, and Cleric in a Box rooms
- Shows safe summary counts without copying private notes, NPC secrets, item curses, artwork, or tactics
- Opens each tool in the selected campaign context
- Exports a portable shared summary

Routes: `campaigns.html`, `campaigns.css`, `campaigns.js`, `shared/dmforge-store.js`

### Encounter Forge

- Separate official 2014 and 2024 encounter calculations
- 2014 Easy–Deadly thresholds, monster-count multipliers, and party-size adjustments
- 2024 Low–High direct XP budgets without a multiple-monster multiplier
- Mixed-level saved party profiles
- Official CR-to-XP values through CR 30
- Monster Card Forge sample imports
- Reusable custom monsters with CR, AC, HP, Dexterity, type, and rules label
- Live difficulty, XP, creature-count, and operational warnings
- Saved encounters by campaign
- Printable encounter packets
- Secure random, 10 + Dexterity, or zeroed initiative
- One-click enemy import into Session Console

Routes: `encounter-forge.html`, `encounter-forge.css`, `encounter-forge.js`, `encounter-rules.js`

### NPC Forge

- Player-safe and private DM 5×7 cards
- Public identity, appearance, faction, status, and known facts
- Private voice, mannerism, personality, motive, fear, leverage, secrets, lies, and relationships
- Optional combat shorthand
- Secure original NPC, name, and roleplay-cue generators
- Searchable campaign library with save, edit, duplicate, delete, import, and export
- Live fit warnings and automatic continuation pages
- Safe **Send to Session NPCs** handoff containing only the DM-selected roleplay summary
- Campaign Hub summaries that exclude motives, secrets, lies, relationship text, and combat notes

Routes: `npc-forge.html`, `npc-forge.css`, `npc-forge.js`, `shared/npc-forge-hardening.js`

### Session Console

- Multiple locally saved campaigns
- Current-session prep, timestamped log, and archives
- Initiative with enemy HP, AC, conditions, round, and turn tracking
- Players remain responsible for their own HP
- Persistent player roster
- Secure dice tray and quick generators
- Printable session packets and JSON backup
- Receives safe Magic Item rewards and NPC roleplay summaries
- Receives complete enemy rosters from Encounter Forge
- Hosts a privacy-safe Player Display room

Routes: `session-console.html`, `session-console.css`, `session-console.js`, `shared/session-console-adapter.js`, `shared/player-display-host.js`

### Player Display

- Read-only phone and tablet view
- Six-character room code and copyable join link
- Current round and active turn
- Public initiative order and conditions
- Full-screen and screen-wake controls
- Automatic reconnect attempts
- Never transmits enemy HP, AC, Dexterity, combat logs, session prep, or DM notes

Routes: `player-display.html`, `player-display.css`, `player-display.js`

### Monster Card Forge

- Readable fold-over monster cards
- Boss folio and accordion layouts
- Separate 5E 2014 and 5E 2024 content
- Guided homebrew builder
- Shared HTML escaping and hostile-input regression tests

Route: `monster-cards.html`

### Magic Item Forge

- Standard cards, detailed cards, and full 5×7 artifact cards
- Player-front, player-back, and private DM-back previews
- Identification states and evolving-item stages
- Uploaded artwork with browser-side resizing
- Shared campaign folders and owner assignments
- Save, edit, duplicate, delete, export, and import
- Safe **Send to Session Rewards** handoff
- Duplex sheets, cut guides, artifact printing, overflow warnings, and automatic continuation pages
- Cleric in a Box Unique Artifact showcase

Routes: `magic-items.html`, `magic-items.css`, `magic-items.js`, `shared/magic-items-adapter.js`

### Cleric in a Box

A separate linked multiplayer tool for exact-level divine charges, healing potions, and cleric scrolls.

- Versioned 2014 and 2024 Cleric rules data
- Explicit DM-controlled Wisdom modifier, save DC, and spell attack bonus
- Host-origin authorization for administrative actions
- Saved room summaries synchronize to Campaign Hub
- Players track their own HP

Live application: https://cbw29512.github.io/healingbox/

## Shared campaign architecture

The browser key `dmforge-shared-v1` stores versioned safe summaries:

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

Detailed records remain inside their source tools. The shared layer deliberately excludes session-prep bodies, complete logs, NPC motives and secrets, magic-item rules and curses, uploaded artwork, encounter tactics, complete combat records, and Cleric in a Box history or deity information.

## Next priorities

1. Loot Forge and Magic Item handoff
2. Browser-level Playwright and axe accessibility tests
3. Physical phone, tablet, cross-network, and printer validation
4. Expanded open/SRD monster catalog with traceable source and license metadata
5. Storage quota, backup-age, and recovery indicators
6. Unified backup manifest linking every tool-specific export

## Testing

Run the zero-dependency safety suite:

```bash
npm test
```

The suite checks:

- Hostile homebrew input escaping
- JavaScript syntax
- Local page assets and live-tool links
- Magic Item and NPC overflow safeguards
- Shared-store privacy boundaries
- Safe Magic Item reward and NPC roleplay transfers
- Official 2014 and 2024 encounter calculations
- Encounter Forge campaign and Session Console handoffs
- Player Display privacy boundaries

GitHub Actions runs the suite on every push and pull request.

## Running locally

Open `index.html` in a modern browser. DM Forge uses static HTML, CSS, and JavaScript and requires no build step. Tool-specific detailed data is stored in browser local storage; use each tool’s export function for backups. Multiplayer displays require an internet connection for PeerJS signaling.

## Key project files

- `index.html` — toolkit homepage
- `campaigns.*` — Campaign Hub
- `encounter-forge.*` and `encounter-rules.js` — encounter builder and rules engine
- `npc-forge.*` — NPC builder, library, private/public cards, and printing
- `session-console.*` — session prep and live combat console
- `player-display.*` and `shared/player-display-host.js` — read-only player initiative view
- `monster-cards.html` and `src/` — Monster Card Forge
- `magic-items.*` — Magic Item Forge
- `shared/` — campaign store, cross-tool adapters, and hardening layers
- `AUDIT-2026-07-21.md` — whole-site audit
- `PROGRESS-2026-07-22.md` — implementation ledger
- `ROADMAP.md` — staged roadmap

## Licensing

DM Forge is an independent tabletop utility. Only open-license content, original DM Forge content, or user-created homebrew should be published or distributed. Rulesets, sources, and required attribution must remain clear in public pages and exports.
