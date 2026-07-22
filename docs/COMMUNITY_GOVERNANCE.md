# DM Forge Community Governance

**Maintainer:** `cbw29512`  
**Community home:** GitHub Discussions in `cbw29512/monstercardforge`  
**Structured work:** GitHub Issues and pull requests

## Purpose

The DM Forge community exists to gather real table experience, answer questions, identify problems, evaluate ideas, correct rules, and help prioritize useful tools without allowing the engineering backlog to become an unstructured wish list.

## Recommended discussion categories

Configure these categories when GitHub Discussions is enabled:

1. **Announcements** — releases, migrations, validation requests, and project decisions. Maintainer-created.
2. **Ideas & Feedback** — opinions and early improvements that are not ready for an issue.
3. **New Tool Ideas** — proposals for entirely new DM Forge modules.
4. **Questions & Help** — workflow, backup, printing, browser, and table-use questions. Enable answer marking.
5. **Rules Accuracy** — edition-sensitive questions before a sourced correction is filed.
6. **Show & Tell** — printed cards, campaign workflows, accessibility setups, and table examples with private information removed.
7. **Polls** — community prioritization and design decisions.
8. **General** — relevant conversations that do not fit elsewhere.

## Request lifecycle

```text
Discussion or observed problem
        ↓
Clarify the user need and affected workflow
        ↓
Check duplication, privacy, licensing, rules, accessibility, and maintenance cost
        ↓
Accept, defer, decline, or request more evidence
        ↓
Accepted work becomes a structured issue
        ↓
Implementation includes tests, documentation, migration, and rollback notes
        ↓
Validation and release
        ↓
Announcement and feedback follow-up
```

## Status language

- **Exploring** — useful conversation, scope not yet locked.
- **Needs evidence** — more table examples, reproduction steps, official rules sources, or accessibility findings are required.
- **Accepted** — approved in principle; create or link a tracked issue.
- **Planned** — prioritized on the roadmap but not yet in active development.
- **In progress** — implementation has begun.
- **Validation** — code is present; browser, device, accessibility, rules, or print checks remain.
- **Released** — deployed and documented.
- **Deferred** — potentially useful but not currently prioritized.
- **Declined** — conflicts with scope, privacy, licensing, rules integrity, accessibility, maintainability, or the local-first product model.

## Moderation rules

Moderators may:

- Move a discussion to the correct category.
- Edit vague or misleading titles for discoverability.
- Ask for reproduction steps or official rules sources.
- Convert an issue to a discussion when the scope is still exploratory.
- Close duplicates while linking the canonical conversation.
- Lock or remove harassment, spam, piracy, private information, exploit details, or repeated disruption.
- Remove long copied passages of proprietary rules while preserving a short locator and official link.

Moderation decisions should reference `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, the rules ledger, or a documented architecture decision when possible.

## Voting and popularity

Votes and reactions are useful evidence, not automatic product decisions. Prioritization also considers:

- How often the problem occurs during real sessions
- Time saved or confusion prevented
- Accessibility improvement
- Data-loss or privacy risk
- Rules accuracy
- Fit with existing campaign workflows
- Development and long-term maintenance cost
- Licensing constraints
- Whether a simpler improvement solves the need

## Privacy

Community posts must not contain:

- Real player names or contact information without permission
- Private campaign notes or unrevealed secrets
- Active multiplayer room information
- Backup files or local-storage exports
- Screenshots containing tokens, personal data, or private browser information
- Security exploit instructions in public threads

## Rules corrections

A production rules correction requires:

1. Exact ruleset
2. Affected record and location
3. Current and expected behavior
4. Official Wizards/D&D Beyond or licensed SRD source
5. Source locator without a long copyrighted quotation
6. Regression test
7. Rules-ledger update
8. Verification date

## Review cadence

During active development, the maintainer should review new discussions and issues at least weekly. When community volume grows, trusted contributors may receive triage permissions to categorize discussions, mark answers, manage duplicates, and help maintain a respectful forum.
