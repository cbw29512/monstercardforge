# Production Gate Validation Run — 2026-07-21

This pull request executes and inspects DM Forge's first PR-visible production-readiness run.

## Commit under validation

The branch starts from the current `main` branch after ADR-018 introduced the blocking production-readiness standard.

## Required checks

- Static safety and anti-drift suite
- Desktop Chromium workflows
- Android Chromium emulation
- iPhone WebKit emulation
- Public-route runtime smoke tests
- Serious and critical axe accessibility scan
- Campaign persistence
- Encounter Forge to Session Console handoff
- Session Console autosave and refresh recovery
- Safe Magic Item, NPC, and Loot handoffs
- Full backup download, preview, confirmation, and restore

## Run history

### Initial static run

The first PR run failed two DOM-contract assertions because the test only recognized IDs declared in static HTML. NPC Forge and Loot Forge intentionally create their campaign-context controls at runtime. The test now recognizes IDs declared in either page markup or runtime-rendered markup.

Result after correction: **Static safety passed — 71 tests, 0 failures.**

### Initial browser run

Playwright evidence identified:

1. A real fresh-browser bug: Session Console ignored a requested `?campaign=` value when its local database did not yet exist.
2. A test assertion bug: a textarea was checked with `toContainText` instead of `toHaveValue`.
3. A smoke-test expectation bug: the About page H1 is `About DM Forge`.

The Session Console adapter now creates and activates the requested campaign on first visit, synchronizes it to Campaign Hub, and reloads into the correct local state. The two test expectations were corrected without weakening their intended behavior.

## Interpretation

A green automated run promotes the exact commit to **release-candidate automation passed**. It does not complete the physical-device, screen-reader, multiplayer-network, printer, or live-deployment portions of the production gate.

A failed run is expected to produce static output, Playwright traces, screenshots, videos, and an HTML report. Failures must be corrected or narrowly documented; the tests must not be weakened merely to turn the check green.
