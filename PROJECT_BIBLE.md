# Monster Card Forge — Project Bible

Version: 1.0  
Status: Active MVP development  
Repository: `cbw29512/monstercardforge`

Use this document as the source of truth when restarting a chat or onboarding any AI/developer. Before continuing development, read this file first.

---

## 1. Project Vision

Monster Card Forge is a print-first and web-ready tabletop RPG monster card system.

The product exists to help Game Masters run combat faster by turning monster information into standardized, easy-to-print, easy-to-carry cards.

The core value is not merely “monster stat blocks.” The core value is a professional print system that makes monsters easier to use at the table than books, PDFs, or random browser tabs.

### Target users

- Dungeon Masters / Game Masters
- Tabletop players who manage summons, companions, wild shape, familiars, or sidekicks
- Homebrew creators
- Teachers, clubs, conventions, and organized play groups
- Future customers buying printable and/or professionally printed card packs

### Primary problem solved

Game Masters lose time flipping books, searching PDFs, switching tabs, and re-reading complex monster abilities during combat.

Monster Card Forge solves this by producing standardized, sleeve-compatible, table-ready cards.

---

## 2. Product Philosophy

- Physical printing is a first-class feature, not an afterthought.
- Every card should be easy to print, cut, fold, laminate, sleeve, and carry.
- Finished standard cards must fit trading-card sleeves and 9-pocket binder pages.
- Combat readability matters more than squeezing everything onto one face.
- If a monster is too complex, the layout expands; text does not shrink into unreadability.
- The site should be customer-first, not database-first.
- The first page must quickly explain the problem, the solution, and the next action.
- The free Goblin card is the first proof of quality.
- The Lich and Adult Black Dragon prove that boss monsters scale correctly.

---

## 3. Physical Card Standard

### MCF-001 — Finished standard card size

Every standard folded card must finish at:

- Width: **2.5 inches**
- Height: **3.5 inches**

This is standard poker/trading card size.

The finished card must fit:

- Standard trading card sleeves
- 9-pocket binder pages
- Card storage boxes
- Laminated home-use setups

### MCF-002 — Cut-and-fold unfolded size

A standard cut-and-fold card is printed as one connected piece:

- Width: **5.0 inches**
- Height: **3.5 inches**

It contains two panels:

- Front panel: 2.5 × 3.5
- Back panel: 2.5 × 3.5

### MCF-003 — Edge-touch fold rule

The right edge of the front panel must touch the left edge of the back panel.

There is:

- No spacer
- No hinge
- No gutter
- No wide fold area
- No gap

There is only a zero-width dotted score/fold line at the seam.

### MCF-004 — Cutting rule

Users cut only around the outside perimeter of the full 5 × 3.5 piece.

They do not cut the middle seam.

### MCF-005 — Folding rule

Users fold on the dotted seam.

After folding, the final footprint must still be 2.5 × 3.5.

### MCF-006 — Lamination rule

For cut-and-fold cards:

1. Print on cardstock.
2. Cut the outside perimeter.
3. Fold on the dotted seam.
4. Laminate after folding.
5. Trim laminate if needed.

### MCF-007 — Rejection rule

If a layout cannot preserve the final 2.5 × 3.5 sleeve-compatible size, reject the layout and redesign it.

---

## 4. Print Modes

### Standard Monster Print Modes

#### Option A: Cut-and-Fold — Recommended

Default for most users.

- Works on normal printers.
- Front and back print side-by-side as one connected 5 × 3.5 piece.
- Panels touch edge-to-edge.
- A dotted fold line is printed exactly where the two card edges touch.
- User cuts the outside perimeter.
- User folds on the dotted seam.
- User laminates after folding.

#### Option B: Duplex Front/Back

For printers with accurate double-sided printing.

- Front page contains card fronts.
- Back page contains matching backs.
- User prints double-sided at 100% scale.
- Alignment testing is required.

The website must let users explicitly choose between Cut-and-Fold and Duplex.

### Boss Monster Print Modes

Boss monsters are monsters with high complexity, such as legendary actions, lair actions, heavy spellcasting, mythic features, or many combat rules.

#### Option A: Boss Folio

A fold-out connected reference for complex monsters.

- Built from multiple 2.5 × 3.5 panels.
- Panels touch edge-to-edge.
- Dotted fold lines appear only where panels touch.
- No spacers or hinges.
- Designed to fold into a compact reference.

#### Option B: Boss Decklet

A fallback for high-CR or complex monsters when accordion lamination is awkward.

- Multiple standard cut-and-fold cards.
- Each unfolded piece is 5 × 3.5.
- Each folded piece becomes a normal 2.5 × 3.5 card.
- Cards can be sleeved together as a boss mini-deck.

The website must let users explicitly choose between Boss Folio and Boss Decklet.

---

## 5. Accordion / Boss Folio Rules

The Boss Folio must be solved as a physical manufacturing layout, not just a visual grid.

Rules:

- Each panel is exactly 2.5 × 3.5.
- Adjacent panels touch edge-to-edge.
- Fold lines are zero-width dotted score lines.
- No panel spacing is permitted.
- Do not use a 2-row visual grid unless it corresponds to an actual duplex or folio production pattern.
- Test with paper before finalizing.

Current concern:

A single 3-panel or 6-panel folio may become awkward when laminated. The Boss Decklet may become preferred for complex monsters if it handles better physically.

---

## 6. Website UX Standards

Every page must answer:

1. What is this?
2. Who is it for?
3. What problem does it solve?
4. What should I do next?

The homepage/hero must communicate:

- “Stop flipping books in combat.”
- Print a monster card.
- Run the encounter faster.

Primary user flow:

1. Understand the problem.
2. Print the free Goblin sample.
3. See how complex monsters scale with Dragon/Lich examples.
4. Browse cards.
5. Create homebrew.
6. Later, buy/download packs.

Tabs/pages should feel intuitive:

- Free Goblin Sample: proof of product quality.
- Browse Cards: find a monster and choose a print mode.
- Create Homebrew: guided builder with live preview.
- Legal / Attribution: trust and licensing clarity.
- Future Print Studio: dedicated manufacturing/export workspace.

---

## 7. Card Content Rules

Every monster card must include enough information to run the monster in combat.

Keep:

- AC
- HP
- Speed
- Ability scores/modifiers
- Saves
- Skills
- Senses
- Resistances
- Immunities
- Condition immunities
- Traits needed in combat
- Actions
- Bonus actions
- Reactions
- Legendary actions
- Spellcasting, when combat relevant
- Lair actions, when relevant

Can omit or move to secondary panels:

- Long lore
- Non-combat ecology
- Long flavor text
- Extended regional effects unless encounter-relevant

Rule: Do not remove combat-critical information just to fit the card. Expand layout instead.

---

## 8. Monster Data Schema Direction

Monster data should be structured and renderer-agnostic.

A monster record should include:

- `id`
- `ruleset`
- `source`
- `name`
- `cr`
- `type`
- `size`
- `alignment`
- `ac`
- `hp`
- `speed`
- `abilities`
- `saves`
- `skills`
- `senses`
- `languages`
- `resistances`
- `immunities`
- `conditionImmunities`
- `traits`
- `actions`
- `bonusActions`
- `reactions`
- `legendaryActions`
- `spellcasting`
- `lairActions`
- `regionalEffects`
- `layoutHint`
- `art`
- `tags`
- `packMembership`
- `legalAttribution`

Data changes. Templates stay consistent.

---

## 9. Ruleset Support

The project must support ruleset separation from the beginning.

Current required buckets:

- 5E 2014
- 5E 2024
- Homebrew
- Original Monster Card Forge content

Rulesets must not be silently mixed.

If a user wants to mix 2014 and 2024 material, the UI must make that explicit.

---

## 10. Licensing and Legal Rules

Monster Card Forge must be legally clean before public sale.

Rules:

- Keep SRD/open-license content separated by source and ruleset.
- Include required attribution where applicable.
- Do not use copied fantasy art or random web images.
- Use original, licensed, public-domain, properly attributed, or generated/owned art only.
- User-created homebrew must be treated as user content.
- Website must include Legal / Attribution page.
- Exported PDFs/card packs must include attribution/credits page when needed.

Standard disclaimer direction:

Monster Card Forge is an independent tabletop utility and is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC.

---

## 11. Homebrew Builder Standards

The Homebrew Builder should be extremely easy to follow.

Every input section should include:

- Plain-English explanation
- Example value
- Helper text
- Validation warnings
- Live preview
- Print layout recommendation

Required experience:

- User can start from an example monster.
- User can copy/edit/print without knowing HTML or layout rules.
- The builder should not feel like a blank tax form.
- The print engine decides layout automatically based on complexity.

Future builder sections:

1. Identity
2. Combat summary
3. Abilities
4. Saves/skills
5. Senses/languages
6. Traits
7. Actions
8. Bonus actions
9. Reactions
10. Legendary actions
11. Spellcasting
12. Lair/regional effects
13. Art
14. Print settings
15. Validation/export

---

## 12. Store and Pack Structure

Future monetization should support:

- Single cards
- Creature type packs
- CR range packs
- Environment/lair packs
- Boss packs
- Adventure packs
- Full 2014 SRD set
- Full 2024 SRD set
- Homebrew/original premium packs
- Professionally printed decks later

Potential filters:

- Ruleset
- CR
- Creature type
- Environment
- Legendary
- Spellcaster
- Lair monster
- Damage type
- Immunities
- Size
- Alignment

Do not activate real sales until print QA, legal attribution, and content validation pass.

---

## 13. SEO Standards

Important SEO targets:

- printable monster cards
- 5e monster cards
- DnD monster cards printable
- monster card generator
- homebrew monster card maker
- RPG monster reference cards
- printable monster stat cards
- boss monster cards
- laminated monster cards

Future SEO pages:

- `/free-goblin-card`
- `/monster-cards/2014`
- `/monster-cards/2024`
- `/tools/homebrew-monster-card-maker`
- `/print/cut-and-fold-monster-cards`
- `/print/boss-folio-monster-cards`
- `/packs/undead`
- `/packs/dragons`
- `/packs/cr-0-1`
- `/packs/cr-17-plus`

Future ecommerce pages should include:

- Product metadata
- Breadcrumbs
- FAQ markup
- Clear product description
- Download/print instructions
- Attribution notice
- Preview images

---

## 14. Code and Architecture Standards

Current MVP is browser-based static HTML/CSS/JS.

Architecture direction:

- Data-driven renderer
- Reusable card engine
- Print engine as a first-class module
- Templates separate from monster data
- Print layouts based on physical measurements
- No monster-specific HTML templates

Coding standards:

- Use meaningful names.
- Use try/catch or safe render wrappers for runtime rendering code.
- Log meaningful errors.
- Keep files modular.
- Split files that exceed ~150 lines where practical.
- Avoid technical debt that blocks print precision.

Current important files:

- `index.html`
- `src/js/app.js`
- `src/js/appState.js`
- `src/js/cardEngine.js`
- `src/js/printStudio.js`
- `src/js/views.js`
- `src/js/homebrewSchema.js`
- `src/js/logger.js`
- `src/data/monsters.js`
- `src/styles/main.css`
- `src/styles/ui-overhaul.css`
- `src/styles/print-layouts.css`

---

## 15. GitHub Workflow

Repository: `https://github.com/cbw29512/monstercardforge`

Current workflow:

- Push incremental MVP updates directly while project is early.
- Keep commit messages meaningful.
- Document major decisions in `/docs` and this Project Bible.

Future workflow:

- `main` should remain stable.
- Use `develop` or feature branches for larger changes.
- Add PR review checklist before public launch.

---

## 16. Quality Control Checklist

Before any public launch:

### Print QC

- Print Goblin cut-and-fold at 100% scale.
- Confirm unfolded size is 5 × 3.5.
- Confirm folded size is 2.5 × 3.5.
- Confirm it fits a sleeve.
- Confirm dotted seam is at the panel edge-touch line.
- Confirm no spacer/gutter appears.
- Test duplex alignment.
- Test Lich Boss Folio.
- Test Dragon Boss Folio.
- Test Boss Decklet.

### Content QC

- Ruleset correct.
- Source verified.
- Attribution included.
- Combat info complete.
- No copyrighted non-open content accidentally included.

### UX QC

- Homepage explains problem.
- First action is obvious.
- Print options are selectable.
- Mobile layout usable.
- User can understand Cut-and-Fold without explanation from developer.

### Accessibility QC

- Buttons have readable labels.
- Text contrast acceptable.
- Keyboard navigation works.
- Form fields have labels.
- Print instructions are plain English.

---

## 17. Current MVP Status

Current build includes:

- Static website shell
- Free Goblin Sample page
- Browse Cards page
- Homebrew Forge starter
- Legal page
- Goblin sample
- Adult Black Dragon sample
- Lich sample
- Cut-and-Fold print option
- Duplex print option
- Boss Folio print option
- Boss Decklet option
- Edge-touch fold standard recently implemented
- Dotted fold line standard documented

Known issues / next work:

- Need real paper print testing.
- Need verify CSS produces exactly 5 × 3.5 unfolded standard card.
- Need improve Boss Folio physical fold design.
- Need make print page visually excellent.
- Need add real/original/licensed art plan.
- Need expand Homebrew Builder actions/traits/spells editing.
- Need add automated measurement tests eventually.
- Need finalize SRD data ingestion plan.

---

## 18. Project Decisions Log

### Decision: Physical printing is core product

The project is not just a monster database. The product is a professional print system for tabletop monster cards.

### Decision: Finished card size is fixed

Finished card size is always 2.5 × 3.5 for standard cards.

### Decision: Cut-and-fold unfolded size

Cut-and-fold cards unfold to 5 × 3.5, with front and back touching edge-to-edge.

### Decision: No spacer between folded panels

There is no hinge, gap, gutter, or wide fold space. Only a dotted fold line on the edge-touch seam.

### Decision: Boss monsters need expanded formats

Complex monsters should not have tiny text. They use Boss Folio or Boss Decklet.

### Decision: Default print mode

Standard monsters default to Cut-and-Fold because it works on any printer.

Boss monsters default to Boss Folio for now, but Boss Decklet may become preferred after physical tests.

### Decision: Website should be customer-first

The UI must start with the user problem and guide them naturally to print, browse, or create.

---

## 19. Future Features

Only after print/card MVP is solid:

- Dice roller
- Encounter builder
- Initiative tracker
- NPC generator
- Magic item cards
- Spell cards
- Trap cards
- Companion cards
- Summon/wild shape cards
- Campaign tools
- QR code lookup
- Versioned cards
- User accounts
- Saved collections
- Pack builder
- PDF export
- Professional print ordering

Do not let these distract from the current MVP: printable monster cards.

---

## 20. How to Restart in a New Chat

Use this prompt:

```text
Read PROJECT_BIBLE.md in https://github.com/cbw29512/monstercardforge and continue Monster Card Forge development from there. Focus on the current MVP: print-ready 2.5 x 3.5 folded monster cards, cut-and-fold/duplex print modes, Boss Folio/Boss Decklet for complex monsters, customer-first UX, and legal ruleset/source separation.
```

After reading this file, continue from the latest repository state before making changes.
