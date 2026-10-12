import type { Area, ChecklistEntry } from '../types/game';
import { SECTION_OF, type SectionId } from './labels';
import { warningPriority } from './priority';

export type Completed = Record<string, number>;

export interface Tally {
  done: number;
  total: number;
  pct: number;
}

const tally = (done: number, total: number): Tally => ({
  done,
  total,
  pct: total === 0 ? 0 : Math.round((done / total) * 100),
});

/**
 * True when another member of the entry's exclusive group is done, i.e. this
 * entry is no longer possible in the current playthrough.
 */
export function isExcluded(e: ChecklistEntry, completed: Completed, all: ChecklistEntry[]): boolean {
  if (!e.exclusiveGroup || e.id in completed) return false;
  return all.some((o) => o.exclusiveGroup === e.exclusiveGroup && o.id !== e.id && o.id in completed);
}

/**
 * Count progress where each mutually exclusive group counts as one unit, so
 * picking one Festival prize doesn't leave the others "outstanding".
 */
export function progressOf(entries: ChecklistEntry[], completed: Completed): Tally {
  let done = 0;
  let total = 0;
  const groups = new Map<string, boolean>();
  for (const e of entries) {
    if (e.exclusiveGroup) {
      groups.set(e.exclusiveGroup, (groups.get(e.exclusiveGroup) ?? false) || e.id in completed);
    } else {
      total++;
      if (e.id in completed) done++;
    }
  }
  for (const g of groups.values()) {
    total++;
    if (g) done++;
  }
  return tally(done, total);
}

export const areaProgress = (a: Area, completed: Completed) => progressOf(a.entries, completed);

export function sectionProgress(entries: ChecklistEntry[], completed: Completed): Record<SectionId, Tally> {
  const bySection: Record<SectionId, ChecklistEntry[]> = {
    items: [],
    ate: [],
    steals: [],
    activities: [],
    chocographs: [],
    shopping: [],
  };
  for (const e of entries) bySection[SECTION_OF[e.category]].push(e);
  return {
    items: progressOf(bySection.items, completed),
    ate: progressOf(bySection.ate, completed),
    steals: progressOf(bySection.steals, completed),
    activities: progressOf(bySection.activities, completed),
    chocographs: progressOf(bySection.chocographs, completed),
    shopping: progressOf(bySection.shopping, completed),
  };
}

/** Entries that are genuinely missable (excludes forced story entries). */
export const isMissable = (e: ChecklistEntry) =>
  !e.mandatory && (e.missability === 'permanent' || e.missability === 'conditional');

export function missableProgress(entries: ChecklistEntry[], completed: Completed): Tally {
  return progressOf(entries.filter(isMissable), completed);
}

/** Missable entries not yet done and still possible. */
export function outstandingMissables(entries: ChecklistEntry[], completed: Completed): ChecklistEntry[] {
  return entries.filter((e) => isMissable(e) && !(e.id in completed) && !isExcluded(e, completed, entries));
}

/**
 * Critical and important warnings still open: what the Journey screen counts
 * as "missables". Ordinary one-time pickups are deliberately left out.
 */
export function outstandingWarnings(entries: ChecklistEntry[], completed: Completed): ChecklistEntry[] {
  return entries.filter(
    (e) =>
      !e.mandatory &&
      !e.closesOnLaterDisc &&
      e.missability !== 'none' &&
      e.missability !== 'temporary' &&
      warningPriority(e) !== 'optional' &&
      !(e.id in completed) &&
      !isExcluded(e, completed, entries),
  );
}
