import { beforeEach, describe, expect, it } from 'vitest';
import { createProgressStore, normaliseState, STORAGE_KEY } from '../lib/progress';

describe('progress store', () => {
  beforeEach(() => localStorage.clear());

  it('ticks and unticks entries and persists to localStorage', () => {
    const store = createProgressStore(localStorage);
    store.setDone('d1.alexandria-vivi.zombie-card', true);
    expect(store.isDone('d1.alexandria-vivi.zombie-card')).toBe(true);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.completed['d1.alexandria-vivi.zombie-card']).toBeTypeOf('number');

    store.toggle('d1.alexandria-vivi.zombie-card');
    expect(store.isDone('d1.alexandria-vivi.zombie-card')).toBe(false);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).completed).toEqual({});
  });

  it('restores progress in a fresh store (browser reopened)', () => {
    createProgressStore(localStorage).setDone('d1.dali.inn-potion', true);
    const reopened = createProgressStore(localStorage);
    expect(reopened.isDone('d1.dali.inn-potion')).toBe(true);
  });

  it('notifies subscribers', () => {
    const store = createProgressStore(localStorage);
    let calls = 0;
    store.subscribe(() => calls++);
    store.setDone('x', true);
    store.setDone('x', true); // no-op
    expect(calls).toBe(1);
  });

  it('remembers the last area and furthest point reached', () => {
    const store = createProgressStore(localStorage);
    store.visitArea('dali', 7);
    store.visitArea('alexandria-vivi', 1);
    expect(store.getState().lastAreaId).toBe('alexandria-vivi');
    expect(store.getState().furthestAreaIndex).toBe(7);
  });

  it('keeps IDs it does not recognise so future content updates do not lose progress', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: { 'd2.future.thing': 1 } }));
    expect(createProgressStore(localStorage).isDone('d2.future.thing')).toBe(true);
  });

  it('survives corrupt storage', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(createProgressStore(localStorage).getState().completed).toEqual({});
  });

  it('works without storage at all', () => {
    const store = createProgressStore(null);
    store.setDone('a', true);
    expect(store.isDone('a')).toBe(true);
  });

  it('normalises junk values', () => {
    const s = normaliseState({
      completed: { good: 5, bad: 'yes', nan: NaN },
      settings: { spoilers: 'banana', hideCompleted: 'no' },
      furthestAreaIndex: -4,
    });
    expect(s.completed).toEqual({ good: 5 });
    expect(s.settings).toEqual({ spoilers: 'safe', hideCompleted: false, dismissedNotices: [] });
    expect(s.furthestAreaIndex).toBe(0);
  });

  it('remembers dismissed notices', () => {
    const store = createProgressStore(localStorage);
    store.dismissNotice('x');
    store.dismissNotice('x');
    expect(createProgressStore(localStorage).getState().settings.dismissedNotices).toEqual(['x']);
  });

  it('resets everything', () => {
    const store = createProgressStore(localStorage);
    store.setDone('a', true);
    store.updateSettings({ spoilers: 'all' });
    store.reset();
    expect(store.getState().completed).toEqual({});
    expect(store.getState().settings.spoilers).toBe('safe');
  });
});
