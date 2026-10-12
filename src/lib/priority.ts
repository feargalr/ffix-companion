import type { ChecklistEntry, RewardUniqueness, WarningPriority } from '../types/game';

/**
 * Warning priority for Before You Leave. An explicit `priority` on the entry
 * always wins; otherwise it follows the consequence of missing it:
 *
 * - unique/limited reward lost for good → critical
 * - one-off events and opportunities (ATEs, letters, sidequest steps) → important
 * - common pickups and replaceable steals → optional
 * - anything not missable, returning later, or of unconfirmed status → optional
 */
export function warningPriority(e: ChecklistEntry): WarningPriority {
  if (e.priority) return e.priority;
  if (e.missability !== 'permanent' && e.missability !== 'conditional') return 'optional';
  switch (e.missableKind) {
    case 'unique':
      return 'critical';
    case 'event':
    case 'opportunity':
      return 'important';
    default:
      return 'optional';
  }
}

/** Reward uniqueness, derived when not stated. */
export function rewardUniqueness(e: ChecklistEntry): RewardUniqueness | undefined {
  if (e.rewardUniqueness) return e.rewardUniqueness;
  switch (e.missableKind) {
    case 'unique':
      return 'unique';
    case 'pickup':
      return 'replaceable';
    case 'event':
      return 'none';
    default:
      return undefined;
  }
}

export const PRIORITY_LABEL: Record<WarningPriority, string> = {
  critical: 'Critical',
  important: 'Important',
  optional: 'Lower priority',
};

export const UNIQUENESS_LABEL: Record<RewardUniqueness, string> = {
  unique: 'Unique reward — no other source',
  limited: 'Strictly limited reward',
  replaceable: 'Reward is obtainable elsewhere',
  none: 'No material reward',
  unconfirmed: 'Reward availability unconfirmed',
};
