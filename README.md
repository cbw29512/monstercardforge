# DM Forge

DM Forge is a free, local-first, print-first Dungeon Master toolkit and live session companion. It combines campaign organization, encounter building, reusable NPCs, loot, magic items, combat management, player-facing initiative, improvisation, printable cards, private campaign search, recovery tools, and community feedback without requiring an account.

The public product goal is one coherent DM website that brings together `cbw29512`'s monster cards and strongest D&D projects rather than leaving them scattered across separate repositories.

## Live site

`https://cbw29512.github.io/monstercardforge/`

## Current infrastructure policy

Until the owner explicitly approves paid infrastructure:

- GitHub Pages hosts the public site.
- GitHub Actions validates source and the exact deployed site.
- GitHub Discussions and Issues provide community feedback and structured requests.
- Detailed campaign data stays in the user's browser.
- Every tool remains useful without an account.
- No paid database, analytics service, AI API, storage provider, or hosted backend is required.

See `docs/DND_REPOSITORY_CONSOLIDATION.md` for the cross-repository plan and `docs/DECISIONS.md` for architecture decisions.

## Live tools

### Campaign Hub

- One active campaign across connected tools
- Discovers locally saved sessions, encounters, NPCs, loot, magic items, and Cleric in a Box rooms
- Shows safe summary counts without copying private notes, NPC secrets, item curses, artwork, or tactics
- Opens each tool in the selected campaign context
- Exports a portable shared summary

Routes: `campaigns.html`, `campaigns.css`, `campaigns.js`, `shared/dmforge-store.js`

### Campaign Search

- Private search across current and archived sessions
- Encounter rosters and notes
- NPC motives, secrets, lies, and relationships
- Loot parcels and private notes
- Magic-item properties and hidden information
- Cleric in a Box room history
- Campaign and record-type filters
- Uploaded artwork excluded from indexing

Routes: `campaign-search.html`, `campaign-search.css`, `campaign-search.js`

### Encounter Forge

- Separate official 5e (2014) and 5.5e (2024) encounter calculations
- 5e Easy–Deadly thresholds, monster-count multipliers, and party-size adjustments
- 5.5e Low–High direct XP budgets without a multiple-monster multiplier
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
- Safe **Send to Session NPCs** handoff
- Campaign Hub summaries that exclude private NPC fields

Routes: `npc-forge.html`, `npc-forge.css`, `npc-forge.js`, `shared/npc-forge-hardening.js`

### Loot Forge

- Campaign treasure parcels
- CP, SP, EP, GP, and PP tracking
- Valuables, mundane gear, magic candidates, clues, and private notes
- Planned, Found, Distributed, Sold, Lost, and Returned status tracking
- Player-safe handouts and private DM parcels
- Printable campaign loot ledger
- Safe **Send to Session Rewards** handoff
- Unidentified Magic Item Forge placeholder handoff
- Stable draft identity and edited-item overwrite protection
- Shared campaign summaries that exclude private contents

Routes: `loot-forge.html`, `loot-forge.css`, `loot-forge.js`, `shared/loot-forge-hardening.js`

### Session Console

- Multiple locally saved campaigns
- Current-session prep, timestamped log, and archives
- Initiative with enemy HP, AC, conditions, round, and turn tracking
- Players remain responsible for their own HP
- Persistent player roster
- Secure dice tray and quick generators
- Printable session packets and JSON safety copy
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
- Separate 5e (2014) and 5.5e (2024) content
- Guided homebrew builder
- Source, license, verification-date, and scope labels
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

### Backup & Storage Center

- Downloads one complete recognized DM Forge safety copy
- Previews and validates a restore before replacing records
- Shows saved record counts and approximate browser storage
- Shows newest-record and last-backup information
- Includes integrity hashes and strict recognized-key filtering

Routes: `backup-center.html`, `backup-center.css`, `backup-center.js`

The next user-experience iteration will present this as **Protect My Campaign**, add automatic local recovery points, and move technical storage details behind an Advanced section.

### Community

- Public Community landing page
- GitHub Discussions path for opinions, questions, polls, and early ideas
- Structured bug, feature, new-tool, and sourced rules-correction requests
- Code of Conduct, contributor guide, security policy, and contribution checklist

Route: `community.html`

### Cleric in a Box

A separate linked multiplayer tool for exact-level divine charges, healing potions, and cleric scrolls.

- Versioned 5e (2014) and 5.5e (2024) Cleric rules data
- Explicit DM-controlled Wisdom modifier, save DC, and spell attack bonus
- Host-origin authorization for administrative actions
- Saved room summaries synchronize to Campaign Hub
- Players track their own HP

Live application: `https://cbw29512.github.io/healingbox/`

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

## D&D repository consolidation

The active consolidation plan is recorded in `docs/DND_REPOSITORY_CONSOLIDATION.md`.

The highest-priority integration is `cbw29512/DungeonCards`, which already contains:

- 319 SRD 5.1 spells and 314 SRD 5.1 monsters
- 339 SRD 5.2.1 spells and 328 SRD 5.2.1 monsters
- Complete licensed weapon tables
- Core d20, skill, saving-throw, attack, damage, and executable spell-family cards
- Official source pages, PDF digests, version labels, and CC BY 4.0 attribution
- A deterministic official-PDF synchronization and verification pipeline

DungeonCards will become **DM Forge Rules Compendium & Roll Cards** rather than being manually recreated.

Other D&D repositories are classified as integrate, rebuild, import content, companion, future system, or archive before promotion.

## Production validation

DM Forge has two automated release gates.

### Production readiness

Runs against a deterministic local server and includes:

- Static safety, rules, privacy, metadata, and anti-drift tests
- Desktop Chromium
- Android Chromium emulation
- iPhone WebKit emulation
- Real campaign, encounter, session, NPC, loot, magic-item, and backup workflows
- Serious and critical axe accessibility checks
- Failure traces, screenshots, videos, and HTML reports

### Live site readiness

Runs against the deployed GitHub Pages origin and:

- Waits for GitHub Pages to report the exact expected commit
- Checks every public route over HTTPS
- Runs the complete Playwright workflow and accessibility suites against the live site
- Fails when source is green but the deployed site is stale or broken

Commands:

```bash
npm install
npx playwright install chromium webkit
npm run test:static
npm run test:browser
npm run test:production
```

## Physical validation still required

Automated green status does not replace:

- Windows Chrome and Edge
- Physical Android and iPhone devices
- Android tablet and iPad
- Separate Wi-Fi and cellular multiplayer
- Keyboard-only, NVDA, and VoiceOver testing
- Real cardstock, duplex, 5×7, packet, and continuation-page printing
- Live Core Web Vitals measurements

## Next priorities

1. Complete file-level review of every D&D repository.
2. Integrate DungeonCards as Rules Compendium & Roll Cards.
3. Replace technical backup language with Protect My Campaign and automatic local restore points.
4. Add exact-record deep links from Campaign Search.
5. Add local/open-source QR room joining.
6. Add installable PWA and offline static caching.
7. Import approved original/licensed adventures, locations, maps, art, and teaching resources.
8. Complete physical device, assistive-technology, multiplayer, and printer validation.

## Running locally

Open `index.html` in a modern browser. DM Forge uses static HTML, CSS, and JavaScript and requires no production build step. Detailed data is stored in browser local storage. Multiplayer displays require an internet connection for PeerJS signaling.

## Key project files

- `index.html` — toolkit homepage
- `campaigns.*` — Campaign Hub
- `campaign-search.*` — private cross-tool search
- `encounter-forge.*` and `encounter-rules.js` — encounter builder and rules engine
- `npc-forge.*` — NPC builder, library, private/public cards, and printing
- `loot-forge.*` — treasure parcels, handoffs, and printing
- `session-console.*` — session prep and live combat console
- `player-display.*` and `shared/player-display-host.js` — read-only player initiative view
- `monster-cards.html` and `src/` — Monster Card Forge
- `magic-items.*` — Magic Item Forge
- `backup-center.*` — storage, safety copies, and restore
- `shared/` — design system, campaign store, adapters, and hardening layers
- `tests/browser/` — real-browser workflows and accessibility checks
- `.github/workflows/production-readiness.yml` — local production gate
- `.github/workflows/live-site-readiness.yml` — exact deployed-site gate
- `docs/DND_REPOSITORY_CONSOLIDATION.md` — cross-repository authority
- `docs/PRODUCTION_READINESS_GATE.md` — release standard
- `docs/DECISIONS.md` — architecture decision log
- `ROADMAP.md` — staged roadmap

## Licensing

DM Forge is an independent tabletop utility. Original DM Forge code and documentation use the MIT license. Third-party content, including SRD-derived data, retains its own license and attribution. Only open-license content, original DM Forge content, or user-created homebrew should be published or distributed. Rulesets, sources, and required attribution must remain clear in public pages and exports.
