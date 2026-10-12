import type { ProgressState } from './progress';

/**
 * Spoiler gating. In "safe" mode, areas up to one step past the furthest area
 * you've opened are fully visible; later ones show only their place name.
 * Nothing is ever locked: opening a later area simply reveals it.
 */
export function isAreaRevealed(areaIndex: number, state: Pick<ProgressState, 'furthestAreaIndex' | 'settings'>) {
  return state.settings.spoilers === 'all' || areaIndex <= state.furthestAreaIndex + 1;
}
