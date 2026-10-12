# FFIX Adventure Companion

A mobile-first, offline-capable completionist checklist for **Final Fantasy IX**, organised area by area. It answers one question:

> *"I'm here in the story. What can I collect or do, and what should I finish before I leave?"*

Disc 1 is complete: 16 areas and 229 checklist entries covering treasure, hidden items, cards, key items, Active Time Events, boss steals, Mognet letters, sidequests, mini-games, Blue Magic and Chocographs. The content was audited in October 2026; see [docs/DISC1_AUDIT.md](docs/DISC1_AUDIT.md). The data model already supports Discs 2–4.

Built with React, TypeScript, Vite and Tailwind CSS. It is installable as a PWA and hosted on GitHub Pages. There is no backend, no accounts and no tracking.

---

## Features

- **Journey**: Disc 1 in story order, grouped by chapter, with per-area completion rings and missable counts. *Continue Adventure* reopens your last area.
- **Area checklists**: every entry has its own large checkbox. Tap the name to see where it is, how to get it, prerequisites, the reward, its missable status, the last chance to get it, and notes.
- **Before You Leave**: each area ends with outstanding missables ranked **Critical** / **Important**, plus the story action that closes them. Ordinary pickups are folded into a lower-priority list. It also catches things that close later, e.g. leftover Ice Cavern treasure is flagged in Dali, where the cave is actually sealed.
- **Missable classification**: separate labels for *unique* items, *one-time pickups* of common items, *one-time steals*, *missable events*, *conditional* content and *returns later*. A chest disappearing is never treated as the item being gone forever.
- **ATEs**: tracked inside each area, with prerequisite chains (*My Little Baby* requires *Time to Escape*) and links between them.
- **Chocograph log**: separate *dug up* and *treasure found* ticks for all nine Disc 1 Chocographs and the first piece. It shows which ability or later disc each treasure needs.
- **Mutually exclusive outcomes**: the Festival of the Hunt prizes count as a single unit. Picking one greys out the others.
- **Spoiler protection** (on by default): areas well ahead of you show only their place name until you open them, and spoiler notes stay folded. Nothing is ever locked.
- **Search**: offline search across all entries and areas, with filters for area, type, missable status and completion.
- **Progress dashboard**: totals, per-category and per-area bars, missables completed, and deadlines on later discs.
- **Your data**: stored in `localStorage` with **Export / Import** (validated JSON) and a confirmed **Reset**.
- **PWA**: installable on iOS and Android, works offline, and asks before applying an update.
- **Accessibility**: semantic landmarks, real checkbox/switch roles, keyboard support, visible focus, reduced-motion support, and 44 px touch targets.

## Quick start

Requires **Node.js 22+** (see `.nvmrc`).

```bash
npm install
npm run dev
```

Open the printed URL. To try it on your phone over the same Wi-Fi, run `npm run dev -- --host` and open the network URL.

### Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-check and build to `dist/` (generates the service worker) |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the Vitest suite once (`npm run test:watch` to watch) |
| `npm run validate` | Validate game data (duplicate IDs, bad references, missing fields, ordering) |
| `npm run report` | Validate and regenerate `docs/content-status.md` |
| `npm run lint` | Lint with oxlint |
| `npm run check` | validate + lint + test + build: everything CI runs |

To test the GitHub Pages subpath locally:

```bash
BASE_PATH=/FFIX/ npm run build
```

```bash
BASE_PATH=/FFIX/ npx vite preview
```

Then open `http://localhost:4173/FFIX/`.

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` validates the data, lints, tests, builds and deploys on every push to `main`.

1. Create a GitHub repository and push this project to its `main` branch.
2. In the repository, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Push (or run the workflow manually from the **Actions** tab). The site appears at `https://<user>.github.io/<repo>/`.

The workflow sets `BASE_PATH` to `/<repo>/` automatically (or `/` for a `<user>.github.io` repository). The app uses hash routing (`#/area/dali`), so deep links and offline reloads work under any subpath without a `404.html` trick.

### Updates and offline behaviour
- The service worker precaches the app shell, fonts and icons on first load, so later visits work fully offline.
- When a new version is deployed, the app shows **"A new version is available — Update"**. Nothing reloads until you tap it, so you never lose your place mid-checklist. Open apps also check for updates hourly.

### Installing on a phone
- **iPhone (Safari):** Share → *Add to Home Screen*.
- **Android (Chrome):** menu → *Install app* / *Add to Home screen*.

## Your progress and privacy

Progress lives only in your browser’s `localStorage` on that device. Clearing site data, using private browsing, or switching browser or device will lose it, and iOS may evict storage for sites you haven’t opened in a long while. **Use Progress → Export now and then** to keep a backup file. Import checks the file before replacing anything, and keeps entries it doesn’t recognise (e.g. from a newer version).

---

## Project structure

```
src/
  types/game.ts          Content schema (Area, ChecklistEntry, missability…)
  data/
    define.ts            defineArea() helper: fills IDs, areaId and defaults
    sources.ts           Source attribution
    index.ts             Disc registry and lookup maps
    disc1/               One file per area, in story order, plus index.ts
  lib/
    progress.ts          localStorage store (useSyncExternalStore)
    stats.ts             Completion maths (exclusive groups count once)
    missables.ts         Before You Leave / later-disc deadlines
    search.ts            Offline search and filters
    importExport.ts      Export format and import validation
    validate.ts          Data integrity rules (used by the script and tests)
    router.ts            Hash router
    spoilers.ts          Spoiler gating
    labels.ts            Category and missability labels
  components/            UI pieces (EntryRow, ChecklistSection, BeforeYouLeave…)
  pages/                 Journey, Area, Search, Progress, About
  test/                  Vitest suites and the shipped-ID fixture (fixtures/shipped-ids.json)
scripts/validate-data.ts Data validation and report generator
pwa.config.ts            Web app manifest and Workbox options
docs/                    Content verification report and generated status
```

## Adding content (Disc 2 and beyond)

1. **Create a folder** `src/data/disc2/` and one file per area, numbered in story order (e.g. `01-summit-station.ts`).
2. **Define each area** with `defineArea(meta, defaults, entries)`:

   ```ts
   import { defineArea, ref } from '../define';

   export default defineArea(
     {
       id: 'summit-station',          // kebab-case, unique across ALL discs
       disc: 2,
       order: 1,                      // 1-based, contiguous within the disc
       location: 'Summit Station',
       visit: 'First Visit',          // distinguishes repeat visits to a place
       chapter: 'Treno Arc',
       summary: 'One or two sentences.',
       departure: { trigger: 'What closes the area', consequence: 'What is lost' },
       tips: ['Optional field notes'],
     },
     // Defaults for entries that don't say otherwise:
     { missability: 'unconfirmed', missableKind: 'pickup', lastOpportunity: 'Before …' },
     [
       {
         slug: 'phoenix-down',        // becomes d2.summit-station.phoenix-down
         name: 'Phoenix Down',
         category: 'treasure',
         spot: 'Platform',
         description: 'Original wording only.',
         sources: ['jegged', 'gamefaqs-bover'],
       },
     ],
   );
   ```
3. **Register the disc** in `src/data/disc2/index.ts`, import it in `src/data/index.ts`, and set `available: true`.
4. Run `npm run report`, fix any validation errors, then append the new IDs to the shipped-ID fixture:

   ```bash
   npx tsx -e "import('./src/data/index.ts').then(m=>{const fs=require('fs');const p='src/test/fixtures/shipped-ids.json';const old=JSON.parse(fs.readFileSync(p,'utf8'));const cur=m.ALL_ENTRIES.map(e=>e.id);console.log('missing',old.filter(i=>!cur.includes(i)).length);fs.writeFileSync(p,JSON.stringify([...old,...cur.filter(i=>!old.includes(i))],null,1)+'\n')})"
   ```

   The fixture holds every shipped ID across all discs. Only ever add to it. The same command appends new IDs, but check that the script output reports `missing 0`.

### Rules for entries
- **IDs are permanent.** Progress is keyed by ID. Fix a typo in `name`, never in `slug`. The test suite fails if a shipped ID disappears.
- **Missability**: use `permanent` only when a source names a closing story point. Use `unconfirmed` when nobody says. Set `missableKind` to say *what* is lost (`unique`, `pickup`, `steal`, `event`, `opportunity`).
- **Closing elsewhere**: if an entry closes when you leave a *later* area, set `closesWithArea: '<that-area-id>'` (e.g. Ice Cavern treasure closes with `dali`). For deadlines on a disc that isn’t in the app yet, set `closesOnLaterDisc: true`.
- **Mutually exclusive** options share an `exclusiveGroup`. **Prerequisites** go in `requires` (entry IDs, built with `ref(disc, areaId, slug)`).
- **Forced story beats** that you still want listed get `mandatory: true`. They are never counted as missable.
- **Spoilers**: set `spoilerLevel` (1 = mild, 2 = plot) and put spoiler text in `spoilerText`, which stays folded.
- **Sources and verification**: list the sources you actually checked. Use `verification: 'single-source'` if only one confirms it, and put any disagreement in `caveats`.
- **Priority**: set `priority` when the consequence is bigger or smaller than the category suggests (e.g. a scene with no item that unlocks a later ATE is `critical`). Otherwise it is derived in `src/lib/priority.ts`.
- **ATEs**: set `ateTrigger` (`selectable`, `automatic`, or `automatic-conditional` for scenes that play by themselves only if their prerequisites were met).
- **Chocographs**: each needs `chocograph: { number, role: 'dig' | 'treasure' }`. Register the pair in `src/data/chocographs.ts`. Treasures reachable only on a later disc use a *reserved* ID there (e.g. `d3.chocographs-disc3.cold-field-treasure`). When that disc is added, create the entry with exactly that ID so existing ticks carry over.
- **Moving an entry** to another area after it shipped: keep its `id` and set `legacyId: true`.
- **Images** (optional): only official material permitted by Square Enix’s FFIX conditions. Register each file in `src/data/images.ts` (source URL, modification) and reference it with `image: { imageId, alt }` on an area or entry. The UI never depends on images.

## Accuracy and sources

See [`docs/DISC1_AUDIT.md`](docs/DISC1_AUDIT.md) for the full audit, [`docs/CONTENT_VERIFICATION.md`](docs/CONTENT_VERIFICATION.md) for the rules the data follows, [`docs/content-status.md`](docs/content-status.md) for generated per-area counts, and [`docs/evidence/disc1-evidence.json`](docs/evidence/disc1-evidence.json) for the machine-readable evidence record.

Facts were cross-checked against:
- [Jegged.com — walkthrough](https://jegged.com/Games/Final-Fantasy-IX/) and [missables](https://jegged.com/Games/Final-Fantasy-IX/Tips-and-Tricks/Missable-Items-and-Events.html)
- [GameFAQs — bover_87’s guide & Missable Item Walkthrough](https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/missable-item-walkthrough)
- [GameFAQs — vinheim’s guide](https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953)
- [GameFAQs — Fishy071’s Chocobo guide](https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/42402) and [Red Scarlet’s Chocograph guide](https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/10330)
- [Steam Community — FFIX 100% Achievement Guide (lylat & ponkberry)](https://steamcommunity.com/sharedfiles/filedetails/?id=665159772) and [ATE guide (karinms)](https://steamcommunity.com/sharedfiles/filedetails/?id=665189459)

All descriptions are original. No guide text or screenshots from guides are included. The only game imagery is the small set of official images described above. Everything else in the visual style is CSS and SVG.

## Licence

The code and original writing in this repository are licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE). You can use, copy, modify and share them for any **non-commercial** purpose, as long as you keep the licence and its `Required Notice` line. Commercial use isn't permitted.

This project is free and non-commercial. It has no ads, paid features or donations tied to the game content.

### Third-party notices
- **Final Fantasy IX**: game names, item names, places and characters belong to Square Enix. They aren't covered by this licence.
- **Official images** in `public/images/official/` come from the official Japanese FFIX website and are used under Square Enix’s [FFIX copyright conditions](https://www.jp.square-enix.com/ff9/conditions.html) for non-commercial use. They are **not** covered by this repository’s licence. The required notice, “© 2000, 2019 SQUARE ENIX CO., LTD. All Rights Reserved. LOGO ILLUSTRATION:© 2000 YOSHITAKA AMANO”, is shown in the app. Each file’s source is listed in `src/data/images.ts` and `docs/DISC1_AUDIT.md`. They will be removed if Square Enix asks.
- **Fonts** (bundled for offline use): [Cinzel](https://github.com/NDISCOVER/Cinzel) and [Inter](https://github.com/rsms/inter), both under the SIL Open Font License 1.1, via Fontsource.
- **Icons**: [Lucide](https://lucide.dev), ISC License.
- **Libraries**: React (MIT), Vite (MIT), Tailwind CSS (MIT), vite-plugin-pwa / Workbox (MIT). See `package.json` for the full list.
- **Research sources** are credited under *Accuracy and sources* above. No text or images from them are included.

## Disclaimer

Unofficial fan project, not affiliated with or endorsed by Square Enix. FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd.
