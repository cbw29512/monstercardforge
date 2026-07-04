# Controller Swap QA

## Change

The live `src/js/app.js` was replaced with the modular controller.

## Why

The original app file contained state, rendering, card logic, homebrew logic, print logic, and error logging in one place. That does not scale.

## New Flow

`index.html`

-> `src/js/app.js`

-> `appState.js`

-> `views.js`

-> `cardEngine.js`

-> `printStudio.js`

## Manual QA Checklist

- Open `index.html` locally.
- Confirm Monster Library loads.
- Confirm Goblin selected by default.
- Confirm Free Goblin Sample tab loads.
- Confirm Homebrew Forge tab loads.
- Confirm Legal tab loads.
- Confirm ruleset filter still changes visible monster list.
- Confirm creature type filter still changes visible monster list.
- Confirm Print Preview opens browser print dialog.

## Known Risk

Browser module loading may fail if opened from some local file systems with strict CORS rules. If so, run with a simple local server.

Example:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```
