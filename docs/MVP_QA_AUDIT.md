# MVP QA Audit

## Current Build

Initial static MVP foundation is pushed to GitHub.

## Pass

- Repository is private.
- Legal notice exists in footer and legal page.
- 2014 / 2024 ruleset separation is present in data and UI filters.
- Free Goblin Sample flow exists.
- Standard card and accordion preview exist.
- Homebrew Forge has helper text and an editable example monster.
- Data-driven renderer exists; monsters do not own layout markup.

## Known Gaps

- Card art is placeholder only.
- Print output needs real paper testing.
- Data is sample-only and not yet validated against final SRD source files.
- Homebrew builder is still shallow; actions, traits, spells, saves, skills, and accordion options need editable sections.
- No automated tests yet.
- No PDF export engine yet; browser print is the temporary MVP path.
- Accessibility pass is not complete.

## MVP Quality Bar

Before public launch, every card must pass:

- Correct ruleset and source attribution.
- Complete combat information.
- No unreadable text.
- Correct 2.5 x 3.5 inch sizing.
- Correct fold/accordion assembly.
- Mobile usable website view.
- Print preview and PDF export validation.
