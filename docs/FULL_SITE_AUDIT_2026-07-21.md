# DM Forge Full-Site Audit — 2026-07-21

## Executive summary

DM Forge has moved from a collection of related static tools into a governed, connected product platform with one visual system, one rules-verification ledger, one change-control process, and automated drift checks.

This audit covered:

- Homepage and public discovery
- Campaign Hub and shared campaign summaries
- Campaign Search
- Session Console
- Encounter Forge
- Player Display
- Monster Card Forge
- Magic Item Forge
- NPC Forge
- Loot Forge
- Backup & Storage Center
- The separate Cleric in a Box repository and live site
- Responsive behavior visible from source
- Typography, color, controls, focus, motion, and print styles
- Local-storage schemas and cross-tool adapters
- Privacy boundaries
- D&D rules data currently represented by the tools
- Licensing and source metadata
- SEO and people-first growth foundations
- Documentation, rollback, and anti-drift controls

## Audit result

### Strong and production-oriented

- Shared campaign navigation and local-first privacy model
- Session Console workflow and player-HP boundary
- Encounter Forge 5e and 5.5e calculation separation
- Player Display allowlist and host model
- Magic Item overflow-safe printing and private DM backs
- NPC and Loot player/DM separation
- Full local backup and restore controls
- Campaign-wide private search
- Cleric in a Box host authorization and exact-level charge model
- Canonical design, rules, SEO, and change-control documents

### Corrected during this audit

- Multiple competing page-specific palettes and UI fonts
- Repeated Google font downloads
- Missing canonical URLs and social metadata
- Missing sitemap and crawler policy
- Public 2014/2024 terminology that lacked current 5e/5.5e context
- CR 0 encounter XP edge cases
- 5.5e encounters exceeding the High budget being labeled merely High
- Duplicate Cleric spell-slot progression inside legacy migration code
- Edition-insensitive Cleric spell resolution
- Incorrect 5.5e Flame Strike formula
- Incomplete Guardian of Faith result text
- Missing concentration and trigger differences for Spiritual Weapon and Spirit Guardians
- Incomplete resurrection and fixed-healing riders
- Incomplete Adult Black Dragon and Lich sample data
- Incorrect Lich Arcana bonus
- Missing Lich spell-slot counts
- Missing monster save DCs, damage, legendary-action costs, source, license, and scope in rendered cards
- Loot Forge hardening file existing in the repository but not being loaded by the live page
- Static integrity coverage omitting several live pages

### Still requires real-world validation

- Physical Android and iOS phone testing
- Tablet testing
- Separate Wi-Fi and cellular multiplayer testing
- Long-running host-tab and reconnect behavior
- Screen-reader testing
- Keyboard-only end-to-end workflows
- Browser automation with Playwright
- Automated accessibility testing with axe
- Live Core Web Vitals field data
- Chrome and Edge print screenshot comparisons
- Physical printer/cardstock/duplex calibration
- Expanded licensed 5.5e monster catalog
- Optional lair and regional stat-block modules
- PWA/offline installation

## Research standards

### Product design and accessibility

The design review uses current W3C WCAG 2.2 guidance as the accessibility target. The shared system includes:

- Visible keyboard focus
- 44-pixel preferred control height
- Mobile-safe form sizing
- Reduced-motion support
- Safe-area handling
- Contrast-tested primary color pairs
- System UI typography for dense interactive surfaces
- Separate editorial typography for printed artifacts

Primary reference:

- https://www.w3.org/TR/WCAG22/

### Performance

The performance target follows current Core Web Vitals guidance measured at the 75th percentile for mobile and desktop:

- Largest Contentful Paint: 2.5 seconds or less
- Interaction to Next Paint: 200 milliseconds or less
- Cumulative Layout Shift: 0.1 or less

Primary references:

- https://web.dev/articles/vitals
- https://web.dev/articles/defining-core-web-vitals-thresholds

These are targets, not current measured claims. Live field instrumentation has not yet been established.

### Search and sustainable growth

The growth standard follows Google Search Central people-first guidance:

- Build original utility and useful guides
- Keep page structure crawlable
- Use descriptive titles and headings
- Document expertise, sources, testing, and limitations
- Avoid copied content, doorway pages, thin automated pages, fabricated reviews, and keyword stuffing

Primary references:

- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/title-link

### Rules authority

D&D rules are verified in this order:

1. Current official Wizards of the Coast / D&D Beyond rules pages
2. SRD 5.1 or SRD 5.2.1 under CC-BY-4.0
3. Official errata and changelog entries
4. Clearly labeled DM Forge heuristics
5. Clearly labeled homebrew

D&D Beyond changed its public terminology on 2026-03-02:

- 2014 rules are displayed as 5e
- revised 2024 rules are displayed as 5.5e

Internal saved identifiers remain `2014` and `2024` for compatibility.

## Canonical design system

### Typography

| Role | Font | Use |
|---|---|---|
| Display | Cinzel | Product identity, H1–H3, card names |
| UI | System sans / Inter fallback | Navigation, forms, tables, logs, buttons |
| Editorial | Georgia / Times | Printed handouts and cards |
| Mono | Cascadia Mono / Segoe UI Mono / Consolas | Room codes and identifiers |

The retired IM Fell English UI font is prohibited by automated test. Google Fonts are centralized in `shared/design-system.css`, with only Cinzel requested remotely.

### Color system

Canonical tokens are defined in `shared/design-system.css` and documented in `docs/DESIGN_SYSTEM.md`.

Contrast-tested pairs include:

- Primary text on parchment: greater than 16:1
- Muted text on parchment: greater than 6.9:1
- Light text on brand red: greater than 8.7:1
- Light text on informational blue: greater than 6.8:1
- Light text on success green: greater than 5.8:1
- Dark text on gold: greater than 5.5:1

### Page alignment

The shared design system reaches pages in two ways:

- Direct stylesheet link on standalone pages
- Automatic injection by `shared/dmforge-store.js` on connected tools

Monster Card Forge retains creature-specific card colors and its dark artwork stage, while its application shell now uses the same parchment/red/gold system as the rest of DM Forge.

Cleric in a Box preserves an artifact-specific background while consuming the canonical color and typography roles.

## Page-by-page findings

### Homepage

Status: **Strong discovery foundation**

Added:

- Unique title and description
- Canonical URL
- Robots directive
- Open Graph and Twitter metadata
- WebApplication structured data
- Crawlable links to every live tool
- Current product positioning

Remaining:

- Purpose-built social share image
- Field performance measurements
- More visible public links to methodology and useful guides

### About & Methodology

Status: **New trust page**

Explains:

- Rules methodology
- Official versus heuristic versus homebrew status
- Privacy model
- Accessibility approach
- Testing and change control
- Source and licensing policy
- Known product boundaries

### Campaign Hub

Status: **Strong**

- Shared active campaign remains summary-only
- Ruleset choices now display 5e (2014) and 5.5e (2024)
- Public methodology, search, and backup controls are linked
- Private detailed records remain in source tools

### Campaign Search

Status: **Strong local-private utility**

- Indexes private records across tools
- Excludes uploaded artwork blobs
- Marks itself as a private DM view
- Provides campaign and record-type filters

Remaining:

- Exact-record deep links
- Search ranking/highlighting improvements
- Very-large-library performance testing

### Session Console

Status: **Strong live-session tool**

- Player HP remains player-controlled
- Enemy HP, AC, conditions, initiative, prep, logs, dice, generators, and archives remain DM-side
- Reference board correctly identifies itself as names/prompts only
- Action wording now accommodates 5e and 5.5e naming differences

Remaining:

- Browser-level workflow automation
- Screen-reader and keyboard testing
- Physical long-session testing
- Potential ruleset-aware reference-board expansion

### Encounter Forge

Status: **Verified with documented heuristics**

Verified:

- 5e Easy/Medium/Hard/Deadly thresholds
- 5e multiple-monster multipliers
- 5e party-size adjustment
- 5.5e Low/Moderate/High direct budgets
- CR-to-XP values through CR 30
- Mixed-level party aggregation

Corrected:

- CR 0 may be 0 or 10 XP; an explicit zero is preserved
- 5.5e encounters over the High budget are labeled Above High
- Over-budget warning cites official procedure
- Average-party CR warning and CR-spread prompt are labeled heuristics

Remaining:

- Larger licensed catalog
- More source/version metadata for imported custom monsters
- Field validation with real mixed-level parties

### Player Display

Status: **Privacy-safe by source review and regression test**

Public fields:

- Campaign
- Session title
- Round
- Current turn
- Initiative values
- Combatant names/types
- Public conditions

Explicitly excluded:

- Current/max HP
- AC
- Dexterity
- Prep
- Logs
- DM notes

Remaining:

- QR join code
- Cross-network mobile validation
- Reconnect stress testing

### Monster Card Forge

Status: **Verified for declared base 5e SRD sample scope**

Published sample records:

- Goblin
- Adult Black Dragon
- Lich

Corrected and protected by tests:

- Exact SRD 5.1 source and CC-BY-4.0 metadata
- CR and XP
- Save DCs
- Action damage
- Legendary-action costs
- Lich Arcana +19
- Lich spell save DC, attack bonus, and slot counts
- Source/license/verification footer
- Scope note

Optional lair actions and regional effects are deliberately excluded until separately sourced and tested.

Homebrew Frost Troll is explicitly labeled DM Forge Original Homebrew and not official D&D content.

Remaining:

- Licensed 5.5e monster records
- More licensed 5e records
- Optional sourced lair/regional modules
- Physical card and accordion print validation

### Magic Item Forge

Status: **Strong homebrew authoring and print system**

- Player and DM views separated
- Identification states and evolving stages
- Artwork storage and backup
- Overflow measurement and continuation sheets
- Safe Session Console summary handoff

Rules boundary:

- User-entered item rules are homebrew unless the user supplies licensed/source-verified content
- The builder cannot guarantee balance or rules accuracy for user text

Remaining:

- Public content/source labels on every preset
- Physical duplex calibration
- Storage-quota stress testing with artwork

### NPC Forge

Status: **Strong homebrew campaign tool**

- Player-safe cards exclude motives, secrets, lies, relationships, and combat notes
- DM cards retain private data
- Safe Session Console handoff
- Overflow continuation
- Original generator content

Remaining:

- Exact-record search deep links
- Relationship graph visualization
- Physical card testing

### Loot Forge

Status: **Strong original campaign tool**

- Player and DM parcels separated
- Original generator clearly labeled non-official
- Safe session reward handoff
- Magic-item placeholder handoff avoids overwriting edited items
- Hardening layer is now actually loaded by the live page

Remaining:

- Physical handout and ledger testing
- Distribution workflow testing with large libraries

### Backup & Storage Center

Status: **Strong recovery foundation**

- Recognized-key allowlist
- Transient encounter handoff excluded
- Import size limit
- JSON validation
- SHA-256 integrity fields
- Restore confirmation
- Per-tool counts and storage size

Remaining:

- Restore-on-second-device live test
- Selective restore
- Encrypted backups if cloud storage is introduced

### Cleric in a Box

Status: **Verified for represented base-level automatic effects plus explicit homebrew artifact laws**

Verified:

- Full-caster slot progression
- Separated 5e and 5.5e Cleric spell lists
- Healing-potion formulas
- Base-level formulas represented in `EFFECTS`
- Edition-specific attack/save methods
- Important half-damage or fixed-result riders
- Concentration and trigger differences represented where required
- Host-only reset, undo, and settings

Corrected:

- Legacy migration now imports the canonical slot table instead of duplicating it
- 5e Inflict Wounds uses a melee spell attack; 5.5e uses a Constitution save
- 5.5e Flame Strike uses 10d6 total
- Spiritual Weapon concentration split
- Spirit Guardians trigger split
- Blade Barrier damage-type/trigger split
- Guardian of Faith 20/10 result and 60-damage expiration
- Resurrection limits and high-impact riders

Homebrew:

- Free-action artifact activation
- Semi-sentience
- Deity-only control
- Immunity to theft, destruction, suppression, banishment, or separation

Remaining:

- Cross-network device test
- QR joining
- Physical session-duration testing
- Continued reverification after official errata or SRD changes

## SEO and traffic plan

### Completed foundation

- Unique page titles and descriptions
- Canonical URLs
- Robots directives
- Sitemap
- Crawlable links
- Structured data on homepage
- Public methodology/trust page
- Tool pages aligned to clear search intent

### Ethical growth work still needed

1. Publish genuinely useful guides connected to the tools.
2. Create purpose-built screenshots and share images.
3. Add Search Console after the public domain decision.
4. Add privacy-respecting analytics only after documenting the event and data policy.
5. Produce short demonstration videos showing real DM workflows.
6. Share printable samples in communities only where promotion is allowed.
7. Add subtle URL/QR attribution to printable samples.
8. Measure guide-to-tool conversion without collecting campaign content.

### Recommended first guides

- How to build a balanced 5e encounter
- How 5e and 5.5e encounter budgets differ
- How to print double-sided D&D magic item cards
- How to run initiative while players track their own HP
- How to create player-safe NPC cards
- How to back up browser-based campaign data

## Automated drift protection

Current test coverage protects:

- JavaScript syntax
- Page and asset contracts
- Retired-font prohibition
- Centralized font import
- Canonical design-system features
- Color contrast
- Unique metadata and canonical URLs
- Sitemap coverage
- Rules-source IDs and verification dates
- Encounter calculations and edge cases
- Cleric spell differences
- Licensed monster values and source metadata
- Player-display privacy
- NPC and Magic Item privacy handoffs
- Loot hardening deployment
- Backup validation contracts
- Print overflow continuation
- Methodology-page trust content

## Documentation and rollback system

Canonical documents:

- `docs/DESIGN_SYSTEM.md`
- `docs/SEO_GROWTH_STANDARD.md`
- `docs/RULES_VERIFICATION_LEDGER.md`
- `rules/rules-sources.json`
- `docs/CHANGE_CONTROL.md`
- `docs/DECISIONS.md`
- `LIVE-VALIDATION-CHECKLIST.md`
- this audit

Changes must follow:

1. Inspect current source and consumers.
2. Change one authority first.
3. Add a regression test.
4. Update documentation.
5. Validate syntax, browser, mobile, privacy, and print layers.
6. Commit in reversible units.
7. Record exceptions and rollback points.

## Release classification

### Source-level status

**Release candidate for live user validation.**

The source now has substantially stronger consistency, rules traceability, licensing metadata, privacy boundaries, and regression protection.

### Not yet claimed

DM Forge is not yet claimed to be:

- fully physically tested on every target device
- fully screen-reader validated
- fully performance-measured in the field
- a complete D&D rules database
- a complete 5e or 5.5e monster catalog
- an official Wizards of the Coast product

## Required next validation order

1. Run the full repository test suites and confirm GitHub Actions.
2. Test main workflows in current Chrome and Edge.
3. Test Android and iOS phones/tablets.
4. Test Player Display and Cleric in a Box across separate networks.
5. Test keyboard-only use.
6. Run axe and screen-reader checks.
7. Print every supported physical format.
8. Measure live Core Web Vitals.
9. Add PWA/offline support after current live behavior is stable.
10. Expand licensed monster content only through the rules/source ledger.

## Decisions still needed from the owner

These do not block the source audit, but they affect public launch strategy:

- Keep the name **DM Forge** or choose a different public brand
- Continue on GitHub Pages or purchase a custom domain
- Public maintainer identity: GitHub username, first name, or full public name
- Repository license and whether the project is intended to be open source
- Analytics preference: none, privacy-respecting analytics, or Google Analytics plus Search Console
- Promotion channels the owner is comfortable using
