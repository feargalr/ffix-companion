import type { Area, ChecklistEntry } from '../types/game';
import { isExcluded, type Completed } from './stats';

export interface DepartureWarning {
  /** Permanently missable content that closes when you leave this area. */
  permanent: ChecklistEntry[];
  /** Choice-dependent or prerequisite-dependent content still open. */
  conditional: ChecklistEntry[];
  /** Sources don't confirm you can come back for these. */
  unconfirmed: ChecklistEntry[];
  /** Will be unavailable for a while but returns later. */
  temporary: ChecklistEntry[];
  /** Total of the "serious" groups (permanent + conditional). */
  count: number;
}

/**
 * What a player should finish before leaving `area`.
 *
 * An entry belongs to an area's warning if it closes with that area — either
 * it lives there and has no `closesWithArea`, or another area's entry points
 * here via `closesWithArea` (e.g. Ice Cavern pickups close when leaving Dali).
 * Forced story entries and deadlines on later discs are excluded.
 */
export function beforeYouLeave(area: Area, all: ChecklistEntry[], completed: Completed): DepartureWarning {
  const closesHere = (e: ChecklistEntry) =>
    e.closesWithArea ? e.closesWithArea === area.id : e.areaId === area.id;

  const open = all.filter(
    (e) =>
      closesHere(e) &&
      !e.mandatory &&
      !e.closesOnLaterDisc &&
      !(e.id in completed) &&
      !isExcluded(e, completed, all),
  );

  // A mutually exclusive group only needs one warning, not one per option.
  const seenGroups = new Set<string>();
  const dedupe = (e: ChecklistEntry) => {
    if (!e.exclusiveGroup) return true;
    if (seenGroups.has(e.exclusiveGroup)) return false;
    seenGroups.add(e.exclusiveGroup);
    return true;
  };

  const permanent = open.filter((e) => e.missability === 'permanent');
  const conditional = open.filter((e) => e.missability === 'conditional').filter(dedupe);
  const unconfirmed = open.filter((e) => e.missability === 'unconfirmed');
  const temporary = open.filter((e) => e.missability === 'temporary');

  return { permanent, conditional, unconfirmed, temporary, count: permanent.length + conditional.length };
}

/** Deadlines that fall on discs not yet in the app. */
export function laterDiscDeadlines(all: ChecklistEntry[], completed: Completed): ChecklistEntry[] {
  return all.filter((e) => e.closesOnLaterDisc && !(e.id in completed));
}
