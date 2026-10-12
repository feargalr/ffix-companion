# Disc 1 content verification report

_Last researched: 12 October 2026. Target platform: Nintendo Switch (also running on Switch 2)._

This report says how the Disc 1 dataset was put together, what was cross-checked, and what is still uncertain.
For per-area counts and the list of single-source entries, see the generated companion file
[`content-status.md`](./content-status.md) (`npm run report`).

## Method

1. **Sources.** Each Disc 1 area was read in full in three independent guides:
   - Jegged.com — *Final Fantasy IX* geographic walkthrough (pages 01–10 of Disc 1)
   - GameFAQs — bover_87's *Guide & Walkthrough*, including the *Missable Item Walkthrough*, *Mognet*, *Jump Rope* and
     *Storyline Mini-Games* sections
   - Steam Community — lylat & ponkberry's *100% Achievement Guide* (Disc 1 sections)
2. **Cross-checking.** An entry is marked `verified` when at least two sources agree on what it is and roughly where.
   An entry stated by only one source is marked `single-source` and shows a "1 source" chip in the app.
3. **Disagreements.** These are recorded in the entry’s caveats rather than settled by guessing (listed below).
4. **Original writing.** All names are the in-game names. Every description, location note and tip was written for
   this project. No guide prose, tables, screenshots or layouts were copied.
5. **Automated checks.** `npm run validate` checks for duplicate or malformed IDs, invalid `requires` / `closesWithArea`
   references, dependency cycles, lone exclusive groups, missing fields, permanent/conditional entries without a
   last-opportunity note, and area ordering. The test suite also stops any shipped entry ID from being removed
   (`src/test/fixtures/shipped-ids.json`).

## Chronology

The order follows the story flow given in the GameFAQs walkthrough and matches Jegged’s chapter order:

1. M.S. Prima Vista — Planning the Heist
2. Alexandria — Vivi’s Arrival
3. Alexandria Castle & Prima Vista — I Want to Be Your Canary
4. Evil Forest — Crash Site & Rescue
5. Gunitas Basin (world map; Melda Arch / North Gate)
6. Ice Cavern
7. Nolrich Heights (world map; South Gate is still closed) — optional
8. Village of Dali (village, underground, Observatory Mountain)
9. Cargo Ship
10. Lindblum — Arrival & Exploration
11. Lindblum — Festival of the Hunt & Departure (Serpent’s Gate, Dragon’s Gate)
12. Lindblum Kingdom — Qu’s Marsh, Pinnacle Rocks, Chocobo’s Forest, Bohden Arch — optional
13. Gizamaluke’s Grotto
14. South Gate / Bohden Gate (the Steiner & Dagger interlude)
15. Daines-horse Basin (world map; Burmecian Arch) — optional
16. Burmecia (ends with the final Disc 1 battle)

Repeat visits are separate areas (Alexandria town vs. castle; Lindblum exploration vs. festival).

## How missability was classified

| Value | Used when |
|-------|-----------|
| `permanent` | A source states the opportunity closes at a story point (e.g. Evil Forest after escaping, Ice Cavern after leaving Dali, Autograph/Moogle Suit before the Tantalus hideout, boss steals). |
| `conditional` | Depends on a choice or order (Festival prize, Germinas Boots floor, Grotto bell order, recruiting the fourth party member). |
| `temporary` | Comes back later (jump-rope rewards on a later disc). |
| `unconfirmed` | No source says whether a later revisit is possible (Alexandria town pickups, Dali village/underground, Burmecia pickups, three Lindblum ATE cut-offs). The app shows these as a lower-risk "Collect now" warning. |
| `none` | Stays available, or is a forced story event. |

`missableKind` tells apart **unique** items (Moonstone, key items, Stiltzkin), **pickups** whose item is common,
**steals**, **events** with no item, and one-off **opportunities**. Boss steals are marked as one-time steals even when
the item itself can be bought, and the caveats say where.

## Known gaps and uncertain entries

### Conflicting details (recorded in entry caveats)
- **Dali — "Dagger Tries Harder"** trigger point: before the Weapon Shop (GameFAQs) vs. the field/windmill (Steam) vs.
  the pumpkin patch (Jegged).
- **Dali — "Queen Brahne’s Steiner"**: forced (Steam) vs. needs *Dagger Tries Harder* + *Cat’s Eye* (GameFAQs).
- **Lindblum synthesis tutorial ATE** title: "Teach Me, Mogster!" (GameFAQs) vs. "My First Synthesis Lesson" (Steam).
- **Gizamaluke’s Grotto** — the Bell Room Moogle who takes Vivi’s Kupo Nut is "Mogmi" in GameFAQs and "Moguta" in Jegged.
- **Knights of Pluto** — Mullenkedheim’s room: "East Dining Room" (GameFAQs) vs. "Guest Room" (Jegged/Steam).
- **Jump rope 50-jump card**: "Cactuar" (GameFAQs) vs. "Cactus" (Jegged).
- **Chocograph name**: "Healing Shore" (GameFAQs) vs. "Healing Water" (Jegged).
- **Friendly Mu** location: Nolrich Heights plains (GameFAQs) vs. the South Gate approach (Jegged).

### Single-source facts
- Ragtime Mouse availability window; frog-catching details; five Blue Magic targets on Lindblum Plateau/basin
  (GameFAQs only).
- Bird’s-Eye Lagoon and Small Beach Chocograph contents (GameFAQs only).
- The bonus for buying every Stiltzkin deal is named as a Ribbon only by Jegged; GameFAQs just calls it a limited item.
- Needle Forks being sold by Atla’s Mogshop (Jegged only).
- Taking the upstairs door in Uptown Burmecia locking out a much later ATE (GameFAQs only).
- The Feather Hat being new stock in Dali (GameFAQs only).

### Revisit status not confirmed (marked `unconfirmed`)
- Alexandria town pickups (27), Dali village / underground / Observatory pickups (19), Burmecia pickups (9), and the
  Lindblum ATEs *Small-Town Knight in a Big City*, *Steam Engine* and *Baku and His Crew*.
  Collecting them on the first visit is always safe. Whether they can be picked up later needs testing in-game.

### Deliberately not tracked
- Tetra Master games against NPCs (e.g. the Alleyway Jack tutorial), Mimic chests in Burmecia, enemy-drop items,
  ordinary shop stock, and the Treasure Hunter point value of each pickup.
- Chocographs that can be dug up on Disc 1 but only completed later (#3, #5, #6, #8). These belong with later discs.
- Read-only Mognet mail that doesn’t affect the delivery chain (only delivery/pickup steps are entries).
- Achievement and trophy goals. The Switch has no achievement system, so these are only mentioned for context.

### Platform notes
- None of the three sources reports any Disc 1 collectible that differs on Switch. The Switch release uses the
  modern port (the PC/PS4 lineage), so the GameFAQs remarks about Steam/PS4/mobile behaviour, such as more forgiving
  sword-fight timing, should apply. **This hasn’t been checked on Switch hardware.**
- The guides give PlayStation button names. The app says "confirm" instead.

## Suggested next verification steps
1. In-game spot checks for the `unconfirmed` groups, especially whether Dali Underground can be re-entered on later
   discs and whether Alexandria town pickups persist.
2. Settle the conflicting details above by watching the in-game prompts.
3. Get a second source for the single-source entries listed in `content-status.md`.
