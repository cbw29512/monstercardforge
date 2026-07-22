# DM Forge D&D Repository Consolidation Ledger

**Owner:** `cbw29512`  
**Product:** DM Forge  
**Hosting policy:** Free and local-first until the owner explicitly approves paid infrastructure  
**Primary live site:** `https://cbw29512.github.io/monstercardforge/`

## North star

DM Forge is the single public Dungeon Master website. Existing D&D repositories are not separate products competing for attention. Each repository must either strengthen the live DM Forge experience, become a clearly linked companion, provide licensed/original content, remain an explicitly staged future system, or be archived.

The target product combines:

- Monster cards and boss folios
- Rules compendium and executable roll cards
- Campaign organization
- Session preparation and live combat
- Encounter construction
- NPCs, loot, magic items, handouts, and printable packets
- Player-safe displays and table tools
- Characters, maps, adventures, locations, languages, and teaching resources
- Local-first privacy, recoverability, and offline-friendly behavior

## Free-only infrastructure decision

Until the owner approves spending:

- GitHub Pages remains the public host.
- GitHub Actions remains the validation system.
- GitHub Discussions and Issues remain the community backend.
- Browser local storage remains the primary campaign store.
- Downloadable Safety Copies and local restore points remain the recovery strategy.
- No paid database, hosted API, analytics platform, map service, AI API, or authentication provider may become required.
- Optional experimental use of a free tier must not make the live tools depend on a service that can pause, expire, or begin charging.
- Every public tool must remain useful without an account.

A future account/database decision requires a new architecture decision covering cost, privacy, export, deletion, migration, offline behavior, vendor lock-in, and failure recovery.

## Classification meanings

### Integrate

Working code or source data should become part of DM Forge after licensing, security, UX, and migration review.

### Rebuild as a DM Forge module

The idea or workflow is valuable, but the existing architecture cannot be safely dropped into the static local-first product.

### Import content

Original or appropriately licensed adventures, maps, artwork, instructions, tables, or reference material should be adapted into DM Forge resources.

### Companion

The project remains technically separate but launches from DM Forge with consistent branding and campaign context.

### Future system

The project contains useful foundations, but its advertised capability is not yet implemented enough for the live public tool list.

### Archive

The repository is empty, superseded, duplicated, or no longer aligned with the product.

## Repository decisions

| Repository | Classification | Current value | DM Forge destination | Status |
|---|---|---|---|---|
| `monstercardforge` | Primary product | Current live DM toolkit and validation gates | DM Forge public site | Active |
| `DungeonCards` | Live companion and source authority | React/TypeScript rules guide, 658 licensed spell references, 642 licensed monster references, weapon/roll cards, encounter folios, homebrew builders, deterministic SRD synchronization, and generated DM Forge exports | **Rules Compendium & Roll Cards**, authoritative Encounter Forge monster catalog, and future Monster Card Forge full-stat source | Companion and Encounter Forge integration complete; full-stat adapter next |
| `healingbox` | Companion, later integrate shared shell | Working multiplayer Cleric in a Box artifact tracker with versioned rules and host authorization | **Cleric in a Box** table tool | Live companion |
| `CharacterForge` | Rebuild as DM Forge module | Flask roles, campaigns, character routes, templates, uploads, and PDF workflow | **Character Forge** using the DM Forge design system and local-first campaign model | Architecture review follows monster-card integration |
| `DungeonMaps` | Future system | Tested Express/SQLite/WebSocket campaign foundation and join codes; no map canvas, tokens, or fog yet | **Maps & Tabletop Display** | Do not advertise as complete |
| `DungeonGate` | Future system | Portable voice/transcription concept; auth, voice, TURN, and transcription remain planned | **Voice, Transcription & Recaps** | Future only |
| `MonsterColoringBook` | Import content and pipeline | Local AI monster-art/book pipeline and large planned monster series | Printable monster art, coloring/activity resources, and optional licensed/original visual assets | Licensing and content review required |
| `DNDLanguageTranslator` | Rebuild/import | D&D language utility concept | **Fantasy Language Translator** quick tool | File-level review pending |
| `DNDTeachingAdventureDemonsWrath` | Import content | Teaching-adventure project | **Adventures & Teaching Modules** | Content and license review pending |
| `DND_DM_Player_Instruction` | Import content | DM/player instruction concept | **Learn to Play / Table Guide** | Content review pending |
| `dnd-campaign-portal` | Import concepts, then archive or supersede | Earlier campaign portal implementation | Campaign Hub, player handouts, campaign landing pages | File-level review pending |
| `black-anvil-tavern` | Import content or rebuild | Tavern/location project | **Locations & Taverns** showcase and reusable campaign location | File-level review pending |
| `dungeoncourtroom` | Import content | Dungeon courtroom concept | Adventure/location module | Content review pending |
| `dungeoncourtroom-pipeline` | Import pipeline/content selectively | Large generation pipeline related to Dungeon Courtroom | Adventure production tooling, not a public runtime dependency | File-level review pending |
| `lootforge` | Archive | Empty original placeholder | Superseded by live Loot Forge inside DM Forge | Archive candidate |
| `dnd_ai_dungeon_master` | Archive or hold | Empty repository | No current destination until a concrete, privacy-safe local AI feature exists | Archive candidate |
| `C-Users-divcl-OneDrive-Desktop-FantasyColorForge` | Archive | Empty accidental-path repository | None | Archive candidate |

## DungeonCards integration rules

DungeonCards remains the source authority because it distinguishes reference-complete content from automation-complete content and records source pages, source versions, PDF digests, rulesets, and CC BY 4.0 attribution.

Integration must preserve:

- Separate 5e (2014) and 5.5e (2024) records
- Exact source and license metadata
- Deterministic generated files
- Source verification tests
- Clear separation between readable references and executable roll procedures
- Original/homebrew labels
- Existing Monster Card Forge print identity
- No handwritten duplicate catalog in the main repository

### Milestone 1 — Live companion integration — Complete

- DungeonCards identifies its D&D experience as **DM Forge — Rules Compendium & Roll Cards**.
- Direct links open Rules Guide, Compendium, Player, DM, Encounter, Card Builder, or Monster Builder without showing the experimental system gateway first.
- A persistent product link returns to the main DM Forge toolkit.
- Public metadata uses the DM Forge identity.
- The main site has a dedicated `rules-compendium.html` gateway.
- The gateway explains reference-complete versus automation-complete scope.
- The main live-site gate checks the companion route and deep-link behavior.
- The experimental Call of Cthulhu preview is not promoted through the DM Forge D&D gateway.

### Milestone 2 — Encounter Forge monster-summary adapter — Complete

- DungeonCards generates a deterministic schema-1 monster-summary export during every production build.
- The export contains exactly 314 SRD 5.1 and 328 SRD 5.2.1 records.
- Source PDF URLs, SHA-256 digests, attribution, counts, and CC BY 4.0 labels remain in the payload.
- Both 5e horizontal and 5.5e vertical stat-block formats are parsed and tested.
- Encounter Forge loads all 642 records without copying them into a handwritten local catalog.
- Search and filters reach every record while the initial rendered DOM is capped at 120 cards.
- Built-in samples and saved custom monsters remain usable when the companion is unavailable.
- Source references survive encounter saving, printing, and Session Console handoff.
- The deployed live gate validates the JSON contract and a sourced Aboleth handoff across desktop Chromium, Android Chromium emulation, and iPhone WebKit.

### Milestone 3 — Monster Card Forge full-stat adapter — Next

- Define a richer deterministic export for traits, actions, bonus actions, reactions, legendary actions, spells, gear, raw source text, and source metadata.
- Map records into the existing Monster Card Forge schema without weakening the fold-over, accordion, or boss-folio designs.
- Add continuation behavior for content that cannot fit instead of clipping or silently omitting rules.
- Preserve verified SRD, original DM Forge homebrew, and user-created homebrew as distinct content classes.
- Validate representative 5e, 5.5e, spellcasting, legendary, and unusually long records before scaling the UI to all 642.
- Add exact spell and monster links from Campaign Search and future encounter records after stable public record routes exist.
- Keep DungeonCards user workspaces namespaced and private until a separate storage adapter is reviewed and tested.

## Production rule for repository imports

Nothing enters the live homepage merely because it exists in GitHub. Before promotion, imported work must have:

1. A complete user workflow.
2. A clear ruleset and source boundary.
3. Licensing and attribution review.
4. Privacy and storage review.
5. Design-system adoption.
6. Mobile and keyboard usability.
7. Static and browser regression tests.
8. Exact-commit live GitHub Pages validation.
9. Documentation, migration, and rollback notes.
10. Honest wording about incomplete capabilities.

## Immediate free work order

1. Keep the exact-commit live-site gate green on every DM Forge update.
2. Build and validate the Monster Card Forge full-stat adapter.
3. Inventory the remaining D&D repositories at file level.
4. Add exact-record deep links between Campaign Search and source tools.
5. Add QR joining using a local/open-source QR implementation.
6. Add PWA/offline support using static service-worker caching.
7. Review CharacterForge as the next full workflow module.
8. Review original adventures, locations, language tools, and player guides.
9. Perform physical phone, tablet, screen-reader, multiplayer, and printer validation.
10. Archive empty or superseded repositories after recorded review.

## Drift prevention

- This ledger is the authority for cross-repository decisions.
- A repository classification may change only through a documented commit explaining why.
- New D&D repositories must be added here before being promoted or merged.
- The roadmap and homepage must not claim a tool is complete when this ledger marks it future, pending review, or archive.
- Paid infrastructure remains prohibited until superseded by an explicit owner-approved architecture decision.
