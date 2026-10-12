import { describe, expect, it } from 'vitest';
import { ALL_AREAS, ALL_ENTRIES, DISCS } from '../data';
import { validateData } from '../lib/validate';
import shippedIds from './fixtures/shipped-ids.json';
import type { Area } from '../types/game';

describe('game data', () => {
  it('passes validation with no errors', () => {
    const errors = validateData(ALL_AREAS).filter((i) => i.level === 'error');
    expect(errors).toEqual([]);
  });

  it('never drops or renames a shipped entry ID (progress would be lost)', () => {
    const current = new Set(ALL_ENTRIES.map((e) => e.id));
    const missing = (shippedIds as string[]).filter((id) => !current.has(id));
    expect(missing).toEqual([]);
  });

  it('has unique IDs', () => {
    const ids = ALL_ENTRIES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('lists Disc 1 chronologically from the opening heist to Burmecia', () => {
    const d1 = DISCS[0].areas;
    expect(d1[0].id).toBe('prima-vista-heist');
    expect(d1.at(-1)!.id).toBe('burmecia');
    expect(d1.map((a) => a.order)).toEqual(d1.map((_, i) => i + 1));
  });

  it('distinguishes separate visits to the same place', () => {
    const lindblum = ALL_AREAS.filter((a) => a.location === 'Lindblum');
    expect(lindblum.length).toBeGreaterThanOrEqual(2);
    expect(new Set(lindblum.map((a) => a.visit)).size).toBe(lindblum.length);
  });

  it('lists Disc 2 from Summit Station to the return to the Iifa Tree', () => {
    const d2 = DISCS[1];
    expect(d2.available).toBe(true);
    expect(d2.areas[0].id).toBe('summit-station');
    expect(d2.areas.at(-1)!.id).toBe('iifa-tree-battle');
    expect(d2.areas.map((a) => a.order)).toEqual(d2.areas.map((_, i) => i + 1));
  });

  it('defines the Disc 2 Chocograph treasure under the exact reserved ID', () => {
    const e = ALL_ENTRIES.find((x) => x.id === 'd2.chocographs-disc2.abandoned-beach-treasure');
    expect(e).toBeDefined();
    expect(e!.chocograph).toEqual({ number: 5, role: 'treasure' });
    expect(e!.requires).toContain('d1.lindblum-kingdom.chocograph-abandoned-beach');
  });

  it('covers the key Disc 1 locations', () => {
    const locations = ALL_AREAS.map((a) => a.location).join(' | ');
    for (const place of ['Alexandria', 'Evil Forest', 'Ice Cavern', 'Dali', 'Cargo Ship', 'Lindblum', "Gizamaluke's Grotto", 'Burmecia']) {
      expect(locations).toContain(place);
    }
  });

  it('gives every permanently missable entry a last-opportunity note', () => {
    const bad = ALL_ENTRIES.filter((e) => e.missability === 'permanent' && !e.mandatory && !e.lastOpportunity);
    expect(bad.map((e) => e.id)).toEqual([]);
  });
});

describe('validator', () => {
  const base = (): Area => ({
    id: 'test-area',
    disc: 1,
    order: 1,
    location: 'Test',
    visit: 'Visit',
    chapter: 'Ch',
    summary: 'S',
    entries: [
      {
        id: 'd1.test-area.a',
        name: 'A',
        category: 'treasure',
        areaId: 'test-area',
        description: 'x',
        missability: 'none',
        verification: 'verified',
        sources: ['jegged'],
      },
    ],
  });

  it('flags duplicate IDs', () => {
    const a = base();
    a.entries.push({ ...a.entries[0] });
    expect(validateData([a]).some((i) => i.message.includes('Duplicate entry id'))).toBe(true);
  });

  it('flags invalid requires references', () => {
    const a = base();
    a.entries[0].requires = ['d1.test-area.nope'];
    expect(validateData([a]).some((i) => i.message.includes('requires unknown entry'))).toBe(true);
  });

  it('flags permanent entries without lastOpportunity', () => {
    const a = base();
    a.entries[0].missability = 'permanent';
    a.entries[0].missableKind = 'pickup';
    expect(validateData([a]).some((i) => i.message.includes('lastOpportunity'))).toBe(true);
  });

  it('flags non-contiguous area order', () => {
    const a = base();
    a.order = 3;
    expect(validateData([a]).some((i) => i.message.includes('order should be 1'))).toBe(true);
  });

  it('flags dependency cycles', () => {
    const a = base();
    a.entries.push({ ...a.entries[0], id: 'd1.test-area.b', requires: ['d1.test-area.a'] });
    a.entries[0].requires = ['d1.test-area.b'];
    expect(validateData([a]).some((i) => i.message.includes('cycle'))).toBe(true);
  });

  it('flags lone exclusive groups', () => {
    const a = base();
    a.entries[0].exclusiveGroup = 'solo';
    expect(validateData([a]).some((i) => i.message.includes('at least two'))).toBe(true);
  });
});
