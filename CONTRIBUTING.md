# Contributing to DM Forge

Thank you for helping make DM Forge more useful at real game tables.

## Where each kind of contribution belongs

- **Questions, opinions, brainstorming, polls, and early ideas:** GitHub Discussions
- **Reproducible bugs:** Bug Report issue form
- **Focused improvements to an existing tool:** Feature Request issue form
- **Entirely new modules:** New Tool Proposal issue form
- **Spells, monsters, abilities, conditions, encounter math, or edition corrections:** Rules Correction issue form
- **Security vulnerabilities:** follow `SECURITY.md`; do not disclose exploitable details in a public issue

An idea normally begins as a discussion. Once its value and scope are clear, maintainers may convert it into a tracked issue.

## Product requirements

A production DM Forge change should:

1. Solve a clear Dungeon Master or table-use problem.
2. Work without an account for local-only workflows whenever practical.
3. Preserve existing local data or include a tested migration.
4. Keep DM-only information out of player-facing views and shared summaries.
5. Work with keyboard navigation and mobile touch targets.
6. Fail clearly without silently losing data or rules text.
7. Include documentation and regression coverage.
8. Respect the canonical design system and rules ledger.

## Anti-drift requirements

### Visual changes

- Use tokens from `shared/design-system.css`.
- Do not introduce a near-duplicate font, color palette, focus style, radius system, or button pattern.
- Preserve the documented distinction between application UI and printed handouts.
- Explain intentional exceptions in `docs/DECISIONS.md`.

### Rules changes

- Cite an official Wizards of the Coast / D&D Beyond page or a licensed SRD source.
- Identify the exact ruleset: 5e (2014), 5.5e (2024), edition-neutral, or homebrew.
- Update `rules/rules-sources.json` and `docs/RULES_VERIFICATION_LEDGER.md`.
- Add or update an exact-data regression test.
- Do not use wikis, videos, forums, memory, or search snippets as final authority.

### Licensed and homebrew content

- Do not submit copied proprietary rules or book text that is not licensed for redistribution.
- Keep SRD/open-license material, DM Forge Original content, and user homebrew clearly labeled.
- Preserve required source and license metadata in displayed and printable output.

### Privacy and storage

- Shared campaign records must remain summaries unless an architecture decision explicitly approves more.
- Never expose private session notes, NPC secrets, loot notes, item curses, enemy HP/AC, room history, or uploaded artwork to player views.
- New local-storage keys must be documented and included in backup/restore coverage where appropriate.

## Development workflow

1. Create or reference an accepted issue.
2. Make the smallest coherent change.
3. Update tests, documentation, and source ledgers in the same pull request.
4. Run `npm test`.
5. Test the affected workflow manually in a modern browser.
6. Describe storage migrations, rules sources, privacy impact, and rollback steps in the pull request.

## Pull requests

Pull requests should include:

- The user problem being solved
- The linked issue or discussion
- Screenshots for visible changes
- Browser/device checks performed
- Rules sources when applicable
- Data migration and rollback notes
- Privacy and player-view impact
- Tests added or updated

Maintainers may request changes or decline contributions that increase complexity without enough table value, duplicate an existing workflow, weaken privacy, create licensing risk, or cannot be maintained safely.

## Maintainer

DM Forge is currently maintained by GitHub user `cbw29512`. Community moderation and contributor roles may expand as the project grows.
