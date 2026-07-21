# DM Forge Live Validation Checklist

Use Chrome or Edge on the DM laptop. Force-refresh each page with **Ctrl+F5** before testing.

## 1. Campaign Hub

1. Open `campaigns.html`.
2. Press **Refresh from Tools**.
3. Create or select a campaign and make it active.
4. Confirm counts appear for sessions, encounters, NPCs, loot, magic items, and Cleric in a Box rooms.
5. Open Encounter Forge, NPC Forge, Loot Forge, Magic Item Forge, and Session Console from the active campaign.
6. Confirm each tool receives the campaign name.

## 2. Encounter Forge → Session Console

1. Open `encounter-forge.html` from Campaign Hub.
2. Create a mixed-level party profile.
3. Switch between 2014 and 2024 and confirm the budget labels change.
4. Add several monsters.
5. Confirm XP, difficulty, and warnings update.
6. Save the encounter.
7. Choose an initiative mode.
8. Press **Launch in Session Console**.
9. Confirm enemies arrive with name, initiative, Dexterity tiebreak, AC, and HP.
10. Confirm the objective and encounter notes appear in Session Console loose notes.

## 3. Player Display

1. In Session Console, open the Initiative tab.
2. Add at least one player and two enemies.
3. Press **Start Player Display**.
4. Copy the player link.
5. Open the link on a phone or tablet.
6. Confirm the player view shows only:
   - Campaign and session title
   - Round
   - Active turn
   - Names and types
   - Initiative values
   - Public conditions
7. Confirm it does **not** show:
   - Enemy current or maximum HP
   - AC
   - Dexterity
   - Combat logs
   - Session prep
   - DM notes
8. Advance turns and add/remove a condition.
9. Confirm the phone updates.
10. Test **Keep Screen Awake**, **Full Screen**, and **Change Room**.
11. Stop the display from Session Console and confirm the player page reconnects only when the host is restarted.

## 4. NPC Forge → Session Console

1. Open `npc-forge.html` from Campaign Hub.
2. Press **Generate Full NPC**.
3. Switch between Player Card and DM Card.
4. Confirm the Player Card never shows motive, fear, leverage, secret, lie, relationship text, or combat notes.
5. Save the NPC.
6. Press **Send to Session NPCs** from the library.
7. Confirm the matching Session Console campaign updates **NPCs & Motives**.
8. Confirm the transferred summary contains only name, role, faction, mannerism, and motive.
9. Enter deliberately long text and confirm the fit warning appears.
10. Print both player and DM versions and confirm continuation pages preserve overflow.

## 5. Loot Forge → Session Console

1. Open `loot-forge.html` from Campaign Hub.
2. Choose a parcel scale and press **Generate Original Parcel**.
3. Confirm generated content is editable.
4. Save the parcel.
5. Change its status from the library.
6. Press **Send to Session**.
7. Confirm Rewards & Discoveries updates in the matching Session Console campaign.
8. Confirm private DM notes are not copied into Session Console.
9. Print a player handout, DM parcel, and campaign loot ledger.

## 6. Loot Forge → Magic Item Forge

1. Add at least one name to **Magic-item candidates**.
2. Press **Send Magic Items to Forge**.
3. Open or refresh Magic Item Forge.
4. Confirm an unidentified placeholder appears in the matching campaign.
5. Confirm the placeholder has no generated activation, charges, damage, save DC, or rules properties.
6. Complete and save the item manually.
7. Re-send the same saved Loot Forge parcel.
8. Confirm the DM’s edited item is not overwritten once the hardening layer is active.

## 7. Magic Item Forge → Session Console

1. Save a magic item in the same campaign.
2. Press **Send to Session Rewards**.
3. Confirm Rewards & Discoveries updates.
4. Confirm hidden secrets, curses, artwork, and full rules are not copied.
5. Add long rules text and confirm a continuation page is added instead of clipping.

## 8. Cleric in a Box

1. Launch Cleric in a Box from Campaign Hub.
2. Create a room under the active campaign.
3. Join from a phone using a player name of `DM`.
4. Confirm the player can use a charge but cannot reset, undo, or change artifact settings.
5. Confirm the DM can set Wisdom modifier, save DC, and spell attack bonus.
6. Test one healing charge and one exact-level scroll.
7. Confirm all connected screens update and spent charges grey out.
8. Refresh Campaign Hub and confirm the room count appears.

## 9. Mobile and tablet layout

Test at minimum:

- Android Chrome phone
- iPhone Safari
- Android or iPad tablet
- Laptop Chrome
- Laptop Edge

Check:

- No sideways page scrolling
- Buttons are easy to tap
- Dialogs remain above the keyboard
- Player Display current-turn highlight is obvious
- NPC and Loot forms collapse to one column
- Long labels and campaign names wrap cleanly

## 10. Printing

Use letter-size paper at **100% / Actual Size**.

Test:

- Monster fold-over card
- Boss folio
- Magic Item front/back duplex
- 5×7 artifact
- NPC player card
- NPC DM card
- Loot player handout
- Loot DM parcel
- Loot campaign ledger
- Session packet
- Encounter packet

Record printer model, browser, scale, margin setting, duplex setting, and any alignment adjustment required.

## 11. Backup safety

1. Export Session Console, Magic Item, NPC, Loot, Encounter, and Campaign Hub JSON files.
2. Open a private/incognito browser window.
3. Import each tool’s backup.
4. Confirm records return to the correct campaign.
5. Never clear the main browser’s site data until all exports have been verified.
