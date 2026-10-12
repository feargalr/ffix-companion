import { describe, expect, it } from 'vitest';
import { ALL_ENTRIES, getArea } from '../data';
import { beforeYouLeave, laterDiscDeadlines } from '../lib/missables';
import { isExcluded, outstandingMissables, progressOf } from '../lib/stats';

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
});

describe('Before You Leave', () => {
  it('lists the unique Moonstone prize before leaving the castle', () => {
    const w = beforeYouLeave(getArea('alexandria-castle-play')!, ALL_ENTRIES, {});
    expect(w.permanent.map((e) => e.id)).toContain('d1.alexandria-castle-play.brahne-prize');
  });

  it('drops entries once they are completed', () => {
    const area = getArea('cargo-ship')!;
    const before = beforeYouLeave(area, ALL_ENTRIES, {});
    const after = beforeYouLeave(area, ALL_ENTRIES, { [area.entries[0].id]: 1 });
    expect(after.count).toBe(before.count - 1);
  });

  it('warns about Ice Cavern treasure in Dali, where the cave actually closes', () => {
    const dali = beforeYouLeave(getArea('dali')!, ALL_ENTRIES, {});
    expect(dali.permanent.some((e) => e.id === 'd1.ice-cavern.elixir')).toBe(true);
    const cave = beforeYouLeave(getArea('ice-cavern')!, ALL_ENTRIES, {});
    expect(cave.permanent.some((e) => e.id === 'd1.ice-cavern.elixir')).toBe(false);
    // ...but the Ice Cavern boss steals close at the boss, in the cave itself.
    expect(cave.permanent.some((e) => e.id === 'd1.ice-cavern.steal-sealion-mythril-dagger')).toBe(true);
  });

  it('shows a mutually exclusive group once and clears it when one option is done', () => {
    const open = beforeYouLeave(festival, ALL_ENTRIES, {});
    expect(open.conditional.filter((e) => e.exclusiveGroup === 'festival-prize')).toHaveLength(1);
    const chosen = beforeYouLeave(festival, ALL_ENTRIES, { [prizes[2].id]: 1 });
    expect(chosen.conditional.filter((e) => e.exclusiveGroup === 'festival-prize')).toHaveLength(0);
  });

  it('keeps later-disc deadlines out of the area warning', () => {
    const w = beforeYouLeave(festival, ALL_ENTRIES, {});
    expect([...w.permanent, ...w.conditional].some((e) => e.closesOnLaterDisc)).toBe(false);
    expect(laterDiscDeadlines(ALL_ENTRIES, {}).map((e) => e.id)).toContain('d1.festival-of-the-hunt.buy-javelin');
  });

  it('never warns about mandatory story entries', () => {
    const w = beforeYouLeave(getArea('evil-forest')!, ALL_ENTRIES, {});
    expect([...w.permanent, ...w.conditional].some((e) => e.mandatory)).toBe(false);
  });
});
