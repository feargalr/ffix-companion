import type { Area, ChecklistEntry } from '../types/game';
import { warningPriority } from './priority';
import { isExcluded, type Completed } from './stats';

export interface DepartureWarning {
  /** Unique/limited rewards or one-off interactions with lasting consequences. */
  critical: ChecklistEntry[];
  /** Missable ATEs, letters, Stiltzkin, key steals and similar. */
  important: ChecklistEntry[];
  /** Common pickups, replaceable steals, unconfirmed or returning content. */
  lower: ChecklistEntry[];
  /** critical + important: the number shown as "missables left". */
  count: number;
}

/** Evidence is incomplete: unconfirmed availability or conflicting sources. */
export const isUncertain = (e: ChecklistEntry) =>
  e.missability === 'unconfirmed' || e.verification === 'conflicting';

/**
 * Does leaving `area` close this entry? Either it lives there and has no
 * `closesWithArea`, or another area's entry points here via `closesWithArea`
 * (e.g. Ice Cavern pickups close when leaving Dali).
 */
export const closesWith = (e: ChecklistEntry, area: Area) =>
  e.closesWithArea ? e.closesWithArea === area.id : e.areaId === area.id;

/**
 * What a player should finish before leaving `area`, grouped by how much it
 * matters. Forced story entries, never-missable content and deadlines on
 * later discs are left out.
 */
export function beforeYouLeave(area: Area, all: ChecklistEntry[], completed: Completed): DepartureWarning {
  const open = all.filter(
    (e) =>
      closesWith(e, area) &&
      e.missability !== 'none' &&
      !e.mandatory &&
      !e.closesOnLaterDisc &&
      !(e.id in completed) &&
      !isExcluded(e, completed, all),
  );

  // A mutually exclusive group only needs one warning, not one per option.
  const seenGroups = new Set<string>();
  const deduped = open.filter((e) => {
    if (!e.exclusiveGroup) return true;
    if (seenGroups.has(e.exclusiveGroup)) return false;
    seenGroups.add(e.exclusiveGroup);
    return true;
  });

  const critical: ChecklistEntry[] = [];
  const important: ChecklistEntry[] = [];
  const lower: ChecklistEntry[] = [];
  for (const e of deduped) {
    // Content that comes back later is never more than a gentle reminder.
    const p = e.missability === 'temporary' ? 'optional' : warningPriority(e);
    (p === 'critical' ? critical : p === 'important' ? important : lower).push(e);
  }
  return { critical, important, lower, count: critical.length + important.length };
}

/** Deadlines that fall on discs not yet in the app. */
export function laterDiscDeadlines(all: ChecklistEntry[], completed: Completed): ChecklistEntry[] {
  return all.filter((e) => e.closesOnLaterDisc && !(e.id in completed));
}
