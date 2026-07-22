# DM Forge Decision Log

This is an append-only record of decisions that affect product identity, rules authority, privacy, data compatibility, or architecture. Superseded decisions remain visible and link to the replacement.

## ADR-001 — One canonical design system

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** Product UI uses the tokens and behavior in `shared/design-system.css`. Tool styles may control specialized layout but may not create independent near-duplicate brand systems.
- **Reason:** Repeated parchment/red/gold palettes and font definitions had begun to diverge across tools.
- **Typography:** Cinzel for display; system sans for UI; editorial serif for print.
- **Compatibility:** Legacy aliases remain available while tool CSS is migrated.
- **Rollback:** Restore tool-local styles and remove the shared link, though this is not recommended because it reintroduces drift.

## ADR-002 — Fantasy identity with modern UI ergonomics

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** Preserve parchment, heraldic headings, printed-card aesthetics, and restrained fantasy ornament. Use modern controls, spacing, focus states, responsive grids, and highly legible UI typography for active session use.
- **Reason:** Atmosphere supports the product, but decorative text in dense controls and logs reduces speed and readability.

## ADR-003 — WCAG 2.2 AA as the accessibility target

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** New work targets WCAG 2.2 AA. Controls use at least 44-pixel preferred touch height, strong focus visibility, reduced-motion support, and mobile-safe layouts.
- **Reason:** DM Forge is used on phones, tablets, and laptops in distracting environments; accessibility improvements directly improve table use.

## ADR-004 — People-first growth, not ranking imitation

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** Traffic growth will come from useful tools, original guides, transparent testing, printable samples, community sharing, and good performance. DM Forge will not clone competitor branding, scrape content, mass-produce thin pages, or use fabricated reviews.
- **Reason:** Sustainable discovery depends on original value and trust.

## ADR-005 — Stable internal ruleset identifiers

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** Saved data continues using `2014` and `2024`. Public interfaces migrate toward `5e (2014)` and `5.5e (2024)` following D&D Beyond's March 2026 terminology update.
- **Reason:** The public labels improve clarity, while changing stored values would risk migration problems without changing mechanics.

## ADR-006 — Rules claims require primary-source IDs

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** Edition-sensitive formulas, lists, tables, and complete stat-block claims require entries in `rules/rules-sources.json`, a verification date, and regression coverage.
- **Reason:** “Reviewed” without a named source is not reproducible.

## ADR-007 — Homebrew and heuristics remain explicit

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** Artifact laws, original generators, DM Forge operational warnings, and user-created rules must be labeled as homebrew, original, names-only, or heuristic rather than official.
- **Reason:** Useful helper behavior should not be confused with core rules.

## ADR-008 — One authority for duplicated tables

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** Versioned rules tables live in dedicated data modules. Migration code imports those tables rather than embedding copies in HTML.
- **Implementation:** Cleric in a Box now boots through `boot.js`, which imports `SLOTS` from `rules-data.js` before loading the application.
- **Reason:** Duplicated spell-slot progression created a silent migration drift risk.

## ADR-009 — Local-first privacy remains the default

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** Detailed campaign data remains local to the browser unless the DM deliberately exports or transfers it. Shared campaign records are summaries. Player displays receive a strict allowlist.
- **Reason:** Campaign notes, secrets, curses, and combat data should not move simply for convenience.

## ADR-010 — Performance targets follow current Core Web Vitals

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** Target 75th-percentile LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1 on mobile and desktop.
- **Reason:** These measure loading, responsiveness, and visual stability for real users.
- **Limitation:** Field data and live device measurements still need to be established.

## ADR-011 — Condensed references may not omit run-critical data

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** A complete monster or spell reference must include the numbers and triggers needed to run it. If a card cannot fit, it expands or continues; it does not silently omit DCs, damage, save outcomes, recharge, duration, or action economy.
- **Reason:** Several early monster samples were attractive but incomplete for actual play.

## ADR-012 — SEO metadata is a baseline, not the growth strategy

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** Canonicals, titles, descriptions, structured data, sitemap, and crawlable links are required. Popularity work then focuses on genuinely useful guides, demonstrations, samples, performance, and trust.
- **Reason:** Metadata helps discovery but cannot substitute for value.

## ADR-013 — DM Forge is the permanent public brand

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** The umbrella product is publicly named **DM Forge**. Individual modules retain descriptive Forge or Console names beneath that brand.
- **Reason:** A stable product identity is required before domain selection, community growth, external contributions, screenshots, guides, and public promotion.
- **Migration:** The current GitHub Pages repository path remains unchanged until a custom-domain decision is made.

## ADR-014 — Public maintainer identity is `cbw29512`

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** Public pages and project documents identify GitHub user `cbw29512` as the maintainer until the owner explicitly chooses a first name, full name, organization, or legal entity.
- **Reason:** The project needs a consistent accountable maintainer identity without exposing more personal information than the owner selected.

## ADR-015 — Community conversations use GitHub Discussions; accepted work uses Issues

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** Questions, opinions, polls, examples, and early ideas belong in GitHub Discussions. Reproducible bugs, scoped features, new-tool proposals, and sourced rules corrections use structured GitHub Issue forms. Accepted discussion ideas graduate into tracked issues.
- **Reason:** A forum should encourage open conversation without turning the engineering backlog into an unstructured request list.
- **Governance:** `docs/COMMUNITY_GOVERNANCE.md`, `CODE_OF_CONDUCT.md`, and `CONTRIBUTING.md` define categories, moderation, privacy, and request progression.

## ADR-016 — No analytics until a measurement plan is approved

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** DM Forge does not currently load Google Analytics, advertising analytics, or another visitor-tracking provider.
- **Reason:** The project does not yet need behavioral tracking, and adding it prematurely would introduce privacy, consent, documentation, performance, and maintenance obligations without a defined decision it would support.
- **Revisit when:** A public launch plan defines exact questions, minimum data, retention, disclosure, and a privacy-respecting provider comparison.

## ADR-017 — Original project material uses MIT; third-party content retains its own license

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** Original DM Forge software and associated project documentation are licensed under MIT through `LICENSE`. Third-party material, including SRD-derived data, is not relicensed and retains the attribution and license recorded in `THIRD_PARTY_NOTICES.md`, source ledgers, records, and rendered output.
- **Reason:** Contributors need a clear open-source license, while licensed D&D rules content requires separate CC-BY-4.0 attribution and trademark boundaries.

## ADR-018 — Production claims require a blocking browser gate and manual evidence

- **Date:** 2026-07-21
- **Status:** Accepted
- **Decision:** A DM Forge commit may be called a release candidate only after the static and Playwright production-readiness gates pass on that exact commit. A broad production-ready claim additionally requires recorded live-device, assistive-technology, backup-recovery, multiplayer, and physical-print validation for the affected workflows.
- **Automated scope:** Desktop Chromium, Android Chromium emulation, iPhone WebKit emulation, public-route runtime smoke tests, cross-tool workflow tests, privacy assertions, backup restore, and serious/critical axe findings.
- **Evidence:** Failed browser runs preserve traces, screenshots, videos, and an HTML report. Manual results are recorded in dated validation documents.
- **Reason:** Static correctness does not prove that a user can complete the workflow in a browser or that the rendered interface remains accessible, private, persistent, and recoverable.
- **Enforcement:** `.github/workflows/production-readiness.yml`, `playwright.config.mjs`, `tests/browser/`, and `tests/production-gate-contract.test.mjs` form one protected release gate.
- **Rollback:** Reverting the gate requires a newer accepted ADR stating the replacement test strategy, risks, and migration plan. Temporary bypasses require a public issue, expiration condition, and maintainer approval.
