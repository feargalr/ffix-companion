import { CHOCOGRAPHS, type ChocographInfo } from '../data/chocographs';
import { ENTRY_BY_ID } from '../data';
import type { Completed } from './stats';

export type ChocographStatus =
  | { kind: 'found' }
  | { kind: 'piece-dug' }
  | { kind: 'not-dug'; needs?: string }
  | { kind: 'needs-ability'; ability: string }
  | { kind: 'later-disc'; disc: number }
  | { kind: 'reachable' };

const REEF_SOURCE = 'd1.daines-horse-basin.chocograph-healing-shore-treasure';

/** Where the player stands with one Chocograph, given their ticks. */
export function chocographStatus(c: ChocographInfo, completed: Completed, currentDisc = 1): ChocographStatus {
  if (c.treasureId && c.treasureId in completed) return { kind: 'found' };
  if (c.digId && !(c.digId in completed)) {
    return { kind: 'not-dug', needs: c.digNeeds === 'Reef' && !(REEF_SOURCE in completed) ? 'Reef' : undefined };
  }
  // A piece has nothing further to find on its own.
  if (!c.treasureId) return { kind: 'piece-dug' };
  if (c.treasureFromDisc > currentDisc) return { kind: 'later-disc', disc: c.treasureFromDisc };
  if (c.treasureAbility === 'Reef' && !(REEF_SOURCE in completed)) return { kind: 'needs-ability', ability: 'Reef' };
  return { kind: 'reachable' };
}

/** True once a treasure's entry exists in the dataset (not just reserved). */
export const treasureEntryExists = (c: ChocographInfo) => !!c.treasureId && ENTRY_BY_ID.has(c.treasureId);

/**
 * Migration notice: before the Chocograph split, one tick covered both
 * digging and the treasure. Those ticks now mean "dug up"; the treasure
 * entries start unticked. Show the notice while any old tick has an
 * unticked treasure that already exists.
 */
export const CHOCOGRAPH_SPLIT_NOTICE = 'chocograph-split-2026-10';

const LEGACY_DIG_IDS = [
  'd1.lindblum-kingdom.chocograph-1',
  'd1.lindblum-kingdom.chocograph-2',
  'd1.daines-horse-basin.chocograph-healing-shore',
  'd1.daines-horse-basin.chocograph-birds-eye-lagoon',
  'd1.daines-horse-basin.chocograph-small-beach',
];

export function needsSplitNotice(completed: Completed, dismissed: string[]): boolean {
  if (dismissed.includes(CHOCOGRAPH_SPLIT_NOTICE)) return false;
  return CHOCOGRAPHS.some(
    (c) =>
      !!c.digId &&
      !!c.treasureId &&
      LEGACY_DIG_IDS.includes(c.digId) &&
      c.digId in completed &&
      !(c.treasureId in completed) &&
      treasureEntryExists(c),
  );
}
