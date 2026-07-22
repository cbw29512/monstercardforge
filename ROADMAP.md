# DM Forge Roadmap

## Product direction

DM Forge is the single public Dungeon Master website for `cbw29512`'s cards, campaign tools, table utilities, licensed rules references, and original D&D projects.

Until the owner explicitly approves paid infrastructure, DM Forge remains:

- Free to use
- Hosted on GitHub Pages
- Local-first and account-free
- Backed by GitHub Actions, Discussions, and Issues
- Portable through plain-language safety copies and local recovery
- Independent of paid databases, AI APIs, analytics services, and hosted backends

Cross-repository decisions are governed by `docs/DND_REPOSITORY_CONSOLIDATION.md`.

## Phase 1 — Foundation — Complete

- DM Forge umbrella homepage
- Monster Card Forge preserved as a dedicated module
- Cleric in a Box linked as a live table tool
- Magic Item Forge initial editor and local library
- Shared print-first visual direction
- Whole-site security and reliability audit
- Critical homebrew-rendering, host-authorization, and print-overflow fixes
- Zero-dependency safety tests and GitHub Actions

## Phase 2 — Magic Item Forge Production — Complete

- Player-front, player-back, and private DM-back cards
- Simple, detailed, and 5×7 artifact formats
- Uploaded artwork with automatic resizing
- Unidentified, partially identified, and fully identified states
- Dormant, Awakened, and Exalted evolving-item stages
- Campaign folders and owner fields
- Local save, edit, duplicate, delete, export, and import
- Nine-card letter-size sheets with cut guides
- Mirrored duplex backs for long-edge printing
- Full-size artifact duplex printing
- Live fit warnings and automatic continuation sheets
- Finished Cleric in a Box Unique Artifact showcase

## Phase 3 — Run and Share the Session — Complete

### Session Console

- Multiple locally saved campaigns
- Reusable current-session prep sheet
- Session log, archive, secure dice, generators, and printable packet
- Initiative order with Dexterity tiebreaks
- Enemy and NPC HP, AC, and conditions
- Player initiative without player HP tracking
- Persistent campaign player roster
- Combat chronicle
- Shared campaign context
- Live receipt of safe Magic Item reward summaries
- Live receipt of safe NPC roleplay summaries
- Direct Encounter Forge enemy imports

### Encounter Forge

- Official 5e (2014) Easy, Medium, Hard, and Deadly XP thresholds
- Official 5e (2014) multiple-monster and party-size multipliers
- Official 5.5e (2024) Low, Moderate, and High direct XP budgets
- Mixed-level saved party profiles
- CR-to-XP table through CR 30
- Monster Card Forge sample imports
- Reusable custom monster catalog
- Search and type/rules filters
- Automatic CR, creature-count, and stat-block warnings
- Saved encounters in shared campaign summaries
- Secure random, 10 + Dexterity, or zeroed initiative modes
- Direct enemy handoff into Session Console
- Printable encounter packets
- Rules and integration regression tests

### Shared Player Display

- DM-hosted read-only display room inside Session Console
- Six-character room code and copyable player link
- Phone- and tablet-first initiative page
- Current round and active turn
- Public initiative order and conditions
- Full-screen and keep-awake controls
- Automatic reconnect attempts
- No enemy HP, AC, Dexterity, combat logs, session prep, or DM notes transmitted
- Privacy regression tests

### Cleric in a Box supported rules and security

- Host-origin authorization for reset, undo, and settings
- Explicit DM-controlled Wisdom modifier, spell save DC, and spell attack bonus
- Versioned 5e (2014) and 5.5e (2024) Cleric spell lists
- Edition-specific supported formulas and resolution methods
- Version-2 room migration to version 3
- Campaign Hub room summaries

## Phase 4 — Campaign Library and Operational Safety — Complete

### Shared campaign foundation

- Versioned `DMForgeStore` shared summary schema
- Campaign Hub page
- One active campaign across connected tools
- Session, encounter, NPC, loot, magic-item, and artifact-room discovery
- Safe campaign counts and source labels
- Query-based campaign handoffs
- Safe Magic Item → Session Rewards handoff
- Safe NPC Forge → Session NPCs & Motives handoff
- Encounter Forge → Session Console initiative handoff
- Privacy tests proving detailed notes, secrets, curses, artwork, tactics, and full rules stay compartmentalized
- Shared summary export

### NPC Forge

- Public identity and private DM roleplay fields
- Motives, mannerisms, fears, leverage, lies, secrets, and relationships
- Player-safe and DM-only 5×7 cards
- Secure full-NPC, name, and roleplay-cue generators
- Campaign folders and reusable searchable NPC library
- Save, edit, duplicate, delete, export, and import
- Optional combat shorthand
- Live card-fit warnings and continuation pages
- Direct safe addition to Session Console prep
- Live cross-tab NPC updates
- Shared campaign summaries that exclude private NPC fields
- Privacy and integration regression tests

### Loot Forge

- Treasure parcel builder
- Coins, valuables, mundane gear, magic candidates, clues, and private notes
- Planned, Found, Distributed, Sold, Lost, and Returned status tracking
- Player-safe handouts and private DM parcels
- Campaign loot-ledger printing
- Safe Session Console reward transfer
- Unidentified Magic Item Forge placeholder transfer
- Stable draft identity and edited-item overwrite protection
- Shared campaign summaries that exclude private contents
- Privacy and integration regression tests

### Campaign Search

- Private search across sessions, encounters, NPCs, loot, magic items, and artifact rooms
- Campaign and record-type filters
- Private fields searchable only in the DM-facing tool
- Uploaded artwork excluded from the search index

### Backup & Storage Center

- Full recognized DM Forge safety copy
- Restore preview and explicit confirmation
- Storage and record summaries by tool
- Browser quota and backup-age indicators
- Import validation and integrity hashes
- Recovery regression tests

### Community

- Public Community landing page
- GitHub Discussions forum path
- Structured bug, feature, new-tool, and sourced rules-correction requests
- Code of Conduct, contributor guide, security policy, and pull-request checklist
- MIT license for original project code and documentation
- Separate third-party/SRD attribution boundaries

## Phase 5 — Production Validation — Automated Gate Complete, Physical Validation Active

### Automated production gate — Complete

- Static safety, rules, privacy, metadata, and anti-drift tests
- Desktop Chromium Playwright workflows
- Android Chromium emulation
- iPhone WebKit emulation
- Serious and critical axe accessibility checks
- Cross-tool privacy and persistence workflows
- Backup download and restore workflow
- Runtime-error checks on every public route
- Failure traces, screenshots, videos, and reports

### Exact deployed live-site gate — Complete

- Waits for GitHub Pages to report the exact expected commit
- Verifies every public route over HTTPS
- Runs the full browser suite against the deployed GitHub Pages origin
- Blocks a live-ready claim when the deployed site differs from source or a public workflow fails

### Physical validation — Active

- Windows Chrome and Edge
- Android phone and tablet
- iPhone and iPad
- Separate Wi-Fi and cellular multiplayer
- Keyboard-only, NVDA, and VoiceOver
- Physical cardstock, duplex, 5×7, packet, and continuation-page printing
- Live Core Web Vitals measurements

## Phase 6 — D&D Repository Consolidation — Active

### Highest priority: DungeonCards integration

- Preserve the complete licensed 5e and 5.5e spell and monster catalogs
- Preserve source pages, PDF hashes, version metadata, and CC BY 4.0 attribution
- Present it inside DM Forge as **Rules Compendium & Roll Cards**
- Keep reference-complete and automation-complete claims separate
- Share compatible monster data with Encounter Forge and Monster Card Forge
- Add campaign-aware handoffs only after storage and privacy review

### Repository review and adaptation

- Rebuild useful CharacterForge workflows as a local-first DM Forge Character Forge
- Review MonsterColoringBook art and lore for licensed/original printable resources
- Review D&D Language Translator as a Quick Tool
- Review Demon’s Wrath as the first teaching-adventure module
- Review Black Anvil Tavern as a reusable location showcase
- Review Dungeon Courtroom content and production pipeline
- Review the old campaign portal for player-handout and campaign-page concepts
- Keep DungeonMaps as a future local VTT system until its map canvas, tokens, fog, and roles are real
- Keep DungeonGate as a future voice/transcription system until implemented and secured
- Archive empty or superseded D&D repositories after review

## Phase 7 — Free User-Experience Improvements — Next

- Replace technical backup language with **Protect My Campaign**
- Automatic local restore points before risky operations and after sessions
- Plain-language recovery history
- Exact-record deep links from Campaign Search
- Local/open-source QR codes for Player Display and Cleric in a Box
- PWA installation and offline static caching
- Larger licensed catalogs through the DungeonCards synchronization pipeline
- Printable original guides, examples, and demonstrations for search discovery

## Deferred until the owner approves spending

- Required user accounts
- Hosted database synchronization
- Paid storage or map hosting
- Paid analytics
- Paid AI APIs
- Public internet voice infrastructure
- Cloud collaboration and co-DM editing

## Product rule

Every DM Forge tool must be fast enough to use during a session, readable on an ordinary printer, attractive enough to hand directly to a player, portable without a required account, and honest about what is complete. Shared summaries and public displays may connect the table, but private DM records remain compartmentalized unless the DM explicitly transfers them.
