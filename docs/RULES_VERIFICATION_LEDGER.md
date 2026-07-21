# DM Forge Rules Verification Ledger

**Ledger version:** 1  
**Last updated:** 2026-07-21  
**Machine-readable authority:** `rules/rules-sources.json`

This document explains how DM Forge distinguishes official rules, edition-sensitive summaries, original helper logic, and campaign homebrew. It prevents a condensed card, warning, or generator from slowly becoming “official” through repetition.

## Public terminology

D&D Beyond changed its display labels on March 2, 2026:

- 2014 fifth-edition rules are labeled **5e**.
- Revised 2024 fifth-edition rules are labeled **5.5e**.
- The change is terminology only; it did not alter rules or saved content.

DM Forge keeps internal values `2014` and `2024` so existing local data remains compatible. Public labels should show `5e (2014)` and `5.5e (2024)` during the migration period.

## Authority hierarchy

Use sources in this order:

1. Current official Wizards of the Coast / D&D Beyond rules pages
2. Published SRD 5.1 or SRD 5.2.1 under CC-BY-4.0
3. Official errata or changelog entries
4. Clearly labeled DM Forge calculation or usability guidance
5. Clearly labeled campaign homebrew

Forums, wikis, videos, social posts, and memory may identify a question but may not serve as the final authority for production rules data.

## Status meanings

### Verified

- Checked against a named primary source
- Verification date recorded
- Relevant formulas or lists protected by tests
- No known unresolved discrepancy

### Verified with heuristic

The official data is verified, but DM Forge adds a clearly labeled implementation judgment. Examples include using average party level for a mixed-level CR warning or choosing when to prompt review of much weaker creatures.

### Names only

The UI lists an action, condition, or rule reminder without reproducing its mechanics. It must direct users to the chosen ruleset for exact adjudication.

### Homebrew

The feature is original DM Forge content, user-authored content, or a campaign-specific rule. It must never be labeled official or rules-verified.

### In progress

The audit has started but is incomplete. Production claims of comprehensive accuracy are prohibited.

### Needs correction

A known omission, mismatch, unsupported claim, or unclear source exists. This status blocks “production-ready rules” claims for that component.

## Current status summary

| Component | Status | Key result |
|---|---|---|
| Encounter Forge math | Verified with heuristic | 5e thresholds/multipliers and 5.5e budgets checked; CR 0 and above-High cases corrected |
| Cleric spell-slot progression | Verified | Full-caster levels 1–20 checked against both Cleric tables |
| Cleric leveled spell lists | Verified | 5e and 5.5e lists separated and checked |
| Healing-potion formulas | Verified | Four standard tiers checked; artifact activation remains homebrew |
| Cleric automatic spell effects | In progress | High-use formulas checked; edition-specific behavior is being expanded |
| Cleric in a Box artifact laws | Homebrew | Deity control and free-action artifact rules are campaign rules |
| Monster sample cards | Needs correction | Dragon and Lich cards omit encounter-critical data and exact license metadata |
| Session reference board | Names only | Correctly directs DMs to official text |
| Magic Item Forge content | Homebrew/template | User-authored rules require user/DM review |
| NPC/Loot/Session generators | Homebrew | Original prompts, not official random tables |

## Verification checklist for rules data

Every edition-sensitive record must answer:

- [ ] Which ruleset does this apply to?
- [ ] What is the exact source ID?
- [ ] When was it checked?
- [ ] Is the displayed text complete enough for its stated purpose?
- [ ] Is damage type preserved rather than merged into an ambiguous total?
- [ ] Is the attack/save method correct?
- [ ] Are concentration, duration, trigger timing, and target limits represented?
- [ ] Is upcasting represented or explicitly out of scope?
- [ ] Are half-damage or successful-save effects represented?
- [ ] Is the content licensed for publication?
- [ ] Does an automated test protect the value or list?

## Condensation policy

A condensed card may shorten prose but may not omit information needed to run the ability:

- attack bonus or save DC
- target/area
- damage or healing formula and type
- successful-save result
- recharge or use limit
- concentration or duration
- trigger timing
- action type
- critical rider conditions

When the card cannot fit all essential information, the layout must expand or add a continuation page.

## Homebrew policy

Homebrew may be powerful, unusual, or intentionally outside core rules. It must include one of these labels:

- `Homebrew`
- `DM Forge Original`
- `Campaign Rule`
- `User Created`

Homebrew fields may cite an official spell for comparison but must not imply that the homebrew effect itself is official.

## Reverification triggers

Recheck affected data when:

- D&D Beyond changes labels or source URLs
- Wizards publishes errata or a new SRD revision
- A formula, list, or stat block is edited
- A user reports a discrepancy
- A tool begins reproducing more rule text than before
- A condensed reference becomes a complete stat-block claim
- Six months have passed since the last review of active production data

## Change process

1. Open the source cited in `rules/rules-sources.json`.
2. Record the discrepancy in the audit or decision log.
3. Correct the data and any related UI wording.
4. Add or update a regression test.
5. Update verification date and notes.
6. Run the full test suite.
7. Verify the live page after deployment.
8. Preserve the change in the progress ledger and commit history.

## Known active work

1. Complete every automatic Cleric spell-effect comparison.
2. Expand edition-specific trigger and concentration notes.
3. Correct Flame Strike’s 5e versus 5.5e formula split.
4. Replace incomplete monster samples with complete, traceable, licensed records.
5. Add record-level source labels to printed outputs.
6. Add a test that rejects future verification dates and unknown source IDs.
