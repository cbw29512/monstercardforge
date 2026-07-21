# DM Forge Validation Record — 2026-07-21

## Scope

This record captures automated validation of the current default branches after the design-system, SEO, rules, monster-data, governance, and documentation audit.

Repositories tested:

- `cbw29512/monstercardforge`
- `cbw29512/healingbox`

Method:

1. Removed prior temporary checkouts.
2. Performed fresh shallow clones from GitHub.
3. Ran `npm test` in each repository.
4. Confirmed both commands exited with status code 0.

## Main DM Forge result

**Result: PASS**

The configured suite includes checks for:

- Production JavaScript syntax
- Primary pages and local asset links
- Hostile input escaping
- Canonical design-system tokens
- Centralized remote font loading
- Retired-font prohibition
- Color contrast
- Unique titles, descriptions, canonical URLs, robots directives, and sitemap entries
- Rules-source IDs and non-future verification dates
- Explicit rules scope
- 5e and 5.5e encounter calculations
- CR 0 and Above-High edge cases
- Licensed monster data and source metadata
- Monster renderer targets, legendary-action costs, spell-slot labels, source, license, and scope
- Magic Item overflow continuation
- NPC player/DM privacy
- Loot hardening deployment
- Safe cross-tool handoffs
- Player Display allowlist
- Backup validation and transient-key exclusions
- Campaign Search privacy and artwork exclusion
- Public methodology content

## Cleric in a Box result

**Result: PASS**

The configured suite includes checks for:

- Application-module syntax
- Canonical migration boot
- Single-authority spell-slot progression
- Host-only administrative actions
- Player payload role-escalation protection
- 5e and 5.5e Cleric spell-list separation
- Edition-specific formulas and attack/save methods
- Concentration, trigger, and damage-type differences
- High-impact fixed and resurrection riders
- Current public 5e/5.5e labels
- Canonical metadata, sitemap, and crawler policy
- Shared design-system consumption
- Artifact laws labeled as campaign homebrew

## Not covered by this automated pass

A green automated suite does not prove:

- Correct rendering on every physical phone or tablet
- Stable multiplayer signaling across every network
- Screen-reader usability
- Complete keyboard-only task flows
- Physical duplex alignment or cardstock behavior
- Live Core Web Vitals field performance
- GitHub Pages cache propagation at a particular moment
- Balance or correctness of user-entered homebrew
- Completeness of the D&D rules universe beyond the declared ledger scope

## Required manual validation

Use `LIVE-VALIDATION-CHECKLIST.md` and complete:

1. Chrome and Edge workflows
2. Android and iOS workflows
3. Tablet workflows
4. Separate-network Player Display and Cleric in a Box tests
5. Keyboard-only tasks
6. NVDA/VoiceOver checks
7. All supported physical print formats
8. Backup on one browser and restore on another
9. Lighthouse and live Core Web Vitals measurement

## Release interpretation

The tested source is a **release candidate for live validation**. Broad production claims remain blocked on the manual/device/accessibility/print/performance work listed above.
