# DM Forge Roadmap

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

### Session Console — Complete

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
- Direct Encounter Forge enemy imports

### Encounter Forge — Complete

- Official 2014 Easy, Medium, Hard, and Deadly XP thresholds
- Official 2014 multiple-monster and party-size multipliers
- Official 2024 Low, Moderate, and High direct XP budgets
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

### Shared Player Display — Complete

- DM-hosted read-only display room inside Session Console
- Six-character room code and copyable player link
- Phone- and tablet-first initiative page
- Current round and active turn
- Public initiative order and conditions
- Full-screen and keep-awake controls
- Automatic reconnect attempts
- No enemy HP, AC, Dexterity, combat logs, session prep, or DM notes transmitted
- Privacy regression tests

### Cleric in a Box Rules and Security — Complete for supported content

- Host-origin authorization for reset, undo, and settings
- Explicit DM-controlled Wisdom modifier, spell save DC, and spell attack bonus
- Versioned 2014 and 2024 Cleric spell lists
- Edition-specific supported formulas
- Version-2 room migration to version 3
- Campaign Hub room summaries

## Phase 4 — Campaign Foundation — Active

### Complete

- Versioned `DMForgeStore` shared summary schema
- Campaign Hub page
- One active campaign across connected tools
- Session, encounter, magic-item, and artifact-room discovery
- Safe campaign counts and source labels
- Query-based handoff into Session Console, Encounter Forge, Magic Item Forge, and Cleric in a Box
- Safe Magic Item → Session Rewards handoff
- Encounter Forge → Session Console initiative handoff
- Privacy tests proving detailed notes, item secrets, artwork, tactics, and full rules stay compartmentalized
- Shared summary export

### Next — NPC Forge

- Fast NPC builder
- Motives, mannerisms, secrets, and relationships
- Player-safe and DM-only cards
- Campaign folders and reusable NPC library
- Direct addition to Session Console prep

### Later — Loot Forge

- Treasure parcel builder
- Mundane and magic loot
- Send magic items directly into Magic Item Forge
- Player-safe handouts and party loot sheets

### Later campaign work

- Unified backup manifest with links to tool-specific backups
- Storage quota and last-backup indicators
- Optional accounts and cloud synchronization
- Shareable player handouts
- Maps and uploaded campaign assets

## Validation track

- Browser-level Playwright workflows
- axe accessibility testing
- Chrome and Edge print screenshots
- Physical phone and tablet testing
- Separate Wi-Fi and cellular multiplayer testing
- Physical cardstock and duplex printer calibration

## Product Rule

Every DM Forge tool must be fast enough to use during a session, readable on an ordinary printer, attractive enough to hand directly to a player, and portable without a required account. Shared summaries and public displays may connect the table, but private DM records remain compartmentalized unless the DM explicitly transfers them.
