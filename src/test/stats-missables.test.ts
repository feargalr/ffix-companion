import { describe, expect, it } from 'vitest';
import { ALL_ENTRIES, getArea } from '../data';
import { beforeYouLeave, laterDiscDeadlines } from '../lib/missables';
import { isExcluded, outstandingMissables, outstandingWarnings, progressOf } from '../lib/stats';

const festival = getArea('festival-of-the-hunt')!;
const prizes = festival.entries.filter((e) => e.exclusiveGroup === 'festival-prize');

describe('completion stats', () => {
  it('counts a mutually exclusive group as one unit', () => {
    const before = progressOf(festival.entries, {});
    const after = progressOf(festival.entries, { [prizes[1].id]: 1 });
    expect(after.done).toBe(before.done + 1);
    expect(after.total).toBe(before.total);
    expect(before.total).toBe(festival.entries.length - prizes.length + 1);
  });

  it('marks the other options excluded once one is chosen', () => {
    const done = { [prizes[0].id]: 1 };
    expect(isExcluded(prizes[1], done, ALL_ENTRIES)).toBe(true);
    expect(isExcluded(prizes[0], done, ALL_ENTRIES)).toBe(false);
  });

  it('reports 100% when everything in an area is ticked', () => {
    const area = getArea('cargo-ship')!;
    const all = Object.fromEntries(area.entries.map((e) => [e.id, 1]));
    expect(progressOf(area.entries, all).pct).toBe(100);
  });

  it('does not count forced story entries as outstanding missables', () => {
    const out = outstandingMissables(ALL_ENTRIES, {});
    expect(out.some((e) => e.mandatory)).toBe(false);
  });

  it('only counts critical and important items as headline warnings', () => {
    const ids = outstandingWarnings(ALL_ENTRIES, {}).map((e) => e.id);
    expect(ids).toContain('d1.alexandria-castle-play.brahne-prize');
    expect(ids).not.toContain('d1.prima-vista-heist.potion');
  });
});

describe('Before You Leave', () => {
  const all = (w: ReturnType<typeof beforeYouLeave>) => [...w.critical, ...w.important, ...w.lower];

  it('lists the unique Moonstone prize as critical before leaving the castle', () => {
    const w = beforeYouLeave(getArea('alexandria-castle-play')!, ALL_ENTRIES, {});
    expect(w.critical.map((e) => e.id)).toContain('d1.alexandria-castle-play.brahne-prize');
  });

  it('drops entries once they are completed', () => {
    const area = getArea('festival-of-the-hunt')!;
    const before = beforeYouLeave(area, ALL_ENTRIES, {});
    const after = beforeYouLeave(area, ALL_ENTRIES, { 'd1.festival-of-the-hunt.master-hunter': 1 });
    expect(after.count).toBe(before.count - 1);
  });

  it('warns about Ice Cavern treasure in Dali, where the cave actually closes', () => {
    const dali = all(beforeYouLeave(getArea('dali')!, ALL_ENTRIES, {}));
    expect(dali.some((e) => e.id === 'd1.ice-cavern.elixir')).toBe(true);
    const cave = beforeYouLeave(getArea('ice-cavern')!, ALL_ENTRIES, {});
    expect(all(cave).some((e) => e.id === 'd1.ice-cavern.elixir')).toBe(false);
    // ...but the Mythril Dagger steal closes at the boss, and it matters.
    expect(cave.important.some((e) => e.id === 'd1.ice-cavern.steal-sealion-mythril-dagger')).toBe(true);
  });

  it('keeps ordinary pickups out of the headline count', () => {
    const cave = beforeYouLeave(getArea('ice-cavern')!, ALL_ENTRIES, {});
    const tent = all(cave).find((e) => e.id === 'd1.ice-cavern.steal-bw1-remedy');
    expect(cave.lower).toContain(tent);
  });

  it('shows a mutually exclusive group once and clears it when one option is done', () => {
    const open = all(beforeYouLeave(festival, ALL_ENTRIES, {}));
    expect(open.filter((e) => e.exclusiveGroup === 'festival-prize')).toHaveLength(1);
    const chosen = all(beforeYouLeave(festival, ALL_ENTRIES, { [prizes[2].id]: 1 }));
    expect(chosen.filter((e) => e.exclusiveGroup === 'festival-prize')).toHaveLength(0);
  });

  it('keeps later-disc deadlines out of the area warning', () => {
    const w = all(beforeYouLeave(festival, ALL_ENTRIES, {}));
    expect(w.some((e) => e.closesOnLaterDisc)).toBe(false);
    expect(laterDiscDeadlines(ALL_ENTRIES, {}).map((e) => e.id)).toContain('d1.festival-of-the-hunt.buy-javelin');
  });

  it('never warns about mandatory story entries or never-missable content', () => {
    const w = all(beforeYouLeave(getArea('evil-forest')!, ALL_ENTRIES, {}));
    expect(w.some((e) => e.mandatory || e.missability === 'none')).toBe(false);
  });

  it('puts the Wei and Kal scene first in Burmecia and Stiltzkin as important', () => {
    const w = beforeYouLeave(getArea('burmecia')!, ALL_ENTRIES, {});
    expect(w.critical.map((e) => e.id)).toContain('d1.burmecia.uptown-ground-door');
    expect(w.important.map((e) => e.id)).toEqual(
      expect.arrayContaining(['d1.burmecia.stiltzkin-333', 'd1.burmecia.kupo-nut-delivery', 'd1.burmecia.cancer-stellazzio']),
    );
    // A Potion in a chest is not a headline warning.
    expect(w.lower.map((e) => e.id)).toContain('d1.burmecia.potion-left-house');
  });
});
