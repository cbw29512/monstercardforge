# Loot Forge Release

Loot Forge is a campaign treasure builder, generator, distribution tracker, handout printer, and cross-tool transfer module for DM Forge.

## Live route

`loot-forge.html`

## Parcel fields

- Campaign
- Parcel name and source scene
- Status: Planned, Found, Distributed, Sold, Lost, or Returned
- Scale: Minor, Moderate, Major, or Legendary
- Assigned character, party, or faction
- CP, SP, EP, GP, and PP
- Valuables and trade goods
- Mundane gear and curios
- Magic-item candidates
- Clues, documents, and story rewards
- Player-facing description
- Private DM notes

## Original generator

The built-in generator uses DM Forge original content rather than reproducing an official treasure table. It uses `crypto.getRandomValues` with rejection sampling to generate:

- Original parcel names and locations
- Tier-scaled coin amounts
- Valuables and trade goods
- Mundane gear and curios
- Original magic-item names
- Story clues
- Player descriptions
- Private complications

Generated results remain editable before saving.

## Campaign library

Saved parcels support:

- Campaign and status filtering
- Text search
- Status changes from the library
- Edit, duplicate, and delete
- JSON export and import
- Player handout printing
- Private DM parcel printing
- Campaign loot-ledger printing

## Session Console handoff

**Send to Session Rewards** transfers an explicit DM-facing summary into the matching campaign’s **Rewards & Discoveries** field. It may include the parcel’s coins, valuables, mundane gear, magic-item candidate names, clues, and assigned recipient.

It never transfers the private DM notes field.

An already-open Session Console receives the rewards update through the existing cross-tab synchronization layer.

## Magic Item Forge handoff

**Send Magic Items to Forge** creates one editable placeholder per magic-item candidate:

- Unidentified state
- Homebrew rules label
- Campaign and owner assignment
- Inferred item category when possible
- Tier-based provisional rarity
- No activation, charges, damage, saves, or properties
- A visible reminder that the DM must complete the item before revealing it

The handoff never generates rules text from an item name and never copies parcel DM notes or story clues.

An already-open Magic Item Forge adopts new placeholders through `shared/magic-items-live-adapter.js`.

## Shared Campaign Hub summary

The versioned shared store records only:

- Parcel name
- Source label
- Status and scale
- Assigned recipient
- Number of coin denominations present and total coin-piece count
- Counts of valuables, mundane items, magic items, and clues
- Update timestamp

The shared summary excludes:

- Item descriptions or names
- Player-facing notes
- Private DM notes
- Clue text
- Magic-item candidate names

## Automated checks

- Route and asset presence
- JavaScript syntax
- Cryptographic generator requirement
- Shared-summary privacy boundary
- Session Console handoff exclusion of private DM notes
- Rule-free unidentified Magic Item placeholders
- Campaign Hub synchronization
- DOM ID and form-field contracts
