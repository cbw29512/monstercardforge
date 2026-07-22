# DM Forge

DM Forge is a free, local-first, print-first Dungeon Master toolkit and live-session companion maintained by `cbw29512`. It combines campaign organization, verified rules references, executable roll cards, encounter building, reusable NPCs, loot, magic items, combat management, player-facing initiative, printable cards, private campaign search, automatic recovery, and community feedback without requiring an account.

The product goal is one coherent DM website that brings together the strongest D&D work across the owner's repositories instead of leaving useful tools scattered.

## Live sites

- Main toolkit: `https://cbw29512.github.io/monstercardforge/`
- Rules Compendium & Roll Cards companion: `https://cbw29512.github.io/DungeonCards/?system=dnd&page=compendium`
- Cleric in a Box companion: `https://cbw29512.github.io/healingbox/`

## Infrastructure policy

Until the owner explicitly approves paid infrastructure:

- GitHub Pages hosts the public applications.
- GitHub Actions validates source, browser workflows, and the exact deployed site.
- GitHub Discussions and Issues provide community feedback and structured requests.
- Detailed campaign data stays in the user's browser.
- Every public tool remains useful without an account.
- No paid database, analytics service, AI API, storage provider, or hosted backend is required.

See `docs/DND_REPOSITORY_CONSOLIDATION.md` for the cross-repository plan and `docs/DECISIONS.md` for architecture decisions.

## Live tools

### Campaign Hub

- One active campaign across connected campaign tools
- Discovers locally saved sessions, encounters, NPCs, loot, magic items, and Cleric in a Box rooms
- Shows privacy-safe summary counts
- Opens tools in the selected campaign context
- Exports a portable shared summary

Routes: `campaigns.html`, `campaigns.css`, `campaigns.js`, `shared/dmforge-store.js`

### Rules Compendium & Roll Cards

The main gateway at `rules-compendium.html` connects DM Forge to the verified `DungeonCards` companion.

- 319 SRD 5.1 spells and 314 SRD 5.1 monsters
- 339 SRD 5.2.1 spells and 328 SRD 5.2.1 monsters
- 658 spell references and 642 monster references total
- Source pages, PDF digests, version labels, and CC BY 4.0 attribution
- Complete licensed weapon tables
- Core d20, skill, saving-throw, attack, and damage cards
- Twenty-two automated spell families with edition-aware behavior
- Player and DM personal workspaces
- Monster encounter decks and ordered folios
- Local roll-card and monster homebrew builders
- Fixed 2.5 × 3.5-inch print-card output

Stable deep links open the D&D Rules Guide, Compendium, Player, DM, Encounter, Card Builder, and Monster Builder directly. The public gateway clearly distinguishes reference-complete records from automation-complete procedures and does not promote the experimental non-D&D preview.

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

- Separate official 5e (2014) and 5.5e (2024) calculations
- 5e Easy–Deadly thresholds, monster-count multipliers, and party-size adjustments
- 5.5e Low–High direct XP budgets
- Mixed-level saved party profiles
- Authoritative live catalog with 314 SRD 5.1 and 328 SRD 5.2.1 monsters
- Schema, source-count, SHA-256 digest, CC BY 4.0, and unique-ID validation
- Search and filtering across all 642 monsters with a 120-card rendering cap for responsiveness
- Source pages and attribution preserved in cards, rosters, saved encounters, Session Console handoffs, and print packets
- Built-in samples and custom monsters remain available when the companion catalog is offline
- CR, XP, AC, average HP, Dexterity, size, type, alignment, speed, and legendary status imported from DungeonCards
- Practical operational warnings
- Printable packets and Session Console handoff

Routes: `encounter-forge.html`, `encounter-forge.css`, `encounter-forge.js`, `encounter-rules.js`, `encounter-monster-catalog.js`

### Session Console

- Multiple locally saved campaigns
- Current-session prep, timestamped log, and archives
- Initiative with enemy HP, AC, conditions, round, and turn tracking
- Players remain responsible for their own HP
- Persistent player roster
- Secure dice and quick generators
- Printable session packets
- Encounter, NPC, loot, and magic-item handoffs
- Privacy-safe Player Display hosting

Routes: `session-console.html`, `session-console.css`, `session-console.js`, `shared/session-console-adapter.js`, `shared/player-display-host.js`

### Player Display

- Read-only phone and tablet view
- Six-character room code and copyable link
- Current round, active turn, initiative order, and public conditions
- Full-screen, screen-wake, and reconnect support
- Never transmits enemy HP, AC, Dexterity, logs, prep, or DM notes

Routes: `player-display.html`, `player-display.css`, `player-display.js`

### Monster Card Forge

- Fold-over monster cards
- Boss folio and accordion layouts
- Separate 5e and 5.5e content
- Guided homebrew builder
- Source, license, verification date, and scope labels
- Hostile-input escaping and regression tests

Route: `monster-cards.html`

The next controlled integration is a richer DungeonCards full-stat adapter that preserves Monster Card Forge's print identity and adds continuation handling instead of clipping or silently omitting long stat blocks.

### Magic Item Forge

- Standard, detailed, and full 5×7 artifact cards
- Player-front, player-back, and private DM-back views
- Identification states and evolving stages
- Uploaded artwork resizing
- Campaign folders and owners
- Save, edit, duplicate, delete, import, and export
- Safe Session Console reward handoff
- Duplex printing, cut guides, fit warnings, and continuation pages

Routes: `magic-items.html`, `magic-items.css`, `magic-items.js`, `shared/magic-items-adapter.js`

### NPC Forge

- Player-safe and private DM 5×7 cards
- Appearance, faction, voice, mannerism, motive, fear, leverage, secrets, lies, and relationships
- Original secure generators
- Searchable campaign library
- Overflow-safe printing
- Safe Session Console handoff
- Shared summaries that exclude private NPC fields

Routes: `npc-forge.html`, `npc-forge.css`, `npc-forge.js`, `shared/npc-forge-hardening.js`

### Loot Forge

- Campaign treasure parcels and coin tracking
- Valuables, gear, magic candidates, clues, and private notes
- Distribution status tracking
- Player handouts and private DM parcels
- Printable campaign ledger
- Safe Session Console rewards
- Unidentified Magic Item Forge placeholders
- Edited-item overwrite protection
- Shared summaries that exclude private parcel contents

Routes: `loot-forge.html`, `loot-forge.css`, `loot-forge.js`, `shared/loot-forge-hardening.js`

### Protect My Campaign

- Normal changes save automatically in each tool
- IndexedDB keeps up to eight recent local recovery points
- Manual **Save Recovery Point** control
- Restoring an older version first preserves the current version
- Plain-language **Download Safety Copy** and **Restore Safety Copy** controls
- Advanced storage details hidden unless needed
- Recognized-key filtering, integrity hashes, and restore preview

Routes: `backup-center.html`, `backup-center.css`, `backup-center.js`, `shared/recovery-manager.js`

### Community

- Public community landing page
- GitHub Discussions for opinions, questions, polls, and early ideas
- Structured bug, feature, new-tool, and sourced rules-correction requests
- Code of Conduct, contributor guide, security policy, and contribution checklist

Route: `community.html`

### Cleric in a Box

A separate linked multiplayer companion for exact-level divine charges, healing potions, and supported cleric scroll effects.

- Versioned 5e and 5.5e Cleric rules data
- DM-controlled Wisdom modifier, save DC, and spell attack bonus
- Host-origin authorization for administrative actions
- Campaign Hub room summaries
- Players track their own HP

## Shared campaign architecture

The key `dmforge-shared-v1` stores versioned privacy-safe summaries:

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

Detailed records remain in source tools. The shared layer excludes session-prep bodies, complete logs, NPC motives and secrets, magic-item rules and curses, uploaded artwork, encounter tactics, complete combat records, and Cleric in a Box history or deity information.

DungeonCards workspaces remain separately namespaced and are not claimed as synchronized into Campaign Hub. Encounter Forge consumes only the generated, public SRD monster-summary export.

## D&D repository consolidation

`docs/DND_REPOSITORY_CONSOLIDATION.md` is the authority for integrate, rebuild, import-content, companion, future-system, and archive decisions.

Completed DungeonCards milestones:

1. DM Forge-branded Rules Compendium & Roll Cards companion.
2. Stable direct D&D workspace links.
3. Deterministic 642-record monster-summary export owned by DungeonCards.
4. Source-authoritative Encounter Forge integration with no copied handwritten catalog.
5. Exact deployed validation across desktop Chromium, Android Chromium emulation, and iPhone WebKit.

The next milestone is the richer full-stat adapter for Monster Card Forge. Handwritten duplicate catalogs are prohibited.

## Production validation

DM Forge uses three complementary checks:

### Static safety

- Rules, privacy, security, metadata, licensing, design, and anti-drift contracts
- JavaScript parsing and local-asset checks
- Cross-tool handoff, authoritative-catalog, and recovery guarantees

### Production readiness

- Deterministic local server
- Desktop Chromium
- Android Chromium emulation
- iPhone WebKit emulation
- Real campaign, encounter, sourced-monster, session, NPC, loot, item, recovery, and companion-gateway workflows
- Serious and critical axe accessibility checks
- Failure traces, screenshots, videos, and HTML reports

### Live site readiness

- Waits for GitHub Pages to report the exact expected commit
- Checks every public DM Forge route over HTTPS
- Checks the deployed DungeonCards companion
- Validates the live 642-record monster export before browser tests
- Runs the complete browser and accessibility suite against the live site
- Verifies the D&D Compendium route, source catalog, full search, and sourced Session Console handoff

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
- Real cardstock, duplex, cut-guide, continuation, folio, packet, and handout printing
- Live Core Web Vitals measurements

## Licensing

DM Forge is an independent tabletop utility. Only open-license content, original DM Forge content, or user-created homebrew may be published or distributed. Rulesets, sources, required attribution, and homebrew boundaries must remain visible in public pages and exports.

Original DM Forge code and documentation use MIT. SRD-derived records retain their separate CC BY 4.0 attribution and are not silently relicensed as original project content.
