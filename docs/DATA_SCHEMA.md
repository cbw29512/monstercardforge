# Data Schema

Monster Card Forge stores monster information as structured data. The renderer owns the visual design; monster records only provide values.

```json
{
  "id": "monster-id",
  "ruleset": "5e-2014",
  "source": "SRD or homebrew",
  "name": "Monster Name",
  "cr": "1",
  "type": "humanoid",
  "size": "Medium",
  "ac": "15",
  "hp": "30 (4d8+12)",
  "speed": "30 ft.",
  "abilities": {"str": 10, "dex": 10, "con": 10, "int": 10, "wis": 10, "cha": 10},
  "saves": [],
  "skills": [],
  "senses": "passive Perception 10",
  "languages": "Common",
  "resistances": [],
  "immunities": [],
  "conditionImmunities": [],
  "traits": [],
  "actions": [],
  "bonusActions": [],
  "reactions": [],
  "legendaryActions": [],
  "spellcasting": null,
  "lairActions": [],
  "regionalEffects": [],
  "layoutHint": "auto"
}
```
