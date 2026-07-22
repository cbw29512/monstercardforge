# Production Gate Validation Run — 2026-07-21

This pull request exists to execute and inspect DM Forge's first PR-visible production-readiness run.

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

## Interpretation

A green automated run promotes the exact commit to **release-candidate automation passed**. It does not complete the physical-device, screen-reader, multiplayer-network, printer, or live-deployment portions of the production gate.

A failed run is expected to produce Playwright traces, screenshots, videos, and an HTML report. Failures must be corrected or narrowly documented; the tests must not be weakened merely to turn the check green.
