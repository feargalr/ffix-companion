import type { SourceId } from '../../types/game';

/** Pickups: two walkthroughs plus the per-disc treasure list. */
export const PICKUP: SourceId[] = ['gamefaqs-bover', 'gamefaqs-vinheim', 'psnprofiles-treasure'];
/** Boss steals: both walkthroughs that publish full steal tables. */
export const STEAL: SourceId[] = ['jegged', 'gamefaqs-bover'];
/** ATE names and triggers. */
export const ATE: SourceId[] = ['gamefaqs-bover', 'steam-ate-guide'];
/** Mognet, Stiltzkin and other story-adjacent facts confirmed by both walkthroughs and Jegged. */
export const STORY: SourceId[] = ['jegged', 'gamefaqs-bover', 'gamefaqs-vinheim'];
