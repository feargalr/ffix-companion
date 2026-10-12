# Disc 1 content audit

_Audit date: 12 October 2026 · Branch: `disc1-audit` · Target: Nintendo Switch (played on Switch 2)_

This audit started from an independent review of the Disc 1 dataset. It implements the confirmed findings and re-checks every entry against a wider set of sources. Where the evidence disagrees or is missing, the entry says so in the app.

Machine-readable companions:
- [`docs/evidence/disc1-evidence.json`](evidence/disc1-evidence.json): every entry with its verification state, missability, priority and the source sections used (`npm run report`).
- [`docs/evidence/disc1-audit-diff.json`](evidence/disc1-audit-diff.json): field-by-field diff of every entry against `main` before this audit.
- [`docs/content-status.md`](content-status.md): generated per-area counts.

---

## Summary

| | Count |
|---|---:|
| Entries reviewed | **229** (218 existing + 11 added) |
| Confirmed by two or more independent sources (`verified`) | **216** |
| One authoritative source (`single-source`) | **2** |
| Sources disagree (`conflicting`) | **11** |
| Unverified | **0** |
| Entries changed | **132** (50 substantive corrections, 82 metadata-only: priority, ATE trigger type or wording) |
| Entries added | **11** |
| Entries removed | **0** |
| Entries still uncertain (not `verified`, or availability `unconfirmed`) | **81** |
| Shipped IDs preserved | **218 / 218** |

“Uncertain” is mostly about *revisit* status. The items themselves and where they are agree across all four walkthroughs. What isn’t documented is whether an unopened chest in Alexandria, Dali, Lindblum or Burmecia can still be collected on a later visit.

## Method

1. **Sources read in full for Disc 1**, in addition to the three used before the audit:

   | ID | Source | Used for |
   |---|---|---|
   | `jegged` | [Jegged walkthrough](https://jegged.com/Games/Final-Fantasy-IX/), Disc 1 pages 01–10 | Pickups, steals, ATEs |
   | `jegged-missables` | [Jegged — Missable Items and Events](https://jegged.com/Games/Final-Fantasy-IX/Tips-and-Tricks/Missable-Items-and-Events.html) | One-time areas, Stiltzkin |
   | `gamefaqs-bover` | [bover_87 guide](https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/missable-item-walkthrough): Disc 1 walkthrough pages plus *Missable Item Walkthrough*, *Mognet*, *Kupo Nuts*, *Stiltzkin Shopping*, *Stellazzio*, *Chocobo Hot & Cold*, *Storyline Mini-Games*, *Jump Rope* | Deadlines, chains |
   | `gamefaqs-vinheim` | [vinheim guide](https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953), Areas 01–13 and the later Alexandria revisit (Area 31) | **New fourth walkthrough.** Each area’s item list was compared with the dataset |
   | `gamefaqs-chocobo-fishy` | [Fishy071 Chocobo guide](https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/42402) | Chocographs by disc |
   | `gamefaqs-chocograph-redscarlet` | [Red Scarlet Chocograph guide](https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/10330) | Chocographs (second source) |
   | `steam-guide` | [lylat & ponkberry 100% guide](https://steamcommunity.com/sharedfiles/filedetails/?id=665159772) | Pickup lists, ATE names |
   | `steam-ate-guide` | [karinms ATE guide](https://steamcommunity.com/sharedfiles/filedetails/?id=665189459) | ATE triggers; bold = forced |

2. **Item-by-item comparison with Vinheim.** For every Disc 1 area, Vinheim’s list of quoted pickups was extracted and matched against the dataset. All areas matched, with one exception: Vinheim omits the Alexandria Weapon Shop **Remedy**, which GameFAQs and the Steam guide both list. The entry was kept and the omission noted.
3. **Verification states** now have four values: `verified` (two or more independent sources), `single-source`, `conflicting` (the disagreement is explained in the entry), and `unverified` (none at present). The number of sources alone was not treated as proof; each conflict was read and recorded.
4. **Limits.** All research was from published guides. Nothing could be checked in-game. GameFAQs rate-limited some requests; every page listed above was eventually read in full.

## Individual corrections

Confidence: **High** = two or more sources agree explicitly; **Medium** = one explicit source plus indirect support; **Low** = inference, flagged in the app.

### Chocographs

| Entry ID | Original | Corrected | Reason / evidence | Confidence |
|---|---|---|---|---|
| `d1.lindblum-kingdom.chocograph-1` | “Chocograph: Streamside”: dig and treasure combined, reward on the dig | “Dig up Chocograph #1: Streamside”; reward moved to new treasure entry | Digging and recovery are separate activities (Fishy071, Red Scarlet, bover_87) | High |
| `d1.lindblum-kingdom.chocograph-2` | Combined; required only catching Choco | Dig only; requires Streamside first | bover_87: Chocographs only appear after the first “Stone With Patterns” | High |
| `d1.daines-horse-basin.chocograph-healing-shore` | Combined; listed under Daines-horse Basin | Dig only; **moved to Chocobo’s Forest (Lindblum Kingdom)**, ID unchanged (`legacyId`) | Digging happens in Chocobo’s Forest; the treasure is on the beach near Burmecia | High |
| `d1.daines-horse-basin.chocograph-birds-eye-lagoon` | Combined; required Healing Shore; single-source | Dig only; moved to Chocobo’s Forest; requires Streamside; verified | **Reef is needed for the treasure, not for digging** (bover_87’s Chocograph table: dig ability “None”; treasure “Reef”) | High |
| `d1.daines-horse-basin.chocograph-small-beach` | Combined; required Healing Shore; reward “Remedy, 2 Elixir, …”; single-source | Dig only; moved; verified. Reward on new treasure entry is **4 Remedy, 2 Elixir, 8 Rising Sun, Oak Staff** | Same as above. “4 Remedy” confirmed by Fishy071, Red Scarlet and bover_87’s own Chocograph table (his walkthrough omitted the quantity) | High |

### Burmecia

| Entry ID | Original | Corrected | Reason / evidence | Confidence |
|---|---|---|---|---|
| `soft-right-house`, `potion-left-house`, `soft-left-house`, `ether-bedroom`, `uptown-tent`, `uptown-phoenix-down`, `lightning-staff` | `unconfirmed` pickups, verified | `permanent` one-time **pickup**, priority **optional**, verification **conflicting** | Jegged’s missables page calls Burmecia a one-time area (“collect all treasure chests before completing the area”). GameFAQs contradicts this indirectly: its Stellazzio page says none of the coins (Cancer included) are missable “even on Disc 4”, and its Mognet list has Disc 4 letters to Atla in Burmecia. The items are common, so the warning stays low and the conflict is shown | Medium |
| `cancer-stellazzio` | `unconfirmed`, kind `pickup` | Kind **unique**, priority **important**, verification **conflicting** | Each Stellazzio has exactly one location (GameFAQs). Not given the strongest warning, because GameFAQs says it can’t be missed | Medium |
| `germinas-boots` | Conditional pickup | Unchanged classification; verification **conflicting** (revisit); note kept that the item comes from Streamside too | Running collapses the floor (all four sources) | High (floor) / Medium (revisit) |
| `stiltzkin-333` | Kind `unique` | Kind **opportunity**, reward **replaceable**, priority **important**; trigger and deadline spelled out | The loss is the purchase, not the items: one of eight deals required for the Ribbon (Jegged, bover_87). He appears when the Lightning Staff chest is opened and leaves quickly (bover_87, Vinheim) | High |
| `uptown-ground-door` | “Enter Uptown building through the ground-level door”, single-source | Renamed **“Wei and Kal: …”**, priority **critical**, clearer directions, verified | Jegged independently confirms the scene enables a later ATE. The later event is only named in spoiler text | High |
| `kupo-nut-delivery` | `none`, no reward | **permanent** opportunity, priority **important**, reward “Random: Tent, Phoenix Pinion or Ether” | You can only carry one Kupo Nut and another is given early on Disc 2 (bover_87 *Kupo Nuts*). Jegged calls it “your only opportunity”. Vinheim received a Phoenix Pinion | High |

### Dali ATEs

| Entry ID | Original | Corrected | Reason / evidence | Confidence |
|---|---|---|---|---|
| `ate-cats-eye-2` | No prerequisite | **requires Cat’s Eye** | Vinheim: “Cat’s Eye 2 (after watching Cat’s Eye)” | High |
| `ate-dagger-tries-harder` | Spot “Village road / field / windmill” | Spot “Village road (after Dagger Tries)”; three trigger routes listed as routes; deadline “before entering the Weapon Shop” | Steam ATE guide gives three trigger routes. GameFAQs and Vinheim both place it before the Weapon Shop | High |
| `ate-queen-brahnes-steiner` | Conditional, spot “Weapon Shop / Inn” | **Automatic-conditional** scene at the inn; not selected from the ATE prompt | Steam ATE guide marks it as forced (bold) and lists its conditions. GameFAQs gives the same prerequisites. Vinheim: it plays when you speak to Dagger at the inn | High |
| `buy-feather-hat` | single-source | verified | Vinheim also buys Feather Hats here | High |

### Lindblum

| Entry ID | Original | Corrected | Reason / evidence | Confidence |
|---|---|---|---|---|
| `ate-synthesis-lesson` | “Teach Me, Mogster! (Synthesis lesson)”, single-source | **“Teach Me, Mogster! (My First Synthesis Lesson)”**, verified, automatic | Vinheim and the Steam ATE guide both give this full form, matching Lessons 1 and 2. The other guides used half the title. It is **not** a version difference | High (name); exact on-screen punctuation unconfirmed |
| `ate-small-town-knight`, `ate-steam-engine`, `ate-baku-and-crew` | “unconfirmed”, vague deadline | Still **unconfirmed** but priority **important**, exact trigger screen, and an explicit *last safe point* (Business District air cab / Tantalus hideout / return to the castle) | All three are optional (not bold in the Steam ATE guide). **No source documents a cut-off**; the last safe point is where every walkthrough has already watched them | High (trigger) / Low (cut-off) |
| `autograph`, `moogle-suit` | Unique key items | Priority **critical**; note that the deadline comes from GameFAQs only, and that you must first see the man in the Moogle suit leave the theatre (Steam) | Deadline single-source; order corroborated by Vinheim | Medium |
| 18 ordinary pickups (`glass-armlet`, `castle-ether`, `gil-163`, `hi-potion`, `echo-screen`, `tent-church-street`, `leather-plate`, `silver-gloves`, `leather-wrist`, `bronze-vest`, `mimic-card`, `steepled-hat`, `gil-127`, `ore`, `hideout-gil-282`, `hideout-gil-68`, `hideout-gil-97`, `mini-burmecia`) | `none` | **`unconfirmed`** pickup, optional | Same standard as Alexandria and Dali: Lindblum is revisited, but no source confirms unopened chests persist. Previously treated more leniently than the other towns | Medium |

### Other areas

| Entry ID | Original | Corrected | Reason / evidence | Confidence |
|---|---|---|---|---|
| `d1.gizamalukes-grotto.kupo-nut-moogle` | “…Bell Room Moogle”, optional | “Give Vivi’s Kupo Nut to **Moguta**”, **mandatory** | Jegged and Vinheim name Moguta; GameFAQs says Mogmi (conflict noted). bover_87 *Kupo Nuts*: the first Disc 1 delivery yields the Holy Bell needed to progress | High (mandatory) / Medium (name) |
| `d1.gunitas-basin.ragtime-mouse` | single-source | verified | Vinheim also covers Ragtime Mouse in forests | High |
| `blu-mustard-bomb`, `blu-limit-glove`, `blu-lv3-defless`, `blu-vanish` | single-source | verified | Vinheim’s Blue Magic table: Bomb and Axe Beak/Carve Spider on Lindblum Plateau, Vice on Eunorus Plains. Mandragora for Limit Glove remains GameFAQs-only and is noted | High |
| `d1.nolrich-heights.friendly-mu` | Requirement “1 Ore” | “Carry at least 1 Ore — the Mu only appears if you have one” | Vinheim. Location still differs between sources (noted) | Medium |
| `d1.alexandria-vivi.hippaul-cards` | No revisit note | Note: a later visit’s bell rope drops a *different* card set | Vinheim Area 31 lists five cards from the same rope | Medium |
| `d1.alexandria-vivi.remedy` | verified | Note that Vinheim omits it | Kept: GameFAQs + Steam | High |

Every other changed entry only gained an explicit **priority**, an **ATE trigger type**, or clearer **last-opportunity wording**. All of these are listed in `disc1-audit-diff.json`.

## Missing content added (11)

| New ID | What | Why included |
|---|---|---|
| `d1.lindblum-kingdom.chocograph-uncultivated-land` | Dig up Chocograph #3 | One of 9 Chocographs diggable on Disc 1 (Fishy071, Red Scarlet, bover_87) |
| `d1.lindblum-kingdom.chocograph-abandoned-beach` | Dig up Chocograph #5 | Same |
| `d1.lindblum-kingdom.chocograph-cold-field` | Dig up Chocograph #6 | Same |
| `d1.lindblum-kingdom.chocograph-faraway-lagoon` | Dig up Chocograph #8 | Same |
| `d1.lindblum-kingdom.chocograph-piece-1` | Dig up a Chocograph Piece | Fishy071 and Red Scarlet: upper-left piece in the Forest on Disc 1. bover_87 says the first *two* can be found any time, so marked **conflicting** |
| `d1.lindblum-kingdom.chocograph-1-treasure` | Streamside treasure | Recovery is now separate from digging |
| `d1.lindblum-kingdom.chocograph-2-treasure` | Between Mountains treasure | Same |
| `d1.daines-horse-basin.chocograph-healing-shore-treasure` | Healing Shore treasure (Reef) | Same |
| `d1.daines-horse-basin.chocograph-birds-eye-lagoon-treasure` | Bird’s-Eye Lagoon treasure | Same; needs Reef |
| `d1.daines-horse-basin.chocograph-small-beach-treasure` | Small Beach treasure | Same; needs Reef |
| `d1.evil-forest.mosco-ruby-letter` | Read the letter at Mosco | Mentioned by Jegged and both Steam guides. Whether it needs the “Girl Who Was Left Behind” ATE is unconfirmed (**conflicting**) |

**Checked and found complete:** chests and hidden items (all areas match Vinheim); the Disc 1 Stellazzio coins (Aries, Cancer); the Disc 1 Mognet chain (Kupo→Monty, Mois→Gumo, Kumop→Mogki, Mogki→Atla, Grimo→Nazna, Atla→Monev); the single Disc 1 Stiltzkin deal (he also appears in Alexandria but sells nothing; added as a tip); boss steals; Blue Magic. Not added: Mimic fights and Tetra Master NPC games (not collectibles), and enemy drops.

## Chocographs

All nine Chocographs that can be dug up on Disc 1 are dug in Chocobo’s Forest, with no special ability needed to dig them. Treasure IDs for later discs are **reserved** in `src/data/chocographs.ts`. The Chocograph log can already record them, and future disc data must use those exact IDs.

| # | Chocograph | Dig-up entry | Treasure | Ability for treasure | Treasure reachable | Treasure entry |
|---|---|---|---|---|---|---|
| 1 | Streamside | `d1.lindblum-kingdom.chocograph-1` | 2 Elixir, 3 Hi-Potion, 4 Ether, 2 Germinas Boots | Field | Disc 1 | `d1.lindblum-kingdom.chocograph-1-treasure` |
| 2 | Between Mountains | `d1.lindblum-kingdom.chocograph-2` | 5 Potion, 5 Hi-Potion, 2 Tent, 2 Cotton Robe | Field | Disc 1 | `d1.lindblum-kingdom.chocograph-2-treasure` |
| 3 | Uncultivated Land | `d1.lindblum-kingdom.chocograph-uncultivated-land` | 10 Antidote, Jade Armlet, 3 Wing Edge, Cargo Ship Card | Field (tracks need airship or Mountain) | Disc 3 | reserved `d3.chocographs-disc3.uncultivated-land-treasure` |
| 4 | Healing Shore | `d1.daines-horse-basin.chocograph-healing-shore` | Reef ability | Field | Disc 1 | `d1.daines-horse-basin.chocograph-healing-shore-treasure` |
| 5 | Abandoned Beach | `d1.lindblum-kingdom.chocograph-abandoned-beach` | 9 Phoenix Pinion, 5 Phoenix Down, 12 Peridot, Diamond Gloves | Field | Disc 2 | reserved `d2.chocographs-disc2.abandoned-beach-treasure` |
| 6 | Cold Field | `d1.lindblum-kingdom.chocograph-cold-field` | 5 Echo Screen, 7 Hi-Potion, 3 Tent, Theater Ship Card | Field (needs ship/airship) | Disc 3 | reserved `d3.chocographs-disc3.cold-field-treasure` |
| 8 | Faraway Lagoon | `d1.lindblum-kingdom.chocograph-faraway-lagoon` | 37 Potion, 6 Magic Tag, Shield Armor, Gaia Gear | Reef | Disc 3 | reserved `d3.chocographs-disc3.faraway-lagoon-treasure` |
| 10 | Bird’s-Eye Lagoon | `d1.daines-horse-basin.chocograph-birds-eye-lagoon` | 8 Potion, 4 Phoenix Down, 3 Ether, Magician Robe | Reef | Disc 1 | `d1.daines-horse-basin.chocograph-birds-eye-lagoon-treasure` |
| 11 | Small Beach | `d1.daines-horse-basin.chocograph-small-beach` | **4 Remedy**, 2 Elixir, 8 Rising Sun, Oak Staff | Reef | Disc 1 | `d1.daines-horse-basin.chocograph-small-beach-treasure` |
| Piece | Chocograph Piece (upper-left) | `d1.lindblum-kingdom.chocograph-piece-1` | Part of the 6-piece Mist Ocean Chocograph | Sea | Disc 3+ | reserved `d3.chocographs-disc3.mist-ocean-treasure` |

Rewards are confirmed by all three Chocograph sources. **Uncultivated Land’s treasure location conflicts:** Fishy071 and Red Scarlet say Zamo Basin north of Treno; bover_87 says Gunitas Basin near the Evil Forest. Both are shown.

The dig and treasure entries are in the Chocographs section of the area checklists. The full log, including treasures you can’t reach yet, is on the **Progress** screen. No Chocograph is ever shown as permanently missed on Disc 1.

## Disc 1 ATE inventory

17 ATEs count towards the full set (matching the Steam ATE guide’s 1–17/79). The three “Teach Me, Mogster!” tutorials don’t count.

| Area | ATE | How it plays | Prerequisite | Last opportunity |
|---|---|---|---|---|
| Evil Forest | The Forest Keeper | Automatic | — | Forced |
| Evil Forest | Time to Escape | Select | — | Before leaving the wreck with Vivi and Steiner |
| Evil Forest | Girl Who Was Left Behind | Select | — | Same |
| Evil Forest | My Little Baby | Select | Time to Escape | Same |
| Evil Forest | Orchestra in the Forest | Select | Vivi and Steiner in party | Before escaping the forest |
| Evil Forest | Do As I Say, Not As I Do | Automatic | — | Forced |
| Gunitas Basin | Teach Me, Mogster! Lesson 1 *(tutorial)* | Automatic | — | Forced |
| Ice Cavern | Teach Me, Mogster! Lesson 2 *(tutorial)* | Automatic | — | Forced |
| Dali | Vivi, Confused | Select | — | Before finding Dagger in the Weapon Shop |
| Dali | Dagger Tries | Select | — | Same |
| Dali | Cat’s Eye | Select | — | Same |
| Dali | Cat’s Eye 2 | Select | Cat’s Eye; talk to Vivi | Same (not offered in the inn reception) |
| Dali | Dagger Tries Harder | Select | Dagger Tries + a few screen changes (three routes) | Before entering the Weapon Shop |
| Dali | Queen Brahne’s Steiner | Automatic **if** conditions met | Dagger Tries Harder, Cat’s Eye, meeting Dagger in the shop | Talking to Dagger at the inn |
| Lindblum | Teach Me, Mogster! (My First Synthesis Lesson) *(tutorial)* | Automatic | — | Forced |
| Lindblum | Small-Town Knight in a Big City | Select | — | **Unconfirmed**; last safe point: before leaving the Business District |
| Lindblum | Vivi’s Shopping | Automatic | — | Forced (gives the Kupo Nut) |
| Lindblum | Steam Engine | Select | — | **Unconfirmed**; last safe point: before the Tantalus hideout |
| Lindblum | What Can I Do? | Automatic | — | Forced |
| Lindblum | Baku and His Crew | Select | — | **Unconfirmed**; last safe point: before returning to the castle |

Related one-time scene: **Wei and Kal** in Uptown Burmecia (not an ATE itself) unlocks a much later ATE.

## Missability totals

| | Before | After |
|---|---:|---:|
| Entries | 218 | 229 |
| permanent | 72 | 81 |
| conditional | 12 | 12 |
| temporary | 5 | 5 |
| unconfirmed | 58 | 69 |
| none | 71 | 62 |

What changed:
- **+7 permanent / −7 unconfirmed (Burmecia)**: one-time pickups, but marked *conflicting* with optional priority.
- **+1 permanent (Kupo Nut delivery)**: one nut can be held at a time.
- **+18 unconfirmed / −18 none (Lindblum pickups)**: same standard as the other towns.
- **The 11 new Chocograph and letter entries**: Chocographs are `none` (never missable); the Mosco letter is `permanent`.

### Warning priority (new)

Priority now comes from the consequence, not the category, and can be set per entry. Distribution across all missable entries:
- **Critical: 6**: sword-fight 100 nobles, Brahne’s prize, Autograph, Moogle Suit, Master Hunter, Wei and Kal.
- **Important: 30**: missable ATEs, Mognet chain steps, Stiltzkin, Kupo Nut delivery, Knights of Pluto, the Festival prize choice, key steals (Mythril Dagger, Ice Staff, Chain Plate), Cancer Stellazzio, the three unconfirmed Lindblum ATEs, recruiting Quina.
- **Lower priority: 131**: ordinary pickups, replaceable steals, unconfirmed revisits, content that comes back later.

Before You Leave shows Critical then Important. Lower-priority items stay one tap away. Entries whose evidence is incomplete are tagged “evidence incomplete”. The Journey screen’s “Missables” number now counts Critical + Important only.

## Images

**Permission basis:** Square Enix’s [FFIX copyright conditions](https://www.jp.square-enix.com/ff9/conditions.html) (Japanese, revised 13 Jan 2021). Category 1 covers text, images and video published on the official FFIX site and related sites; category 2 covers in-game screenshots. Conditions observed:
- non-commercial use only;
- the notice “© 2000, 2019 SQUARE ENIX CO., LTD. All Rights Reserved. / LOGO ILLUSTRATION:© 2000 YOSHITAKA AMANO” is shown in the app footer on every page and on the About page;
- no excessive modification;
- no advertising;
- notices are not removed;
- the material is not combined with non-FFIX content;
- it will be taken down on request.

| File (`public/images/official/`) | Original | Modification |
|---|---|---|
| `char-zidane.webp` | https://www.jp.square-enix.com/ff9/characters/images/zidane_cg.png | Transparent margins trimmed, scaled to 240 px high, WebP |
| `char-vivi.webp` | …/characters/images/vivi_cg.png | Same |
| `char-garnet.webp` | …/characters/images/garnet_cg.png | Same |
| `char-steiner.webp` | …/characters/images/steiner_cg.png | Same |
| `char-freya.webp` | …/characters/images/freija_cg.png | Same |
| `char-quina.webp` | …/characters/images/quina_cg.png | Same |
| `loc-prima-vista-stage.webp` | https://www.jp.square-enix.com/ff9/system/images/other_thumb_01.jpg | WebP at original 266×183 |
| `loc-sword-fight.webp` | …/system/images/other_thumb_09.jpg | Same |
| `loc-dali-field.webp` | …/system/images/ate_thumb_01.jpg | Same |
| `loc-evil-forest-crash-site.webp` | …/system/images/ate_thumb_02.jpg | Same |

The ten files total about 123 KB. They are lazy-loaded with explicit dimensions and precached by the service worker for offline use. Sources and modifications are also recorded in `src/data/images.ts` and on the About page.

**Rejected:**
- The official system-page battle, menu and Chocobo screenshots (`atb_thumb_01–03`, `other_thumb_02–08`, `other_thumb_10`), because they show Japanese UI text or aren’t locations.
- All images on the 25th-anniversary site (jp.finalfantasy.com/ffix25th), which are mostly merchandise photos under a different © line and don’t clearly fall under the FFIX conditions.
- Any walkthrough or wiki screenshots: not permitted.

**Not found:** official images for Alexandria town, Ice Cavern, Lindblum, Gizamaluke’s Grotto or Burmecia. Those areas have no thumbnail.

**Residual uncertainty:** the conditions are published on Square Enix’s Japanese site. No separate English-language FFIX conditions page was found to confirm the same terms internationally.

## Technical changes

**Data model** (`src/types/game.ts`), all optional and backward compatible:
- `Verification` adds `conflicting`. The validator requires a caveat explaining any conflict.
- `priority` (`critical` / `important` / `optional`), `rewardUniqueness`, `ateTrigger` (`selectable` / `automatic` / `automatic-conditional`), `chocograph { number, role: 'dig' | 'treasure' }`.
- `legacyId`: an entry may move area while keeping its original ID. The validator only enforces the disc prefix.
- Areas gain `partyIds` (portraits) and `image` (thumbnail). `SourceId` adds the five new sources, and `AREA_SECTIONS` maps each area to the exact page or section read.

The four requested dimensions map onto the model like this:
- **Availability**: `missability` (+ `repeatable`).
- **Reward uniqueness**: `rewardUniqueness`, derived from `missableKind` when unset.
- **Completion opportunity**: `missableKind` (`pickup` / `steal` / `event` / `opportunity`) with `lastOpportunity`.
- **Warning priority**: `priority`, derived in `src/lib/priority.ts` when unset.

**Warning logic:** `src/lib/missables.ts` now returns `critical` / `important` / `lower` groups. `outstandingWarnings()` drives the Journey count. Closing-area rules (`closesWithArea`, later-disc deadlines, mutually exclusive groups) are unchanged.

**Progress migration:**
- No stored data is rewritten.
- The five original Chocograph IDs now mean “dug up”. A pre-audit tick is never assumed to mean the treasure was found, so the new treasure entries start unticked.
- A dismissible note explains this on the Progress screen and the two Chocograph areas. It is stored in `settings.dismissedNotices`, which old exports simply lack and get defaulted.
- Ticks on reserved later-disc treasure IDs are stored and exported but not counted until those discs exist.
- Tests cover importing a pre-audit export.

**Validation:** `npm run validate` now also checks:
- the Chocograph registry (dig IDs exist, reserved IDs have the right disc prefix and no duplicates);
- image references and files;
- the new enums.

`npm run report` writes the evidence JSON.

## Unresolved, needs in-game confirmation

1. **Burmecia revisit:** can Burmecia be re-entered later, and do unopened chests and the Cancer coin remain? (Jegged vs GameFAQs.)
2. **Alexandria (27), Dali (19), Lindblum (18) pickups:** do unopened chests persist on later visits? No source confirms either way.
3. **Lindblum ATE cut-offs:** exactly when do Small-Town Knight, Steam Engine and Baku and His Crew stop being offered?
4. **Autograph / Moogle Suit deadline:** stated only by GameFAQs.
5. **Chocograph Pieces on Disc 1:** one or two?
6. **Mosco’s letter:** does it depend on the “Girl Who Was Left Behind” ATE?
7. **Moogle name in Gizamaluke’s Grotto:** Moguta (Jegged, Vinheim) or Mogmi (GameFAQs)?
8. **Uncultivated Land treasure location:** Zamo Basin or Gunitas Basin?
9. **Friendly Mu location:** plains vs forest vs South Gate approach.
10. **Exact on-screen ATE title** for the synthesis tutorial (punctuation and capitalisation).
11. **Switch specifics:** no Disc 1 differences are reported by any source. Not checked on hardware.

## Quality assurance

See the commit for exact command output. Run on this branch:
- `npm run validate`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run check`

Also checked:
- **Mobile layout:** checked at 375 px in the browser, with no horizontal overflow on Area or Progress pages.
- **Shipped IDs:** the fixture grew from 218 to 229 IDs, append-only.
