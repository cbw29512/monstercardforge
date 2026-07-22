# DM Forge Production Readiness Gate

**Gate version:** 1.0  
**Introduced:** 2026-07-21  
**Owner:** `cbw29512`

DM Forge is not considered production-ready merely because its pages load or its static tests pass. A release candidate must prove the workflows people depend on in real browsers and preserve evidence when a failure occurs.

## Release states

### Development

Work may be incomplete, experimental, or awaiting migration and browser tests. Development work must not be advertised as production-ready.

### Release candidate

The static suite and automated browser gate pass on the exact commit. Required manual checks are scheduled or recorded. Public wording may say release candidate or beta.

### Production-ready

All automated gates pass, required manual device and print checks are recorded, known blocking defects are closed, data migration and rollback are documented, and the live GitHub Pages deployment has been verified from the deployed URL.

## Blocking automated checks

The workflow `.github/workflows/production-readiness.yml` runs on pushes to `main`, pull requests, and manual dispatches. It is intentionally blocking; browser failures are not marked continue-on-error.

The gate runs:

1. Static safety, rules, privacy, metadata, and anti-drift tests.
2. Chromium desktop workflows.
3. Chromium Android emulation.
4. WebKit iPhone emulation.
5. Public-route smoke tests and JavaScript runtime-error detection.
6. Serious and critical automated accessibility checks through axe-core.
7. Trace, screenshot, video, and HTML-report capture on failures.

## Real workflows protected

The automated browser suite proves:

- A campaign can be created, made active, routed into tools, refreshed, and recovered.
- Encounter Forge can build an encounter and send complete enemy AC, HP, Dexterity, and initiative data into Session Console.
- Session Console prep persists after refresh.
- Magic Item Forge sends only a safe reward summary and does not copy hidden curses or artwork.
- NPC Forge sends useful DM roleplay context without copying secrets, lies, or combat notes into the handoff or shared summary.
- Loot Forge sends rewards without private DM notes.
- Loot Forge creates unidentified Magic Item placeholders and never overwrites items the DM later edited.
- Backup & Storage Center can download, validate, preview, confirm, and restore recognized campaign records.
- Every public route returns successfully and renders its expected heading without page errors.

## Commands

Install test dependencies and browser engines once:

```bash
npm install
npx playwright install chromium webkit
```

Run the fast static gate:

```bash
npm run test:static
```

Run browser tests:

```bash
npm run test:browser
```

Run the complete automated production gate:

```bash
npm run test:production
```

Run visible browsers during debugging:

```bash
npm run test:browser:headed
```

## Required manual checks before the first broad public release

Automation cannot replace these checks:

- Windows Chrome and Edge on the live GitHub Pages site
- Android Chrome on a physical phone
- iPhone Safari on a physical phone
- Android tablet and iPad layout checks
- Player Display across separate devices and reconnect scenarios
- Cleric in a Box across Wi-Fi and cellular paths
- Keyboard-only navigation
- NVDA on Windows and VoiceOver on iPhone or iPad
- Real printer output for every supported card, handout, folio, packet, duplex, and continuation format
- Backup restoration in a second browser profile or second computer
- Live Core Web Vitals and network-performance measurements

Results belong in a dated file under `docs/validation/` or in the repository’s live validation checklist. A manual failure blocks the affected production claim even when automation is green.

## Failure evidence

GitHub Actions retains these artifacts for 14 days:

- `playwright-report/`
- `test-results/`
- Browser traces
- Failure screenshots
- Failure videos

A failed workflow should be diagnosed from those artifacts. Do not weaken or skip a test merely to make a release green. Correct the application or document a narrowly justified test correction.

## Changes that require gate updates

Update browser coverage in the same pull request when a change adds or modifies:

- A public page
- A local-storage key or schema
- A cross-tool handoff
- A player-facing view
- A backup or migration path
- An edition-sensitive rule
- A print format
- A networked room workflow
- A privacy boundary

## Rollback

Every production change must remain individually revertible through Git history. When a release introduces a storage migration, the change must describe whether rollback is safe and how newer records behave in the older version.

The gate itself may only be weakened through a documented architecture decision approved by the maintainer. Temporary bypasses must identify the failing test, risk, expiration condition, and follow-up issue.
