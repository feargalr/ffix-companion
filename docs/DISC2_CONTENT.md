# Disc 2 content and verification

_Built: October 2026 · Target: Nintendo Switch (played on Switch 2)_

Companions:
- [`evidence/disc2-evidence.json`](evidence/disc2-evidence.json): every Disc 2 entry with its verification state, missability, priority and the source sections read (`npm run report`).
- [`content-status.md`](content-status.md): per-area counts for all discs.

## Summary

| | Count |
|---|---:|
| Areas | **20** |
| Checklist entries | **221** |
| Verified by two or more sources | **212** |
| Single source | **9** (listed below) |
| Conflicting | **0** (disagreements are recorded in notes) |
| ATEs | **32**, matching the Steam ATE guide’s #18–#49 |
| Warning priority (missable entries): critical / important / lower | **3 / 59 / 94** |
| Missability: permanent / conditional / unconfirmed / none | 144 / 9 / 3 / 65 |

**Existing progress:** all 230 Disc 1 IDs are unchanged. The 221 new IDs were appended to `src/test/fixtures/shipped-ids.json`.

## The reserved Chocograph ID

The Chocograph log had reserved `d2.chocographs-disc2.abandoned-beach-treasure` before Disc 2 existed. Disc 2 defines that entry with exactly that ID:
- **Area** `chocographs-disc2`: “Outer Continent — Donna Plains & Gegalrich Shores”.
- **Slug** `abandoned-beach-treasure`.
- **Requirement** `d1.lindblum-kingdom.chocograph-abandoned-beach`.

Any tick recorded in the log before this release carries straight over. Three safeguards keep it that way:
- The validator fails the build if a reserved ID for an available disc has no entry.
- A test checks this specific ID.
- The Chocograph log now judges reachability against the disc you are on.

The remaining reserved IDs, all on Disc 3, are untouched:
- `d3.chocographs-disc3.uncultivated-land-treasure`
- `d3.chocographs-disc3.cold-field-treasure`
- `d3.chocographs-disc3.faraway-lagoon-treasure`
- `d3.chocographs-disc3.mist-ocean-treasure`

## Sources and method

- **GameFAQs, bover_87**: all 16 Disc 2 walkthrough pages (*Journey to Treno* through *Battle of the Iifa Tree*), plus the *Kupo Nuts*, *Stiltzkin*, *Stellazzio* and *Chocobo Hot & Cold* pages.
- **GameFAQs, Vinheim**: Areas 14–30. Every area’s pickup list was compared with the dataset, and the Mognet, Stiltzkin, Blue Magic and limited-item names were confirmed.
- **PSNProfiles Rank S treasure guide**: per-disc availability for every Disc 2 location (used for missability).
- **Jegged**: Disc 2 pages 11–25, for boss steal tables, Stiltzkin, Mognet letters, the Dali Elixir, Cleyra’s point of no return and the Cleyra Blue Magic.
- **Steam ATE guide (karinms)**: Disc 2 ATE names, triggers and forced (bold) scenes.
- **Fishy071 / Red Scarlet**: the Abandoned Beach treasure.
- **Jegged missables**: Stiltzkin stops 2–4 and the Friendly Monster jewels.

Per-area section links are in `src/data/sources.ts` (`AREA_SECTIONS`).

## Areas

| # | Area | Notes |
|---|---|---|
| 1 | Summit Station & South Gate | Last chance for Iron Helms and Silver Gloves; Nazna’s Kupo Nut |
| 2 | Bentini Heights, Quan’s Dwelling & Dali *(optional)* | Scorpio coin; Disc 2-only Elixir in Dali’s field |
| 3 | Dark City Treno | 7 ATEs with screen lock-outs; Gemini and Taurus coins; last chance for Air Rackets |
| 4 | Gargan Roo | One-time area (GameFAQs) |
| 5 | Mist Continent — Before Cleyra *(optional)* | Kupo Nut delivery that must happen before Cleyra; the Disc 1 Javelin deadline now closes here |
| 6 | Cleyra’s Trunk | Two chests reportedly need taking before the sandfall changes (PSNProfiles) |
| 7 | Cleyra Settlement | Point of no return; Emerald (critical); Stiltzkin 444; residents’ rewards |
| 8 | Alexandria Castle — Breaking Out | Three bosses with steals; Mognet chain |
| 9 | Pinnacle Rocks | Disc 2-only chests (PSNProfiles) |
| 10 | Lindblum — Under Occupation | Disc 2-only pickups; 15 Chain Mail last chance; “The Third Jewel” ATE |
| 11 | Mist Continent — Before Leaving | Two more Kupo Nut deliveries in a fixed order; Dragon’s Gate letter |
| 12 | Fossil Roo | One-time inner tunnels; Stiltzkin 555; Kuppo; Madain’s Ring mining |
| 13 | Outer Continent — Donna Plains *(optional)* | **Reserved Abandoned Beach treasure** |
| 14 | Conde Petie | 5 ATEs with lock-outs; Diamond (closes end of Disc 3) |
| 15 | Black Mage Village | Mogryo’s letter (critical); 6 ATEs in a strict order |
| 16 | Conde Petie & Mountain Path | Nuptial Joy; four stones → Moonstone (critical, closes end of Disc 3); Stiltzkin 666 |
| 17 | Madain Sari | 5 ATEs; Libra coin; Kirman Coffee |
| 18 | Iifa Tree | Disc 2-only; area below the elevator closes |
| 19 | Madain Sari — Return | Solo boss; new party member |
| 20 | Iifa Tree — Return | End of Disc 2 |

## Decisions worth knowing

- **Kupo Nut ordering.** You can carry only one Kupo Nut (bover_87). Disc 2 hands out four (Nazna, Monev, Moonte, Suzuna), so each delivery entry says exactly which nut it is and its deadline.
  - Nazna’s nut must be delivered before meeting Monev.
  - Monev’s nut before collecting Moonte’s, and Moonte’s before Fossil Roo.
  - Suzuna’s nut can’t be delivered on Disc 2, because Moguta is on the other continent.
- **Disc 2’s fixed Kupo Nut reward.** bover_87’s Kupo Nut page says the Disc 2 Elixir is only available after Cleyra. So the Elixir is attached to the delivery of Monev’s nut, and the earlier delivery is “random item”.
- **Cross-disc deadlines.** The Conde Petie Diamond, the four coloured stones and the Moonstone stay available until the end of Disc 3 (GameFAQs, PSNProfiles). They are flagged as later-disc deadlines, which appear under “Deadlines ahead” on the Progress screen rather than as Disc 2 warnings.
- **Cleyra’s Trunk** chests close at the settlement’s point of no return, so they appear in the settlement’s Before You Leave list. The trunk page explains this.
- **Treno-arch treasures not included.** PSNProfiles lists “Treno Archway” chests (3,206 Gil and two Elixirs) for Discs 1–3. Vinheim places them at a gate near the Evil Forest that is reached with the Chocobo’s Mountain ability, which comes much later, so they belong with later content.
- **Party portraits.** Official art for Eiko and Amarant was added from the same official FFIX character page, under the same conditions as the other portraits.
- **ATE prerequisites.** These were only added where a source states them; ordering hints in guides were not turned into requirements. The Treno chain (Tradition → Pursuit → Confusion → Ambition) follows bover_87’s explicit “(Pursuit, then …)” wording. Cleyra’s ATEs are not chained.

## Single-source entries

| Entry | Source | Why only one |
|---|---|---|
| `d2.summit-station.buy-iron-helms` | GameFAQs | Last-chance shop claim |
| `d2.summit-station.buy-silver-gloves` | GameFAQs | Last-chance shop claim |
| `d2.treno.buy-air-rackets` | GameFAQs | Last-chance shop claim |
| `d2.lindblum-occupied.buy-chain-mail` | GameFAQs | Last-chance shop claim |
| `d2.alexandria-castle-escape.steal-zorn-partisan` | Jegged | GameFAQs lists Thorn’s Mythril Armor instead (Jegged lists it as a drop) |
| `d2.mist-continent-zidane.frog-catching-3`, `d2.mist-continent-departure.frog-catching-4`, `d2.chocographs-disc2.frog-catching-5` | GameFAQs | Frog catching isn’t covered by the other guides |
| `d2.black-mage-village.mogryo-stiltzkin-letter` | GameFAQs | Read-only letter |

## Disagreements recorded in notes

- **Beatrix’s Ice Brand** (Cleyra): bover_87 puts it in the semi-rare slot; Jegged lists it as rare (6%).
- **Madain Sari cooking:** bover_87 and the Steam ATE guide give different cook/fisher assignments. The notes give both, plus the advice they share (leave out the Oglop, ask Quina).
- **Cleyra trunk sand chests:** only PSNProfiles says the Magician Shoes and Ice Staff must be taken before the sandfall changes.
- **Pinnacle Rocks:** PSNProfiles lists all chests as Disc 2 only; bover_87 says the two Disc 1 chests (Elixir, Phoenix Down) are also on Disc 3. The Disc 2 entries cover only the three new chests.

## Open questions

1. Whether `Mogmatt → Suzuna` and `Mogryo → Mocchi` can still be delivered after their areas (marked *unconfirmed*). The pickup of Mogryo’s letter is confirmed missable.
2. The exact point at which Bohden Gate’s wagon chest (an Elixir Card, per PSNProfiles) becomes reachable. Not added.
3. Running Shoes in Quan’s Dwelling’s clock (PSNProfiles: Discs 2–4). No walkthrough mentions it on Disc 2, so it isn’t added.
4. Switch-specific behaviour: none reported; not checked on hardware.
