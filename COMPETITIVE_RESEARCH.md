# DM Forge Competitive Research

Research date: July 2026

DM Forge should not copy another product. It should combine the strongest workflows into a focused, account-optional, print-first companion for in-person Dungeon Masters.

## Products reviewed

### D&D Beyond

Relevant strengths:

- Official searchable rules and character tools
- Encounter building and combat tracking
- Browser-based Maps VTT with uploaded maps, tokens, fog of war, and game logs
- Campaign-linked content and player access

Sources:

- https://dndbeyond-support.wizards.com/hc/en-us/articles/7747237485716-Encounters
- https://dndbeyond-support.wizards.com/hc/en-us/articles/46363122030868-What-is-Maps
- https://www.dndbeyond.com/en

DM Forge response:

- Keep rulesets explicit and separated.
- Add encounter building without requiring purchased content.
- Add a lightweight player display later, but do not begin by building a full VTT.

### Improved Initiative and dedicated combat trackers

Relevant strengths:

- Fast initiative sorting
- Convenient stat blocks
- HP and condition controls
- Shared player displays
- Combat histories

Sources:

- https://improvedinitiative.app/
- https://www.inittracker.com/

DM Forge response:

- Session Console now tracks initiative, enemy HP, AC, conditions, rounds, and a combat chronicle.
- Players remain responsible for their own HP.
- A synchronized player initiative display is a future priority.

### Kobold Plus Fight Club

Relevant strengths:

- Party-based encounter difficulty
- 2014 and 2024 encounter rules
- Monster filters by source, CR, environment, size, type, and legendary status
- Random encounter styles
- Custom-monster import
- Saved encounter history

Source:

- https://koboldplus.club/

DM Forge response:

- Encounter Forge should calculate difficulty under both rulesets.
- It should filter the open/homebrew monster library and send completed encounters directly into Session Console.
- It should accept DM-created monsters from Monster Card Forge.

### donjon

Relevant strengths:

- Broad collection of generators
- Names, weather, adventures, dungeons, inns, towns, treasure, encounters, NPCs, and quick references
- Fast, low-friction use

Sources:

- https://donjon.bin.sh/
- https://donjon.bin.sh/5e5/

DM Forge response:

- Keep generators inside the current session rather than scattering them across hundreds of pages.
- Generated details should be saved into session notes with one click.
- Build deeper dedicated generators only when they integrate with campaigns, cards, encounters, or loot.

### Roll20

Relevant strengths:

- Searchable compendium
- Drag-and-drop entries into handouts and character journals
- Shared turn tracker
- GM-visible and player-visible information layers

Sources:

- https://help.roll20.net/hc/en-us/articles/360039178694-Compendium
- https://help.roll20.net/hc/en-us/articles/360039178634-Turn-Tracker

DM Forge response:

- Continue separating player-safe card fronts from hidden DM backs.
- Build direct handoff between Monster Cards, Magic Items, Encounter Forge, and Session Console.

### Sly Flourish / Lazy DM workflows

Relevant strengths:

- Focus prep on material likely to matter at the table
- Reusable session worksheets
- Character and NPC trackers
- Campaign folders, session notes, maps, and campaign-support pages
- Random tables and quick-reference material

Sources:

- https://shop.slyflourish.com/products/the-lazy-dms-workbook
- https://slyflourish.com/organizing_notes.html
- https://slyflourish.com/lazy_campaign_building_checklist.html

DM Forge response:

- Session Console uses flexible prep prompts rather than rigid scene scripting.
- Each campaign contains a current session and archived sessions.
- Campaign data remains locally portable through JSON export and import.

## Product gaps DM Forge should fill

1. One home for prep, combat, improvisation, cards, and session memory.
2. Print-first output that remains useful when the laptop closes.
3. Player-safe and DM-private versions of the same content.
4. No required account for local campaign use.
5. Direct movement between tools instead of repeated data entry.
6. Clear separation between 2014, 2024, SRD/open content, and homebrew.

## Priority roadmap

### Completed

- DM Forge hub
- Monster Card Forge
- Production Magic Item Forge
- Cleric in a Box integration
- Session Console with prep, initiative, enemy HP, conditions, dice, generators, logs, archives, printing, and backups

### Next

1. Encounter Forge
   - 2014 and 2024 difficulty models
   - Party profiles
   - Environment and CR filtering
   - Saved encounters
   - Direct launch into Session Console
   - Monster Card Forge imports

2. Shared player initiative display
   - Current turn and round
   - Visible conditions
   - No private monster HP
   - Phone and tablet support

3. NPC Forge and relationship tracker
   - Player-safe and DM-secret information
   - Printable cards
   - Direct addition to session prep

4. Loot Forge
   - Treasure parcels and shops
   - Direct creation of Magic Item Forge cards
   - Party-loot handouts

5. Campaign library integration
   - One campaign selector shared by all DM Forge tools
   - Optional cloud synchronization after the local workflow is stable
