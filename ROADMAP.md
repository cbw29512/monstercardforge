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

## Phase 3 — Run the Session — Active

### Session Console — Complete

- Multiple locally saved campaigns
- Reusable current-session prep sheet
- Opening beat, likely scenes, secrets, NPCs, locations, rewards, and loose notes
- Timestamped session log
- Initiative order with Dexterity tiebreaks
- Round and current-turn tracking
- Enemy and NPC HP, AC, and conditions
- Player initiative without player HP tracking
- Persistent campaign player roster
- Combat chronicle
- Secure dice with advantage and disadvantage
- NPC, inn, rumor, weather, treasure, complication, and name generators
- Session archive
- Printable session packet
- JSON backup and import
- Shared campaign context
- Live receipt of safe Magic Item reward summaries

### Cleric in a Box Rules and Security — Complete for supported content

- Host-origin authorization for reset, undo, and settings
- Explicit DM-controlled Wisdom modifier, spell save DC, and spell attack bonus
- Versioned 2014 and 2024 Cleric spell lists
- Edition-specific supported formulas
- Version-2 room migration to version 3
- Campaign Hub room summaries

### Encounter Forge — Next

- Separate 2014 and 2024 difficulty models
- Party profiles and encounter budgets
- Environment, type, CR, size, source, and legendary filters
- Random encounter styles
- Custom monsters from Monster Card Forge
- Saved encounter history in the shared campaign store
- Direct launch into Session Console
- Printable encounter packet

### Shared Player Display

- Phone and tablet initiative view
- Current turn and round
- Public conditions and visible combatants
- No private enemy HP or DM notes

### NPC Forge

- Fast NPC builder
- Motives, mannerisms, secrets, and relationships
- Player-safe and DM-only cards
- Campaign folders and reusable NPC library
- Direct addition to Session Console prep

### Loot Forge

- Treasure parcel builder
- Mundane and magic loot
- Send magic items directly into Magic Item Forge
- Player-safe handouts and party loot sheets

## Phase 4 — Campaign Foundation — Active

### Complete

- Versioned `DMForgeStore` shared summary schema
- Campaign Hub page
- One active campaign across connected tools
- Existing Session Console and Magic Item campaign discovery
- Cleric in a Box room-summary discovery
- Safe campaign counts and source labels
- Query-based handoff into Session Console and Magic Item Forge
- Safe Magic Item → Session Rewards handoff
- Privacy tests proving detailed notes, item secrets, artwork, and full rules stay compartmentalized
- Shared summary export

### Next

- Encounter records in Campaign Hub
- Monster Card → Encounter Forge → Session Console handoff
- NPC and Loot shared summaries
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
- Separate Wi-Fi and cellular Cleric in a Box testing
- Physical cardstock and duplex printer calibration

## Product Rule

Every DM Forge tool must be fast enough to use during a session, readable on an ordinary printer, attractive enough to hand directly to a player, and portable without a required account. Shared summaries may connect tools, but private DM records remain compartmentalized unless the DM explicitly transfers them.
