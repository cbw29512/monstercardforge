# Rules Compendium Integration Validation — 2026-07-22

This pull request validates the first production integration between the main DM Forge toolkit and `cbw29512/DungeonCards`.

## Included integration

- Main-site `rules-compendium.html` gateway
- Homepage promotion as a first-class DM Forge tool
- Stable direct links to D&D Rules Guide, Compendium, Player, DM, Encounter, Card Builder, and Monster Builder
- DM Forge branding and return navigation inside DungeonCards
- Sitemap, metadata, governance, browser smoke, and anti-drift coverage
- Cross-repository live check against the deployed DungeonCards Compendium route
- Explicit reference-complete versus automation-complete boundary
- Explicit exclusion of the experimental non-D&D preview from the public DM Forge gateway

## Required evidence

- Static safety passes
- Production readiness passes on desktop Chromium, Android Chromium emulation, and iPhone WebKit
- Rules Compendium gateway workflow passes
- Exact deployed DM Forge commit passes every HTTPS route
- Deployed DungeonCards opens the D&D Compendium directly
- DungeonCards shows the DM Forge product lockup and working return link
- Serious and critical automated accessibility findings remain clear

A green result validates the automated and deployed-browser portions of this integration. Physical phone, tablet, assistive-technology, and printer acceptance remain separate evidence.
