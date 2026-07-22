# Security Policy

DM Forge stores campaign data locally in the browser and includes player-facing views, imported JSON, uploaded artwork, browser-to-browser rooms, and cross-tool handoffs. Security and privacy reports are taken seriously.

## Supported version

The current default branch and live GitHub Pages deployment are supported. Older downloaded copies and forks may not include current fixes.

## Reporting a vulnerability

Do not publish exploit instructions, private campaign data, room information, tokens, or proof-of-concept payloads in a public issue or discussion.

Use GitHub’s private vulnerability reporting feature for this repository when it is available. If that option is not visible, contact the maintainer through the GitHub account `cbw29512` with only enough public information to arrange a private report.

Include:

- Affected page, file, or workflow
- Browser and operating system
- Reproduction steps
- Security or privacy impact
- Whether player-facing data, local storage, imports, uploads, or multiplayer rooms are involved
- A minimal proof of concept with private information removed
- Suggested mitigation, when known

## Response process

The maintainer will aim to:

1. Acknowledge a credible report.
2. Reproduce and classify the impact.
3. Restrict public disclosure while a fix is prepared.
4. Add a regression test when practical.
5. Update documentation, migration behavior, and release notes.
6. Coordinate disclosure after the live fix is available.

## Security boundaries

Production changes must preserve these boundaries:

- Player Display receives only public initiative data.
- Shared Campaign Hub records remain privacy-safe summaries.
- User-controlled HTML is escaped before rendering.
- Host-only actions are authorized by connection origin, not display name.
- Imported backup keys are allowlisted and validated.
- Uploaded artwork and private rules text are not copied into shared summaries.
- Security-sensitive failures should be explicit rather than silently corrupting or exposing data.
