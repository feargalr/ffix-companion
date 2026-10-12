import type { Category, Missability, MissableKind } from '../types/game';

export const CATEGORY_LABEL: Record<Category, string> = {
  treasure: 'Treasure',
  'hidden-item': 'Hidden item',
  card: 'Card',
  'key-item': 'Key item',
  ate: 'ATE',
  steal: 'Steal',
  equipment: 'Shop',
  sidequest: 'Sidequest',
  minigame: 'Mini-game',
  'optional-event': 'Optional event',
  mognet: 'Mognet',
  'blue-magic': 'Blue Magic',
  chocograph: 'Chocograph',
};

/** Checklist sections, in display order. */
export type SectionId = 'items' | 'ate' | 'steals' | 'activities' | 'shopping';

export const SECTIONS: { id: SectionId; title: string; categories: Category[] }[] = [
  { id: 'items', title: 'Treasure & Items', categories: ['treasure', 'hidden-item', 'card', 'key-item'] },
  { id: 'ate', title: 'Active Time Events', categories: ['ate'] },
  { id: 'steals', title: 'Boss Steals', categories: ['steal'] },
  {
    id: 'activities',
    title: 'Optional Activities',
    categories: ['sidequest', 'minigame', 'optional-event', 'mognet', 'blue-magic', 'chocograph'],
  },
  { id: 'shopping', title: 'Shopping & Equipment', categories: ['equipment'] },
];

export const SECTION_OF: Record<Category, SectionId> = Object.fromEntries(
  SECTIONS.flatMap((s) => s.categories.map((c) => [c, s.id])),
) as Record<Category, SectionId>;

export const MISSABILITY_LABEL: Record<Missability, string> = {
  permanent: 'Permanently missable',
  temporary: 'Temporarily unavailable later',
  none: 'Not missable',
  conditional: 'Conditional',
  unconfirmed: 'Revisit unconfirmed',
};

/**
 * Short badge text for the collapsed row; null = no badge. "Unconfirmed" gets
 * no row badge — it would sit on dozens of ordinary pickups and drown out the
 * real warnings. It still appears in the details and Before You Leave.
 */
export function missableBadge(m: Missability, kind?: MissableKind): string | null {
  if (m === 'none' || m === 'unconfirmed') return null;
  if (m === 'temporary') return 'Returns later';
  if (m === 'conditional') return kind === 'unique' ? 'Choice · Unique' : 'Conditional';
  switch (kind) {
    case 'unique':
      return 'Missable · Unique';
    case 'steal':
      return 'One-time steal';
    case 'pickup':
      return 'One-time pickup';
    case 'event':
      return 'Missable event';
    default:
      return 'Missable';
  }
}

export const KIND_EXPLAINER: Record<MissableKind, string> = {
  unique: 'The item or reward is unique or strictly limited. Missing it means losing it for this playthrough.',
  pickup: 'This particular pickup disappears, but the item itself is common or can be found elsewhere.',
  steal: 'The boss can only be robbed once. The item may be available elsewhere. See notes.',
  event: 'A scene or event with no unique item. It only matters for completeness.',
  opportunity: 'A one-off opportunity (letter, reward chance or sidequest step).',
};
