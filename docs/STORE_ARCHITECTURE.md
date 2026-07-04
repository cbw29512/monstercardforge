# Store Architecture

## Store Principle

Customers should be able to buy exactly what they need without understanding the database.

## Product Types

### Single Card

One monster card or accordion card.

Example:

- Goblin Card
- Lich Accordion Card
- Adult Black Dragon Boss Card

### Type Pack

A pack grouped by creature type.

Examples:

- Undead Pack
- Dragon Pack
- Fiend Pack
- Beast Pack
- Construct Pack

### CR Range Pack

A pack grouped by challenge range.

Examples:

- CR 0-1 Starter Pack
- CR 2-4 Low-Level Threats
- CR 5-10 Mid-Tier Encounters
- CR 11-16 Bosses
- CR 17+ Epic Threats

### Environment / Lair Pack

A pack grouped by where the DM is running the session.

Examples:

- Dungeon Pack
- Forest Pack
- Swamp Pack
- Mountain Pack
- Underdark Pack
- City Pack
- Graveyard Pack
- Dragon Lair Pack

### Edition Set

Ruleset-specific full collections.

Examples:

- 5E 2014 SRD Complete Card Set
- 5E 2024 SRD Complete Card Set

## Product Page Template

Every product page should include:

- Product name
- Ruleset
- Number of cards
- Included monsters
- Print formats included
- Standard / accordion card count
- Sample previews
- What the customer receives
- Attribution notice
- Refund / download policy
- Related packs

## URL Pattern

- `/cards/{ruleset}/{monster-slug}`
- `/packs/{ruleset}/type/{type-slug}`
- `/packs/{ruleset}/cr/{cr-range}`
- `/packs/{ruleset}/environment/{environment-slug}`
- `/sets/{ruleset}/complete`

## Launch Store Rule

Do not activate payment until:

- print QA passes,
- legal attribution is correct,
- card previews are accurate,
- product copy clearly states digital/printable delivery,
- and the free Goblin sample has been printed successfully.
