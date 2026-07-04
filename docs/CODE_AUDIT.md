# Code Audit

## Current Architecture

The MVP has moved from a single script toward a modular browser app.

## Modules

- `src/js/appState.js`: central state management.
- `src/js/logger.js`: error logging and safe rendering wrapper.
- `src/js/cardEngine.js`: reusable card and panel renderer.
- `src/js/printStudio.js`: print sheet helpers.
- `src/js/homebrewSchema.js`: guided homebrew field schema and validation.
- `src/js/views.js`: view-level rendering.
- `src/data/monsters.js`: starter monster data.

## Good

- Card rendering is no longer tied to individual monsters.
- Layout selection is data-driven.
- Homebrew guidance is schema-driven.
- Print flow has its own module.
- Error logging exists in shared utilities.

## Needs Work

- `src/js/app.js` still needs to be replaced with the modular shell.
- CSS should be split after it exceeds 150 lines.
- Monster data needs final SRD verification.
- Homebrew nested editing is not complete.
- No automated tests yet.

## Next QC Target

Replace `app.js` with a thin controller that delegates rendering to the new modules.
