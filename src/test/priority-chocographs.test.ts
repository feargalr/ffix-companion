import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ALL_AREAS, ALL_ENTRIES, DISCS, ENTRY_BY_ID } from '../data';
import { CHOCOGRAPHS } from '../data/chocographs';
import { ALL_IMAGES, LOCATION_IMAGES, SQUARE_ENIX_NOTICE } from '../data/images';
import { CHOCOGRAPH_SPLIT_NOTICE, chocographStatus, needsSplitNotice } from '../lib/chocographs';
import { parseImport } from '../lib/importExport';
import { warningPriority } from '../lib/priority';
import { progressOf } from '../lib/stats';
import { validateChocographs, validateImageRefs } from '../lib/validate';

const entry = (id: string) => ENTRY_BY_ID.get(id)!;

describe('warning priority', () => {
  it('derives priority from consequence, not category', () => {
    expect(warningPriority(entry('d1.alexandria-castle-play.brahne-prize'))).toBe('critical');
    expect(warningPriority(entry('d1.lindblum.autograph'))).toBe('critical');
    expect(warningPriority(entry('d1.evil-forest.ate-orchestra'))).toBe('important');
    expect(warningPriority(entry('d1.evil-forest.wrist'))).toBe('optional');
    expect(warningPriority(entry('d1.cargo-ship.steal-silver-gloves'))).toBe('optional');
  });

  it('lets an event with no item outrank a chest when its consequence is bigger', () => {
    expect(warningPriority(entry('d1.burmecia.uptown-ground-door'))).toBe('critical');
    expect(warningPriority(entry('d1.burmecia.soft-left-house'))).toBe('optional');
  });

  it('treats the Stiltzkin deal as a missable opportunity, not a unique item', () => {
    const s = entry('d1.burmecia.stiltzkin-333');
    expect(s.missableKind).toBe('opportunity');
    expect(s.rewardUniqueness).toBe('replaceable');
    expect(warningPriority(s)).toBe('important');
  });
});

describe('Chocographs', () => {
  const discs = DISCS.filter((d) => d.available).map((d) => d.number);

  it('registry is consistent with the dataset', () => {
    const issues = validateChocographs(CHOCOGRAPHS, new Set(ENTRY_BY_ID.keys()), discs).filter((i) => i.level === 'error');
    expect(issues).toEqual([]);
  });

  it('covers all nine Disc 1 Chocographs plus a piece', () => {
    const numbers = CHOCOGRAPHS.map((c) => c.number);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 8, 10, 11, 'piece']);
  });

  it('keeps the original IDs for the first five Chocographs as "dug up"', () => {
    for (const id of [
      'd1.lindblum-kingdom.chocograph-1',
      'd1.lindblum-kingdom.chocograph-2',
      'd1.daines-horse-basin.chocograph-healing-shore',
      'd1.daines-horse-basin.chocograph-birds-eye-lagoon',
      'd1.daines-horse-basin.chocograph-small-beach',
    ]) {
      expect(entry(id).chocograph?.role).toBe('dig');
    }
    // Digging moved to Chocobo's Forest, but the IDs stay the same.
    expect(entry('d1.daines-horse-basin.chocograph-small-beach').areaId).toBe('lindblum-kingdom');
    expect(entry('d1.daines-horse-basin.chocograph-small-beach').legacyId).toBe(true);
  });

  it('does not require Reef to dig up Bird’s-Eye Lagoon or Small Beach, only to find their treasure', () => {
    const reef = 'd1.daines-horse-basin.chocograph-healing-shore-treasure';
    expect(entry('d1.daines-horse-basin.chocograph-small-beach').requires).not.toContain(reef);
    expect(entry('d1.daines-horse-basin.chocograph-small-beach-treasure').requires).toContain(reef);
  });

  it('lists Small Beach as 4 Remedies', () => {
    expect(entry('d1.daines-horse-basin.chocograph-small-beach-treasure').reward).toMatch(/^4 Remedy/);
  });

  it('reports treasure reachability honestly', () => {
    const small = CHOCOGRAPHS.find((c) => c.number === 11)!;
    const cold = CHOCOGRAPHS.find((c) => c.number === 6)!;
    expect(chocographStatus(small, {}).kind).toBe('not-dug');
    expect(chocographStatus(small, { [small.digId]: 1 }).kind).toBe('needs-ability');
    expect(chocographStatus(small, { [small.digId]: 1, 'd1.daines-horse-basin.chocograph-healing-shore-treasure': 1 }).kind).toBe('reachable');
    expect(chocographStatus(cold, { [cold.digId]: 1 })).toEqual({ kind: 'later-disc', disc: 3 });
  });

  it('migrates conservatively: an old tick means "dug up" and the treasure starts unticked', () => {
    // A pre-split export where the player had ticked Streamside and Small Beach.
    const oldExport = JSON.stringify({
      app: 'ffix-companion',
      version: 1,
      exportedAt: '2026-10-12T00:00:00Z',
      state: {
        version: 1,
        completed: { 'd1.lindblum-kingdom.chocograph-1': 1, 'd1.daines-horse-basin.chocograph-small-beach': 2 },
        furthestAreaIndex: 3,
        collapsed: {},
        settings: { spoilers: 'safe', hideCompleted: false },
      },
    });
    const res = parseImport(oldExport, new Set(ENTRY_BY_ID.keys()));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.unknownIds).toEqual([]);
    expect(res.state.completed['d1.lindblum-kingdom.chocograph-1']).toBe(1);
    expect('d1.lindblum-kingdom.chocograph-1-treasure' in res.state.completed).toBe(false);
    expect(res.state.settings.dismissedNotices).toEqual([]);
    expect(needsSplitNotice(res.state.completed, [])).toBe(true);
    expect(needsSplitNotice(res.state.completed, [CHOCOGRAPH_SPLIT_NOTICE])).toBe(false);
  });

  it('keeps ticks on reserved later-disc treasure IDs without counting them yet', () => {
    const reserved = 'd3.chocographs-disc3.cold-field-treasure';
    expect(ENTRY_BY_ID.has(reserved)).toBe(false);
    const res = parseImport(
      JSON.stringify({ app: 'ffix-companion', version: 1, state: { completed: { [reserved]: 5 } } }),
      new Set(ENTRY_BY_ID.keys()),
    );
    expect(res.ok && res.state.completed[reserved]).toBe(5);
    expect(progressOf(ALL_ENTRIES, { [reserved]: 5 }).done).toBe(0);
  });
});

describe('official images', () => {
  it('every registered image file exists and is small', () => {
    for (const img of ALL_IMAGES) {
      expect(existsSync(resolve('public', img.file)), img.file).toBe(true);
      expect(img.sourceUrl).toMatch(/^https:\/\/www\.jp\.square-enix\.com\/ff9\//);
    }
  });

  it('every image reference in the data is registered', () => {
    expect(validateImageRefs(ALL_AREAS, new Set(Object.keys(LOCATION_IMAGES)))).toEqual([]);
  });

  it('carries the exact Square Enix notice required by the usage conditions', () => {
    expect(SQUARE_ENIX_NOTICE).toEqual([
      '© 2000, 2019 SQUARE ENIX CO., LTD. All Rights Reserved.',
      'LOGO ILLUSTRATION:© 2000 YOSHITAKA AMANO',
    ]);
  });
});
