# Protect My Campaign Validation — 2026-07-22

This pull request validates the free local-first campaign protection release currently on `main`.

## Scope

- Automatic local recovery points stored in IndexedDB
- Bounded eight-version recovery history
- Current-version preservation before restore
- Plain-language Protect My Campaign interface
- Downloadable Safety Copy for device moves and full browser resets
- Safety Copy validation and integrity checks
- Advanced storage details hidden from the normal workflow
- Desktop Chromium, Android Chromium, and iPhone WebKit workflows
- Exact deployed GitHub Pages validation

## Release interpretation

A green run verifies the automated source, browser, accessibility, privacy, persistence, recovery, and deployed-site gates. Physical-device and full browser-reset testing remain separate manual evidence.
