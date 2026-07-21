# DM Forge Change Control

**Version:** 1.0.0  
**Effective date:** 2026-07-21

This process keeps DM Forge reproducible, reviewable, and reversible. A feature is not complete merely because it appears to work in one browser.

## Sources of truth

| Area | Source of truth |
|---|---|
| Visual tokens and interaction defaults | `shared/design-system.css` and `docs/DESIGN_SYSTEM.md` |
| Rules sources and verification state | `rules/rules-sources.json` and `docs/RULES_VERIFICATION_LEDGER.md` |
| Product roadmap | `ROADMAP.md` |
| Current implementation status | `PROGRESS-2026-07-22.md` plus dated audit/release notes |
| Live validation | `LIVE-VALIDATION-CHECKLIST.md` |
| Architecture and privacy boundaries | `README.md`, adapters in `shared/`, and automated privacy tests |
| Decisions and exceptions | `docs/DECISIONS.md` |

No issue, chat message, comment, or memory replaces these repository records.

## Required change sequence

### 1. Define the change

Record:

- Problem being solved
- User-facing result
- Files and data affected
- Ruleset or privacy implications
- Rollback point
- Test plan

Use `docs/DECISIONS.md` for architectural, visual, rules, privacy, storage, or licensing decisions.

### 2. Inspect before editing

- Fetch the current file and SHA.
- Identify every consumer of the data or component.
- Search for duplicate constants, labels, formulas, and storage keys.
- Confirm migration requirements for existing browser data.

### 3. Change one authority first

Examples:

- Change a color in `shared/design-system.css`, not nine tool styles.
- Change a spell formula in `rules-data.js`, not rendered HTML.
- Change campaign summary behavior in `DMForgeStore`, not every hub card.
- Change a storage schema through a versioned migration.

### 4. Add regression protection

Depending on the change, add:

- Unit test
- Static contract test
- Privacy-boundary test
- Rules-source test
- Accessibility test
- Browser workflow test
- Print screenshot comparison

A corrected bug without a regression test is still at risk of returning.

### 5. Update documentation in the same workstream

Update all relevant records:

- Design system
- Rules ledger
- Audit
- Roadmap
- README
- Release note
- Validation checklist

Do not leave documentation as an unspecified future cleanup.

### 6. Validate in layers

1. JavaScript syntax
2. Unit/static tests
3. Local browser workflow
4. Mobile viewport
5. Keyboard workflow
6. Privacy boundary
7. Print preview
8. Live GitHub Pages route
9. Physical device/printer when relevant

### 7. Commit in reversible units

Preferred commit pattern:

1. Add new shared asset or data model.
2. Add tests.
3. Connect one consumer.
4. Connect remaining consumers.
5. Update public labels and documentation.

Avoid combining unrelated rules, visual, storage, and feature changes into one opaque commit.

## Rollback procedure

1. Identify the last known-good commit in the progress ledger.
2. Export a full browser backup before testing rollback behavior.
3. Revert the smallest affected commit or restore the prior file contents.
4. Do not downgrade a storage schema without a documented reverse migration.
5. Run the same tests and live validation used for the change.
6. Record why the rollback happened in `docs/DECISIONS.md`.

## Versioning policy

### Design system

- Patch: correction that does not change token meaning
- Minor: new token or component contract
- Major: changed token semantics, typography roles, or compatibility requirements

### Shared store and local tool data

- Every incompatible shape change increments a schema version.
- Readers must normalize older valid shapes.
- Migrations must use canonical data tables rather than duplicate constants.
- Unknown fields should be preserved when practical.

### Rules data

- Update verification date only after primary-source review.
- Record source IDs.
- A terminology-only change must not silently rewrite saved ruleset identifiers.

## Definition of done

A change is done only when:

- [ ] The user-facing task works
- [ ] Existing saved data still works or migrates safely
- [ ] Private data stays inside the intended boundary
- [ ] Relevant tests pass
- [ ] Rules claims are sourced
- [ ] UI uses canonical design tokens
- [ ] Keyboard and mobile use were considered
- [ ] Print output was considered when relevant
- [ ] Documentation is current
- [ ] Rollback point is identifiable
- [ ] Live deployment was checked

## Prohibited drift patterns

- Copying a palette into a new CSS file
- Duplicating a rules table inside HTML
- Adding a formula without a source ID
- Calling condensed or homebrew data “official”
- Adding a new storage key without Backup Center coverage
- Adding a private field to a shared summary
- Adding a player display field without a privacy test
- Hiding overflowing print text
- Adding a public page without title, description, canonical, internal links, and sitemap entry
- Changing terminology without preserving internal compatibility

## Review cadence

- Before each major session-use release: safety, backup, and live workflow review
- Monthly during active development: design and documentation drift scan
- Every six months: rules-source and external-guidance review
- After any official errata, SRD release, or D&D Beyond terminology change: targeted rules review
