import { describe, expect, it } from 'vitest';
import { ALL_AREAS } from '../data';
import { buildIndex, normalise, search, searchAreas } from '../lib/search';

const index = buildIndex(ALL_AREAS);
const names = (q: string, f = {}) => search(index, q, f, {}).map((r) => r.entry.name);

describe('search', () => {
  it('normalises punctuation and case', () => {
    expect(normalise("Qu's Marsh")).toBe('qus marsh');
    expect(normalise('Hi-Potion')).toBe('hi potion');
  });

  it('finds the Moonstone sword-fight prize', () => {
    expect(names('Moonstone')[0]).toMatch(/Sword fight/);
  });

  it('finds every jump rope milestone', () => {
    expect(names('jump rope').filter((n) => n.startsWith('Jump rope'))).toHaveLength(6);
  });

  it('finds Stiltzkin and Gizamaluke content', () => {
    expect(names('Stiltzkin').some((n) => n.includes('Stiltzkin'))).toBe(true);
    expect(names('gizamaluke').length).toBeGreaterThan(0);
  });

  it('matches areas by name', () => {
    expect(searchAreas(ALL_AREAS, 'alexandria').map((h) => h.area.id)).toEqual(
      expect.arrayContaining(['alexandria-vivi', 'alexandria-castle-play']),
    );
  });

  it('requires every word to match', () => {
    expect(names('potion zzzz')).toEqual([]);
  });

  it('filters by type, area, missability and status', () => {
    const ates = search(index, '', { section: 'ate' }, {});
    expect(ates.length).toBeGreaterThan(0);
    expect(ates.every((r) => r.entry.category === 'ate')).toBe(true);

    const dali = search(index, 'potion', { areaId: 'dali' }, {});
    expect(dali.every((r) => r.entry.areaId === 'dali')).toBe(true);

    const miss = search(index, '', { missability: 'missable' }, {});
    expect(miss.every((r) => ['permanent', 'conditional'].includes(r.entry.missability))).toBe(true);

    const first = dali[0].entry.id;
    expect(search(index, 'potion', { areaId: 'dali', status: 'done' }, { [first]: 1 }).map((r) => r.entry.id)).toEqual([first]);
    expect(search(index, 'potion', { areaId: 'dali', status: 'todo' }, { [first]: 1 }).some((r) => r.entry.id === first)).toBe(false);
  });
});
