import type { Area, ChecklistEntry, Disc } from '../types/game';
import { disc1Areas } from './disc1';
import { disc2Areas } from './disc2';

/**
 * All discs. To add Disc 2, create src/data/disc2/ following the Disc 1
 * pattern, import its areas here and flip `available` to true.
 */
export const DISCS: Disc[] = [
  { number: 1, title: 'Disc 1', areas: disc1Areas, available: true },
  { number: 2, title: 'Disc 2', areas: disc2Areas, available: true },
  { number: 3, title: 'Disc 3', areas: [], available: false },
  { number: 4, title: 'Disc 4', areas: [], available: false },
];

/** Every area across available discs, in play order. */
export const ALL_AREAS: Area[] = DISCS.flatMap((d) => d.areas);

export const ALL_ENTRIES: ChecklistEntry[] = ALL_AREAS.flatMap((a) => a.entries);

export const AREA_BY_ID = new Map(ALL_AREAS.map((a) => [a.id, a]));
export const ENTRY_BY_ID = new Map(ALL_ENTRIES.map((e) => [e.id, e]));

/** Global play-order index (0-based) used for spoiler gating and prev/next. */
export const AREA_INDEX = new Map(ALL_AREAS.map((a, i) => [a.id, i]));

export function getArea(id: string | undefined): Area | undefined {
  return id ? AREA_BY_ID.get(id) : undefined;
}

export function areaTitle(a: Area): string {
  return `${a.location} — ${a.visit}`;
}
