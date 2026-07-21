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
